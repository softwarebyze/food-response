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
  const [gameStage, setGameStage] = useState<GameStage>('init')
  return (
    <div>
      <div className="columns is-mobile">
        {gameStage === 'interval' && (
          <div className="column">
            <div className="fixationCross">+</div>
          </div>
        )}
        <>
          <div className="column">
            <img src={trialImages[0]!.src} />
            <img src={trialImages[1]!.src} />
            <img src={trialImages[2]!.src} />
            <img src={trialImages[3]!.src} />
          </div>
          <div className="column">
            <img src={trialImages[4]!.src} />
            <img src={trialImages[5]!.src} />
            <img src={trialImages[6]!.src} />
            <img src={trialImages[7]!.src} />
          </div>
          <div className="column">
            <img src={trialImages[8]!.src} />
            <img src={trialImages[9]!.src} />
            <img src={trialImages[10]!.src} />
            <img src={trialImages[11]!.src} />
          </div>
          <div className="column">
            <img src={trialImages[12]!.src} />
            <img src={trialImages[13]!.src} />
            <img src={trialImages[14]!.src} />
            <img src={trialImages[15]!.src} />
          </div>
        </>
      </div>
    </div>
  )
}
