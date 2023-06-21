import 'bulma/css/bulma.min.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './animation.css'
import Home from './components/Home'
import LoginPage from './components/LoginPage'
import Nav from './components/Nav'
import RateFoodCategoriesPage from './components/RateFoodCategoriesPage'
import RateFoodPage from './components/RateFoodPage'
import TaskPage from './components/TaskPage'
import UserPage from './components/UserPage'
import { useAuth } from './contexts/AuthContext'
import { allFoodImages } from './data/images'
import { images } from './data/images.json'
import { tasks } from './data/tasks.json'
import { useFoodCategoryRatings } from './hooks/useFoodCategoryRatings'
import { useFoodRatings } from './hooks/useFoodRatings'
import './main.css'
import { TaskInfo } from './types/Task'

function PrivateRoute({ children }: { children: JSX.Element }) {
  console.log('PrivateRoute')
  const { session } = useAuth()
  return session ? children : <Navigate to="/login" />
}

function RatingCategoriesCompletedRoute({
  children,
}: {
  children: JSX.Element
}) {
  console.log('RatingCategoriesCompletedRoute')
  const {
    data: foodCategoryRatings,
    isLoading,
    isError,
    isFetching,
  } = useFoodCategoryRatings()
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError || !foodCategoryRatings) {
    return <div>Error loading food ratings</div>
  }
  const foodCategoryRatingsCount = foodCategoryRatings.length
  const hasCompletedFoodCategoryRatings = foodCategoryRatingsCount >= 4
  return hasCompletedFoodCategoryRatings ? (
    children
  ) : (
    <Navigate to="/ratecategories" />
  )
}

function RatingFoodsCompletedRoute({ children }: { children: JSX.Element }) {
  console.log('RatingFoodsCompletedRoute')
  // Check if the user has completed rating all the foods
  const { data: foodRatings, isLoading, isError, isFetching } = useFoodRatings()
  if (isLoading) {
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
              <RateFoodCategoriesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
