import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import ResponsesTable from './ResponsesTable'

export default function UserPage() {
  const [loading, setLoading] = useState(false)
  const { session } = useAuth()
  const [responses, setResponses] = useState<any>([])

  const getResponses = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('task_responses').select('*')

    if (error) {
      alert(error.message)
    } else {
      setResponses(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    getResponses()
  }, [])
  return (
    <section className="section">
      <div className="container swing-in-top-fwd">
        <h1 className="title is-1">User Page</h1>
        <hr />
        <p className="title">Responses Table</p>
        <ResponsesTable responses={responses} loading={loading} />
      </div>
    </section>
  )
}
