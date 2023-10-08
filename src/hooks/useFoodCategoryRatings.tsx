import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'

type FoodCategoryRatingData = {
  id?: number
  created_at?: string
  user_id?: string
  food_category: string
  rating: number
}

const fetchFoodCategoryRatings = async () => {
  const { data: foodCategoryRatings, error } = await supabase
    .from('food_category_ratings')
    .select('*')

  if (error) {
    throw new Error(error.message)
  }

  return foodCategoryRatings as FoodCategoryRatingData[]
}

export function useFoodCategoryRatings() {
  return useQuery({
    queryKey: ['foodCategoryRatings'],
    queryFn: fetchFoodCategoryRatings,
  })
}
