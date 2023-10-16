import _ from 'lodash'
import questions from '../data/questions'
import { useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Tables } from '../types/Task'
import { recordQuestionResponse } from '../utils/recordResponse'

export default function Questions() {
  const currentQuestions = [
    { type: 'benefits' as const, question: _.sample(questions.benefits)! },
    { type: 'costs' as const, question: _.sample(questions.costs)! },
    { type: 'reframing' as const, question: _.sample(questions.reframing)! },
  ]

  const [showQuestions, setShowQuestions] = useLocalStorage(
    'showQuestions',
    false
  )

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const currentQuestion = currentQuestions[currentQuestionIndex]

  const handleResponse = (
    response: Tables<'question_responses'>['Insert']['response']
  ) => {
    recordQuestionResponse({
      ...currentQuestion,
      response,
    })
    const hasCompletedQuestions =
      currentQuestionIndex >= currentQuestions.length - 1
    if (hasCompletedQuestions) {
      setShowQuestions(false)
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    }
  }

  return showQuestions ? (
    <Question question={currentQuestion.question} onSubmit={handleResponse} />
  ) : (
    <></>
  )
}

function Question({
  question,
  onSubmit,
}: {
  question: string
  onSubmit: (response: string) => void
}) {
  const [text, setText] = useState('')
  const handleSubmit = () => {
    onSubmit(text)
    setText('')
  }

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
              onChange={(e) => setText(e.target.value)}
              value={text}
            ></textarea>
          </p>
          <p className="questionFeedback"></p>
          <button onClick={handleSubmit} className="button is-primary is-large">
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
