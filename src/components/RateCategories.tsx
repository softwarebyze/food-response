import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  insertFoodCategoryRatingOrRatings,
  useUserData,
} from '../contexts/UserDataContext'
import Loading from './Loading'

export default function RateCategories() {
  // const queryClient = useQueryClient()
  const { session } = useAuth()
  const { unhealthyFoodCategories } = useUserData()
  const [currentFoodCategoryRatings, setCurrentFoodCategoryRatings] = useState(
    () => {
      const initialRatings = new Map()
      unhealthyFoodCategories.forEach((category) => {
        initialRatings.set(category, 0)
      })
      return initialRatings
    }
  )

  async function saveCategories() {
    const categoryRatingsArray = Array.from(
      currentFoodCategoryRatings.entries()
    ).map(([category, rating]) => ({
      food_category: category,
      rating: rating ? 1 : 0,
      user_id: session!.user!.id,
    }))

    return await insertFoodCategoryRatingOrRatings(categoryRatingsArray)
  }

  const { mutate: recordCategoryRatings, isLoading } = useMutation({
    mutationFn: saveCategories,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['foodCategoryRatings'] })
    },
  })

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1>Please choose at least 4 food categories</h1>
          <div className="is-flex is-flex-direction-column is-align-items-flex-start">
            {Array.from(currentFoodCategoryRatings).map(
              ([category, rating]) => (
                <label key={category} className="checkbox m-2 tag">
                  <input
                    type="checkbox"
                    checked={rating ? true : false}
                    onChange={(event) => {
                      const updatedRatings = new Map(currentFoodCategoryRatings)
                      updatedRatings.set(category, event.target.checked ? 1 : 0)
                      setCurrentFoodCategoryRatings(updatedRatings)
                    }}
                    className="m-1"
                  />
                  {category}
                </label>
              )
            )}
          </div>
          <button
            disabled={
              Array.from(currentFoodCategoryRatings.values()).filter(Boolean)
                .length < 4
            }
            title={
              Array.from(currentFoodCategoryRatings.values()).filter(Boolean)
                .length < 4
                ? 'Please rate at least 4 categories'
                : undefined
            }
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
