import { PostgrestError } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { supabase } from '../supabaseClient'
import { FoodRatingData, ImageData } from '../types/Task'
import * as imagesHelpers from './../data/images.ts'

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


export function UserDataProvider({ children }: { children: JSX.Element }) {
  const {
    allFoodImages,
    allHealthyImages,
    allUnhealthyImages,
    allWaterImages,
  } = imagesHelpers

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
