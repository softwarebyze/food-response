import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useUserData } from '../contexts/UserDataContext'
import { tasks } from '../data/tasks.json'
import {
  ImageData,
  ImageType,
  TaskResponse,
  VisualSearchGameStage,
  VisualSearchReaction,
  VisualSearchResponse,
} from '../types/Task'
import { recordTaskResponse } from '../utils/recordResponse'
import Break from './Break'

function prepareTaskData(
  images: ImageData[],
  totalNumberOfTrials: number,
  healthyImagesPerTrial: number = 1,
  unhealthyImagesPerTrial: number = 15
) {
  const healthyImages = _.shuffle(
    images.filter((image) => image.type === 'healthy')
  )
  const unhealthyImages = _.shuffle(
    images.filter((image) => image.type === 'unhealthy')
  )

  while (healthyImages.length < healthyImagesPerTrial * totalNumberOfTrials) {
    healthyImages.push(..._.shuffle([...healthyImages]))
  }

  while (
    unhealthyImages.length <
    unhealthyImagesPerTrial * totalNumberOfTrials
  ) {
    unhealthyImages.push(..._.shuffle([...unhealthyImages]))
  }

  const taskData = []
  for (let i = 0; i < totalNumberOfTrials; i++) {
    const healthyImageForTrial = healthyImages.splice(0, healthyImagesPerTrial)
    const unhealthyImagesForTrial = unhealthyImages.splice(
      0,
      unhealthyImagesPerTrial
    )
    taskData.push(
      _.shuffle([...healthyImageForTrial, ...unhealthyImagesForTrial])
    )
  }

  return taskData
}

function createImageMatrix(
  numRows: number,
  numCols: number,
  images: ImageData[]
) {
  const imageMatrix = []
  let imageIndex = 0
  for (let row = 0; row < numRows; row++) {
    const imageRow = []
    for (let col = 0; col < numCols; col++) {
      imageRow.push(images[imageIndex])
      imageIndex++
    }
    imageMatrix.push(imageRow)
  }
  return imageMatrix
}

const { times, blocks, trialsPerBlock } = tasks[3]
const totalTrials = trialsPerBlock! * blocks!

