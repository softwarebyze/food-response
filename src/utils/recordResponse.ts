import { supabase } from '../supabaseClient'
import { ResponseWithTrialData } from '../types/Task'

export async function recordResponse(response: ResponseWithTrialData) {
  console.table(response)

  const { data, error } = await supabase
    .from('responses')
    .insert(response)
  console.log({data, error})
}
