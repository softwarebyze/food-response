import { useState } from 'react'
import { TaskInfo } from '../types/Task'
import GoNoGo from './GoNoGo'
import StartScreen from './StartScreen'
import StopSignal from './StopSignal'
import DotProbe from './DotProbe'

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
          <div className="gameWrapper">
            {task.name === 'Stop Signal' && <StopSignal endGame={endGame} />}
            {task.name === 'Go/No-Go' && <GoNoGo endGame={endGame} />}
            {task.name === 'Dot Probe' && <DotProbe />}
          </div>
        )}
        {pageState === 'results' && <div>Results</div>}
      </div>
    </section>
  )
}
