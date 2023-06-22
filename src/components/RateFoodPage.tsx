import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UNHEALTHY_IMAGE_COUNT, allFoodImages } from '../data/images'
import { useFoodCategoryRatings } from '../hooks/useFoodCategoryRatings'
import { useFoodRatings } from '../hooks/useFoodRatings'
import { supabase } from '../supabaseClient'
import { FoodRatingData } from '../types/Task'

export default function RateFoodPage() {
  const queryClient = useQueryClient()
  const [currentRating, setCurrentRating] = useState('')
  const { session } = useAuth()
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0)

  const { data: foodRatings } = useFoodRatings()
  const { data: foodCategoryRatings } = useFoodCategoryRatings()

  const chosenCategories =
    foodCategoryRatings &&
    foodCategoryRatings
      .filter((rating) => rating.rating !== 0)
      .map((rating) => rating.food_category)

  const foodsToRate =
    chosenCategories &&
    allFoodImages.filter((foodImageData) =>
      chosenCategories.includes(foodImageData.foodType)
    )
  const currentFood = foodsToRate?.length ? foodsToRate[currentFoodIndex] : null

  const { mutate: recordRating } = useMutation({
    mutationFn: async (foodRating: FoodRatingData) => {
      const { data, error } = await supabase
        .from('food_ratings')
        .insert(foodRating)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['foodRatings'] })
      setCurrentFoodIndex((prevIndex) => prevIndex + 1)
    },
  })

  const handleKeyDown = async (event: KeyboardEvent) => {
    const { key } = event
    if (!(key >= '1' && key <= '9')) return
    if (!currentFood) return console.log('no current food')
    if (!currentFood?.id) return console.log('no current food id')
    setCurrentRating(key)
    const keyNumber = parseInt(key)
    recordRating({
      rating: keyNumber,
      food_id: currentFood!.id,
      user_id: session!.user!.id,
    })
    setCurrentRating('')
  }
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentFood])
  return (
    <div className="container">
      <h1 className="title">Rate Food Page</h1>
      {foodRatings && (
        <h2 className="subtitle">
          Rated {foodRatings.length} of {foodsToRate?.length} foods
        </h2>
      )}
      <div className="columns is-centered">
        {currentFood && (
          <div className="column is-narrow is-centered">
            <div className="is-flex is-justify-content-center">
              <img src={currentFood.src} alt="food to rate" />
            </div>
            <div className="has-text-centered">
              <h1 className="is-size-1">{currentRating}</h1>
            </div>
            <div className="is-flex m-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((i) => (
                <div
                  key={i}
                  className="tile button is-outlined p-6 is-align-items-center mr-1"
                  onClick={() => handleKeyDown({ key: i } as KeyboardEvent)}
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
        {foodRatings && foodRatings.length >= UNHEALTHY_IMAGE_COUNT && (
          <div>
            <p>
              Done rating foods! <Link to="/">Go to Games</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
