import { useEffect, useMemo, useState } from 'react'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import { ImageType, ReactionType } from '../types/Task'
interface Image {
  src: string
  type: ImageType
}
type VisualSearchGameStage = 'cue' | 'interval' | 'feedback'
type VisualSearchResponse = {
  reactionType: null | ReactionType
  correct: null | boolean
  responseTime: null | number
  selectedSrc: null | string
}

const rawImages: Image[] = images as Image[]

function getTrialImages() {
  const unhealthyImages = rawImages.filter(
    (image) => image.type === 'unhealthy'
  )
  const healthyImages = rawImages.filter((image) => image.type === 'healthy')
  const healthyImage = healthyImages.sort(() => Math.random() - 0.5)[0]
  const trialImages = [...unhealthyImages, healthyImage].sort(
    () => Math.random() - 0.5
  )
  return trialImages
}

function createImageMatrix(numRows: number, numCols: number, images: Image[]) {
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

const task = tasks[3]
const { times } = task

export default function VisualSearch({
  endGame,
  setAccuracy,
  setAverageResponse,
}: {
  endGame: () => void,
  setAccuracy: (value: number) => void,
  setAverageResponse: (value: number) => void
}) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const trialImages = useMemo(() => getTrialImages(), [currentTrialIndex])
  const imageMatrix = useMemo(
    () => createImageMatrix(4, 4, trialImages as Image[]),
    [currentTrialIndex]
  )
  const [gameStage, setGameStage] = useState<VisualSearchGameStage>('interval')
  const defaultResponse: VisualSearchResponse = {
    reactionType: null,
    correct: null,
    responseTime: null,
    selectedSrc: null,
  }
  const [response, setResponse] =
    useState<VisualSearchResponse>(defaultResponse)
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)
  const [numCorrect, setNumCorrect] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  function showCue() {
    setGameStage('cue')
    setCueTimestamp(Date.now())
  }

  useEffect(() => {
    setAccuracy(Math.round(numCorrect / (currentTrialIndex + 1) * 10000) / 100)
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

  const taskData = imageMatrix.flat()
  function goToNextTrialOrEndGame() {
    if (currentTrialIndex < taskData.length - 1) {
      setCurrentTrialIndex((prev) => prev + 1)
    } else {
      endGame()
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
        timeout = setTimeout(goToNextTrialOrEndGame, times?.interval)
        break
      case 'interval':
        timeout = setTimeout(showCue, times?.interval)
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

    const responseTime = cueTimestamp ? Date.now() - cueTimestamp : null;

    setResponse({
      reactionType: 'commission',
      correct: type === 'healthy',
      responseTime: responseTime,
      selectedSrc: imageSrc,
    })
    if (type === 'healthy') {
      setNumCorrect(prevNumCorrect => prevNumCorrect + 1);
      setTotalTime(prevTotalTime => responseTime ? prevTotalTime + responseTime : prevTotalTime)
    }
  }

  function handleOmission() {
    setResponse({
      reactionType: 'omission',
      correct: false,
      responseTime: null,
      selectedSrc: null,
    })
  }
  useEffect(() => {
    if (response.reactionType) {
      setGameStage('feedback')
    }
  }, [response])

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
