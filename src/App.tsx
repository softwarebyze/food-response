import { useQuery } from '@tanstack/react-query'
import 'bulma/css/bulma.min.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import LoginPage from './components/LoginPage'
import Nav from './components/Nav'
import RateFoodPage from './components/RateFoodPage'
import TaskPage from './components/TaskPage'
import UserPage from './components/UserPage'
import { useAuth } from './contexts/AuthContext'
import { fetchFoodRatings, useUserData } from './contexts/UserDataContext'
import { images } from './data/images.json'
import { tasks } from './data/tasks.json'
import './main.css'
import './animation.css'
import { TaskInfo } from './types/Task'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { session } = useAuth()
  return session ? children : <Navigate to="/login" />
}

function RatingCategoriesCompletedRoute({
  children,
}: {
  children: JSX.Element
}) {
  const hasCompletedRatings = false
  return hasCompletedRatings ? children : <Navigate to="/ratecategories" />
}

function RatingFoodsCompletedRoute({ children }: { children: JSX.Element }) {
  // Check if the user has completed rating all the foods
  const { allFoodImages } = useUserData()
  const {
    data: foodRatings,
    isLoading,
    isError,
    isFetching,
  } = useQuery({ queryKey: ['foodRatings'], queryFn: fetchFoodRatings })
  if (isLoading || isFetching) {
    return <div>Loading...</div>
  }
  if (isError || !foodRatings) {
    return <div>Error loading food ratings</div>
  }
  const hasCompletedRating = foodRatings.length >= allFoodImages.length
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
      {images?.map((food) => (
        <img
          key={food.id}
          src={food.src}
          alt={'food'}
          style={{
            visibility: 'hidden',
            height: '1px',
          }}
        />
      ))}
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
              <RatingCategoriesCompletedRoute>
                <RateFoodPage />
              </RatingCategoriesCompletedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/ratecategories"
          element={
            <PrivateRoute>
              <div>Rate Categories Route</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
