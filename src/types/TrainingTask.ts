type TaskName = 'Stop Signal' | 'Go/No-Go' | 'Dot Probe' | 'Visual Search'

export type TrainingTask = {
  taskName: TaskName
  instructions: string
}
