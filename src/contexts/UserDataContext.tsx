import { PostgrestError } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { images as imagesFromJson } from '../data/images.json'
import { supabase } from '../supabaseClient'
import { FoodRatingData, ImageData } from '../types/Task'

const images = imagesFromJson as ImageData[]
const HEALTHY_IMAGE_COUNT = 60
const UNHEALTHY_IMAGE_COUNT = 80

interface UserData {
  allFoodImages: ImageData[]
  userImages: ImageData[]
}

const UserDataContext = createContext<UserData>({
  allFoodImages: [],
  userImages: [],
})

export async function fetchFoodRatings() {
  // Get all food ratings for the user
  const {
    data: foodRatings,
    error,
  }: {
    data: FoodRatingData[] | null
    error: PostgrestError | null
  } = await supabase.from('food_ratings').select('*')
  if (foodRatings) {
    return foodRatings
  }
  if (error) {
    console.error(error)
  }
}

export async function fetchFoodCategoryRatings() {
  const { data: foodCategoryRatings, error } = await supabase
    .from('food_category_ratings')
    .select('*')
  return foodCategoryRatings
}

export function UserDataProvider({ children }: { children: JSX.Element }) {
  const allImages = images
  const allFoodImages = allImages.filter((image) => image.type !== 'water')
  const allHealthyImages = allImages.filter((image) => image.type === 'healthy')
  const allUnhealthyImages = allImages.filter(
    (image) => image.type === 'unhealthy'
  )
  const allWaterImages = allImages.filter((image) => image.type === 'water')

  const {
    data: foodRatings,
    isLoading,
    isError,
    isFetching,
  } = useQuery({ queryKey: ['foodRatings'], queryFn: fetchFoodRatings })

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

  return (
    <UserDataContext.Provider
      value={{
        allFoodImages,
        userImages: allUserImages,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export function useUserData() {
  return useContext(UserDataContext)
}
