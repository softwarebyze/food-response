import { supabase } from '../supabaseClient'
import { TablesInsert } from '../types/supabase'

export async function recordTaskResponse(
  taskResponseData: TablesInsert<'task_responses'>
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

export async function recordQuestionResponse(
  questionResponseData: TablesInsert<'question_responses'>
) {
  const { data, error } = await supabase
    .from('question_responses')
    .insert(questionResponseData)

  if (error) {
    console.error('Error inserting question response:', error)
  } else {
    console.log('Question response inserted successfully:', data)
  }
}
