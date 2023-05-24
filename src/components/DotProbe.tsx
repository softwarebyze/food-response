import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import {
  DotProbeGameStage,
  DotProbeReaction,
  DotProbeResponse,
  ResponseWithTrialData,
} from '../types/Task'
import { recordResponse } from '../utils/recordResponse'
import Break from './Break'

const { times: timesFromJSON, blocks, trialsPerBlock } = tasks[2]
const totalTrials = trialsPerBlock! * blocks!
const slowdown = 1
const times = {
  interval: timesFromJSON.interval * slowdown,
  init: (timesFromJSON?.init ?? 500) * slowdown,
  break: timesFromJSON.break,
}

const healthyImages = images.filter((image) => image.type === 'healthy')
const unhealthyImages = images.filter((image) => image.type === 'unhealthy')
const imagePairs = healthyImages.map((healthyImage, index) => ({
  left: healthyImage,
  right: unhealthyImages[index],
}))

export default function DotProbe({
  endGame,
  setAccuracy,
  setAverageResponse,
}: {
  endGame: () => void
  setAccuracy: (value: number) => void
  setAverageResponse: (value: number) => void
}) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const [gameStage, setGameStage] = useState<DotProbeGameStage>('interval')
  const [response, setResponse] = useState<DotProbeResponse>({
    reaction: null,
    responseTime: null,
  })
  const [numCorrect, setNumCorrect] = useState<number>(0)
  const [totalTime, setTotalTime] = useState<number>(0)
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)
  const [taskStartedAt, setTaskStartedAt] = useState(new Date())
  const { session } = useAuth()
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

  function isTimeForBreak(currentTrialIndex: number, trialsPerBlock: number) {
    return (currentTrialIndex + 1) % trialsPerBlock === 0
  }

  function onLastTrial(currentTrialIndex: number, totalTrials: number) {
    return currentTrialIndex === totalTrials - 1
  }

  function goToNextTrialOrBreakOrEndGame() {
    if (onLastTrial(currentTrialIndex, totalTrials)) {
      endGame()
    } else if (isTimeForBreak(currentTrialIndex, trialsPerBlock!)) {
      return setGameStage('break')
    } else {
      setCurrentTrialIndex((prev) => prev + 1)
    }
  }

  function handleReaction(reaction: DotProbeReaction) {
    const responseTime = cueTimestamp ? Date.now() - cueTimestamp : null

    const isCorrect =
      (healthySide === 'left' && reaction === 'left-commission') ||
      (healthySide === 'right' && reaction === 'right-commission')

    const newResponse = { reaction, responseTime }
    const newResponseWithTrialData: ResponseWithTrialData = {
      ...newResponse,
      correct: isCorrect,
      userId: session!.user.id,
      taskStartedAt,
      trialIndex: currentTrialIndex,
      imageType: 'healthy',
      trialType: healthySide,
      src: [currentImagePair.left.src, currentImagePair.right.src].join(', '),
      gameSlug: 'dotprobe',
    }
    recordResponse(newResponseWithTrialData)
    setResponse(newResponse)

    if (isCorrect) {
      setNumCorrect((prevNumCorrect) => prevNumCorrect + 1)
      setTotalTime((prevTotalTime) =>
        responseTime ? prevTotalTime + responseTime : prevTotalTime
      )
    }
    goToNextTrialOrBreakOrEndGame()
  }

  useEffect(() => {
    setGameStage('interval')
  }, [currentTrialIndex])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    switch (gameStage) {
      case 'interval':
        setResponse({ reaction: null, responseTime: null })
        timeout = setTimeout(() => setGameStage('init'), times.interval)
        break
      case 'init':
        timeout = setTimeout(showCue, times.init)
        break
      case 'cue':
        break
      case 'break':
        timeout = setTimeout(
          () => setCurrentTrialIndex((prev) => prev + 1),
          times.break
        )
    }
    return () => clearTimeout(timeout)
  }, [gameStage])

  if (gameStage === 'break') return <Break />

  return (
    <>
      <div>DotProbe</div>
      <>
        {'currentTrialIndex: ' + currentTrialIndex}
        <br />
        {'totalTrials: ' + totalTrials}
        <br />
        {'slowdown: ' + slowdown + 'x'}
        <br />
        {'gameStage: ' + gameStage}
        <br />
        {'response: ' + JSON.stringify(response)}
        <br />
        {'cueTimestamp: ' + JSON.stringify(cueTimestamp)}
      </>
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
              {healthySide === 'left' && (
                <div
                  className="probe"
                  onClick={() => handleReaction('left-commission')}
                  onTouchStart={() => handleReaction('left-commission')}
                >
                  <svg width="20" height="20">
                    <circle cx="10" cy="10" r="10"></circle>
                  </svg>
                </div>
              )}
            </div>
            <div className="column">
              {healthySide === 'right' && (
                <div
                  className="probe"
                  onClick={() => handleReaction('right-commission')}
                  onTouchStart={() => handleReaction('right-commission')}
                >
                  <svg width="20" height="20">
                    <circle cx="10" cy="10" r="10"></circle>
                  </svg>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
