import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { allUnhealthyCategories } from '../data/images'
import { useFoodCategoryRatings } from '../hooks/useFoodCategoryRatings'
import useRateFoodCategories from '../hooks/useRateFoodCategories'

export default function RateFoodCategoriesPage() {
  const { session } = useAuth()
  const { data: foodCategoryRatings } = useFoodCategoryRatings()
  const [currentFoodCategoryRatings, setCurrentFoodCategoryRatings] = useState(
    () =>
      allUnhealthyCategories.map((category) => ({
        category,
        rating:
          foodCategoryRatings?.find(
            (rating) => rating.food_category === category
          )?.rating ?? 0,
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

  const {
    mutate: rateFoodCategories,
    isSuccess,
    isError,
    isLoading,
  } = useRateFoodCategories()
  const handleSubmit = (e: any) => {
    e.preventDefault()
    rateFoodCategories(
      currentFoodCategoryRatings.map(({ rating, category }) => ({
        rating,
        user_id: session?.user.id,
        food_category: category,
      }))
    )
  }

  const enoughChosenCategories =
    currentFoodCategoryRatings.filter(({ rating }) => rating > 0).length >= 4

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
          <button disabled={!enoughChosenCategories} onClick={handleSubmit}>
            Submit
          </button>
          {isSuccess && <div>Success!</div>}
          {isError && <div>Error</div>}
          {isLoading && <div>Loading...</div>}
          {(foodCategoryRatings?.length ?? 0) >= 4 && (
            <div>
              <p>
                Done rating food categories!{' '}
                <Link to="/ratefoods">Go to Rate Foods</Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
