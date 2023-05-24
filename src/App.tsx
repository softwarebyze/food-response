import 'bulma/css/bulma.min.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import LoginPage from './components/LoginPage'
import Nav from './components/Nav'
import TaskPage from './components/TaskPage'
import UserPage from './components/UserPage'
import { useAuth } from './contexts/AuthContext'
import { tasks } from './data/tasks.json'
import './main.css'
import { TaskInfo } from './types/Task'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { session } = useAuth()
  return session ? children : <Navigate to="/login" />
}

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      {session && <Nav />}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home tasks={tasks as TaskInfo[]} />
            </PrivateRoute>
          }
        />
        <Route path="/user" element={<UserPage />} />
        <Route path="/login" element={<LoginPage />} />
        {tasks.map((task) => (
          <Route
            key={task.name}
            path={task.path}
            element={
              <PrivateRoute>
                <TaskPage task={task as TaskInfo} />
              </PrivateRoute>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
