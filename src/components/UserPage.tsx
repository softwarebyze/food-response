import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import ResponsesTable from './ResponsesTable'
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
        <div className='table-container'>
          <table className='table'>
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
          </table>
        </div>
        <hr />
        <div className="columns">
          <div className="column">
            <p className="title">Food Ratings</p>
            {areFoodRatingsReady ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>food_id</th>
                      <th>src</th>
                      <th>food_type</th>
                      <th>rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodRatings.map((rating) => (
                      <tr key={rating.id}>
                        <td>{rating.id}</td>
                        <td>
                          {
                            allImages.find(
                              (image) => image.id === rating.food_id
                            )?.src
                          }
                        </td>
                        <td>{rating.id}</td>
                        <td>
                          {
                            allImages.find(
                              (image) => image.id === rating.food_id
                            )?.foodType
                          }
                        </td>
                        <td>{rating.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
