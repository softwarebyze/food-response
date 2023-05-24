import { ResponseWithTrialData } from '../types/Task'

export default function ResponsesTable({
  responses,
  loading,
}: {
  responses: any[]
  loading: boolean
}) {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>id</th>
            <th>userId</th>
            <th>trialIndex</th>
            <th>reaction</th>
            <th>taskStartedAt</th>
            <th>imageType</th>
            <th>correct</th>
            <th>gameSlug</th>
            <th>responseTime</th>
            <th>trialType</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response: ResponseWithTrialData) => (
            <tr key={response.id}>
              <td>{response.id}</td>
              <td>{response.userId}</td>
              <td>{response.trialIndex}</td>
              <td>{response.reaction}</td>
              <td>{response.taskStartedAt.toString()}</td>
              <td>{response.imageType}</td>
              <td>{response.correct?.toString()}</td>
              <td>{response.gameSlug}</td>
              <td>{response.responseTime ?? "null"}</td>
              <td>{response.trialType}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <progress className="progress  is-primary" max="100" />}
    </>
  )
}
