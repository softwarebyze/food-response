import { ResponseWithTrialData } from '../types/Task'

export function recordResponse(response: ResponseWithTrialData) {
  console.table(response)
}
