import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'

const fetchFoodRatings = async () => {
  const { data: foodRatings, error } = await supabase
    .from('food_ratings')
    .select('*')

  if (error) {
    throw error
  }

  return foodRatings
}

export function useFoodRatings() {
  return useQuery({
    queryKey: ['foodRatings'],
    queryFn: fetchFoodRatings,
  })
}
