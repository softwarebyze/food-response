import { describe, expect, it } from 'vitest'
import {
  getNextStageAfterResponse,
  prepareTaskData,
} from '../components/GoNoGo'
import { tasks } from '../data/tasks.json'
import { sampleUserImages } from './sampleUserImages'

describe('GoNoGo prepareTaskData', () => {
  const goNoGo = tasks[1]
  const totalTrials = goNoGo.blocks * goNoGo.trialsPerBlock
  console.log({ totalTrials })
  const testTaskData = prepareTaskData(sampleUserImages, totalTrials)
  it(`Should give enough task data for all trials`, () => {
    expect(testTaskData.length).toBe(totalTrials)
  })
  it('Should not repeat any food images back to back', () => {
    const repeatedFoods = testTaskData.filter(
      (trial, i) =>
        i > 0 &&
        trial.imageType !== 'water' &&
        trial.src === testTaskData[i - 1].src
    )
    expect(repeatedFoods.length).toBe(0)
  })
})

describe('get next stage based on response and trial type', () => {
  it('is interval if response is correct', () => {
    expect(
      getNextStageAfterResponse(
        { reaction: 'left-commission', correct: true, responseTime: 100 },
        'go'
      )
    ).toBe('interval')
  })
  it('is interval if response is incorrect, trial type is go, and reaction is a commission', () => {
    expect(
      getNextStageAfterResponse(
        { reaction: 'left-commission', correct: false, responseTime: 100 },
        'go'
      )
    ).toBe('interval')
  })
  it('is error if response is incorrect, trial type is go, and reaction is an omission', () => {
    expect(
      getNextStageAfterResponse(
        { reaction: 'omission', correct: false, responseTime: 100 },
        'go'
      )
    ).toBe('error')
  })
  it('is error if response is incorrect, trial type is no-go, and reaction is an omission', () => {
    expect(
      getNextStageAfterResponse(
        { reaction: 'omission', correct: false, responseTime: 100 },
        'no-go'
      )
    ).toBe('error')
  })
})
