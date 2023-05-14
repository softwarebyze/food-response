import { TaskInfo } from '../types/Task'

interface ResultsProps {
  task: TaskInfo
  endGame: () => void
  accuracy: number
  averageResponse: number
}
export default function Results({
  endGame,
  accuracy,
  averageResponse,
}: ResultsProps) {
  return (
    <>
      <div className="box">
        <h1 className="title">Results</h1>
        <ul>
          <li> Average Response Time: {averageResponse} milliseconds </li>
          <li> Percent Correct: {accuracy} %</li>
          <br />
        </ul>
        <button
          onClick={endGame}
          className="button is-info is-large"
          tabIndex={1}
        >
          Resend Data
        </button>
      </div>
    </>
  )
}
