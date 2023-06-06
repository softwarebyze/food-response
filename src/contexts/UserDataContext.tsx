import { PostgrestError } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { images as imagesFromJson } from '../data/images.json'
import { supabase } from '../supabaseClient'
import { FoodRatingData, ImageData } from '../types/Task'

const images = imagesFromJson as ImageData[]
const HEALTHY_IMAGE_COUNT = 60
const UNHEALTHY_IMAGE_COUNT = 80

interface UserData {
  loading: boolean
  setLoading: (loading: boolean) => void
  allFoodImages: ImageData[]
  userImages: ImageData[]
}

const UserDataContext = createContext<UserData>({
  loading: false,
  setLoading: () => {},
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

export function UserDataProvider({ children }: { children: JSX.Element }) {
  const queryClient = useQueryClient()
  const localFoodRatingsRaw = localStorage.getItem('foodRatings')
  const localFoodRatings = useMemo(
    () => (localFoodRatingsRaw ? JSON.parse(localFoodRatingsRaw) : null),
    [localFoodRatingsRaw]
  )
  const initialFoodRatings = localFoodRatings ?? []
  const [foodRatings, setFoodRatings] = useState<FoodRatingData[] | []>(
    initialFoodRatings
  )
  const [loading, setLoading] = useState(false)
  const [userImages, setUserImages] = useState<ImageData[] | []>([])

  const allImages = images
  const allFoodImages = allImages.filter((image) => image.type !== 'water')
  const allHealthyImages = allImages.filter((image) => image.type === 'healthy')
  const allUnhealthyImages = allImages.filter(
    (image) => image.type === 'unhealthy'
  )
  const allWaterImages = allImages.filter((image) => image.type === 'water')



  useEffect(() => {
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
    setUserImages(allUserImages)
  }, [foodRatings])

  return (
    <UserDataContext.Provider
      value={{
        loading,
        setLoading,
        allFoodImages,
        userImages,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export function useUserData() {
  return useContext(UserDataContext)
}
