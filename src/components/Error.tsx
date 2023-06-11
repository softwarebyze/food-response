import { useState } from 'react'

export default function Error({ message }: { message: string }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <>
      {isVisible && (
        <div className="notification is-danger">
          <button className="delete" onClick={handleClose} />
          {message}
        </div>
      )}
    </>
  )
}
