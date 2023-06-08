import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useUserData } from '../contexts/UserDataContext'
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
  TaskResponse,
} from '../types/Task'
import { recordTaskResponse } from '../utils/recordResponse'
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

export function sampleWithoutBackToBackRepeats<T>(array: T[], n: number): T[] {
  if (array.length >= n) return _.sampleSize(array, n)
  let previousItem = _.sample(array)!
  return Array(n)
    .fill(null)
    .map(() => {
      const nextItem = _.sample(_.without(array, previousItem))!
      previousItem = nextItem
      return nextItem
    })
}

export function prepareTaskData(
  images: ImageData[],
  totalTrials: number
): GoNoGoTrialData[] {
  const trialImages = sampleWithoutBackToBackRepeats(images, totalTrials)

  const taskData = trialImages.map((imageData) => {
    const trialType = getGoNoGoTrialType(imageData.type)
    return {
      src: imageData.src,
      imageType: imageData.type,
      border: getGoNoGoBorderStyle(trialType),
      side: getRandomSide(),
      trialType,
    }
  })

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

  const { userImages } = useUserData()

  const taskData = useMemo(
    () => prepareTaskData(userImages, totalTrials),
    [userImages, totalTrials]
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
    console.log('Go/No-Go', percentages)
  }, [])

  const { src, trialType, side, border, imageType } =
    taskData[currentTrialIndex]
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
    setPictureShownAt(Date.now())
    setPictureDelta(
      pictureShownAt ? pictureShownAt - taskStartedAt.getTime() : null
    )
  }

  function showInterval() {
    setGameStage('interval')
    setIntervalShownAt(Date.now())
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
    setJitterDur(Date.now() - intervalShownAt!)
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
      return getNextStageAfterResponse(response, trialType)
    },
    [trialType]
  )

  useEffect(() => {
    showCue()
  }, [currentTrialIndex])

  function handleReaction(reaction: GoNoGoReaction) {
    const responseTime =
      ['left-commission', 'right-commission'].includes(reaction) && cueTimestamp
        ? Date.now() - cueTimestamp
        : null
    const isCorrect = isGoNoGoResponseCorrect(reaction)
    const newResponse = {
      reaction,
      correct: isCorrect,
      responseTime,
    }

    const taskResponseData: Partial<TaskResponse> = {
      user_id: session!.user.id,
      gsession_created_at: taskStartedAt,
      game_slug: 'gonogo',
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
      is_omission: !isCorrect && reaction === 'omission' ? 1 : 0,
      is_commission:
        !isCorrect && ['left-commission', 'right-commission'].includes(reaction)
          ? 1
          : 0,
      target_index: side === 'left' ? 0 : 1,
      picture_offset: side === 'left' ? 'LEFT' : 'RIGHT',
      picture_list: src,
    }

    recordTaskResponse(taskResponseData)

    if (newResponse.correct) {
      setNumCorrect((prevNumCorrect) => prevNumCorrect + 1)
      if (['left-commission', 'right-commission'].includes(reaction)) {
        setTotalTime((prevTotalTime) =>
          responseTime ? prevTotalTime + responseTime : prevTotalTime
        )
      }
    }

    const nextStage = getNextGoNoGoStageAfterResponse(newResponse)
    if (nextStage) {
      setGameStage(nextStage)
    }
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout
    switch (gameStage) {
      case 'cue':
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
