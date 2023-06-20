import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'

type FoodCategoryRating = any

const addFoodCategoryRatings = async (
  foodCategoryRating: FoodCategoryRating[]
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
    mutationFn: async (foodCategoryRatings: FoodCategoryRating[]) =>
      await addFoodCategoryRatings(foodCategoryRatings),
    onSuccess: () =>
      useQueryClient().invalidateQueries({ queryKey: ['foodCategoryRatings'] }),
  })
}
