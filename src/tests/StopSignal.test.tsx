import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import StopSignal, { isResponseCorrect } from '../components/StopSignal'

describe('StopSignal', () => {
  let imageElement: HTMLImageElement
  let imageContainerElement: HTMLElement
  beforeEach(() => {
    render(<StopSignal />)
    imageElement = screen.getByAltText(/trial image/i)
    imageContainerElement = screen.getByTitle(/image-container/i)
  })
  it('renders an image', () => {
    expect(imageElement).toBeDefined()
  })
  it('has white border initially', () => {
    const hasWhiteBorder =
      imageContainerElement.classList.contains('whiteBorder')
    expect(hasWhiteBorder).toBe(true)
  })
  it('has gray or blue border after 100ms', async () => {
    // wait 101ms
    setTimeout(() => {
      const hasGrayBorder =
        imageContainerElement.classList.contains('grayBorder')
      const hasBlueBorder =
        imageContainerElement.classList.contains('blueBorder')
      expect(hasBlueBorder || hasGrayBorder).toBe(true)
    }, 101)
  })
  it('changes images after appropriate spacebar click', async () => {
    const initialImageSrc = imageElement.src
    setTimeout(() => {
      fireEvent.keyDown(imageContainerElement, { key: ' ', keyCode: 32 })
      const finalImageSrc = imageElement.src
      expect(initialImageSrc).not.toEqual(finalImageSrc)
    }, 200)
  })
  it('proceeds if no spacebar click after 1150ms', async () => {
    const initialImageSrc = imageElement.src
    setTimeout(() => {
      const finalImageSrc = imageElement.src
      expect(initialImageSrc).not.toEqual(finalImageSrc)
    }, 1151)
  })
})

describe('is response correct', () => {
  it('is correct if blue border and commission', () => {
    expect(isResponseCorrect('commission', 'blueBorder')).toBe(true)
  })
  it('is correct if gray border and omission', () => {
    expect(isResponseCorrect('omission', 'grayBorder')).toBe(true)
  })
  it('is incorrect if blue border and omission', () => {
    expect(isResponseCorrect('omission', 'blueBorder')).toBe(false)
  })
  it('is incorrect if gray border and commission', () => {
    expect(isResponseCorrect('commission', 'grayBorder')).toBe(false)
  })
})
