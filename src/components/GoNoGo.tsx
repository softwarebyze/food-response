import { useEffect, useState } from 'react'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import {
  GoNoGoCue,
  GoNoGoGameStage,
  GoNoGoReaction,
  GoNoGoResponse,
  ImageType,
} from '../types/Task'

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

const { stages, times: timesFromJSON } = tasks[1]
const slowdown = 1
const times = {
  cue: (timesFromJSON?.cue ?? 1250) * slowdown,
  interval: (timesFromJSON?.interval ?? 500) * slowdown,
  error: (timesFromJSON?.error ?? 500) * slowdown,
} as const

export default function GoNoGo({ endGame }: { endGame: () => void }) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const [gameStage, setGameStage] = useState<GoNoGoGameStage>('cue')

  const { image, border, error, interval } = stages[gameStage]
  const taskData = images
  const { src, type } = taskData[currentTrialIndex]
  const borderStyle = border
    ? getGoNoGoBorderStyle(type as ImageType)
    : 'whiteBorder'
  const [response, setResponse] = useState<GoNoGoResponse>({
    reaction: null,
    correct: null,
  })
  const side = image ? getRandomSide() : null

  const cue: GoNoGoCue = { side, imageType: type as ImageType }

  function showCue() {
    setGameStage('cue')
  }

  function showInterval() {
    setGameStage('interval')
  }

  function showError() {
    setGameStage('error')
  }

  function goToNextTrialOrEndGame() {
    if (currentTrialIndex < taskData.length - 1) {
      setCurrentTrialIndex((prev) => prev + 1)
    } else {
      endGame()
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
    setResponse({ reaction, correct })
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout
    switch (gameStage) {
      case 'cue':
        setResponse({ reaction: null, correct: null })
        timeout = setTimeout(() => handleReaction('omission'), times.cue)
        break
      case 'interval':
        timeout = setTimeout(goToNextTrialOrEndGame, times.interval)
        break
      case 'error':
        timeout = setTimeout(showInterval, times.error)
        break
    }
    return () => clearTimeout(timeout)
  }, [gameStage])

  return (
    <>
      {'currentTrialIndex: ' + currentTrialIndex}
      <br />
      {'taskData.length: ' + taskData.length}
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
