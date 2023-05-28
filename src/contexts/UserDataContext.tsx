import { PostgrestError } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { FoodRatingData, ImageData } from '../types/Task'

interface UserData {
  loading: boolean
  setLoading: (loading: boolean) => void
  foodRatings: FoodRatingData[] | []
  allFoods: { [x: string]: any }[] | null
  unratedFoods: ImageData[] | null
  fetchFoodRatings: () => void
}

const UserDataContext = createContext<UserData>({
  loading: false,
  setLoading: () => {},
  foodRatings: [],
  allFoods: [],
  unratedFoods: [],
  fetchFoodRatings: () => {},
})

export function UserDataProvider({ children }: { children: JSX.Element }) {
  const [foodRatings, setFoodRatings] = useState<FoodRatingData[] | []>([])
  const [loading, setLoading] = useState(false)
  const [allFoods, setAllFoods] = useState<ImageData[] | null>(null)
  const [unratedFoods, setUnratedFoods] = useState<ImageData[] | []>([])

  // Get all foods
  useEffect(() => {
    async function fetchAllFoods() {
      setLoading(true)
      const {
        data,
        error,
      }: { data: ImageData[] | null; error: PostgrestError | null } =
        await supabase.from('foods').select()
      if (error) {
        console.error(error)
      } else setAllFoods(data)
      setLoading(false)
    }
    fetchAllFoods()
  }, [])

  // Get all food ratings for the user
  async function fetchFoodRatings() {
    setLoading(true)
    const {
      data,
      error,
    }: {
      data: FoodRatingData[] | null
      error: PostgrestError | null
    } = await supabase.from('food_ratings').select('*')
    if (error) {
      console.error(error)
    }

    setFoodRatings(data ?? [])
    setLoading(false)
  }
  useEffect(() => {
    fetchFoodRatings()
  }, [])

  // update unrated foods whenever foodRatings or allFoods changes
  useEffect(() => {
    if (!allFoods || !foodRatings) {
      return
    }
    const ratedFoodIds = foodRatings.map((foodRating) => foodRating.food_id)
    const updatedUnratedFoods = allFoods.filter(
      (food) => !ratedFoodIds.includes(food.id)
    )
    setUnratedFoods(updatedUnratedFoods)
  }, [allFoods, foodRatings])

  return (
    <UserDataContext.Provider
      value={{
        loading,
        setLoading,
        foodRatings,
        allFoods,
        unratedFoods,
        fetchFoodRatings,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export function useUserData() {
  return useContext(UserDataContext)
}
