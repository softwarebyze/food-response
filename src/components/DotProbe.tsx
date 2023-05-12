import { useEffect, useState } from 'react'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import {
  DotProbeGameStage,
  DotProbeReaction,
  DotProbeResponse,
} from '../types/Task'
import Break from './Break'

const { times: timesFromJSON, blocks, trialsPerBlock } = tasks[2]
const totalTrials = trialsPerBlock! * blocks!
const slowdown = 1
const times = {
  interval: (timesFromJSON?.interval ?? 500) * slowdown,
  init: (timesFromJSON?.init ?? 500) * slowdown,
  break: timesFromJSON?.break ?? 10000,
} as const

const healthyImages = images.filter((image) => image.type === 'healthy')
const unhealthyImages = images.filter((image) => image.type === 'unhealthy')
const imagePairs = healthyImages.map((healthyImage, index) => ({
  left: healthyImage,
  right: unhealthyImages[index],
}))

export default function DotProbe({
  endGame,
  setAccuracy,
  setAverageResponse,
}: {
  endGame: () => void,
  setAccuracy: (value: number) => void,
  setAverageResponse: (value: number) => void
}) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const [gameStage, setGameStage] = useState<DotProbeGameStage>('interval')
  const [response, setResponse] = useState<DotProbeResponse>({
    reaction: null,
    responseTime: null,
  })
  const [numCorrect, setNumCorrect] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)
  const currentImagePair = imagePairs[currentTrialIndex]
  const healthySide =
    currentImagePair.left.type === 'healthy' ? 'left' : 'right'

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


  function goToNextTrialOrEndGame() {
    if (currentTrialIndex < imagePairs.length - 1) {
      setCurrentTrialIndex((prev) => prev + 1)
    } else {
      endGame()
    }
  }

  function handleReaction(reaction: DotProbeReaction) {
    const isCorrect = (healthySide === 'left' && reaction === 'left-commission') ||
      (healthySide === 'right' && reaction === 'right-commission');
    
    const responseTime = cueTimestamp ? Date.now() - cueTimestamp : null
    
    setResponse({
      reaction,
      responseTime: responseTime,
    });

    if (isCorrect) {
      setNumCorrect(prevNumCorrect => prevNumCorrect + 1);
      setTotalTime(prevTotalTime => responseTime ? prevTotalTime + responseTime : prevTotalTime)
    }
    goToNextTrialOrEndGame();
  }

  useEffect(() => {
    setGameStage('interval')
  }, [currentTrialIndex])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    switch (gameStage) {
      case 'interval':
        setResponse({ reaction: null, responseTime: null })
        timeout = setTimeout(() => setGameStage('init'), times.interval)
        break
      case 'init':
        timeout = setTimeout(showCue, times.init)
        break
      case 'cue':
        break
    }
    return () => clearTimeout(timeout)
  }, [gameStage])

  if (gameStage === 'break') return <Break />

  return (
    <>
      <div>DotProbe</div>
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
      <div className="columns is-mobile">
        {gameStage === 'interval' && (
          <div className="column">
            <div className="fixationCross">+</div>
          </div>
        )}
        {gameStage === 'init' && (
          <>
            <div className="column">
              <img src={currentImagePair.left.src} />
            </div>
            <div className="column">
              <img src={currentImagePair.right.src} />
            </div>
          </>
        )}
        {gameStage === 'cue' && (
          <>
            <div className="column">
              {healthySide === 'left' && (
                <div
                  className="probe"
                  onClick={() => handleReaction('left-commission')}
                  onTouchStart={() => handleReaction('left-commission')}
                >
                  <svg width="20" height="20">
                    <circle cx="10" cy="10" r="10"></circle>
                  </svg>
                </div>
              )}
            </div>
            <div className="column">
              {healthySide === 'right' && (
                <div
                  className="probe"
                  onClick={() => handleReaction('right-commission')}
                  onTouchStart={() => handleReaction('right-commission')}
                >
                  <svg width="20" height="20">
                    <circle cx="10" cy="10" r="10"></circle>
                  </svg>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}