import { TrainingTask } from '../types/TrainingTask'

interface Props {
  trainingTask: TrainingTask
}
function InstructionsPage(props: Props) {
  const { name, instructions } = props.trainingTask
  return (
    <>
      <h1>{name}</h1>
      <p>{instructions}</p>
      <button>Start Game</button>
    </>
  )
}

export default InstructionsPage
