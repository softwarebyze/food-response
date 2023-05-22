import { useEffect, useMemo, useState } from 'react'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import {
  ImageData,
  ImageType,
  VisualSearchGameStage,
  VisualSearchResponse,
} from '../types/Task'
import Break from './Break'

const rawImages: ImageData[] = images as ImageData[]

function getTrialImages(numberOfImages: number = 16) {
  const unhealthyImages = rawImages
    .filter((image) => image.type === 'unhealthy')
    .slice(0, numberOfImages - 1)
  const healthyImages = rawImages.filter((image) => image.type === 'healthy')
  const healthyImage = healthyImages.sort(() => Math.random() - 0.5)[0]
  const trialImages = [...unhealthyImages, healthyImage].sort(
    () => Math.random() - 0.5
  )
  return trialImages
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
  const trialImages = useMemo(() => getTrialImages(), [currentTrialIndex])
  const imageMatrix = useMemo(
    () => createImageMatrix(4, 4, trialImages as ImageData[]),
    [currentTrialIndex]
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

  function showCue() {
    setGameStage('cue')
    setCueTimestamp(Date.now())
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
        timeout = setTimeout(handleOmission, times?.cue)
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

  function handleImageClick(imageSrc: string, type: ImageType) {
    if (gameStage !== 'cue') return

    const responseTime = cueTimestamp ? Date.now() - cueTimestamp : null

    setResponse({
      reaction: 'commission',
      correct: type === 'healthy',
      responseTime: responseTime,
      selectedSrc: imageSrc,
    })
    if (type === 'healthy') {
      setNumCorrect((prevNumCorrect) => prevNumCorrect + 1)
      setTotalTime((prevTotalTime) =>
        responseTime ? prevTotalTime + responseTime : prevTotalTime
      )
    }
  }

  function handleOmission() {
    setResponse({
      reaction: 'omission',
      correct: false,
      responseTime: null,
      selectedSrc: null,
    })
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
                    onClick={() => handleImageClick(image.src, image.type)}
                    onTouchStart={() => handleImageClick(image.src, image.type)}
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
