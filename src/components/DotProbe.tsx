import { useEffect, useState } from 'react'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import { DotProbeReaction, DotProbeResponse } from '../types/Task'

type DotProbeGameState = 'interval' | 'images' | 'cue'
const { interval, images: imageDuration } = tasks[2].times!
const slowdown = 1
const times = {
  interval: interval * slowdown,
  images: imageDuration * slowdown,
}

const healthyImages = images.filter((image) => image.type === 'healthy')
const unhealthyImages = images.filter((image) => image.type === 'unhealthy')
const imagePairs = healthyImages.map((healthyImage, index) => ({
  left: healthyImage,
  right: unhealthyImages[index],
}))

export default function DotProbe({ endGame }: { endGame: () => void }) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const [gameStage, setGameStage] = useState<DotProbeGameState>('interval')
  const [response, setResponse] = useState<DotProbeResponse>({
    reaction: null,
    responseTime: null,
  })
  const [cueTimestamp, setCueTimestamp] = useState<number | null>(null)
  const currentImagePair = imagePairs[currentTrialIndex]
  const healthySide =
    currentImagePair.left.type === 'healthy' ? 'left' : 'right'

  function showCue() {
    setGameStage('cue')
    setCueTimestamp(Date.now())
  }

  function goToNextTrialOrEndGame() {
    if (currentTrialIndex < imagePairs.length - 1) {
      setCurrentTrialIndex((prev) => prev + 1)
    } else {
      endGame()
    }
  }

  function handleReaction(reaction: DotProbeReaction) {
    setResponse({
      reaction,
      responseTime: cueTimestamp ? Date.now() - cueTimestamp : null,
    })
    goToNextTrialOrEndGame()
  }

  useEffect(() => {
    setGameStage('interval')
  }, [currentTrialIndex])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    switch (gameStage) {
      case 'interval':
        setResponse({ reaction: null, responseTime: null })
        timeout = setTimeout(() => setGameStage('images'), times.interval)
        break
      case 'images':
        timeout = setTimeout(showCue, times.images)
        break
      case 'cue':
        break
    }
    return () => clearTimeout(timeout)
  }, [gameStage])

  return (
    <>
      <div>DotProbe</div>
      <>
        {'currentTrialIndex: ' + currentTrialIndex}
        <br />
        {'images.length: ' + images.length}
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
        {gameStage === 'images' && (
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
