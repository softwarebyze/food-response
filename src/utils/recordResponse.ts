import { supabase } from '../supabaseClient'
import { TaskResponse } from '../types/Task'

export async function recordTaskResponse(
  taskResponseData: Partial<TaskResponse>
) {
  const { data, error } = await supabase
    .from('task_responses')
    .insert(taskResponseData)

  if (error) {
    console.error('Error inserting task response:', error)
  } else {
    console.log('Task response inserted successfully:', data)
  }
}
