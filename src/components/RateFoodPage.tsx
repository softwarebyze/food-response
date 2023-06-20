import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  // HEALTHY_IMAGE_COUNT,
  // UNHEALTHY_IMAGE_COUNT,
  // fetchFoodRatings,
  // useFoodCategoryRatingsQuery,
  // useFoodRatingsQuery,
  useUserData,
} from '../contexts/UserDataContext'
import RateCategories from './RateCategories'
// import RateFoods from './RateFoods'

export default function RateFoodPage() {
  const {
    useFoodCategoryRatingsQuery,
    useFoodRatingsQuery,
    HEALTHY_IMAGE_COUNT,
    UNHEALTHY_IMAGE_COUNT,
  } = useUserData()
  const { data: foodCategoryRatings } = useFoodCategoryRatingsQuery()
  const {
    data: foodRatings,
    isLoading,
    isError,
    isFetching,
  } = useFoodRatingsQuery()
  // useQuery({ queryKey: ['foodRatings'], queryFn: fetchFoodRatings })

  if (isLoading || isFetching) {
    return <div>Loading food ratings...</div>
  }
  if (isError || !foodRatings) {
    return <div>Error loading food ratings</div>
  }

  const doneRatingFoods = foodRatings?.length
    ? foodRatings?.length >= HEALTHY_IMAGE_COUNT + UNHEALTHY_IMAGE_COUNT
    : false

  const doneRatingCategories = foodCategoryRatings?.length ?? false
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
          // <RateFoods />
          <></>
      ) : (
        <RateCategories />
      )}
    </div>
  )
}
