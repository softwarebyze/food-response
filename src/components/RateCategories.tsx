import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  insertFoodCategoryRating,
  useUserData,
} from '../contexts/UserDataContext'
import Loading from './Loading'

interface FoodCategoryRating {
  [foodCategory: string]: number
}

export default function RateCategories() {
  const queryClient = useQueryClient()
  const { session } = useAuth()
  const { unhealthyFoodCategories } = useUserData()
  const initialRatings: FoodCategoryRating = {}
  unhealthyFoodCategories.forEach((category) => {
    initialRatings[category] = 0
  })
  const [currentFoodCategoryRatings, setCurrentFoodCategoryRatings] =
    useState(initialRatings)

  const { mutate: recordCategoryRatings, isLoading } = useMutation({
    mutationFn: saveCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodCategoryRatings'] })
    },
  })

  async function saveCategories() {
    for (const category in currentFoodCategoryRatings) {
      await insertFoodCategoryRating({
        food_category: category,
        rating: currentFoodCategoryRatings[category] ? 1 : 0,
        user_id: session!.user!.id,
      })
    }
  }

  return (
    <>
      <h1>Choose food categories</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div>
            {unhealthyFoodCategories.map((category) => (
              <label key={category} className="checkbox m-2 tag">
                <input
                  type="checkbox"
                  checked={currentFoodCategoryRatings[category] ? true : false}
                  onChange={(event) => {
                    setCurrentFoodCategoryRatings((prevCategoryRatings) => ({
                      ...prevCategoryRatings,
                      [category]: event.target.checked ? 1 : 0,
                    }))
                  }}
                  className="m-1"
                />
                {category}
              </label>
            ))}
          </div>
          <button
            onClick={(_e) => recordCategoryRatings()}
            className="button is-primary"
          >
            Save Categories
          </button>
        </>
      )}
    </>
  )
}
