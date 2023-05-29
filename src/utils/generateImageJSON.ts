// not using this because the IDs need to match the IDs in the database

// import * as fs from 'fs'
// import * as path from 'path'
// import { ImageData, ImageType } from '../types/Task'

// const directoryPath = 'public/images'

// const foodData: ImageData[] = []

// fs.readdirSync(directoryPath).forEach((foodTypeFolder) => {
//   const foodTypeFolderPath = path.join(directoryPath, foodTypeFolder)
//   // Check if the foodTypePath is a directory
//   if (fs.statSync(foodTypeFolderPath).isDirectory()) {
//     // Iterate through each file in the folder
//     fs.readdirSync(foodTypeFolderPath).forEach((file) => {
//       // Check if the file is an image file
//       if (
//         file.endsWith('.jpg') ||
//         file.endsWith('.jpeg') ||
//         file.endsWith('.webp') ||
//         file.endsWith('.png')
//       ) {
//         // extract the type (healthy/unhealthy/water) from the file name
//         const type: ImageType = file.includes('Unhealthy')
//           ? 'unhealthy'
//           : file.includes('Healthy')
//           ? 'healthy'
//           : 'water'
//         // Add the food type and image path to the array
//         const foodTypeData = {
//           id: foodData.length,
//           src: `/images/${foodTypeFolder}/${file}`,
//           foodType: foodTypeFolder,
//           type,
//         }
//         foodData.push(foodTypeData)
//       }
//     })
//   }
// })

// const jsonData = JSON.stringify(foodData)
// fs.writeFileSync('src/data/imagesGenerated.json', jsonData)
