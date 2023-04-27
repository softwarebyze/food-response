import { useState } from 'react'
import { images } from '../data/images.json'
import { GameStage } from '../types/Task'
interface Image {
  src: string
  type: string
}

const rawImages: Image[] = images
const unhealthyImages = rawImages.filter((image) => image.type === 'unhealthy')
const healthyImage = rawImages.find((image) => image.type === 'healthy')
const trialImages = [...unhealthyImages, healthyImage].sort(
  () => Math.random() - 0.5
)

export default function VisualSearch({ endGame }: { endGame: () => void }) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0)
  const [gameStage, setGameStage] = useState<GameStage>('error')
  return (
    <div>
      <div className="columns is-mobile">
        {gameStage === 'interval' && (
          <div className="column">
            <div className="fixationCross">+</div>
          </div>
        )}
        {gameStage === 'cue' ||
          (gameStage === 'error' && (
            <>
              <div className="column">
                <img
                  src={trialImages[0]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[0]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[1]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[1]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[2]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[2]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[3]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[3]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
              </div>
              <div className="column">
                <img
                  src={trialImages[4]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[4]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[5]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[5]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[6]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[6]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[7]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[7]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
              </div>
              <div className="column">
                <img
                  src={trialImages[8]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[8]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[9]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[9]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[10]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[10]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[11]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[11]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
              </div>
              <div className="column">
                <img
                  src={trialImages[12]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[12]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[13]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[13]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[14]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[14]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
                <img
                  src={trialImages[15]!.src}
                  className={`vsImg ${
                    gameStage === 'error' &&
                    trialImages[15]?.type === 'unhealthy'
                      ? 'red-shrink'
                      : ''
                  }`}
                />
              </div>
            </>
          ))}
      </div>
    </div>
  )
}
