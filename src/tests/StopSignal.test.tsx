import _ from 'lodash'
import { describe, expect, it } from 'vitest'
import { prepareTaskData } from '../components/StopSignal'
import { tasks } from '../data/tasks.json'
import { ImageData, TaskInfo } from '../types/Task'
import { sampleUserImages } from './sampleUserImages'

describe('Stop Signal prepareTaskData', () => {
  const stopSignal = tasks[0] as TaskInfo
  const testTaskData = prepareTaskData(
    sampleUserImages as ImageData[],
    stopSignal.blocks
  )
  it(`Should give enough task data for all trials`, () => {
    expect(testTaskData.length).toBe(
      stopSignal.blocks * stopSignal.trialsPerBlock
    )
  })
  it('Each block should have 14 unique low-cal foods, 14 unique high-cal foods, and 4 glasses of water', () => {
    const testTaskDataBlocks = _.chunk(testTaskData, stopSignal.trialsPerBlock)
    testTaskDataBlocks.forEach((testTaskData) => {
      const healthyImages = testTaskData.filter(
        (trial) => trial.imageType === 'healthy'
      )
      const unhealthyImages = testTaskData.filter(
        (trial) => trial.imageType === 'unhealthy'
      )
      const waterImages = testTaskData.filter(
        (trial) => trial.imageType === 'water'
      )
      expect(healthyImages.length).toBe(14)
      expect(_.uniq(healthyImages).length).toBe(14)
      expect(unhealthyImages.length).toBe(14)
      expect(_.uniq(unhealthyImages).length).toBe(14)
      expect(waterImages.length).toBe(4)
      expect(_.uniq(waterImages).length).toBe(4)
    })
  })
  it(`51.4% healthy foods: 40.5% are shown 2 times
      48.5% unhealthy foods: 38% are shown 2 times`, () => {
    console.log(`STOP SIGNAL`)
    const totalTrials = testTaskData.length
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

      console.log(`- ${trialTypePercent}% ${imageType} trials:`)
      uniqueCounts.forEach((count) => {
        const trialsWithCount = trialsOfTypeWithCounts.filter(
          (trial) => trial.count === count
        )
        const percentWithCount = (trialsWithCount.length / totalTrials) * 100
        console.log(` - ${percentWithCount}% are shown ${count}x`)
      })
    })
    console.log('\ntrial types:')
    const trialTypes = ['go', 'stop']
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
