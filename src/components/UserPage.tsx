import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import ResponsesTable from './ResponsesTable'
import { useFoodCategoryRatings } from '../hooks/useFoodCategoryRatings'
import { useFoodRatings } from '../hooks/useFoodRatings'
import { allImages } from '../data/images'

export default function UserPage() {
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<any>([])
  const { session } = useAuth()

  const getResponses = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('task_responses').select('*')

    if (error) {
      console.error(error)
    } else {
      setResponses(data)
    }
    setLoading(false)
  }
  const { data: foodCategoryRatings, isSuccess: areFoodCategoryRatingsReady } =
    useFoodCategoryRatings()
  const { data: foodRatings, isSuccess: areFoodRatingsReady } = useFoodRatings()

  useEffect(() => {
    getResponses()
  }, [])
  return (
    <section className="section">
      <div className="container swing-in-top-fwd">
        <h1 className="title is-1">User Page</h1>
        <hr />
        <div>User: {session?.user.email}</div>
        <div>Id: {session?.user.id}</div>
        <hr />
        <div className="columns">
          <div className="column">
            <p className="title">Food Category Ratings</p>
            <div>
              {areFoodCategoryRatingsReady
                ? foodCategoryRatings.map((rating) => (
                    <p key={rating.id}>
                      {rating.food_category}: {rating.rating}
                    </p>
                  ))
                : 'Not ready'}
            </div>
          </div>
          <div className="column">
            <p className="title">Food Ratings</p>
            <div>
              {areFoodRatingsReady
                ? foodRatings.map((rating) => (
                    <p key={rating.id}>
                      {
                        allImages.find((image) => image.id === rating.food_id)
                          ?.foodType
                      }
                      : {rating.rating}
                    </p>
                  ))
                : 'Not ready'}
            </div>
          </div>
        </div>
        <hr />
        <p className="title">Responses Table</p>
        <ResponsesTable responses={responses} loading={loading} />
      </div>
    </section>
  )
}
