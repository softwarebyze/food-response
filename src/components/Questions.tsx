import _ from 'lodash'
import questions from '../data/questions'
import { useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export default function Questions() {
  const numberOfQuestionsAtATime = 5
  const currentQuestions = _.sampleSize(questions, numberOfQuestionsAtATime)

  const [showQuestions, setShowQuestions] = useLocalStorage(
    'showQuestions',
    false
  )

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const goToNextQuestionOrClose = () => {
    const hasCompletedQuestions =
    currentQuestionIndex >= currentQuestions.length - 1
    
    if (hasCompletedQuestions) {
      setShowQuestions(false)
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    }
  }

  return showQuestions ? (
    <Question
      question={currentQuestions[currentQuestionIndex]}
      onSubmit={goToNextQuestionOrClose}
    />
  ) : (
    <></>
  )
}

function Question({
  question,
  onSubmit,
}: {
  question: string
  onSubmit: () => void
}) {
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="field">
          <label className="label white title is-3">{question}</label>
          <p className="control">
            <textarea
              className="textarea"
              id="mesAnswer"
              placeholder="Please answer the above question."
            ></textarea>
          </p>
          <p className="questionFeedback"></p>
          <button onClick={onSubmit} className="button is-primary is-large">
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
