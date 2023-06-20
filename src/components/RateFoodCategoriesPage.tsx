import { useState } from 'react'
import { allUnhealthyCategories } from '../data/images.ts'
import useRateFoodCategories from '../hooks/useRateFoodCategories.tsx'
import { Navigate } from 'react-router-dom'

export default function RateFoodCategoriesPage() {
  const [currentFoodCategoryRatings, setCurrentFoodCategoryRatings] = useState(
    () =>
      allUnhealthyCategories.map((category) => ({
        category,
        rating: 0,
      }))
  )

  const handleRatingChange = (category: string) => {
    setCurrentFoodCategoryRatings((prevFoodCategoryRatings) => {
      const categoryIndex = prevFoodCategoryRatings.findIndex(
        ({ category: ratingCategory }) => ratingCategory === category
      )
      const currentRating = prevFoodCategoryRatings[categoryIndex].rating
      const newRating = currentRating === 0 ? 1 : 0
      const newFoodCategoryRatings = [...prevFoodCategoryRatings]
      newFoodCategoryRatings[categoryIndex] = {
        category,
        rating: newRating,
      }
      return newFoodCategoryRatings
    })
  }

  const { mutate: rateFoodCategories, isSuccess } = useRateFoodCategories()
  const handleSubmit = (e: any) => {
    e.preventDefault()
    rateFoodCategories(currentFoodCategoryRatings)
  }

  if (isSuccess) {
    return <Navigate to="/ratefoods" />
  }

  return (
    <div className="container">
      <h1 className="title">Choose Food Categories</h1>
      <h2 className="subtitle">Please choose at least 4 food categories</h2>
      <div className="column">
        <form>
          {currentFoodCategoryRatings.map(({ category, rating }) => (
            <div key={category}>
              <label>
                {category}
                <input
                  type="checkbox"
                  checked={Boolean(rating)}
                  onChange={() => handleRatingChange(category)}
                />
              </label>
            </div>
          ))}
          <button
            disabled={
              currentFoodCategoryRatings.filter(({ rating }) => Boolean(rating))
                .length < 4
            }
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
