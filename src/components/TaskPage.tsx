import { TrainingTask } from '../types/TrainingTask'

export default function TaskPage({ task }: { task: TrainingTask }) {
  return (
    <>
      <div>{task.name}</div>
      <p>{task.instructions}</p>
      <button>Start Game</button>
    </>
  )
}
