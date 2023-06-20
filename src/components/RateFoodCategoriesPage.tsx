import { useState } from 'react'
import { allUnhealthyCategories } from '../data/images.ts'

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

  return (
    <div className="container">
      <h1 className="title">Choose Food Categories</h1>
      <h2 className="subtitle">Please choose at least 4 food categories</h2>
      <div className="column">
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
      </div>
    </div>
  )
}
