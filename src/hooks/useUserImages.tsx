import {
  allHealthyImages,
  allUnhealthyImages,
  allWaterImages,
} from '../data/images'
import { FoodRatingData, ImageData } from '../types/Task'
import { useFoodRatings } from './useFoodRatings'

const HEALTHY_IMAGE_COUNT = 60
const UNHEALTHY_IMAGE_COUNT = 80

const sortImagesByRanking = (
  images: ImageData[],
  ratings: FoodRatingData[]
) => {
  return images.sort((imageA, imageB) => {
    const imageARating =
      ratings.find((rating) => rating.food_id === imageA.id)?.rating ?? 0
    const imageBRating =
      ratings.find((rating) => rating.food_id === imageB.id)?.rating ?? 0
    return imageARating - imageBRating
  })
}

export function useUserImages() {
  const { data: foodRatings, isLoading, isError, isFetching } = useFoodRatings()

  const healthyImagesSortedByRating = foodRatings
    ? sortImagesByRanking(allHealthyImages, foodRatings)
    : []
  const unhealthyImagesSortedByRating = foodRatings
    ? sortImagesByRanking(allUnhealthyImages, foodRatings)
    : []

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
  return {
    userImages: allUserImages,
  }
}
