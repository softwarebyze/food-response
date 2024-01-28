import _ from 'lodash'
import { ImageData } from '../types/Task'
import { Tables } from '../types/supabase'
import { images as imagesFromJson } from './images.json'

const images = imagesFromJson as ImageData[]
const HEALTHY_IMAGE_COUNT = 60
export const UNHEALTHY_IMAGE_COUNT = 80

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

const sortImagesByRanking = (
  images: ImageData[],
  ratings: Tables<'food_ratings'>[]
) => {
  return images.sort((imageA, imageB) => {
    const imageARating =
      ratings.find((rating) => rating.food_id === imageA.id)?.rating ?? 0
    const imageBRating =
      ratings.find((rating) => rating.food_id === imageB.id)?.rating ?? 0
    return imageBRating - imageARating
  })
}

export const getUserImagesFromFoodRatings = (
  foodRatings: Tables<'food_ratings'>[]
) => {
  const healthyImagesSortedByRating = sortImagesByRanking(
    allHealthyImages,
    foodRatings
  )
  const unhealthyImagesSortedByRating = sortImagesByRanking(
    allUnhealthyImages,
    foodRatings
  )

  const userHealthyImages = healthyImagesSortedByRating.slice(
    0,
    HEALTHY_IMAGE_COUNT
  )
  const userUnhealthyImages = unhealthyImagesSortedByRating.slice(
    0,
    UNHEALTHY_IMAGE_COUNT
  )

  const allUserImages = [
    ...userHealthyImages,
    ...userUnhealthyImages,
    ...allWaterImages,
  ]

  return allUserImages
}

export const primingCategories = {
  positive: 0,
  negative: 1,
} as const

type ModuleWithDefaultExport = { default: string }
const positiveImages = import.meta.glob('/src/priming-images/positive/*', {
  eager: true,
}) as Record<string, ModuleWithDefaultExport>

const negativeImages = import.meta.glob('/src/priming-images/negative/*', {
  eager: true,
}) as Record<string, ModuleWithDefaultExport>

export const positivePrimingImageSrcs = Object.values(positiveImages).map(
  (module) => module.default
)
export const negativePrimingImageSrcs = Object.values(negativeImages).map(
  (module) => module.default
)

export function getPrimingImageSrc(type: 'positive' | 'negative'): string {
  const imageList =
    type === 'positive' ? positivePrimingImageSrcs : negativePrimingImageSrcs
  return _.sample(imageList)!
}
