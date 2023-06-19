import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  HEALTHY_IMAGE_COUNT,
  UNHEALTHY_IMAGE_COUNT,
  fetchFoodRatings,
  useUserData,
} from '../contexts/UserDataContext'
import RateCategories from './RateCategories'
import RateFoods from './RateFoods'

export default function RateFoodPage() {
  const { foodCategoryRatings } = useUserData()
  const {
    data: foodRatings,
    isLoading,
    isError,
    isFetching,
  } = useQuery({ queryKey: ['foodRatings'], queryFn: fetchFoodRatings })

  const doneRatingFoods = foodRatings?.length
    ? foodRatings?.length >= HEALTHY_IMAGE_COUNT + UNHEALTHY_IMAGE_COUNT
    : false

  const doneRatingCategories = foodCategoryRatings?.length > 0

  return (
    <div className="container">
      <h1 className="title">Rate Food Page</h1>
      {doneRatingFoods ? (
        <div>
          <p>
            Done rating foods! <Link to="/">Go to Games</Link>
          </p>
        </div>
      ) : doneRatingCategories ? (
        <RateFoods />
      ) : (
        <RateCategories />
      )}
    </div>
  )
}
