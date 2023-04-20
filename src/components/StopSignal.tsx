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
  reactionType: ReactionType,
  borderStyle: 'whiteBorder' | 'grayBorder' | 'blueBorder'
) {
  return (
    (borderStyle === 'blueBorder' && reactionType === 'commission') ||
    (borderStyle === 'grayBorder' && reactionType === 'omission')
  )
}

import { useCallback, useEffect, useState } from 'react'
import { useGame } from '../contexts/GameContext'
import { GameStage, ImageType, ReactionType, Response } from '../types/Task'
const slowdown = 1
const times = {
  init: 100 * slowdown,
  cue: 1150 * slowdown,
  interval: 500 * slowdown,
  error: 500 * slowdown,
} as const

export default function StopSignal({ endGame }: { endGame: () => void }) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const [gameStage, setGameStage] = useState<GameStage>('init')
  const {
    taskData,
    taskInfo: { stages },
  } = useGame()
  const { image, border, error, interval } = stages[gameStage]
  const { src, type } = taskData[currentTrialIndex]
  const borderStyle = border ? getBorderStyle(type as ImageType) : 'whiteBorder'
  const [response, setResponse] = useState<Response>({
    type: null,
    correct: null,
  })

  function showCue() {
    setGameStage('cue')
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

  function goToNextTrialOrEndGame() {
    if (currentTrialIndex < taskData.length - 1) {
      setCurrentTrialIndex((prev) => prev + 1)
    } else {
      endGame()
    }
  }

  // when reaction changes, if it is wrong, change state to error
  // if it is correct, change state to interval
  useEffect(() => {
    if (response.correct === null) return
    if (response.correct === false) showError()
    if (response.correct === true) showInterval()
  }, [response])

  const handleReaction = (reactionType: ReactionType) => {
    const newResponse = {
      type: reactionType,
      correct: isResponseCorrect(reactionType, borderStyle),
    }
    setResponse(newResponse)
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameStage !== 'cue' || event.key !== ' ') return
      handleReaction('commission')
    },
    [gameStage]
  )

  // set game stage to init and show cue after 1000ms when currentTrialIndex changes
  useEffect(() => {
    showInit()
  }, [currentTrialIndex])

  // add event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // add timeout to proceed to next stage
  useEffect(() => {
    let timeout: NodeJS.Timeout
    switch (gameStage) {
      case 'init':
        setResponse({ type: null, correct: null })
        timeout = setTimeout(showCue, times.init)
        break
      case 'cue':
        timeout = setTimeout(() => handleReaction('omission'), times.cue)
        break
      case 'error':
        timeout = setTimeout(showInterval, times.error)
        break
      case 'interval':
        timeout = setTimeout(goToNextTrialOrEndGame, times.interval)
        break
    }
    return () => clearTimeout(timeout)
  }, [gameStage])

  return (
    <>
      <>
        {'currentTrialIndex: ' + currentTrialIndex}
        <br />
        {'taskData.length: ' + taskData.length}
        <br />
        {'slowdown: ' + slowdown + 'x'}
        <br />
        {'gameStage: ' + gameStage}
        <br />
        {'response: ' + JSON.stringify(response)}
      </>
      {interval ? (
        <></>
      ) : (
        <>
          <div
            title="image-container"
            className={`imageBox sized ${borderStyle}`}
          >
            {image && <img src={src} alt="trial image" className="squeezed" />}
            {error && <div className="redCross">X</div>}
          </div>
        </>
      )}
    </>
  )
}
