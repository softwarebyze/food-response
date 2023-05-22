import { describe, expect, it } from 'vitest'
import { getNextStageAfterResponse } from '../components/GoNoGo'

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
