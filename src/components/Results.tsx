import { useNavigate } from 'react-router-dom'

interface ResultsProps {
  accuracy: number
  averageResponse: number
}
export default function Results({ accuracy, averageResponse }: ResultsProps) {
  const navigate = useNavigate()
  return (
    <div className="box">
      <h1 className="title">Results</h1>
      <ul>
        <li> Average Response Time: {averageResponse} milliseconds </li>
        <li> Percent Correct: {accuracy}%</li>
        <br />
      </ul>
      <button
        onClick={() => navigate('/')}
        className="button is-info is-large"
        tabIndex={1}
      >
        Done
      </button>
    </div>
  )
}
