type TaskName = 'Stop Signal' | 'Go/No-Go' | 'Dot Probe' | 'Visual Search'

export type TrainingTask = {
  name: TaskName
  instructions: string
  path: string
}
