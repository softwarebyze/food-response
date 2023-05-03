import { useCallback, useEffect, useState } from 'react'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import {
  GameStage,
  ImageType,
  ReactionType,
  Response,
  TaskData,
} from '../types/Task'
import Break from './Break'

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

function prepareTaskData(images: TaskData, totalTrials: number) {
  return [...Array(totalTrials).fill(null)].map(
    () => images[Math.floor(Math.random() * images.length)]
  )
}

const { stages, times: timesFromJSON, blocks, trialsPerBlock } = tasks[0]
const totalTrials = trialsPerBlock! * blocks!
const slowdown = 1
const times = {
  init: (timesFromJSON?.init ?? 100) * slowdown,
  cue: (timesFromJSON?.cue ?? 1150) * slowdown,
  interval: (timesFromJSON?.interval ?? 500) * slowdown,
  error: (timesFromJSON?.error ?? 500) * slowdown,
  break: timesFromJSON?.break ?? 10000,
} as const

const taskData = prepareTaskData(images as TaskData, totalTrials)

export default function StopSignal({ endGame }: { endGame: () => void }) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const [gameStage, setGameStage] = useState<GameStage>('init')

  const { image, border, error, interval } = stages![gameStage]!
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

  function showInterval() {
    setGameStage('interval')
  }

  function showError() {
    setGameStage('error')
  }

  function showInit() {
    setGameStage('init')
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
      responseTime: cueTimestamp ? Date.now() - cueTimestamp : null,
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
        timeout = setTimeout(goToNextTrialOrBreakOrEndGame, times.interval)
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
      <>
        {'currentTrialIndex: ' + currentTrialIndex}
        <br />
        {'totalTrials: ' + totalTrials}
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
