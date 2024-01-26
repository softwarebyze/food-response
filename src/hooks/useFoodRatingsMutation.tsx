import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'
import { TablesInsert } from '../types/supabase'

export function useFoodRatingsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      foodRating: TablesInsert<'food_ratings'> | TablesInsert<'food_ratings'>[]
    ) => {
      const { data, error } = await supabase
        .from('food_ratings')
        .insert(foodRating)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['foodRatings'] })
    },
  })
}
