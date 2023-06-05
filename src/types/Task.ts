export type ImageType = 'unhealthy' | 'healthy' | 'water'
export type ImageData = {
  src: string
  foodType: string
  type: ImageType
  id: number
}

export type FoodRatingData = {
  id?: number,
  food_id: number,
  user_id: string,
  rating: number,
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
    [key: string]: GameState
  }
  times: {
    interval: number
    cue: number
    feedback: number
    break: number
    init?: number
    error?: number
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
export interface TaskResponse {
  id: number;
  user_id: string | null;
  gsession_created_at: Date | null;
  game_slug: string | null;
  assessment: string | null;
  phase: number | null;
  sort: number | null;
  picture_delta: number | null;
  picture_dur: number | null;
  border_delta: number | null;
  jitter_dur: number | null;
  correct_resp_delta: number | null;
  commission_resp_delta: number | null;
  has_selection: 0 | 1 | null;
  is_valid: boolean | null;
  is_omission: boolean | null;
  is_commission: boolean | null;
  target_index: number | null;
  picture_offset: string | null;
  picture_list: string | null;
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
