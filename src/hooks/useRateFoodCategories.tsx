import { useMutation, useQueryClient } from '@tanstack/react-query'
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
    console.error(error)
    throw error
  }
  return data
}

export default function useRateFoodCategories() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addFoodCategoryRatings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodCategoryRatings'] })
    },
  })
}
