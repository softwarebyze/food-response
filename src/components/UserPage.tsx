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
    const { data, error } = await supabase.from('responses').select('*')

    if (error) {
      alert(error.message)
    } else {
      console.log({ data })
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
        <h1 className="title is-1">Responses</h1>
      </div>
      <hr />
      <ResponsesTable responses={responses} loading={loading} />
    </section>
  )
}