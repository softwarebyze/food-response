import _ from 'lodash'
import { describe, expect, it } from 'vitest'
import { prepareTaskData } from '../components/VisualSearch'
import { tasks } from '../data/tasks.json'
import { ImageData, TaskInfo } from '../types/Task'
import { sampleUserImages } from './sampleUserImages'

describe('Visual Search prepareTaskData', () => {
  const visualSearch = tasks[3] as TaskInfo
  const testTaskData = prepareTaskData(
    sampleUserImages as ImageData[],
    visualSearch.blocks * visualSearch.trialsPerBlock,
    1,
    15
  )
  it(`Should give enough task data for all trials`, () => {
    expect(testTaskData.length).toBe(
      visualSearch.blocks * visualSearch.trialsPerBlock
    )
  })
  it('Each trial should have 1 unique healthy food and 15 unique unhealthy foods', () => {
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
})
