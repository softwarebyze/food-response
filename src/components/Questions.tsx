import _ from 'lodash'
import questions from '../data/questions'
import { useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { recordQuestionResponse } from '../utils/recordResponse'
import { useQuestionResponses } from '../hooks/useQuestionResponses'
import { TablesInsert } from '../types/supabase'

export default function Questions() {
  const { data: questionResponsesFromDb } = useQuestionResponses()

  // 66% chance of benefits, 33% chance of costs
  const firstQuestionType: 'benefits' | 'costs' = _.sample([
    'benefits',
    'costs',
    'benefits',
  ])!

  // if goals question has been asked, use implementation question, otherwise use goals question
  const wasGoalsQuestionAsked = questionResponsesFromDb?.some(
    (response) => response.type === 'goals'
  )

  const secondQuestionType: 'goals' | 'implementations' = wasGoalsQuestionAsked
    ? 'implementations'
    : 'goals'

  const wasReframingQuestionAskedThreeTimes =
    (questionResponsesFromDb || []).filter(
      (response) => response.type === 'reframing'
    ).length >= 3

  // if reframing question has been asked three times, use circumnavigating question, otherwise use reframing question
  const thirdQuestionType: 'reframing' | 'circumnavigating' =
    wasReframingQuestionAskedThreeTimes ? 'circumnavigating' : 'reframing'

  const currentQuestions = [
    {
      type: firstQuestionType,
      question: _.sample(questions[firstQuestionType])!,
    },
    {
      type: secondQuestionType,
      question: _.sample(questions[secondQuestionType])!,
    },
    {
      type: thirdQuestionType,
      question: _.sample(questions[thirdQuestionType])!,
    },
  ]

  const [showQuestions, setShowQuestions] = useLocalStorage(
    'showQuestions',
    false
  )

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const currentQuestion = currentQuestions[currentQuestionIndex]

  const handleResponse = (
    response: TablesInsert<'question_responses'>['response']
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
