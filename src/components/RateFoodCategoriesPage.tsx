import { useFoodCategoryRatings } from '../hooks/useFoodCategoryRatings'

export default function RateFoodCategoriesPage() {
  const { ratedCategories } = useFoodCategoryRatings()
  return (
    <div className="container">
      <h1 className="title">Rate Food Categories Page</h1>
      <h2 className="subtitle">
        Rated {ratedCategories.length} food categories
      </h2>
      <div className="columns is-centered"></div>
    </div>
  )
}
