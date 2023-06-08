import _ from 'lodash'
import { describe, expect, it } from 'vitest'
import {
  getNextStageAfterResponse,
  prepareTaskData,
} from '../components/GoNoGo'
import { tasks } from '../data/tasks.json'
import { GoNoGoTrialType } from '../types/Task'
import { sampleUserImages } from './sampleUserImages'

describe('GoNoGo prepareTaskData', () => {
  const goNoGo = tasks[1]
  const totalTrials = goNoGo.blocks * goNoGo.trialsPerBlock
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
  it(`33% healthy foods: 39% are shown 2 times (remaining shown just once)
      33% unhealthy foods: 42% are shown 2 times  
      34% glasses of water: 38% are shown 2 times`, () => {
    console.log('GO NO GO')
    console.log(`total trials: ${totalTrials}`)

    const dataGroupedBySrc = _.groupBy(testTaskData, 'src')
    const counts = _.mapValues(dataGroupedBySrc, (group) => group.length)

    const testTaskDataWithCounts = testTaskData.map((trial) => ({
      ...trial,
      count: counts[trial.src],
    }))

    const imageTypes = ['healthy', 'unhealthy', 'water']
    imageTypes.forEach((imageType) => {
      const trialsOfTypeWithCounts = testTaskDataWithCounts.filter(
        (trial) => trial.imageType === imageType
      )
      const uniqueCounts = _.uniq(
        trialsOfTypeWithCounts.map(({ count }) => count)
      )
      const trialTypePercent =
        (trialsOfTypeWithCounts.length / totalTrials) * 100

      console.log(`- ${_.round(trialTypePercent, 3)}% ${imageType} trials:`)
      uniqueCounts.forEach((count) => {
        const trialsWithCount = trialsOfTypeWithCounts.filter(
          (trial) => trial.count === count
        )
        const percentWithCount = (trialsWithCount.length / totalTrials) * 100
        console.log(` - ${_.round(percentWithCount, 3)}% are shown ${count}x`)
      })
    })
    console.log('\ntrial types:')
    const trialTypes: GoNoGoTrialType[] = ['go', 'no-go']
    trialTypes.forEach((trialType) => {
      const trialsWithCounts = testTaskDataWithCounts.filter(
        (trial) => trial.trialType === trialType
      )
      const trialTypePercent = (
        (trialsWithCounts.length / totalTrials) *
        100
      ).toFixed(3)

      console.log(`- ${trialType} ${trialTypePercent}%`)
    })
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
