import { useFoodCategoryRatings } from '../hooks/useFoodCategoryRatings'
import { allUnhealthyCategories } from '../data/images.ts'

export default function RateFoodCategoriesPage() {
  const { data: ratedCategories } = useFoodCategoryRatings()
  return (
    <div className="container">
      <h1 className="title">Rate Food Categories Page</h1>
      <h2 className="subtitle">
        Rated {ratedCategories?.length ?? '...'} food categories
      </h2>
      <div className="column">
        {allUnhealthyCategories.map((category) => (
          <p key={category}>{category}</p>
        ))}
      </div>
    </div>
  )
}
