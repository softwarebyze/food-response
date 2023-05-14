import * as fs from 'fs'
import * as path from 'path'

const directoryPath = 'images'

const foodData = []

fs.readdirSync(directoryPath).forEach((foodType) => {
  const foodTypePath = path.join(directoryPath, foodType)
  // Check if the foodTypePath is a directory
  if (fs.statSync(foodTypePath).isDirectory()) {
    // Iterate through each file in the folder
    fs.readdirSync(foodTypePath).forEach((file) => {
      // Check if the file is an image file
      if (
        file.endsWith('.jpg') ||
        file.endsWith('.jpeg') ||
        file.endsWith('.webp') ||
        file.endsWith('.png')
      ) {
        // Add the food type and image path to the array
        const foodTypeData = {
          src: `/images/${foodType}/${file}`,
          foodType,
          type: file.includes('Unhealthy') ? 'unhealthy' : 'healthy',
        }
        foodData.push(foodTypeData)
      }
    })
  }
})

const water = {
  src: 'https://img.freepik.com/free-vector/isolated-glass-water_1368-2666.jpg?w=2000',
  type: 'water',
}

const jsonData = JSON.stringify({ images: [...foodData, water] })
fs.writeFileSync('src/data/imagesGenerated.json', jsonData)
