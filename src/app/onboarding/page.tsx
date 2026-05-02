'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const QUESTIONS = [
  { id: 1, text: 'I finish lab reports and assignments before their deadline', category: 'strengths' },
  { id: 2, text: 'I enjoy reading scientific papers or textbooks in my free time', category: 'strengths' },
  { id: 3, text: 'I prefer working alone over working in groups', category: 'weaknesses' },
  { id: 4, text: 'When I make a mistake, I analyze what went wrong before moving on', category: 'strengths' },
  { id: 5, text: 'I feel comfortable speaking or presenting in front of people', category: 'strengths' },
  { id: 6, text: 'I get stressed easily when facing unexpected problems', category: 'weaknesses' },
  { id: 7, text: 'I can manage multiple tasks or deadlines at the same time', category: 'strengths' },
  { id: 8, text: 'I actively look for internship or research opportunities on my own', category: 'opportunities' },
  { id: 9, text: 'I feel motivated more by money and financial stability than by passion', category: 'threats' },
  { id: 10, text: 'I believe I can learn any skill if I put in the effort', category: 'strengths' },
  { id: 11, text: 'I follow through on long-term projects even when they get boring', category: 'strengths' },
  { id: 12, text: 'I take initiative in group work rather than waiting to be told what to do', category: 'strengths' },
  { id: 13, text: 'I find it hard to say no to people who ask for my help', category: 'weaknesses' },
  { id: 14, text: 'I prefer practical, hands-on work over theoretical study', category: 'strengths' },
  { id: 15, text: 'I keep track of my goals and review them regularly', category: 'strengths' },
  { id: 16, text: 'I get discouraged by failure or negative feedback', category: 'weaknesses' },
  { id: 17, text: 'I am aware of the job market and typical salaries in my field', category: 'opportunities' },
  { id: 18, text: 'I feel financially pressured by my family situation', category: 'threats' },
  { id: 19, text: 'I would be willing to work or study abroad if a good opportunity came up', category: 'opportunities' },
  { id: 20, text: 'I believe hard work alone is enough to succeed in Egypt\'s biology job market', category: 'threats' },
]

const SCALE_LABELS = ['لا أبداً', 'نادراً', 'أحياناً', 'كثيراً', 'دايماً']

export default function Onboarding() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUserId(user.id)
    loadProgress(user.id)
  }

  async function loadProgress(uid: string) {
    const { data } = await supabase.from('profiles').select('swot_results').eq('user_id', uid).single()
    if (data?.swot_results?.answers) {
      setAnswers(data.swot_results.answers)
      const lastAnswered = Object.keys(data.swot_results.answers).length
      if (lastAnswered > 0 && lastAnswered < QUESTIONS.length) {
        setCurrentQuestion(lastAnswered)
      }
    }
  }

  function handleAnswer(questionId: number, value: number) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  async function saveProgress() {
    setSaving(true)
    const swotResult = calculateSWOT()
    try {
      await supabase.from('profiles').upsert({
        user_id: userId,
        swot_results: { answers, ...swotResult },
        updated_at: new Date(),
      })
    } catch (err) {
      console.error('Error saving:', err)
    } finally {
      setSaving(false)
    }
  }

  function calculateSWOT() {
    const scores = { strengths: 0, weaknesses: 0, opportunities: 0, threats: 0 }
    QUESTIONS.forEach(q => {
      const answer = answers[q.id] || 0
      if (answer > 3) { // Only count 4 and 5 (كثيراً and دايماً)
        scores[q.category] += answer - 3
      }
    })
    return scores
  }

  async function handleNext() {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      await saveProgress()
      router.push('/onboarding/career-track')
    }
  }

  function handlePrev() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  function getSlideDirection() {
    return currentQuestion > 0 ? 'translate-x-0' : '-translate-x-full'
  }

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100
  const currentQ = QUESTIONS[currentQuestion]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }} dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#0D6B6E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
            اكتشف نفسك
          </h1>
          <p style={{ color: '#1A1A2E', opacity: 0.7 }}>
            The BioCareerMap Diagnostic — 20 questions, about 8 minutes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm" style={{ color: '#1A1A2E' }}>
              السؤال {currentQuestion + 1} من {QUESTIONS.length}
            </span>
            <span className="text-sm" style={{ color: '#1A1A2E', opacity: 0.6 }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#F5E6C8' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: '#C8991A',
              }}
            />
          </div>
        </div>

        {/* Question Card with Slide Animation */}
        <div className="bg-white rounded-lg shadow-lg p-8 min-h-[300px] relative overflow-hidden">
          <div
            key={currentQuestion}
            className="transition-all duration-500 ease-in-out"
            style={{
              transform: 'translateX(0)',
              opacity: 1,
            }}
          >
            <h2 className="text-2xl font-bold mb-8" style={{ color: '#1A1A2E' }} dir="rtl">
              {currentQ.text}
            </h2>

            <div className="space-y-3">
              {SCALE_LABELS.map((label, index) => {
                const value = index + 1
                const isSelected = answers[currentQ.id] === value
                return (
                  <button
                    key={value}
                    onClick={() => handleAnswer(currentQ.id, value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all hover:scale-102 ${
                      isSelected ? 'transform scale-105' : ''
                    }`}
                    style={{
                      borderColor: isSelected ? '#C8991A' : '#E5E7EB',
                      backgroundColor: isSelected ? '#F5E6C8' : '#FFFFFF',
                      color: '#1A1A2E',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{label}</span>
                      {isSelected && (
                        <span className="text-2xl">✓</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
            style={{ border: '2px solid #C8991A', color: '#C8991A' }}
          >
            السابق
          </button>

          {currentQuestion < QUESTIONS.length - 1 ? (
            <button
              onClick={() => {
                if (answers[currentQ.id]) {
                  handleNext()
                }
              }}
              disabled={!answers[currentQ.id]}
              className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
            >
              التالي
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!answers[currentQ.id] || saving}
              className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
            >
              {saving ? 'جاري الحفظ...' : 'إنهاء واحفظ'}
            </button>
          )}
        </div>

        {/* Skip Warning */}
        {!answers[currentQ.id] && (
          <p className="text-center mt-4 text-sm" style={{ color: '#1A1A2E', opacity: 0.5 }}>
            يجب اختيار إجابة للمتابعة
          </p>
        )}
      </div>
    </div>
  )
}
