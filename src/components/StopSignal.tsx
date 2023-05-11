import { useCallback, useEffect, useState } from 'react'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import { GameStage, ImageType, ReactionType, Response } from '../types/Task'

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

const { stages, times: timesFromJSON } = tasks[0]
const slowdown = 3
const times = {
  init: (timesFromJSON?.init ?? 100) * slowdown,
  cue: (timesFromJSON?.cue ?? 1150) * slowdown,
  interval: (timesFromJSON?.interval ?? 500) * slowdown,
  error: (timesFromJSON?.error ?? 500) * slowdown,
} as const

export default function StopSignal({
  endGame,
  setAccuracy,
  setAverageResponse,
}: {
  endGame: () => void,
  setAccuracy: (value: number) => void,
  setAverageResponse: (value: number) => void,
}) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const [gameStage, setGameStage] = useState<GameStage>('init')

  const [numCorrect, setNumCorrect] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const { image, border, error, interval } = stages![gameStage] as any
  const taskData = images
  const { src, type } = taskData[currentTrialIndex]
  const borderStyle = border ? getBorderStyle(type as ImageType) : 'whiteBorder'
  const [response, setResponse] = useState<Response>({
    type: null,
    correct: null,
    responseTime: null,
  })
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)

  function showCue() {
    setGameStage('cue')
    setCueTimestamp(Date.now())
  }

  useEffect(() => {
    setAccuracy(Math.round(numCorrect / currentTrialIndex * 10000) / 100)
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
    const responseTime = cueTimestamp ? Date.now() - cueTimestamp : null;

    const newResponse = {
      type: reactionType,
      correct: isResponseCorrect(reactionType, borderStyle),
      responseTime: responseTime,
    }
    setResponse(newResponse)
    if (isResponseCorrect(reactionType, borderStyle)) {
      setNumCorrect(prevNumCorrect => prevNumCorrect + 1);
      if (reactionType === 'commission') {
        setTotalTime(prevTotalTime => prevTotalTime + responseTime);
      }     
    }
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
        setResponse({ type: null, correct: null, responseTime: null })
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
          {image && <img src={src} alt="trial image" className="squeezed" />}
          {error && <div className="redCross">X</div>}
        </div>
      )}
    </>
  )
}
