import { supabase } from '../supabaseClient'
import { Tables } from '../types/Task'

export async function recordTaskResponse(
  taskResponseData: Tables<'task_responses'>['Insert']
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
