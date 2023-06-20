import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  fetchFoodRatings,
  useFoodCategoryRatingsQuery,
  useFoodRatingsQuery,
  useUserData,
} from '../contexts/UserDataContext'
import { supabase } from '../supabaseClient'
import { FoodRatingData } from '../types/Task'

export default function RateFoods() {
  const queryClient = useQueryClient()
  const { session } = useAuth()
  const { allFoodImages } = useUserData()
  const {
    data: foodRatings,
    isLoading,
    isError,
    isFetching,
  } = useFoodRatingsQuery()
  // useQuery({ queryKey: ['foodRatings'], queryFn: fetchFoodRatings })

  // const { data: foodCategoryRatings } = useFoodCategoryRatingsQuery()
  // console.log({ foodCategoryRatings })
  // const userChosenCategories = [
  //   ...new Set(
  //     foodCategoryRatings
  //       ?.filter(({ rating }) => rating > 0)
  //       .map(({ food_category }) => food_category)
  //   ),
  // ]

  // const unhealthyFoodsInUserCategories = allFoodImages
  //   .filter(({ type }) => type === 'unhealthy')
  //   .filter(({ foodType }) => userChosenCategories?.includes(foodType))

  const ratedFoodIds =
    foodRatings?.map((foodRating) => foodRating.food_id) ?? []
  const unratedFoods = allFoodImages.filter(
    (food) => !ratedFoodIds.includes(food.id)
  )
  const currentFood = unratedFoods?.length ? unratedFoods[0] : null

  const { mutate: recordRating } = useMutation({
    mutationFn: async (foodRating: FoodRatingData) => {
      return await supabase.from('food_ratings').insert(foodRating)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodRatings'] })
    },
  })

  const handleKeyDown = async (event: KeyboardEvent) => {
    const { key } = event
    if (!(key >= '1' && key <= '9')) return
    if (!currentFood) return console.log('no current food')
    if (!currentFood?.id) return console.log('no current food id')
    const keyNumber = parseInt(key)
    recordRating({
      rating: keyNumber,
      food_id: currentFood!.id,
      user_id: session!.user!.id,
    })
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentFood])

  return (
    <>
      <h2 className="subtitle">
        Rated {foodRatings?.length ?? 0} of {allFoodImages?.length} foods
      </h2>
      <div className="columns is-centered">
        {currentFood && (
          <div className="column is-narrow is-centered">
            <div className="is-flex is-justify-content-center">
              <img src={currentFood.src} alt="food to rate" />
            </div>
            <div className="is-flex m-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((i) => (
                <div
                  key={i}
                  className="tile button is-outlined p-6 is-align-items-center mr-1"
                  onClick={() => handleKeyDown({ key: i } as KeyboardEvent)}
                  onTouchStart={() =>
                    handleKeyDown({ key: i } as KeyboardEvent)
                  }
                >
                  <p>{i}</p>
                </div>
              ))}
            </div>
            <p className="has-text-centered">
              Rate the food from 1 to 9 with your keyboard
            </p>
          </div>
        )}
      </div>
    </>
  )
}
