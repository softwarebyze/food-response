import _ from 'lodash'
import { describe, expect, it } from 'vitest'
import { prepareTaskData } from '../components/DotProbe'
import { tasks } from '../data/tasks.json'
import { sampleUserImages } from './sampleUserImages'

describe('DotProbe prepareTaskData', () => {
  const dotProbe = tasks[2]
  const totalTrials = dotProbe.trialsPerBlock * dotProbe.blocks
  const testTaskData = prepareTaskData(sampleUserImages, totalTrials)
  it('Gives enough data', () => {
    expect(testTaskData.length).toBe(totalTrials)
  })
  it('Each trial has a different left and right food', () => {
    expect(
      testTaskData.every(({ left, right }) => left.src !== right.src)
    ).toBe(true)
  })
  it(`Each trial has 1 high-calorie and 1 low-calorie food`, () => {
    testTaskData.every(({ left, right }) => {
      expect(
        _.difference(['healthy', 'unhealthy'], [left.type, right.type]).length
      ).toBe(0)
    })
  })

  it(`51% trials with healthy foods on the left and unhealthy on the right
      49% trials with healthy foods on the right and unhealthy on the left
      24.5% combinations are shown 2 times
      1% is shown 4 times
      8.5% are shown 3 times
      Remaining combinations just shown once`, () => {
    console.log(`DOT PROBE`)
    console.log(`total trials: ${totalTrials}`)
    const { length: healthyLeftUnhealthyRightTrials } = testTaskData.filter(
      ({ left, right }) => left.type === 'healthy' && right.type === 'unhealthy'
    )
    const healthyLeftUnhealthyRightTrialsPercent =
      (healthyLeftUnhealthyRightTrials / totalTrials) * 100
    console.log(
      `${healthyLeftUnhealthyRightTrialsPercent}% trials with healthy foods on the left and unhealthy on the right`
    )
    const { length: healthyRightUnhealthyLeftTrials } = testTaskData.filter(
      ({ right, left }) => right.type === 'healthy' && left.type === 'unhealthy'
    )
    const healthyRightUnhealthyLeftTrialsPercent =
      (healthyRightUnhealthyLeftTrials / totalTrials) * 100
    console.log(
      `${healthyRightUnhealthyLeftTrialsPercent}% trials with healthy foods on the right and unhealthy on the left`
    )
  })
})
