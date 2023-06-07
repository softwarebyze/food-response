import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useUserData } from '../contexts/UserDataContext'
import { tasks } from '../data/tasks.json'
import {
  ImageData,
  ImageType,
  StopSignalBorderStyle,
  StopSignalGameStage,
  StopSignalReaction,
  StopSignalTrialData,
  StopSignalTrialType,
  TaskResponse,
} from '../types/Task'
import { recordTaskResponse } from '../utils/recordResponse'
import Break from './Break'

function getStopSignalTrialType(imageType: ImageType): StopSignalTrialType {
  switch (imageType) {
    case 'unhealthy':
      return 'stop'
    case 'healthy':
      return 'go'
    case 'water':
      return Math.random() < 0.5 ? 'stop' : 'go'
  }
}

function getStopSignalBorderStyle(
  trialType: StopSignalTrialType
): StopSignalBorderStyle {
  switch (trialType) {
    case 'stop':
      return 'grayBorder'
    case 'go':
      return 'blueBorder'
  }
}

export function prepareTaskData(
  images: ImageData[],
  blocks: number,
  healthyImagesPerBlock: number = 14,
  unhealthyImagesPerBlock: number = 14,
  waterImagesPerBlock: number = 4
): StopSignalTrialData[] {
  const healthyImages = _.shuffle(
    images.filter((image) => image.type === 'healthy')
  )
  const unhealthyImages = _.shuffle(
    images.filter((image) => image.type === 'unhealthy')
  )
  const waterImages = _.shuffle(
    images.filter((image) => image.type === 'water')
  )

  while (healthyImages.length < healthyImagesPerBlock * blocks) {
    healthyImages.push(..._.shuffle([...healthyImages]))
  }

  while (unhealthyImages.length < unhealthyImagesPerBlock * blocks) {
    unhealthyImages.push(..._.shuffle([...unhealthyImages]))
  }

  while (waterImages.length < waterImagesPerBlock * blocks) {
    waterImages.push(..._.shuffle([...waterImages]))
  }

  const taskData = []
  for (let i = 0; i < blocks; i++) {
    const healthyImagesBlock = healthyImages.splice(0, healthyImagesPerBlock)
    const unhealthyImagesBlock = unhealthyImages.splice(
      0,
      unhealthyImagesPerBlock
    )
    const waterImagesBlock = waterImages.splice(0, waterImagesPerBlock)
    const combinedImages = healthyImagesBlock.concat(
      unhealthyImagesBlock,
      waterImagesBlock
    )
    const combinedImagesShuffled = _.shuffle(combinedImages)
    const combinedWithTrialData = combinedImagesShuffled.map((imageData) => {
      const trialType = getStopSignalTrialType(imageData.type)
      return {
        src: imageData.src,
        imageType: imageData.type,
        border: getStopSignalBorderStyle(trialType),
        trialType,
      }
    })
    taskData.push(...combinedWithTrialData)
  }
  return taskData
}

const { stages, times, blocks, trialsPerBlock } = tasks[0]
const totalTrials = trialsPerBlock * blocks

