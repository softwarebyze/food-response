import { useState } from 'react'
import { TaskInfo } from '../types/Task'
import GoNoGo from './GoNoGo'
import StartScreen from './StartScreen'
import StopSignal from './StopSignal'
import DotProbe from './DotProbe'
import VisualSearch from './VisualSearch'
import Results from './Results'

type PageState = 'start' | 'game' | 'results'

export default function TaskPage({ task }: { task: TaskInfo }) {
  const [pageState, setPageState] = useState<PageState>('start')
  const startGame = () => setPageState('game')
  const endGame = () => setPageState('results')
  const [accuracy, setAccuracy] = useState<number>(0);
  const [averageResponse, setAverageResponse] = useState<number>(0);
  return (
    <section className="section" id="gameSection">
      <div className="container" id="gameContainer">
        {pageState === 'start' && (
          <StartScreen task={task} startGame={startGame} />
        )}
        {pageState === 'game' && (
          <div className="gameWrapper">
            {task.name === 'Stop Signal' && <StopSignal endGame={endGame} setAccuracy={setAccuracy} setAverageResponse={setAverageResponse}/>}
            {task.name === 'Go/No-Go' && <GoNoGo endGame={endGame} setAccuracy={setAccuracy} setAverageResponse={setAverageResponse}/>}
            {task.name === 'Dot Probe' && <DotProbe endGame={endGame} setAccuracy={setAccuracy} setAverageResponse={setAverageResponse}/>}
            {task.name === 'Visual Search' && <VisualSearch endGame={endGame} setAccuracy={setAccuracy} setAverageResponse={setAverageResponse}/>}
          </div>
        )}
        {pageState === 'results' && (
        <Results accuracy={accuracy} averageResponse={averageResponse}/>
        )}
        </div>
    </section>
  )
}
