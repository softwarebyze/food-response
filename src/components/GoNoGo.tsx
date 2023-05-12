import { useCallback, useEffect, useState } from 'react'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import {
  GoNoGoCue,
  GoNoGoGameStage,
  GoNoGoReaction,
  GoNoGoResponse,
  ImageType,
  TaskData,
} from '../types/Task'
import Break from './Break'

function getGoNoGoBorderStyle(imageType: ImageType) {
  switch (imageType) {
    case 'unhealthy':
      return 'dashedBorder'
    case 'healthy':
      return 'solidBorder'
    case 'water':
      return Math.random() < 0.5 ? 'solidBorder' : 'dashedBorder'
  }
}

function isGoNoGoResponseCorrect(reactionType: GoNoGoReaction, cue: GoNoGoCue) {
  const { side, imageType } = cue
  return (
    (side === 'left' &&
      imageType === 'healthy' &&
      reactionType === 'left-commission') ||
    (side === 'right' &&
      imageType === 'healthy' &&
      reactionType === 'right-commission') ||
    (imageType === 'unhealthy' && reactionType === 'omission')
  )
}

function getRandomSide() {
  return Math.random() < 0.5 ? 'left' : 'right'
}

function prepareTaskData(images: TaskData, totalTrials: number) {
  return [...Array(totalTrials).fill(null)].map(
    () => images[Math.floor(Math.random() * images.length)]
  )
}

const { stages, times: timesFromJSON, blocks, trialsPerBlock } = tasks[1]
const totalTrials = trialsPerBlock! * blocks!
const slowdown = 1
const breakSlowdown = 1
const times = {
  cue: (timesFromJSON?.cue ?? 1250) * slowdown,
  interval: (timesFromJSON?.interval ?? 500) * slowdown,
  error: (timesFromJSON?.error ?? 500) * slowdown,
  break: (timesFromJSON?.break ?? 10000) * breakSlowdown,
} as const

const taskData = prepareTaskData(images as TaskData, totalTrials)

export default function GoNoGo({
  endGame,
  setAccuracy,
  setAverageResponse,
}: {
  endGame: () => void
  setAccuracy: (value: number) => void
  setAverageResponse: (value: number) => void
}) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const [gameStage, setGameStage] = useState<GoNoGoGameStage>('cue')

  const [numCorrect, setNumCorrect] = useState<number>(0)
  const [totalTime, setTotalTime] = useState<number>(0)
  const { image, border, error, interval } = stages![gameStage] as any
  const { src, type } = taskData[currentTrialIndex]
  const borderStyle = border
    ? getGoNoGoBorderStyle(type as ImageType)
    : 'whiteBorder'
  const [response, setResponse] = useState<GoNoGoResponse>({
    reaction: null,
    correct: null,
    responseTime: null,
  })
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)
  const side = image ? getRandomSide() : null

  const cue: GoNoGoCue = { side, imageType: type as ImageType }

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

  useEffect(() => {
    if (response.correct === null) return
    if (response.correct === false) showError()
    if (response.correct === true) showInterval()
  }, [response])

  useEffect(() => {
    showCue()
  }, [currentTrialIndex])

  function handleReaction(reaction: GoNoGoReaction) {
    const correct = isGoNoGoResponseCorrect(reaction, cue)
    const responseTime = cueTimestamp ? Date.now() - cueTimestamp : null
    setResponse({ reaction, correct, responseTime })
    if (correct) {
      setNumCorrect((prevNumCorrect) => prevNumCorrect + 1)
      if (['left-commission', 'right-commission'].includes(reaction)) {
        setTotalTime((prevTotalTime) =>
          responseTime ? prevTotalTime + responseTime : prevTotalTime
        )
      }
    }
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameStage !== 'cue' || !['c', 'm'].includes(event.key)) return
      if (event.key === 'c') handleReaction('left-commission')
      if (event.key === 'm') handleReaction('right-commission')
    },
    [gameStage]
  )

  // add event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    switch (gameStage) {
      case 'cue':
        setResponse({ reaction: null, correct: null, responseTime: null })
        timeout = setTimeout(() => handleReaction('omission'), times.cue)
        break
      case 'interval':
        timeout = setTimeout(goToNextTrialOrBreakOrEndGame, times.interval)
        break
      case 'error':
        timeout = setTimeout(showInterval, times.error)
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
      {'currentTrialIndex: ' + currentTrialIndex}
      <br />
      {'totalTrials: ' + totalTrials}
      <br />
      {'slowdown: ' + slowdown + 'x'}
      <br />
      {'gameStage: ' + gameStage}
      <br />
      {'side: ' + side}
      <br />
      {'response: ' + JSON.stringify(response)}
      {interval ? (
        <></>
      ) : (
        <div className={`imageBox ${borderStyle} sized`}>
          {image && (
            <div className="columns is-mobile">
              <div className="column">
                {side === 'left' && (
                  <img
                    onClick={() => handleReaction('left-commission')}
                    src={src}
                  />
                )}
              </div>
              <div className="column">
                {side === 'right' && (
                  <img
                    onClick={() => handleReaction('right-commission')}
                    src={src}
                  />
                )}
              </div>
            </div>
          )}
          {error && <div className="redCross">X</div>}
        </div>
      )}
    </>
  )
}
