import { useMutation } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'

interface FoodCategoryRatingData {
  food_category: string
  rating: number
}

const addFoodCategoryRatings = async (
  foodCategoryRating: FoodCategoryRatingData[]
) => {
  const { data, error } = await supabase
    .from('food_category_ratings')
    .insert(foodCategoryRating)

  if (error) {
    throw error
  }

  return data
}

export default function useRateFoodCategories() {
  return useMutation({
    mutationFn: async (foodCategoryRatings: FoodCategoryRatingData[]) =>
      await addFoodCategoryRatings(foodCategoryRatings),
  })
}
