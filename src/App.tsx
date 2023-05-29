import 'bulma/css/bulma.min.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import LoginPage from './components/LoginPage'
import Nav from './components/Nav'
import RateFoodPage from './components/RateFoodPage'
import TaskPage from './components/TaskPage'
import UserPage from './components/UserPage'
import { useAuth } from './contexts/AuthContext'
import { useUserData } from './contexts/UserDataContext'
import { tasks } from './data/tasks.json'
import './main.css'
import { TaskInfo } from './types/Task'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { session } = useAuth()
  return session ? children : <Navigate to="/login" />
}

function RatingCompletedRoute({ children }: { children: JSX.Element }) {
  // Check if the user has completed rating all the foods
  const { foodRatings, allFoodImages } = useUserData()
  const hasCompletedRating = foodRatings.length >= allFoodImages.length
  return hasCompletedRating ? children : <Navigate to="/rate" />
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
              <RatingCompletedRoute>
                <Home tasks={tasks as TaskInfo[]} />
              </RatingCompletedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        {tasks.map((task) => (
          <Route
            key={task.name}
            path={task.path}
            element={
              <PrivateRoute>
                <RatingCompletedRoute>
                  <TaskPage task={task as TaskInfo} />
                </RatingCompletedRoute>
              </PrivateRoute>
            }
          />
        ))}
        <Route path="/rate" element={<RateFoodPage />} />
      </Routes>
    </BrowserRouter>
  )
}
