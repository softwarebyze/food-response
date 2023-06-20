import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'

const fetchFoodCategoryRatings = async () => {
  const { data: foodCategoryRatings, error } = await supabase
    .from('food_category_ratings')
    .select('*')

  if (error) {
    throw new Error(error.message)
  }

  return foodCategoryRatings
}

export function useFoodCategoryRatings() {
  return useQuery({
    queryKey: ['foodCategoryRatings'],
    queryFn: fetchFoodCategoryRatings,
  })
}
