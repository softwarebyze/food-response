import { useUserData } from '../contexts/UserDataContext'
import { images } from '../data/images.json'
export default function MyFoods() {
  const { foodRatings } = useUserData()
  return (
    <div className="container">
      <h1 className="title">My Foods</h1>
      <h2 className="subtitle">{foodRatings?.length ?? 0} Rated Foods</h2>
      <div className="is-flex overflow-x-scroll">
        {images.map((food, i) => (
          <div key={i} className="m-2">
            <h2>{food.foodType}</h2>
            <img src={food.src} alt={food.foodType} />
          </div>
        ))}
      </div>
    </div>
  )
}
