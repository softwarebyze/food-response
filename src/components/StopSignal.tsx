import { useEffect, useState } from 'react'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import {
  ImageType,
  Response,
  StopSignalGameStage,
  StopSignalReaction,
  TaskData,
} from '../types/Task'
import Break from './Break'

function getBorderStyle(imageType: ImageType) {
  switch (imageType) {
    case 'unhealthy':
      return 'grayBorder'
    case 'healthy':
      return 'blueBorder'
    case 'water':
      return Math.random() < 0.5 ? 'grayBorder' : 'blueBorder'
  }
}

export function isResponseCorrect(
  reactionType: StopSignalReaction,
  borderStyle: 'whiteBorder' | 'grayBorder' | 'blueBorder'
) {
  return (
    (borderStyle === 'blueBorder' && reactionType === 'commission') ||
    (borderStyle === 'grayBorder' && reactionType === 'omission')
  )
}

function prepareTaskData(images: TaskData, totalTrials: number) {
  return [...Array(totalTrials).fill(null)].map(
    () => images[Math.floor(Math.random() * images.length)]
  )
}

const { stages, times: timesFromJSON, blocks, trialsPerBlock } = tasks[0]
const totalTrials = trialsPerBlock * blocks
const slowdown = 1
const times = {
  init: (timesFromJSON?.init ?? 100) * slowdown,
  cue: (timesFromJSON.cue ?? 1150) * slowdown,
  interval: (timesFromJSON.interval) * slowdown,
  error: (timesFromJSON?.error ?? 500) * slowdown,
  break: timesFromJSON.break,
}

const taskData = prepareTaskData(images as TaskData, totalTrials)

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
  const { image, border, error, interval } = stages![gameStage] as any

  const { src, type } = taskData[currentTrialIndex]
  const borderStyle = border ? getBorderStyle(type as ImageType) : 'whiteBorder'
  const [response, setResponse] = useState<Response>({
    reaction: null,
    correct: null,
    responseTime: null,
  })
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)

  function showCue() {
    setGameStage('cue')
    setCueTimestamp(Date.now())
  }

  useEffect(() => {
    setAccuracy(Math.round((numCorrect / currentTrialIndex) * 10000) / 100)
  }, [setAccuracy, numCorrect, currentTrialIndex])

  useEffect(() => {
    setAverageResponse(Math.round(totalTime / numCorrect))
  }, [setAccuracy, totalTime, numCorrect])

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

  // when reaction changes, if it is wrong, change state to error
  // if it is correct, change state to interval
  useEffect(() => {
    if (response.correct === null) return
    if (response.correct === false) showError()
    if (response.correct === true) showInterval()
  }, [response])

  const handleReaction = (reaction: StopSignalReaction) => {
    const responseTime =
      reaction === 'commission'
        ? cueTimestamp
          ? Date.now() - cueTimestamp
          : null
        : null

    const newResponse = {
      reaction: reaction,
      correct: isResponseCorrect(reaction, borderStyle),
      responseTime: responseTime,
    }
    setResponse(newResponse)
    if (isResponseCorrect(reaction, borderStyle)) {
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
      {interval ? (
        <></>
      ) : (
        <div
          title="image-container"
          className={`imageBox sized ${borderStyle}`}
        >
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
