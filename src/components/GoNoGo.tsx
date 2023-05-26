import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import {
  GoNoGoBorderStyle,
  GoNoGoGameStage,
  GoNoGoReaction,
  GoNoGoResponse,
  GoNoGoTaskInfo,
  GoNoGoTrialData,
  GoNoGoTrialType,
  ImageData,
  ImageType,
  // ResponseWithTrialData,
} from '../types/Task'
// import { recordResponse } from '../utils/recordResponse'
import Break from './Break'

function getGoNoGoTrialType(imageType: ImageType): GoNoGoTrialType {
  switch (imageType) {
    case 'unhealthy':
      return 'no-go'
    case 'healthy':
      return 'go'
    case 'water':
      return Math.random() < 0.5 ? 'no-go' : 'go'
  }
}

function getGoNoGoBorderStyle(trialType: GoNoGoTrialType): GoNoGoBorderStyle {
  switch (trialType) {
    case 'go':
      return 'solidBorder'
    case 'no-go':
      return 'dashedBorder'
  }
}

function getRandomSide(): 'left' | 'right' {
  return Math.random() < 0.5 ? 'left' : 'right'
}

function prepareTaskData(
  images: ImageData[],
  totalTrials: number
): GoNoGoTrialData[] {
  const healthyImages = _.shuffle(
    images.filter((image) => image.type === 'healthy')
  )
  const unhealthyImages = _.shuffle(
    images.filter((image) => image.type === 'unhealthy')
  )
  const waterImages = _.shuffle(
    images.filter((image) => image.type === 'water')
  )

  while (healthyImages.length < totalTrials) {
    healthyImages.push(..._.shuffle([...healthyImages]))
  }

  while (unhealthyImages.length < totalTrials) {
    unhealthyImages.push(..._.shuffle([...unhealthyImages]))
  }

  while (waterImages.length < totalTrials) {
    waterImages.push(..._.shuffle([...waterImages]))
  }

  const combinedImages = healthyImages.concat(unhealthyImages, waterImages)
  const combinedImagesShuffled = _.shuffle(combinedImages)

  const taskData = _.take(combinedImagesShuffled, totalTrials).map(
    (imageData) => {
      const trialType = getGoNoGoTrialType(imageData.type)
      return {
        src: imageData.src,
        imageType: imageData.type,
        border: getGoNoGoBorderStyle(trialType),
        side: getRandomSide(),
        trialType,
      }
    }
  )

  return taskData
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

const { stages, times, blocks, trialsPerBlock } = tasks[1] as GoNoGoTaskInfo
const totalTrials = trialsPerBlock * blocks

const taskData = prepareTaskData(images as ImageData[], totalTrials)
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
  const [taskStartedAt, setTaskStartedAt] = useState(new Date())
  const { session } = useAuth()

  useEffect(() => alert(percentages), [])

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

  const getNextGoNoGoStageAfterResponse = useCallback(
    (response: GoNoGoResponse) => {
      return getNextStageAfterResponse(response, trialType as GoNoGoTrialType)
    },
    [trialType]
  )

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
    const responseTime =
      ['left-commission', 'right-commission'].includes(reaction) && cueTimestamp
        ? Date.now() - cueTimestamp
        : null

    const newResponse = {
      reaction,
      correct: isGoNoGoResponseCorrect(reaction),
      responseTime,
    }
    // const newResponseWithTrialData: ResponseWithTrialData = {
    //   ...newResponse,
    //   userId: session!.user.id,
    //   taskStartedAt,
    //   trialIndex: currentTrialIndex,
    //   imageType,
    //   trialType,
    //   src,
    //   gameSlug: 'gonogo',
    // }
    // recordResponse(newResponseWithTrialData)
    setResponse(newResponse)
    if (newResponse.correct) {
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

  return interval ? (
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
  )
}
