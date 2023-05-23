import { Session } from '@supabase/supabase-js'
import 'bulma/css/bulma.min.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, redirect } from 'react-router-dom'
import Home from './components/Home'
import LoginPage from './components/LoginPage'
import Nav from './components/Nav'
import TaskPage from './components/TaskPage'
import { tasks } from './data/tasks.json'
import './main.css'
import { supabase } from './supabaseClient'
import { TaskInfo } from './types/Task'

type PrivateRouteProps = { session: Session | null; children: any }

function PrivateRoute({ session, children }: PrivateRouteProps) {
  return session ? children : <Navigate to="/login" />
}

export default function App() {
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
    <BrowserRouter>
      {session && <Nav />}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute session={session}>
              <Home tasks={tasks as TaskInfo[]} />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        {tasks.map((task) => (
          <Route
            key={task.name}
            path={task.path}
            element={<TaskPage task={task as TaskInfo} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
