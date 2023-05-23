export type ImageType = 'unhealthy' | 'healthy' | 'water'
export type ImageData = {
  src: string
  foodType: string
  type: ImageType
}

export type GameStage =
  | StopSignalGameStage
  | GoNoGoGameStage
  | DotProbeGameStage
  | VisualSearchGameStage
export interface GameState {
  image: boolean
  border: boolean
  error: boolean
  interval: boolean
}

type TaskName = 'Stop Signal' | 'Go/No-Go' | 'Dot Probe' | 'Visual Search'
export type TaskInfo = {
  name: TaskName
  path: string
  instructions: string
  cover: string
  stages?: {
    [key in GameStage]: GameState
  }
  times: {
    [key in GameStage]: number
  }
  blocks: number
  trialsPerBlock: number
}

export type StopSignalReaction = 'commission' | 'omission'
export interface StopSignalResponse {
  reaction: StopSignalReaction | null
  correct: boolean | null
  responseTime: number | null
}
export type StopSignalBorderStyle = 'grayBorder' | 'blueBorder'
export type StopSignalTrialType = 'go' | 'stop'
export type StopSignalGameStage =
  | 'init'
  | 'cue'
  | 'interval'
  | 'error'
  | 'break'
export interface StopSignalTrialData {
  src: string
  imageType: ImageType
  border: StopSignalBorderStyle
  trialType: StopSignalTrialType
}

export type Reaction =
  | StopSignalReaction
  | GoNoGoReaction
  | DotProbeReaction
  | VisualSearchReaction

export interface Response {
  correct: boolean | null
  reaction: Reaction | null
  responseTime: number | null
}
type TrialType =
  | StopSignalTrialType
  | GoNoGoTrialType
  | DotProbeTrialType
  | VisualSearchTrialType
export interface ResponseWithTrialData extends Response {
  userId: string
  taskStartedAt: Date
  trialIndex: number
  imageType: ImageType
  src: string
  trialType: TrialType
  gameSlug: string
}

export type GoNoGoReaction = 'left-commission' | 'right-commission' | 'omission'
export interface GoNoGoResponse {
  reaction: GoNoGoReaction | null
  correct: boolean | null
  responseTime: number | null
}
export type GoNoGoBorderStyle = 'solidBorder' | 'dashedBorder'
export type GoNoGoTrialType = 'go' | 'no-go'
export interface GoNoGoTrialData {
  src: string
  imageType: ImageType
  border: GoNoGoBorderStyle
  side: 'left' | 'right'
  trialType: GoNoGoTrialType
}
export type GoNoGoGameStage = 'cue' | 'interval' | 'error' | 'break'
type GoNoGoTimes = {
  [key in GoNoGoGameStage]: number
}
export interface GoNoGoTaskInfo {
  name: TaskName
  path: string
  instructions: string
  cover: string
  stages: {
    [key in GoNoGoGameStage]: GameState
  }
  times: GoNoGoTimes
  blocks: number
  trialsPerBlock: number
}

export type DotProbeReaction = 'left-commission' | 'right-commission'
export interface DotProbeResponse {
  reaction: DotProbeReaction | null
  responseTime: number | null
}
export type DotProbeGameStage = 'interval' | 'init' | 'cue' | 'break'
export type DotProbeTrialType = 'left' | 'right'

export type VisualSearchGameStage = 'cue' | 'feedback' | 'interval' | 'break'
export type VisualSearchReaction = 'commission' | 'omission'
export interface VisualSearchResponse {
  reaction: VisualSearchReaction | null
  responseTime: number | null
  correct: boolean | null
  selectedSrc: string | null
}
type VisualSearchTrialType =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
