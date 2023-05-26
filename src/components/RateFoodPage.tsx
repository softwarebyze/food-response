import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import { images } from '../data/images.json'

async function recordRating({
  rating,
  foodId,
  userId,
}: {
  rating: number
  foodId: string
  userId: string
}) {
  return await supabase.from('food-ratings').insert({ rating, foodId, userId })
}

export default function RateFoodPage() {
  const [loading, setLoading] = useState(false)
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0)
  const [foods, setFoods] = useState<{ [x: string]: any }[]>(images)
  const [currentRating, setCurrentRating] = useState('')
  const [ratings, setRatings] = useState([])
  const { session } = useAuth()
  const currentFood = foods?.[currentFoodIndex]
  console.log({ currentFood })

  //   useEffect(() => {
  //     async function getRatings() {
  //       const { data, error } = await supabase
  //         .from('food-ratings')
  //         .select('*')
  //         .eq('userId', session!.user!.id)
  //       console.log({ data, error })
  //     }
  //     getRatings()
  //   }, [])

//   useEffect(() => {
//     const fetchUnratedFoods = async (userId: string) => {
//       const { data, error } = await supabase
//         .from('food-ratings')
//         .select('foodId')
//         .eq('userId', userId)

//       if (error) {
//         console.error('Error fetching unrated foods:', error)
//         return []
//       }
//       const ratedFoodIds = data.map((rating) => rating.foodId)
//       console.log({ ratedFoodIds })

//       // Fetch all foods except the ones that the user has already rated
//       const { data: foodsData, error: foodsError } = await supabase
//         .from('foods')
//         .select()
//         .not('id', 'in', ratedFoodIds)

//       if (foodsError) {
//         console.error('Error fetching unrated foods:', foodsError)
//         return []
//       }

//       setFoods(foodsData)
//     }
//     fetchUnratedFoods(session!.user!.id)
//   }, [])

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (loading) return console.log('loading')
      const { key } = event
      if (key >= '1' && key <= '9') {
        setLoading(true)
        setCurrentRating(key)
        const keyNumber = parseInt(key)
        await recordRating({
          rating: keyNumber,
          foodId: currentFood.id,
          userId: session!.user!.id,
        })
        setLoading(false)
        setCurrentRating('')
        setCurrentFoodIndex((prevIndex) => prevIndex + 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  return (
    <div className="columns is-centered">
      {currentFood ? (
        <div className="column is-narrow">
          <img src={currentFood.src} alt="food to rate" />
          <p className="has-text-centered">
            Rate the food from 1 to 9 with your keyboard
          </p>
          <div className="has-text-centered">
            <h1 className="is-size-1">{currentRating}</h1>
          </div>

          {loading && <progress className="progress is-primary" max="100" />}
          <br />
          <br />
          {JSON.stringify(ratings)}
        </div>
      ) : (
        <p>Done rating foods</p>
      )}
    </div>
  )
}
