import { Tables } from '../types/supabase'

export default function ResponsesTable({
  responses,
  loading,
}: {
  responses: Tables<'task_responses'>[]
  loading: boolean
}) {
  return (
    <div className="overflow-x-scroll">
      <table className="table">
        <thead>
          <tr>
            <th>id</th>
            <th>user_id</th>
            <th>gsession_created_at</th>
            <th>game_slug</th>
            <th>assessment</th>
            <th>phase</th>
            <th>sort</th>
            <th>picture_delta</th>
            <th>picture_dur</th>
            <th>border_delta</th>
            <th>jitter_dur</th>
            <th>correct_resp_delta</th>
            <th>commission_resp_delta</th>
            <th>has_selection</th>
            <th>is_valid</th>
            <th>is_omission</th>
            <th>is_commission</th>
            <th>target_index</th>
            <th>picture_offset</th>
            <th>picture_list</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <tr key={response.id}>
              <td>{response.id}</td>
              <td>{response.user_id}</td>
              <td>{response.gsession_created_at?.toString()}</td>
              <td>{response.game_slug}</td>
              <td>{response.assessment}</td>
              <td>{response.phase}</td>
              <td>{response.sort}</td>
              <td>{response.picture_delta}</td>
              <td>{response.picture_dur}</td>
              <td>{response.border_delta}</td>
              <td>{response.jitter_dur}</td>
              <td>{response.correct_resp_delta}</td>
              <td>{response.commission_resp_delta}</td>
              <td>{response.has_selection}</td>
              <td>{response.is_valid}</td>
              <td>{response.is_omission}</td>
              <td>{response.is_commission}</td>
              <td>{response.target_index}</td>
              <td>{response.picture_offset}</td>
              <td>{response.picture_list}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <progress className="progress is-primary" max="100" />}
    </div>
  )
}
