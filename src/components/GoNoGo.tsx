import {
  GoNoGoBorderStyle,
  GoNoGoCue,
  GoNoGoGameStage,
  GoNoGoReaction,
  GoNoGoResponse,
  ImageType,
} from '../types/Task'

function getGoNoGoBorderStyle(imageType: ImageType): GoNoGoBorderStyle {
  switch (imageType) {
    case 'unhealthy':
      return 'dashedBorder'
    case 'healthy':
      return 'solidBorder'
    case 'water':
      return Math.random() < 0.5 ? 'solidBorder' : 'dashedBorder'
  }
}

function isGoNoGoResponseCorrect(
  reactionType: GoNoGoReaction,
  cue: GoNoGoCue
): boolean {
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

import { useState } from 'react'
import { tasks } from '../data/tasks.json'
const stages = tasks[1].stages

export default function GoNoGo({ endGame }: { endGame: () => void }) {
  const src =
    'https://projecthealthori.org/file/repo/8fafc912bec1c78aaa451e519c9134c2.png'
  const cue: GoNoGoCue = { side: getRandomSide(), imageType: 'unhealthy' }
  const { imageType: type, side } = cue
  const [gameStage, setGameStage] = useState<GoNoGoGameStage>('cue')
  const [response, setResponse] = useState<GoNoGoResponse>({
    type: null,
    correct: null,
  })

  const { image, border, error, interval } = stages[gameStage]
  const borderStyle = border
    ? getGoNoGoBorderStyle(type as ImageType)
    : 'whiteBorder'

  function next() {
    switch (gameStage) {
      case 'cue':
        setGameStage('interval')
        break
      case 'interval':
        setGameStage('error')
        break
      case 'error':
        setGameStage('cue')
        break
    }
  }

  return (
    <>
      {/* {'currentTrialIndex: ' + currentTrialIndex} */}
      <br />
      {/* {'taskData.length: ' + taskData.length} */}
      <br />
      {/* {'slowdown: ' + slowdown + 'x'} */}
      <br />
      {'gameStage: ' + gameStage}
      <br />
      {'response: ' + JSON.stringify(response)}
      <br />
      <button onClick={next}>Next Stage</button>
      {interval ? (
        <></>
      ) : (
        <div className={`imageBox ${borderStyle} sized`}>
          {image && (
            <div className="columns is-mobile">
              <div className="column">
                {side === 'left' && <img src={src} />}
              </div>
              <div className="column">
                {side === 'right' && <img src={src} />}
              </div>
            </div>
          )}
          {<div className="redCross">X</div>}
        </div>
      )}
    </>
  )
}
