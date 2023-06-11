import _ from 'lodash'
import { describe, expect, it } from 'vitest'
import { prepareTaskData, sampleImagesByType } from '../components/StopSignal'
import { images } from '../data/images.json'
import { tasks } from '../data/tasks.json'
import { ImageData, ImageType } from '../types/Task'
import { sampleUserImages } from './sampleUserImages'

describe('Stop Signal prepareTaskData', () => {
  const stopSignal = tasks[0]
  const testTaskData = prepareTaskData(sampleUserImages, stopSignal.blocks)
  it(`Gives enough task data for all trials`, () => {
    expect(testTaskData.length).toBe(
      stopSignal.blocks * stopSignal.trialsPerBlock
    )
  })
  it('Has 14 unique low-cal foods, 14 unique high-cal foods, and 4 glasses of water', () => {
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
    })
  })
  it('No back-to-back image src repeats', () => {
    const allTrialImagesBackToBack = testTaskData.filter(
      (trialImage, i) => i > 0 && trialImage.src === testTaskData[i - 1].src
    )
    expect(allTrialImagesBackToBack.length).toBe(0)
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

describe('sampleImagesByType', () => {
  const sampleImages = _.shuffle(images).slice(0, 100) as ImageData[]
  it('returns the correct number of images', () => {
    const testSamples = sampleImagesByType(sampleImages, 'healthy', 14)
    expect(testSamples.length).toBe(14)
  })
  const fewSampleImages = _.shuffle(images).slice(0, 10) as ImageData[]
  it('returns the correct number of images if the number requested is greater than the number available', () => {
    const testSamples = sampleImagesByType(fewSampleImages, 'unhealthy', 100)
    expect(testSamples.length).toBe(100)
  })
  it('returns images of the correct type', () => {
    const imageTypes: ImageType[] = ['healthy', 'unhealthy', 'water']
    imageTypes.forEach((type) => {
      const testSamples = sampleImagesByType(sampleUserImages, type, 4)
      expect(testSamples.every((image) => image.type === type)).toBe(true)
    })
  })
})
