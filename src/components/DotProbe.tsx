import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { tasks } from '../data/tasks.json'
import {
  DotProbeGameStage,
  DotProbeReaction,
  GameProps,
  ImageData,
  TaskResponse,
} from '../types/Task'
import { recordTaskResponse } from '../utils/recordResponse'
import Break from './Break'

const { times, blocks, trialsPerBlock } = tasks[2]
const totalTrials = trialsPerBlock! * blocks!

export function prepareTaskData(images: ImageData[], totalTrials: number) {
  const healthyImages = _.shuffle(
    images.filter((image) => image.type === 'healthy')
  )
  const unhealthyImages = _.shuffle(
    images.filter((image) => image.type === 'unhealthy')
  )

  while (healthyImages.length < totalTrials) {
    healthyImages.push(..._.shuffle([...healthyImages]))
  }

  while (unhealthyImages.length < totalTrials) {
    unhealthyImages.push(..._.shuffle([...unhealthyImages]))
  }

  const imagePairs = _.take(healthyImages, totalTrials).map(
    (healthyImage, index) => {
      const randomSide = Math.random() < 0.5 ? 'left' : 'right'
      const otherSide = randomSide === 'left' ? 'right' : 'left'
      return {
        [`${randomSide}`]: healthyImage,
        [`${otherSide}`]: unhealthyImages[index],
      }
    }
  )
  return imagePairs
}

