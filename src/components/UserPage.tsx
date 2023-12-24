import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import ResponsesTable from './ResponsesTable'
import { useFoodCategoryRatings } from '../hooks/useFoodCategoryRatings'
import { useFoodRatings } from '../hooks/useFoodRatings'
import { allImages } from '../data/images'
import { useQuestionResponses } from '../hooks/useQuestionResponses'

export default function UserPage() {
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<any>([])
  const { session } = useAuth()
  const { data: questionResponses } = useQuestionResponses()

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
        <p className="title">Question Responses</p>
        <thead>
          <tr>
            <th>id</th>
            <th>type</th>
            <th>question</th>
            <th>response</th>
          </tr>
        </thead>
        <tbody>
          {questionResponses?.map((response) => (
            <tr key={response.id}>
              <td>{response.id}</td>
              <td>{response.type}</td>
              <td>{response.question}</td>
              <td>{response.response}</td>
            </tr>
          ))}
        </tbody>
        <hr />
        <div className="columns">
          <div className="column">
            <p className="title">Food Category Selections</p>
            <thead>
              <tr>
                <th>id</th>
                <th>food_category</th>
                <th>selected</th>
              </tr>
            </thead>
            {areFoodCategoryRatingsReady ? (
              <tbody>
                {foodCategoryRatings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.id}</td>
                    <td>{rating.food_category}</td>
                    <td>{rating.rating}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              'Not ready'
            )}
          </div>
          <div className="column">
            <p className="title">Food Ratings</p>
            <thead>
              <tr>
                <th>id</th>
                <th>food_id</th>
                <th>food_type</th>
                <th>rating</th>
              </tr>
            </thead>
            {areFoodRatingsReady ? (
              <tbody>
                {foodRatings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.id}</td>
                    <td>{rating.food_id}</td>
                    <td>
                      {
                        allImages.find((image) => image.id === rating.food_id)
                          ?.foodType
                      }
                    </td>
                    {rating.rating}
                  </tr>
                ))}
              </tbody>
            ) : (
              'Not ready'
            )}
          </div>
        </div>
        <hr />
        <p className="title">Responses Table</p>
        <ResponsesTable responses={responses} loading={loading} />
      </div>
    </section>
  )
}
