import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUserData } from '../contexts/UserDataContext'

export default function RateFoodPage() {
  const [currentRating, setCurrentRating] = useState('')
  const { session } = useAuth()
  const {
    loading,
    setLoading,
    allFoodImages,
    foodRatings,
    unratedFoods,
    recordRating,
    resetFoodRatings,
    randomlyRateRemainingFoods,
  } = useUserData()
  const currentFood = unratedFoods?.length
    ? unratedFoods[0]
    : null

  function randomlyRateCurrentFood() {
    const randomRating = Math.floor(Math.random() * 9) + 1
    handleKeyDown({ key: `${randomRating}` } as KeyboardEvent)
  }

  const handleKeyDown = async (event: KeyboardEvent) => {
    const { key } = event
    if (!(key >= '1' && key <= '9')) return
    if (loading) return console.log('loading')
    if (!currentFood) return console.log('no current food')
    if (!currentFood?.id) return console.log('no current food id')
    setLoading(true)
    setCurrentRating(key)
    const keyNumber = parseInt(key)
    await recordRating({
      rating: keyNumber,
      food_id: currentFood!.id,
      user_id: session!.user!.id,
    })
    setCurrentRating('')
    setLoading(false)
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
      <h2 className="subtitle">
        Rated {foodRatings?.length ?? 0} of {allFoodImages?.length} foods
      </h2>
        <div className="columns is-centered">
          {currentFood ? (
            <div className="column is-narrow">
              <img src={currentFood.src} alt="food to rate" />
              <div className="has-text-centered">
                <h1 className="is-size-1">{currentRating}</h1>
              </div>
              {loading && (
                <progress className="progress is-primary" max="100" />
              )}
              <p className="has-text-centered">
                Rate the food from 1 to 9 with your keyboard
              </p>
              <p className="has-text-centered">
                <button onClick={randomlyRateCurrentFood}>Click Here</button>
                <span> to rate the current food randomly</span>
              </p>
              <p className="has-text-centered">
                <span>Or </span>
                <button
                  onClick={() =>
                    randomlyRateRemainingFoods(
                      setCurrentRating,
                      session!.user.id
                    )
                  }
                >
                  Click Here
                </button>
                <span>
                  {' '}
                  to rate all {unratedFoods?.length} remaining foods randomly
                </span>
              </p>
            </div>
          ) : (
            <div>
              <p>
                Done rating foods! <Link to="/">Go to Games</Link>
              </p>
              <p>
                Or{' '}
                <button onClick={() => resetFoodRatings(session!.user.id)}>
                  Clear all of my food ratings
                </button>
              </p>
            </div>
          )}
        </div>
        <div className="columns is-centered">
          <div className="column is-narrow">
            <p className="title">Foods {`(${allFoodImages.length})`}</p>
            <table className="table is-fullwidth">
              <thead>
                <tr>
                  <th>Food Id</th>
                  <th>Food Type</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {allFoodImages.map((food) => (
                  <tr key={food.id}>
                    <td>{food.id}</td>
                    <td>{food.foodType}</td>
                    <td>
                      <img
                        className="image is-64x64"
                        src={food.src}
                        alt={food.foodType}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="column is-narrow">
            <p className="title">Food Ratings {`(${foodRatings.length})`}</p>
            <table className="table is-fullwidth">
              <thead>
                <tr>
                  <th>Rating Id</th>
                  <th>Food Id</th>
                  <th>Rating</th>
                  <th>User Id</th>
                </tr>
              </thead>
              <tbody>
                {foodRatings.map((foodRating) => (
                  <tr key={foodRating.id}>
                    <td>{foodRating.id}</td>
                    <td>{foodRating.food_id}</td>
                    <td>{foodRating.rating}</td>
                    <td>{foodRating.user_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}