export default function DotProbe({
  endGame,
  setAccuracy,
  setAverageResponse,
  userImages,
}: GameProps) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const [gameStage, setGameStage] = useState<DotProbeGameStage>('interval')
  const [numCorrect, setNumCorrect] = useState<number>(0)
  const [totalTime, setTotalTime] = useState<number>(0)
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)
  const [taskStartedAt, setTaskStartedAt] = useState(new Date())
  const [pictureDelta, setPictureDelta] = useState<number | null>(null)
  const [pictureShownAt, setPictureShownAt] = useState<number | null>(null)
  const [intervalShownAt, setIntervalShownAt] = useState<number | null>(null)
  const [jitterDur, setJitterDur] = useState<number | null>(null)
  const { session } = useAuth()

  const imagePairs = useMemo(
    () => prepareTaskData(userImages, totalTrials),
    [userImages, totalTrials]
  )
  useEffect(() => {
    const leftPercent =
      imagePairs.filter((imgData) => imgData.left.type === 'healthy').length /
      imagePairs.length
    const rightPercent =
      imagePairs.filter((imgData) => imgData.right.type === 'healthy').length /
      imagePairs.length
    const leftWater =
      imagePairs.filter(
        (imgData) => imgData.left.foodType.toLowerCase() === 'water'
      ).length / imagePairs.length
    const rightWater =
      imagePairs.filter(
        (imgData) => imgData.right.foodType.toLowerCase() === 'water'
      ).length / imagePairs.length
    const percentages = `
    LeftHealthy: ${Math.round(leftPercent * 100)}%
    RightHealthy: ${Math.round(rightPercent * 100)}%
    LeftWater: ${Math.round(leftWater * 100)}%
    RightWater: ${Math.round(rightWater * 100)}%
    `
    console.log('Dot Probe', percentages)
  }, [])

  const currentImagePair = imagePairs[currentTrialIndex]
  const healthySide =
    currentImagePair.left.type === 'healthy' ? 'left' : 'right'

  useEffect(() => {
    setAccuracy(Math.round((numCorrect / currentTrialIndex) * 10000) / 100)
  }, [setAccuracy, numCorrect, currentTrialIndex])

  useEffect(() => {
    setAverageResponse(Math.round(totalTime / numCorrect))
  }, [setAccuracy, totalTime, numCorrect])

  function showCue() {
    setGameStage('cue')
    setCueTimestamp(Date.now())
  }

  function showInit() {
    setGameStage('init')
    setPictureShownAt(Date.now())
    setPictureDelta(
      pictureShownAt ? pictureShownAt - taskStartedAt.getTime() : null
    )
  }

  function isTimeForBreak(currentTrialIndex: number, trialsPerBlock: number) {
    return (currentTrialIndex + 1) % trialsPerBlock === 0
  }

  function onLastTrial(currentTrialIndex: number, totalTrials: number) {
    return currentTrialIndex === totalTrials - 1
  }

  function goToNextTrialOrBreakOrEndGame() {
    setJitterDur(Date.now() - intervalShownAt!)
    if (onLastTrial(currentTrialIndex, totalTrials)) {
      endGame()
    } else if (isTimeForBreak(currentTrialIndex, trialsPerBlock!)) {
      return setGameStage('break')
    } else {
      setCurrentTrialIndex((prev) => prev + 1)
      setGameStage('interval')
      setIntervalShownAt(Date.now())
    }
  }

  function handleReaction(reaction: DotProbeReaction) {
    const responseTime = cueTimestamp ? Date.now() - cueTimestamp : null

    const isCorrect =
      (healthySide === 'left' && reaction === 'left-commission') ||
      (healthySide === 'right' && reaction === 'right-commission')

    const taskResponseData: Partial<TaskResponse> = {
      user_id: session!.user.id,
      gsession_created_at: taskStartedAt,
      game_slug: 'dotprobe',
      assessment: 'TEST',
      phase: 0,
      sort: currentTrialIndex,
      picture_delta: pictureDelta,
      picture_dur: pictureShownAt ? Date.now() - pictureShownAt : null,
      border_delta: 0,
      jitter_dur: jitterDur,
      correct_resp_delta: isCorrect ? responseTime : null,
      commission_resp_delta:
        !isCorrect && ['left-commission', 'right-commission'].includes(reaction)
          ? responseTime
          : null,
      has_selection: ['left-commission', 'right-commission'].includes(reaction)
        ? 1
        : 0,
      is_valid: isCorrect ? 1 : 0,
      is_omission: false ? 1 : 0,
      is_commission:
        !isCorrect && ['left-commission', 'right-commission'].includes(reaction)
          ? 1
          : 0,
      target_index: healthySide === 'left' ? 0 : 1,
      picture_offset: 'LEFT',
      picture_list: [
        currentImagePair.left.src,
        currentImagePair.right.src,
      ].join(', '),
    }

    recordTaskResponse(taskResponseData)

    if (isCorrect) {
      setNumCorrect((prevNumCorrect) => prevNumCorrect + 1)
      setTotalTime((prevTotalTime) =>
        responseTime ? prevTotalTime + responseTime : prevTotalTime
      )
    }
    goToNextTrialOrBreakOrEndGame()
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout
    switch (gameStage) {
      case 'interval':
        timeout = setTimeout(showInit, times.interval)
        break
      case 'init':
        timeout = setTimeout(showCue, times.init)
        break
      case 'cue':
        break
      case 'break':
        timeout = setTimeout(() => {
          setCurrentTrialIndex((prev) => prev + 1)
          setGameStage('interval')
          setIntervalShownAt(Date.now())
        }, times.break)
        break
    }
    return () => clearTimeout(timeout)
  }, [gameStage])

  if (gameStage === 'break') return <Break />

  return (
    <div className="columns is-mobile">
      {gameStage === 'interval' && (
        <div className="column">
          <div className="fixationCross">+</div>
        </div>
      )}
      {gameStage === 'init' && (
        <>
          <div className="column">
            <img src={currentImagePair.left.src} />
          </div>
          <div className="column">
            <img src={currentImagePair.right.src} />
          </div>
        </>
      )}
      {gameStage === 'cue' && (
        <>
          <div className="column">
            {healthySide === 'left' ? (
              <div
                className="probe"
                onClick={() => handleReaction('left-commission')}
              >
                <svg width="20" height="20">
                  <circle cx="10" cy="10" r="10"></circle>
                </svg>
              </div>
            ) : (
              <div className="fill"></div>
            )}
          </div>
          <div className="column">
            {healthySide === 'right' ? (
              <div
                className="probe"
                onClick={() => handleReaction('right-commission')}
              >
                <svg width="20" height="20">
                  <circle cx="10" cy="10" r="10"></circle>
                </svg>
              </div>
            ) : (
              <div className="fill"></div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
