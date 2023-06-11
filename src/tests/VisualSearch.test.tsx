import _ from 'lodash'
import { describe, expect, it } from 'vitest'
import { prepareTaskData } from '../components/VisualSearch'
import { tasks } from '../data/tasks.json'
import { ImageData, TaskInfo } from '../types/Task'
import { sampleUserImages } from './sampleUserImages'

describe('Visual Search prepareTaskData', () => {
  const visualSearch = tasks[3] as TaskInfo
  const totalTrials = visualSearch.blocks * visualSearch.trialsPerBlock
  const testTaskData = prepareTaskData(
    sampleUserImages as ImageData[],
    totalTrials,
    1,
    15
  )
  it(`Gives enough task data for all trials`, () => {
    expect(testTaskData.length).toBe(totalTrials)
  })
  it('Each trial has 1 unique healthy food and 15 unique unhealthy foods', () => {
    testTaskData.forEach((trialImages) => {
      const healthyImages = trialImages.filter(
        (trial) => trial.type === 'healthy'
      )
      const unhealthyImages = trialImages.filter(
        (trial) => trial.type === 'unhealthy'
      )
      expect(healthyImages.length).toBe(1)
      expect(_.uniq(healthyImages).length).toBe(1)
      expect(unhealthyImages.length).toBe(15)
      expect(_.uniq(unhealthyImages).length).toBe(15)
    })
  })
  it('No back to back healthy image repeats', () => {
    const healthyImages = testTaskData.map((trialImages) =>
      trialImages.filter((trial) => trial.type === 'healthy')
    )
    const healthyImagesBackToBack = healthyImages.filter(
      (healthyImage, i) => healthyImage === healthyImages[i - 1] && i > 0
    )
    expect(healthyImagesBackToBack.length).toBe(0)
  })
  it(`Healthy foods: 23.7% are shown 2 times and 17.5% are shown 3 times
      Unhealthy foods: about 2.7% of the images are repeated between 26-45 times`, () => {
    console.log(`VISUAL SEARCH`)
    const totalTrials = testTaskData.length
    console.log(`total trials: ${totalTrials}`)
    const allTrialImages = _.flatten(testTaskData)

    const dataGroupedBySrc = _.groupBy(allTrialImages, 'src')
    const counts = _.mapValues(dataGroupedBySrc, (group) => group.length)

    const allTrialImagesWithCounts = allTrialImages.map((trial) => ({
      ...trial,
      count: counts[trial.src],
    }))
    const imageTypes = ['healthy', 'unhealthy'] as const

    imageTypes.forEach((imageType) => {
      const allTrialImagesOfTypeWithCounts = allTrialImagesWithCounts.filter(
        (trial) => trial.type === imageType
      )
      const uniqueCounts = _.uniq(
        allTrialImagesOfTypeWithCounts.map(({ count }) => count)
      )

      console.log(`${imageType} images:`)
      uniqueCounts.forEach((count) => {
        const trialsOfTypeWithCount = allTrialImagesOfTypeWithCounts.filter(
          (trial) => trial.count === count
        )
        const percentOfTypeThatIsShownCountTimes = (
          (trialsOfTypeWithCount.length /
            allTrialImagesOfTypeWithCounts.length) *
          100
        ).toFixed(1)

        console.log(
          ` - ${trialsOfTypeWithCount.length} (${percentOfTypeThatIsShownCountTimes}%) are shown ${count}x`
        )
      })
    })
  })
})
