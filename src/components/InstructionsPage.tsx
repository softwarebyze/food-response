import { TrainingTask } from '../types/TrainingTask'

interface Props {
  trainingTask: TrainingTask
}
function InstructionsPage(props: Props) {
  const { taskName, instructions } = props.trainingTask
  return (
    <>
      <h1>{taskName}</h1>
      <p>{instructions}</p>
      <button>Start Game</button>
    </>
  )
}

export default InstructionsPage
