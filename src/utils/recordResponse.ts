import { supabase } from '../supabaseClient'
import { ResponseWithTrialData } from '../types/Task'

export async function recordResponse(response: ResponseWithTrialData) {
  const { data, error } = await supabase.from('responses').insert(response)
}
