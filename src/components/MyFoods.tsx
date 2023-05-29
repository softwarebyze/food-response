import { useUserData } from '../contexts/UserDataContext'
export default function MyFoods() {
  const { foodRatings, userImages } = useUserData()
  const userImagesWithoutWater = userImages.filter(
    (img) => img.type !== 'water'
  )
  const healthyUserImages = userImagesWithoutWater.filter(
    (img) => img.type === 'healthy'
  )
  const unhealthyUserImages = userImagesWithoutWater.filter(
    (img) => img.type === 'unhealthy'
  )
  return (
    <div className="container">
      <h1 className="title">My Foods</h1>
      <h2 className="subtitle">{`${foodRatings.length} Rated Foods`}</h2>
      <h2 className="subtitle">
        {`Using ${healthyUserImages.length} highest rated Low-Calorie Foods`}
      </h2>
      <div className="is-flex overflow-x-scroll m-1">
        {healthyUserImages.map((food, i) => (
          <div key={i} className="m-2">
            <h2>{food.foodType}</h2>
            <img src={food.src} alt={food.foodType} />
          </div>
        ))}
      </div>
      <h2 className="subtitle">
        {`And ${unhealthyUserImages.length} highest rated High-Calorie Foods`}
      </h2>
      <div className="is-flex overflow-x-scroll m-1">
        {unhealthyUserImages.map((food, i) => (
          <div key={i} className="m-2">
            <h2>{food.foodType}</h2>
            <img src={food.src} alt={food.foodType} />
          </div>
        ))}
      </div>
    </div>
  )
}
