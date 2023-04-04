import { TrainingTask } from '../types/TrainingTask'
import InstructionsPage from './InstructionsPage'

const stopSignalTask: TrainingTask = {
  taskName: 'Stop Signal',
  instructions: `You will see pictures on either the left or right side of the screen, 
  surrounded by a solid or dashed border. If you see a solid border around the picture,
  touch the picture. Be sure to touch the side of the screen that you see the picture
  and stay within the border. Do not touch the screen if you see a dashed border. Go
  as fast as you can but remember accuracy is more important than speed!`,
}

function StopSignal() {
  return (
    <>
      <div>Stop Signal</div>
      <InstructionsPage trainingTask={stopSignalTask} />
    </>
  )
}

export default StopSignal