export default function StopSignal({
  endGame,
  setAccuracy,
  setAverageResponse,
}: {
  endGame: () => void
  setAccuracy: (value: number) => void
  setAverageResponse: (value: number) => void
}) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const [gameStage, setGameStage] = useState<StopSignalGameStage>('init')

  const [numCorrect, setNumCorrect] = useState<number>(0)
  const [totalTime, setTotalTime] = useState<number>(0)
  const { image, error, interval } = stages![gameStage] as any

  const { userImages } = useUserData()

  const taskData = useMemo(
    () => prepareTaskData(userImages, blocks),
    [userImages, blocks]
  )
  useEffect(() => {
    const healthyPercent =
      taskData.filter((imgData) => imgData.imageType === 'healthy').length /
      taskData.length
    const unhealthyPercent =
      taskData.filter((imgData) => imgData.imageType === 'unhealthy').length /
      taskData.length
    const waterPercent =
      taskData.filter((imgData) => imgData.imageType === 'water').length /
      taskData.length
    const percentages = `
    Healthy: ${Math.round(healthyPercent * 100)}%
    Unhealthy: ${Math.round(unhealthyPercent * 100)}%
    Water: ${Math.round(waterPercent * 100)}%
    `
    console.log('Stop-Signal', percentages)
  }, [])

  const { src, trialType, border, imageType } = taskData[currentTrialIndex]
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)
  const [taskStartedAt, setTaskStartedAt] = useState(new Date())
  const [pictureDelta, setPictureDelta] = useState<number | null>(null)
  const [pictureShownAt, setPictureShownAt] = useState<number | null>(null)
  const [intervalShownAt, setIntervalShownAt] = useState<number | null>(null)
  const [jitterDur, setJitterDur] = useState<number | null>(null)
  const { session } = useAuth()

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

  function showInterval() {
    setGameStage('interval')
    setIntervalShownAt(Date.now())
  }

  function showError() {
    setGameStage('error')
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
    }
  }

  function isStopSignalResponseCorrect(reactionType: StopSignalReaction) {
    return (
      (trialType === 'go' && reactionType === 'commission') ||
      (trialType === 'stop' && reactionType === 'omission')
    )
  }

  const handleReaction = (reaction: StopSignalReaction) => {
    const responseTime =
      reaction === 'commission' && cueTimestamp
        ? Date.now() - cueTimestamp
        : null

    const isCorrect = isStopSignalResponseCorrect(reaction)

    const newResponse = {
      reaction,
      correct: isCorrect,
      responseTime,
    }

    const taskResponseData: Partial<TaskResponse> = {
      user_id: session!.user.id,
      gsession_created_at: taskStartedAt,
      game_slug: 'stopsignal',
      assessment: 'TEST',
      phase: 0,
      sort: currentTrialIndex,
      picture_delta: pictureDelta,
      picture_dur: pictureShownAt ? Date.now() - pictureShownAt : null,
      border_delta:
        cueTimestamp && pictureShownAt ? cueTimestamp - pictureShownAt : null,
      jitter_dur: jitterDur,
      correct_resp_delta: isCorrect ? responseTime : null,
      commission_resp_delta:
        !isCorrect && reaction === 'commission' ? responseTime : null,
      has_selection: reaction === 'commission' ? 1 : 0,
      is_valid: isCorrect ? 1 : 0,
      is_omission: !isCorrect && reaction === 'omission' ? 1 : 0,
      is_commission: !isCorrect && reaction === 'commission' ? 1 : 0,
      target_index: 0,
      picture_offset: 'NONE',
      picture_list: src,
    }

    recordTaskResponse(taskResponseData)

    if (newResponse.correct) {
      setNumCorrect((prevNumCorrect) => prevNumCorrect + 1)
      if (reaction === 'commission') {
        setTotalTime((prevTotalTime) =>
          responseTime ? prevTotalTime + responseTime : prevTotalTime
        )
      }
    }

    newResponse.correct ? showInterval() : showError()
  }

  // set game stage to init and show cue after 1000ms when currentTrialIndex changes
  useEffect(() => {
    showInit()
  }, [currentTrialIndex])

  // add timeout to proceed to next stage
  useEffect(() => {
    let timeout: NodeJS.Timeout
    switch (gameStage) {
      case 'init':
        timeout = setTimeout(showCue, times.init)
        break
      case 'cue':
        timeout = setTimeout(() => handleReaction('omission'), times.cue)
        break
      case 'error':
        timeout = setTimeout(showInterval, times.error)
        break
      case 'interval':
        timeout = setTimeout(goToNextTrialOrBreakOrEndGame, times.interval)
        break
      case 'break':
        timeout = setTimeout(
          () => setCurrentTrialIndex((prev) => prev + 1),
          times.break
        )
        break
    }
    return () => clearTimeout(timeout)
  }, [gameStage])

  if (gameStage === 'break') return <Break />

  return (
    <>
      {interval ? (
        <></>
      ) : (
        <div title="image-container" className={`imageBox sized ${border}`}>
          {image && (
            <img
              onClick={() => handleReaction('commission')}
              onTouchStart={() => handleReaction('commission')}
              src={src}
              alt="trial image"
              className="squeezed"
            />
          )}
          {error && <div className="redCross">X</div>}
        </div>
      )}
    </>
  )
}
