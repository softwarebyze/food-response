import { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { redirect } from 'react-router-dom'
import { supabase } from '../supabaseClient'

interface AuthData {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthData>({ session: null, loading: true })

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((event, session) => {
      setLoading(true)
      setSession(session)
      if (event === 'SIGNED_IN') {
        redirect('/')
      }
      if (event === 'SIGNED_OUT') {
        redirect('/login')
      }
      setLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
