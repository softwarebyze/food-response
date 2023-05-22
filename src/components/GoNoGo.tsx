import { useEffect, useState } from 'react'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import {
  GoNoGoGameStage,
  GoNoGoReaction,
  GoNoGoResponse,
  GoNoGoTaskInfo,
  GoNoGoTrialData,
  GoNoGoTrialType,
  ImageData,
  ImageType,
} from '../types/Task'
import Break from './Break'

function getGoNoGoTrialType(imageType: ImageType) {
  switch (imageType) {
    case 'unhealthy':
      return 'no-go'
    case 'healthy':
      return 'go'
    case 'water':
      return Math.random() < 0.5 ? 'no-go' : 'go'
  }
}

function getGoNoGoBorderStyle(trialType: GoNoGoTrialType) {
  switch (trialType) {
    case 'go':
      return 'solidBorder'
    case 'no-go':
      return 'dashedBorder'
  }
}

function getRandomSide() {
  return Math.random() < 0.5 ? 'left' : 'right'
}

function prepareTaskData(
  images: ImageData[],
  totalTrials: number
): GoNoGoTrialData[] {
  return [...Array(totalTrials).fill(null)].map(() => {
    const imageData = images[Math.floor(Math.random() * images.length)]
    const trialType = getGoNoGoTrialType(imageData.type)
    return {
      src: imageData.src,
      imageType: imageData.type,
      border: getGoNoGoBorderStyle(trialType),
      side: getRandomSide(),
      trialType,
    }
  })
}

export function getNextStageAfterResponse(
  response: GoNoGoResponse,
  trialType: GoNoGoTrialType
) {
  if (response.correct) return 'interval'
  const isIncorrect = response.correct === false
  const isCommission = response.reaction !== 'omission'
  const isGoTrial = trialType === 'go'
  const isGoCommission = isCommission && isGoTrial
  if (isIncorrect && isGoCommission) return 'interval'
  if (isIncorrect && !isGoCommission) return 'error'
}

const {
  stages,
  times: timesFromJSON,
  blocks,
  trialsPerBlock,
} = tasks[1] as GoNoGoTaskInfo
const totalTrials = trialsPerBlock * blocks
const slowdown = 1
const breakSlowdown = 1
const times = {
  cue: (timesFromJSON.cue) * slowdown,
  interval: (timesFromJSON.interval) * slowdown,
  error: (timesFromJSON.error) * slowdown,
  break: (timesFromJSON.break) * breakSlowdown,
}

const taskData = prepareTaskData(images as ImageData[], totalTrials)

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
  const { image, error, interval } = stages[gameStage]
  const { src, trialType, side, border, imageType } =
    taskData[currentTrialIndex]
  const [response, setResponse] = useState<GoNoGoResponse>({
    reaction: null,
    correct: null,
    responseTime: null,
  })
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)

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

  function isGoNoGoResponseCorrect(reactionType: GoNoGoReaction) {
    return (
      (side === 'left' &&
        trialType === 'go' &&
        reactionType === 'left-commission') ||
      (side === 'right' &&
        trialType === 'go' &&
        reactionType === 'right-commission') ||
      (trialType === 'no-go' && reactionType === 'omission')
    )
  }

  function getNextGoNoGoStageAfterResponse(response: GoNoGoResponse) {
    return getNextStageAfterResponse(response, trialType as GoNoGoTrialType)
  }

  useEffect(() => {
    if (response.correct === null || response.reaction === null) return
    const nextStage = getNextGoNoGoStageAfterResponse(response)
    if (typeof nextStage === 'string') {
      setGameStage(nextStage)
    }
  }, [response])

  useEffect(() => {
    showCue()
  }, [currentTrialIndex])

  function handleReaction(reaction: GoNoGoReaction) {
    const correct = isGoNoGoResponseCorrect(reaction)
    const responseTime = ['left-commission', 'right-commission'].includes(
      reaction
    )
      ? cueTimestamp
        ? Date.now() - cueTimestamp
        : null
      : null
    const newResponse = { reaction, correct, responseTime }
    setResponse(newResponse)
    if (correct) {
      setNumCorrect((prevNumCorrect) => prevNumCorrect + 1)
      if (['left-commission', 'right-commission'].includes(reaction)) {
        setTotalTime((prevTotalTime) =>
          responseTime ? prevTotalTime + responseTime : prevTotalTime
        )
      }
    }
  }

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
        <div className={`imageBox ${border} sized`}>
          {image && (
            <div className="columns is-mobile">
              <div className="column">
                {side === 'left' ? (
                  <img
                    onClick={() => handleReaction('left-commission')}
                    onTouchStart={() => handleReaction('left-commission')}
                    src={src}
                  />
                ) : (
                  <div
                    onClick={() => handleReaction('left-commission')}
                    onTouchStart={() => handleReaction('left-commission')}
                    className="fill clickable"
                  ></div>
                )}
              </div>
              <div className="column">
                {side === 'right' ? (
                  <img
                    onClick={() => handleReaction('right-commission')}
                    onTouchStart={() => handleReaction('right-commission')}
                    src={src}
                  />
                ) : (
                  <div
                    onClick={() => handleReaction('right-commission')}
                    onTouchStart={() => handleReaction('right-commission')}
                    className="fill clickable"
                  ></div>
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
