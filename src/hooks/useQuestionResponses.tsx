import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'

const fetchQuestionResponses = async () => {
  const { data: questionResponses, error } = await supabase
    .from('question_responses')
    .select('*')

  if (error) {
    throw error
  }

  return questionResponses
}

export function useQuestionResponses() {
  return useQuery({
    queryKey: ['questionResponses'],
    queryFn: fetchQuestionResponses,
  })
}