import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import {
  ImageData,
  ImageType,
  ResponseWithTrialData,
  StopSignalGameStage,
  StopSignalReaction,
  StopSignalResponse,
  StopSignalTrialData,
  StopSignalTrialType,
} from '../types/Task'
import { recordResponse } from '../utils/recordResponse'
import Break from './Break'

function getStopSignalTrialType(imageType: ImageType) {
  switch (imageType) {
    case 'unhealthy':
      return 'stop'
    case 'healthy':
      return 'go'
    case 'water':
      return Math.random() < 0.5 ? 'stop' : 'go'
  }
}

function getStopSignalBorderStyle(trialType: StopSignalTrialType) {
  switch (trialType) {
    case 'stop':
      return 'grayBorder'
    case 'go':
      return 'blueBorder'
  }
}

function prepareTaskData(
  images: ImageData[],
  totalTrials: number
): StopSignalTrialData[] {
  return [...Array(totalTrials).fill(null)].map(() => {
    const imageData = images[Math.floor(Math.random() * images.length)]
    const trialType = getStopSignalTrialType(imageData.type)
    return {
      src: imageData.src,
      imageType: imageData.type,
      border: getStopSignalBorderStyle(trialType),
      trialType,
    }
  })
}

const { stages, times, blocks, trialsPerBlock } = tasks[0]
const totalTrials = trialsPerBlock * blocks

const taskData = prepareTaskData(images as ImageData[], totalTrials)

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

  const { src, trialType, border, imageType } = taskData[currentTrialIndex]
  const [response, setResponse] = useState<StopSignalResponse>({
    reaction: null,
    correct: null,
    responseTime: null,
  })
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)
  const [taskStartedAt, setTaskStartedAt] = useState(new Date())
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
  }

  function showError() {
    setGameStage('error')
  }

  function showInit() {
    setGameStage('init')
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

  function isStopSignalResponseCorrect(reactionType: StopSignalReaction) {
    return (
      (trialType === 'go' && reactionType === 'commission') ||
      (trialType === 'stop' && reactionType === 'omission')
    )
  }

  // when reaction changes, if it is wrong, change state to error
  // if it is correct, change state to interval
  useEffect(() => {
    if (response.correct === null) return
    if (response.correct === false) showError()
    if (response.correct === true) showInterval()
  }, [response])

  const handleReaction = (reaction: StopSignalReaction) => {
    const responseTime =
      reaction === 'commission' && cueTimestamp
        ? Date.now() - cueTimestamp
        : null

    const newResponse = {
      reaction,
      correct: isStopSignalResponseCorrect(reaction),
      responseTime,
    }
    const newResponseWithTrialData: ResponseWithTrialData = {
      ...newResponse,
      userId: session!.user.id,
      taskStartedAt,
      trialIndex: currentTrialIndex,
      imageType,
      trialType,
      src,
      gameSlug: 'stopsignal',
    }
    recordResponse(newResponseWithTrialData)
    setResponse(newResponse)
    if (newResponse.correct) {
      setNumCorrect((prevNumCorrect) => prevNumCorrect + 1)
      if (reaction === 'commission') {
        setTotalTime((prevTotalTime) =>
          responseTime ? prevTotalTime + responseTime : prevTotalTime
        )
      }
    }
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
        setResponse({ reaction: null, correct: null, responseTime: null })
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
