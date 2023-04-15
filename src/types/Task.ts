export type ImageType = 'unhealthy' | 'healthy' | 'water'

export type GameStage = 'init' | 'cue' | 'interval' | 'error'

export interface GameState {
  image: boolean
  border: boolean
  error: boolean
  interval: boolean
}

type TaskName = 'Stop Signal' | 'Go/No-Go' | 'Dot Probe' | 'Visual Search'

export type TaskInfo = {
  name: TaskName
  instructions: string
  path: string
  cover: string
  stages: {
    [key in GameStage]: GameState
  }
}

export interface StopSignalTrialData {
  src: string
  type: ImageType
}

export type TrialData = StopSignalTrialData
export type TaskData = TrialData[]

export type ReactionType = 'omission' | 'commission'

export interface Response {
  correct: boolean | null
  type: ReactionType | null
}
