import { supabase } from '../supabaseClient'
import { Database } from '../types/supabase'

export async function recordTaskResponse(
  taskResponseData: Database['public']['Tables']['task_responses']['Insert']
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
