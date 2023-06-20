import { allUnhealthyCategories } from '../data/images.ts'
import { useFoodCategoryRatings } from '../hooks/useFoodCategoryRatings'

export default function RateFoodCategoriesPage() {
  const { data: foodCategoryRatings } = useFoodCategoryRatings()
  return (
    <div className="container">
      <h1 className="title">Rate Food Categories Page</h1>
      <h2 className="subtitle">
        Rated {foodCategoryRatings?.length ?? '...'} food categories Please rate
        at least 4 food categories
      </h2>
      <div className="column">
        {allUnhealthyCategories.map((category) => (
          <p key={category}>{category}</p>
        ))}
      </div>
    </div>
  )
}
