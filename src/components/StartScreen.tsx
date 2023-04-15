import { TaskInfo } from '../types/Task'

interface StartScreenProps {
  task: TaskInfo
  startGame: () => void
}
export default function StartScreen({ task, startGame }: StartScreenProps) {
  return (
    <>
      <h1 className="title is-1">{task.name}</h1>
      <div>
        <div className="box">
          <p>{task.instructions}</p>
        </div>
        <a onClick={startGame} className="button is-info is-large">
          Start Game
        </a>
      </div>
    </>
  )
}
