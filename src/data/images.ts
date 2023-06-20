import { ImageData } from '../types/Task'
import { images as imagesFromJson } from './images.json'

const images = imagesFromJson as ImageData[]

export const allImages = images
export const allFoodImages = allImages.filter((image) => image.type !== 'water')
export const allHealthyImages = allImages.filter(
  (image) => image.type === 'healthy'
)
export const allUnhealthyImages = allImages.filter(
  (image) => image.type === 'unhealthy'
)
export const allWaterImages = allImages.filter(
  (image) => image.type === 'water'
)

export const allUnhealthyCategories = [
  ...new Set(allUnhealthyImages.map(({ foodType }) => foodType)),
]
