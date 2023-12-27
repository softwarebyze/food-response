import { Link } from 'react-router-dom'
import { UNHEALTHY_IMAGE_COUNT } from '../data/images'
import { useFoodRatings } from '../hooks/useFoodRatings'

export default function RateFoodPage() {
  const { data: foodRatings } = useFoodRatings()

  return (
    <div className="container">
      <h1 className="title">Rate Food Page</h1>
      <div className="columns is-centered">
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
