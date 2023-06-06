import { PostgrestError } from '@supabase/supabase-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { images as imagesFromJson } from '../data/images.json'
import { supabase } from '../supabaseClient'
import { FoodRatingData, ImageData } from '../types/Task'

const images = imagesFromJson as ImageData[]
const HEALTHY_IMAGE_COUNT = 60
const UNHEALTHY_IMAGE_COUNT = 80

interface UserData {
  loading: boolean
  setLoading: (loading: boolean) => void
  foodRatings: FoodRatingData[] | []
  allFoodImages: ImageData[]
  unratedFoods: ImageData[] | []
  recordRating: (foodRating: FoodRatingData) => Promise<void>
  resetFoodRatings: (userId: string) => Promise<void>
  randomlyRateRemainingFoods: (
    setCurrentRating: (rating: string) => void,
    userId: string
  ) => Promise<void>
  userImages: ImageData[]
}

const UserDataContext = createContext<UserData>({
  loading: false,
  setLoading: () => {},
  foodRatings: [],
  allFoodImages: [],
  unratedFoods: [],
  recordRating: async () => {},
  resetFoodRatings: async (userId: string) => {},
  randomlyRateRemainingFoods: async (
    setCurrentRating: (rating: string) => void,
    userId: string
  ) => { },
  userImages: [],
})

export function UserDataProvider({ children }: { children: JSX.Element }) {
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
  const [unratedFoods, setUnratedFoods] = useState<ImageData[] | []>([])
  const [userImages, setUserImages] = useState<ImageData[] | []>([])

  const allImages = images
  const allFoodImages = allImages.filter((image) => image.type !== 'water')
  const allHealthyImages = allImages.filter((image) => image.type === 'healthy')
  const allUnhealthyImages = allImages.filter(
    (image) => image.type === 'unhealthy'
  )
  const allWaterImages = allImages.filter((image) => image.type === 'water')

  async function recordRating(foodRating: FoodRatingData) {
    const { data, error } = await supabase
      .from('food_ratings')
      .insert(foodRating)
    if (error) {
      console.error(error)
    } else {
      fetchFoodRatings().then((foodRatings) => {
        if (foodRatings) {
          setFoodRatings(foodRatings)
          localStorage.setItem('foodRatings', JSON.stringify(foodRatings))
        }
      })
    }
  }

  async function resetFoodRatings(userId: string) {
    setLoading(true)
    const { data, error } = await supabase
      .from('food_ratings')
      .delete()
      .eq('user_id', userId)
    setFoodRatings([])
    localStorage.removeItem('foodRatings')
    setLoading(false)
  }

  const randomlyRateRemainingFoods = useCallback(
    async (setCurrentRating: (rating: string) => void, userId: string) => {
      setLoading(true)
      const ratingPromises = (unratedFoods || []).map(async (food) => {
        const randomRating = Math.floor(Math.random() * 9) + 1
        setCurrentRating(`${randomRating}`)
        await recordRating({
          rating: randomRating,
          food_id: food.id,
          user_id: userId,
        })
        setCurrentRating('')
      })
      await Promise.all(ratingPromises)
      setLoading(false)
    },
    [unratedFoods]
  )

  async function fetchFoodRatings() {
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
  useEffect(() => {
    // on mount, get all food ratings for the user
    setLoading(true)
    fetchFoodRatings().then((foodRatings) => {
      if (foodRatings) {
        setFoodRatings(foodRatings)
        localStorage.setItem('foodRatings', JSON.stringify(foodRatings))
      }
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    // Get food_id for each of the user's food ratings
    const ratedFoodIds = foodRatings.map((foodRating) => foodRating.food_id)
    const updatedUnratedFoods = allFoodImages.filter(
      (food) => !ratedFoodIds.includes(food.id)
    )
    setUnratedFoods(updatedUnratedFoods)
  }, [foodRatings])

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
        foodRatings,
        allFoodImages,
        unratedFoods,
        recordRating,
        resetFoodRatings,
        randomlyRateRemainingFoods,
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
