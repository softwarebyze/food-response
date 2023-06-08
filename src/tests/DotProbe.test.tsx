import { describe, expect, it } from 'vitest'
import { prepareTaskData } from '../components/DotProbe'
import { tasks } from '../data/tasks.json'
import { sampleUserImages } from './sampleUserImages'

describe('DotProbe prepareTaskData', () => {
  const dotProbe = tasks[2]
  const totalTrials = dotProbe.trialsPerBlock * dotProbe.blocks
  it('Gives enough data', () => {
    const testTaskData = prepareTaskData(sampleUserImages, totalTrials)
    expect(testTaskData.length).toBe(totalTrials)
  })
})
