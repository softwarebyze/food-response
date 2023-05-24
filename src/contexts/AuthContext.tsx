import { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { redirect } from 'react-router-dom'
import { supabase } from '../supabaseClient'

interface AuthData {
  session: Session | null
}

const AuthContext = createContext<AuthData>({ session: null })

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (event === 'SIGNED_IN') {
        redirect('/')
      }
      if (event === 'SIGNED_OUT') {
        redirect('/login')
      }
    })
  }, [])
  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
