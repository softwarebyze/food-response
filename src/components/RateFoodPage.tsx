import { Link } from 'react-router-dom'
import { UNHEALTHY_IMAGE_COUNT, allFoodImages } from '../data/images'
import { useFoodRatings } from '../hooks/useFoodRatings'
import { useState } from 'react'
import { useFoodRatingsMutation } from '../hooks/useFoodRatingsMutation'

const getFoodIdFromFilename = (filenameWithExtension: string) => {
  const filename = filenameWithExtension.split('.')[0]
  const imageWithMatchingFilename = allFoodImages.find((food) =>
    food.src.includes(filename)
  )
  if (!imageWithMatchingFilename) {
    throw new Error(`No food found with filename ${filename}`)
  }
  return imageWithMatchingFilename.id
}

const getDataFromCsv = (csv: string) => {
  const [_headers, ...data] = csv.split('\r\n')
  return data
}

export default function RateFoodPage() {
  const { data: foodRatings } = useFoodRatings()
  const hasCompletedRating =
    foodRatings && foodRatings?.length >= UNHEALTHY_IMAGE_COUNT

  const {
    mutate: recordRating,
    isError,
    isLoading,
  } = useFoodRatingsMutation()

  const [rawCsvString, setRawCsvString] = useState<string | null>(null)

  const rawData = getDataFromCsv(rawCsvString || '')
  const cleanedData = rawData.filter((row) => {
    const [filename, _pictype, rating, chosen, _value] = row.split(',')
    return filename.length > 0 && rating && chosen // exclude rows not chosen
  })
  const ratingsData = cleanedData.map((row) => {
    const [filename, _pictype, rating, _chosen, _value] = row.split(',')
    return {
      food_id: getFoodIdFromFilename(filename),
      rating: +rating,
    }
  })
  const ratings = ratingsData

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        console.log(text)
        if (typeof text === 'string') {
          setRawCsvString(text)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleSubmit = () => {
    recordRating(ratings)
  }

  return (
    <div className="container">
      <div className="column is-centered">
        <h1 className="title">Rate Food Page</h1>

        {!hasCompletedRating ? (
          <>
            {isError && (
              <article className="message is-danger">
                <div className="message-body">
                  <strong>Error</strong>
                  <p>There was an error recording your ratings.</p>
                </div>
              </article>
            )}
            {isLoading && (
              <article className="message is-info">
                <div className="message-body">
                  <strong>Loading</strong>
                  <p>Recording your ratings...</p>
                </div>
              </article>
            )}
            <p className="subtitle">
              {!rawCsvString
                ? `Please upload your food ratings file. The file 
          should be a CSV with columns in this order: 
          name (ex: PHHealthy16.png), pictype (1 or 0), rating 
          (number), chosen (1 or 0), value (number)`
                : 'Please confirm your food ratings and click Submit.'}
            </p>
            <div className="is-flex is-flex-direction-column is-align-items-start is-2">
              <input type="file" accept=".csv" onChange={onChange} />
              {ratings && (
                <div className='mt-3'>
                  <p>Preview:</p>
                  <pre>{JSON.stringify(ratings, null, 2)}</pre>
                </div>
              )}
              <input
                disabled={!rawCsvString || !rawCsvString?.length}
                type="submit"
                className="button is-primary mt-2"
                onClick={handleSubmit}
              />
            </div>
          </>
        ) : (
          <div>
            <p>
              Done rating foods! <Link to="/">Go to Games</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
