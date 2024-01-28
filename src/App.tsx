import 'bulma/css/bulma.min.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './animation.css'
import Home from './components/Home'
import LoginPage from './components/LoginPage'
import Nav from './components/Nav'
import RateFoodPage from './components/RateFoodPage'
import TaskPage from './components/TaskPage'
import UserPage from './components/UserPage'
import { useAuth } from './contexts/AuthContext'
import { UNHEALTHY_IMAGE_COUNT } from './data/images'
import { tasks } from './data/tasks.json'
import { useFoodRatings } from './hooks/useFoodRatings'
import './main.css'
import { TaskInfo } from './types/Task'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { session } = useAuth()
  return session ? children : <Navigate to="/login" />
}

function RatingFoodsCompletedRoute({ children }: { children: JSX.Element }) {
  // Check if the user has completed rating all the foods
  const { data: foodRatings, isLoading, isError, isFetching } = useFoodRatings()
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError || !foodRatings) {
    return <div>Error loading food ratings</div>
  }
  const hasCompletedRating = foodRatings.length >= UNHEALTHY_IMAGE_COUNT
  return hasCompletedRating ? children : <Navigate to="/ratefoods" />
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
              <RatingFoodsCompletedRoute>
                <Home tasks={tasks as TaskInfo[]} />
              </RatingFoodsCompletedRoute>
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
                <RatingFoodsCompletedRoute>
                  <TaskPage task={task as TaskInfo} />
                </RatingFoodsCompletedRoute>
              </PrivateRoute>
            }
          />
        ))}
        <Route
          path="/ratefoods"
          element={
            <PrivateRoute>
              <RateFoodPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