export default function VisualSearch({
  endGame,
  setAccuracy,
  setAverageResponse,
}: {
  endGame: () => void
  setAccuracy: (value: number) => void
  setAverageResponse: (value: number) => void
}) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)

  const { userImages } = useUserData()

  const taskData = useMemo(
    () => prepareTaskData(userImages, totalTrials, 1, 15),
    [userImages]
  )

  const trialImages = taskData[currentTrialIndex]
  const targetIndex = trialImages.findIndex((image) => image.type === 'healthy')
  const imageMatrix = useMemo(
    () => createImageMatrix(4, 4, trialImages),
    [trialImages]
  )
  const [gameStage, setGameStage] = useState<VisualSearchGameStage>('interval')
  const defaultResponse: VisualSearchResponse = {
    reaction: null,
    correct: null,
    responseTime: null,
    selectedSrc: null,
  }
  const [response, setResponse] =
    useState<VisualSearchResponse>(defaultResponse)
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)
  const [numCorrect, setNumCorrect] = useState<number>(0)
  const [totalTime, setTotalTime] = useState<number>(0)
  const [taskStartedAt, setTaskStartedAt] = useState(new Date())
  const [pictureDelta, setPictureDelta] = useState<number | null>(null)
  const [pictureShownAt, setPictureShownAt] = useState<number | null>(null)
  const [intervalShownAt, setIntervalShownAt] = useState<number | null>(null)
  const [jitterDur, setJitterDur] = useState<number | null>(null)
  const { session } = useAuth()

  function showCue() {
    setGameStage('cue')
    setCueTimestamp(Date.now())
    setPictureShownAt(Date.now())
    setPictureDelta(
      pictureShownAt ? pictureShownAt - taskStartedAt.getTime() : null
    )
  }

  useEffect(() => {
    setAccuracy(
      Math.round((numCorrect / (currentTrialIndex + 1)) * 10000) / 100
    )
  }, [setAccuracy, numCorrect, currentTrialIndex])

  useEffect(() => {
    setAverageResponse(Math.round(totalTime / numCorrect))
  }, [setAccuracy, totalTime, numCorrect])

  function showInterval() {
    setGameStage('interval')
    setIntervalShownAt(Date.now())
  }

  useEffect(() => {
    showInterval()
  }, [currentTrialIndex])

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

  useEffect(() => {
    let timeout: NodeJS.Timeout
    switch (gameStage) {
      case 'cue':
        setResponse(defaultResponse)
        timeout = setTimeout(() => handleResponse(null, null), times?.cue)
        break
      case 'feedback':
        timeout = setTimeout(goToNextTrialOrBreakOrEndGame, times?.interval)
        break
      case 'interval':
        timeout = setTimeout(showCue, times?.interval)
        break
      case 'break':
        timeout = setTimeout(
          () => setCurrentTrialIndex((prev) => prev + 1),
          times.break
        )
    }
    return () => clearTimeout(timeout)
  }, [gameStage])

  function getBorderStyle(imageSrc: string, type: ImageType) {
    if (gameStage !== 'feedback') {
      return ''
    }
    if (type === 'healthy') {
      return 'green-grow'
    }
    if (response.correct === false && imageSrc === response.selectedSrc) {
      return 'red-shrink'
    }
  }

  function handleResponse(imageSrc: string | null, type: ImageType | null) {
    if (gameStage !== 'cue') return

    const responseTime = cueTimestamp ? Date.now() - cueTimestamp : null

    const isCorrect = type === 'healthy'

    const newResponse = {
      reaction: 'commission' as VisualSearchReaction,
      correct: isCorrect,
      responseTime: responseTime,
      selectedSrc: imageSrc,
    }

    const taskResponseData: Partial<TaskResponse> = {
      user_id: session?.user.id,
      gsession_created_at: taskStartedAt,
      game_slug: 'visualsearch',
      assessment: 'TEST',
      phase: 0,
      sort: currentTrialIndex,
      picture_delta: pictureDelta,
      picture_dur: pictureShownAt ? Date.now() - pictureShownAt : null,
      border_delta: 0,
      jitter_dur: jitterDur,
      correct_resp_delta: isCorrect ? responseTime : null,
      commission_resp_delta: !isCorrect && type !== null ? responseTime : null,
      has_selection: type !== null,
      is_valid: isCorrect,
      is_omission: type === null,
      is_commission: !isCorrect && type !== null,
      target_index: targetIndex,
      picture_offset: 'LEFT',
      picture_list: trialImages.map((image) => image.src).join(','),
    }

    recordTaskResponse(taskResponseData)

    setResponse(newResponse)
    if (isCorrect) {
      setNumCorrect((prevNumCorrect) => prevNumCorrect + 1)
      setTotalTime((prevTotalTime) =>
        responseTime ? prevTotalTime + responseTime : prevTotalTime
      )
    }
  }

  useEffect(() => {
    if (response.reaction) {
      setGameStage('feedback')
    }
  }, [response])

  if (gameStage === 'break') return <Break />

  return (
    <div>
      <div className="columns is-mobile">
        {gameStage === 'interval' && (
          <div className="column">
            <div className="fixationCross">+</div>
          </div>
        )}
        {['cue', 'feedback'].includes(gameStage) && (
          <>
            {imageMatrix.map((row, rowIndex) => (
              <div key={`row${rowIndex}`} className="column">
                {row.map((image, colIndex) => (
                  <img
                    key={`col${colIndex}`}
                    className={getBorderStyle(image.src, image.type)}
                    src={image.src}
                    onClick={() => handleResponse(image.src, image.type)}
                    onTouchStart={() => handleResponse(image.src, image.type)}
                  />
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
