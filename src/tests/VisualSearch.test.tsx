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
})
