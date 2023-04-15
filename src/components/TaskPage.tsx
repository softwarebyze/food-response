import { useState } from 'react'
import { GameProvider } from '../contexts/GameContext'
import { TaskInfo } from '../types/Task'
import StartScreen from './StartScreen'
import StopSignal from './StopSignal'

type PageState = 'start' | 'game' | 'results'

export default function TaskPage({ task }: { task: TaskInfo }) {
  const [pageState, setPageState] = useState<PageState>('start')
  const startGame = () => setPageState('game')
  const endGame = () => setPageState('results')
  return (
    <section className="section" id="gameSection">
      <div className="container" id="gameContainer">
        {pageState === 'start' && (
          <StartScreen task={task} startGame={startGame} />
        )}
        {pageState === 'game' && (
          <GameProvider>
            {task.name === 'Stop Signal' && <StopSignal endGame={endGame} />}
          </GameProvider>
        )}
        {pageState === 'results' && <div>Results</div>}
      </div>
    </section>
  )
}
