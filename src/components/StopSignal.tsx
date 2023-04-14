import { tasks } from '../data/tasks.json'
import { TrainingTask } from '../types/TrainingTask'
import InstructionsPage from './InstructionsPage'

function StopSignal() {
  const stopSignalTask = tasks[0] as TrainingTask

  return (
    <>
      <div>Stop Signal</div>
      <InstructionsPage trainingTask={stopSignalTask} />
    </>
  )
}

export default StopSignal
