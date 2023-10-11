import _ from 'lodash'
import questions from '../data/questions'
import { useState } from 'react'

export default function Questions() {
  const numberOfQuestionsAtATime = 5
  const currentQuestions = _.sampleSize(questions, numberOfQuestionsAtATime)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [show, setShow] = useState(true)

  const goToNextQuestionOrClose = () => {
    // if on last question, close. else, increment index
    const done = currentQuestionIndex >= currentQuestions.length - 1
    if (done) {
      setShow(false)
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    }
  }

  return show ? (
    <Question
      question={currentQuestions[currentQuestionIndex]}
      onSubmit={goToNextQuestionOrClose}
    />
  ) : null
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
