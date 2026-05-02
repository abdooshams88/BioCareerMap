'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Chart, register } from 'react-chartjs-2'
import {
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const TOTAL_STEPS = 3

const HARD_SKILLS = [
  'PCR and molecular biology techniques',
  'Cell culture',
  'Microscopy (light + electron)',
  'ELISA and immunological assays',
  'Bioinformatics basics (BLAST, NCBI)',
  'Scientific writing',
  'Statistical analysis (SPSS or Excel)',
  'Good Laboratory Practice (GLP)',
  'HACCP knowledge',
  'ISO standards awareness',
  'Basic research methodology',
]

const SOFT_SKILLS = [
  'Time management',
  'Team communication',
  'Problem solving',
  'Critical thinking',
  'Presentation skills',
  'English language proficiency',
  'Arabic scientific writing',
  'Leadership',
  'Networking',
  'Stress management',
]

const LEVELS = [
  { key: 'none', labelAr: 'لا أعرفه', labelEn: "Don't know it", value: 0 },
  { key: 'heard', labelAr: 'سمعت عنه', labelEn: 'Heard of it', value: 1 },
  { key: 'basic', labelAr: 'أساسيات', labelEn: 'Basics', value: 2 },
  { key: 'proficient', labelAr: 'متمكن', labelEn: 'Proficient', value: 3 },
  { key: 'expert', labelAr: 'خبير', labelEn: 'Expert', value: 4 },
]

export default function Onboarding() {
  const router = useRouter()
  const chartRef = useRef<ChartJS>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState('')

  // Step 1: SWOT
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})

  // Step 2: Skill Grid
  const [skillGrid, setSkillGrid] = useState<{ [key: string]: string }>({})

  // Step 3: Career Track
  const [selectedTrack, setSelectedTrack] = useState('')

  useEffect(() => { checkUser() }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUserId(user.id)
    loadProgress(user.id)
  }

  async function loadProgress(uid: string) {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', uid).single()
    if (data) {
      if (data.swot_results?.answers) {
        setAnswers(data.swot_results.answers)
        setCurrentStep(2)
      }
      if (data.skill_grid && Object.keys(data.skill_grid).length > 0) {
        setSkillGrid(data.skill_grid)
        setCurrentStep(3)
      }
      if (data.career_tracks && data.career_tracks.length > 0) {
        setSelectedTrack(data.career_tracks[0])
      }
    }
  }

  async function saveProgress() {
    setSaving(true)
    try {
      const updateData: any = {
        user_id: userId,
        updated_at: new Date(),
      }

      if (currentStep === 1) {
        updateData.swot_results = { answers, completed: true }
      }

      if (currentStep === 2) {
        updateData.skill_grid = skillGrid
      }

      if (currentStep === 3) {
        updateData.career_tracks = selectedTrack ? [selectedTrack] : []
        updateData.completed_onboarding = true
      }

      const { error } = await supabase.from('profiles').upsert(updateData)
      if (error) throw error
    } catch (err) {
      console.error('Error saving:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleNext() {
    if (currentStep === 1 && Object.keys(answers).length < 20) return
    if (currentStep === 2 && Object.keys(skillGrid).length < HARD_SKILLS.length + SOFT_SKILLS.length) return

    await saveProgress()

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/dashboard')
    }
  }

  function handleBack() {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const progress = ((currentStep - 1) / TOTAL_STEPS) * 100

  // Chart data
  const hardSkillsAvg = HARD_SKILLS.reduce((sum, skill) => {
    const level = LEVELS.find(l => l.key === skillGrid[skill])
    return sum + (level?.value || 0)
  }, 0) / HARD_SKILLS.length * 25

  const softSkillsAvg = SOFT_SKILLS.reduce((sum, skill) => {
    const level = LEVELS.find(l => l.key === skillGrid[skill])
    return sum + (level?.value || 0)
  }, 0) / SOFT_SKILLS.length * 25

  const chartData = {
    labels: ['Hard Skills', 'Soft Skills'],
    datasets: [
      {
        label: 'Your Skills',
        data: [hardSkillsAvg, softSkillsAvg],
        backgroundColor: 'rgba(200, 153, 26, 0.2)',
        borderColor: '#C8991A',
        borderWidth: 2,
        pointBackgroundColor: '#C8991A',
      },
    ],
  }

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { display: false },
        grid: { color: 'rgba(26, 26, 46, 0.1)' },
        angleLines: { color: 'rgba(26, 26, 46, 0.1)' },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }} dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: '#1A1A2E' }}>Step {currentStep} of {TOTAL_STEPS}</span>
            <span className="text-sm" style={{ color: '#1A1A2E', opacity: 0.6 }}>{Math.round(progress)}%</span>
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

        {/* Step 1: SWOT Diagnostic */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
              اكتشف نفسك
            </h2>
            <p className="mb-8" style={{ color: '#1A1A2E', opacity: 0.7 }}>The BioCareerMap Diagnostic — 20 questions, about 8 minutes</p>

            <div className="space-y-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((qId) => {
                const questions: { [key: number]: string } = {
                  1: 'I finish lab reports and assignments before their deadline',
                  2: 'I enjoy reading scientific papers or textbooks in my free time',
                  3: 'I prefer working alone over working in groups',
                  4: 'When I make a mistake, I analyze what went wrong before moving on',
                  5: 'I feel comfortable speaking or presenting in front of people',
                  6: 'I get stressed easily when facing unexpected problems',
                  7: 'I can manage multiple tasks or deadlines at the same time',
                  8: 'I actively look for internship or research opportunities on my own',
                  9: 'I feel motivated more by money and financial stability than by passion',
                  10: 'I believe I can learn any skill if I put in the effort',
                  11: 'I follow through on long-term projects even when they get boring',
                  12: 'I take initiative in group work rather than waiting to be told what to do',
                  13: 'I find it hard to say no to people who ask for my help',
                  14: 'I prefer practical, hands-on work over theoretical study',
                  15: 'I keep track of my goals and review them regularly',
                  16: 'I get discouraged by failure or negative feedback',
                  17: 'I am aware of the job market and typical salaries in my field',
                  18: 'I feel financially pressured by my family situation',
                  19: 'I would be willing to work or study abroad if a good opportunity came up',
                  20: 'I believe hard work alone is enough to succeed in Egypt\'s biology job market',
                }
                return (
                  <div key={qId}>
                    <h3 className="text-lg font-bold mb-4" style={{ color: '#0D6B6E' }} dir="rtl">
                      {qId}. {questions[qId]}
                    </h3>
                    <div className="grid grid-cols-5 gap-3">
                      {LEVELS.map((level) => (
                        <button
                          key={level.key}
                          onClick={() => setAnswers(prev => ({ ...prev, [qId]: level.value }))}
                          className={`p-3 rounded-lg border-2 transition-all ${answers[qId] === level.value ? 'transform scale-105' : ''}`}
                          style={{
                            borderColor: answers[qId] === level.value ? '#C8991A' : '#E5E7EB',
                            backgroundColor: answers[qId] === level.value ? '#F5E6C8' : '#FFFFFF',
                            color: '#1A1A2E',
                          }}
                        >
                          <div className="text-sm font-bold">{level.labelAr}</div>
                          <div className="text-xs mt-1" style={{ opacity: 0.6 }}>{level.labelEn}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Skill Grid */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
              أين أنت دلوقتي؟
            </h2>
            <p className="mb-8" style={{ color: '#1A1A2E', opacity: 0.7 }}>Where Are You Right Now? Rate your skills below.</p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Hard Skills */}
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#0D6B6E' }} dir="rtl">المهارات الصلبة</h3>
                <div className="space-y-4">
                  {HARD_SKILLS.map((skill) => (
                    <div key={skill}>
                      <p className="text-sm mb-2" style={{ color: '#1A1A2E' }} dir="rtl">{skill}</p>
                      <div className="flex gap-2 flex-wrap">
                        {LEVELS.map((level) => (
                          <button
                            key={level.key}
                            onClick={() => setSkillGrid(prev => ({ ...prev, [skill]: level.key }))}
                            className="px-3 py-1 rounded-md text-xs transition-all"
                            style={{
                              backgroundColor: skillGrid[skill] === level.key ? '#C8991A' : '#FFFFFF',
                              color: skillGrid[skill] === level.key ? '#1A1A2E' : '#1A1A2E',
                              border: `1px solid ${skillGrid[skill] === level.key ? '#C8991A' : '#E5E7EB'}`,
                            }}
                          >
                            {level.labelAr}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#0D6B6E' }} dir="rtl">المهارات الناعمة</h3>
                <div className="space-y-4">
                  {SOFT_SKILLS.map((skill) => (
                    <div key={skill}>
                      <p className="text-sm mb-2" style={{ color: '#1A1A2E' }} dir="rtl">{skill}</p>
                      <div className="flex gap-2 flex-wrap">
                        {LEVELS.map((level) => (
                          <button
                            key={level.key}
                            onClick={() => setSkillGrid(prev => ({ ...prev, [skill]: level.key }))}
                            className="px-3 py-1 rounded-md text-xs transition-all"
                            style={{
                              backgroundColor: skillGrid[skill] === level.key ? '#C8991A' : '#FFFFFF',
                              color: skillGrid[skill] === level.key ? '#1A1A2E' : '#1A1A2E',
                              border: `1px solid ${skillGrid[skill] === level.key ? '#C8991A' : '#E5E7EB'}`,
                            }}
                          >
                            {level.labelAr}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: '#F5E6C8' }}>
              <h3 className="text-lg font-bold mb-4 text-center" style={{ color: '#1A1A2E' }} dir="rtl">ملفك المهاري</h3>
              <div className="w-full max-w-md mx-auto">
                <Chart type="radar" data={chartData} options={chartOptions} ref={chartRef} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Career Track */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
              اختر المسار المهني
            </h2>
            <p className="mb-8" style={{ color: '#1A1A2E', opacity: 0.7 }}>Select your primary career track</p>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: 'research', titleAr: 'البحث العلمي', titleEn: 'Research', desc: 'Focus on scientific research and discovery' },
                { id: 'clinical', titleAr: 'المختبرات السريرية', titleEn: 'Clinical', desc: 'Work in clinical labs and diagnostics' },
                { id: 'industry', titleAr: 'الصناعة', titleEn: 'Industry', desc: 'Biotech and pharmaceutical companies' },
              ].map((track) => (
                <div
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className="p-6 rounded-lg border-2 cursor-pointer transition-all hover:scale-105"
                  style={{
                    borderColor: selectedTrack === track.id ? '#C8991A' : '#F5E6C8',
                    backgroundColor: selectedTrack === track.id ? '#F5E6C8' : '#FFFFFF',
                  }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A2E' }} dir="rtl">{track.titleAr}</h3>
                  <p className="text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }}>{track.titleEn}</p>
                  <p className="text-sm mt-2" style={{ color: '#1A1A2E', opacity: 0.6 }}>{track.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
            style={{ border: '2px solid #C8991A', color: '#C8991A' }}
          >
            السابق
          </button>

          <button
            onClick={handleNext}
            disabled={
              saving ||
              (currentStep === 1 && Object.keys(answers).length < 20) ||
              (currentStep === 2 && Object.keys(skillGrid).length < HARD_SKILLS.length + SOFT_SKILLS.length) ||
              (currentStep === 3 && !selectedTrack)
            }
            className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
          >
            {saving ? 'جاري الحفظ...' : currentStep === TOTAL_STEPS ? 'إنهاء واحفظ' : 'التالي'}
          </button>
        </div>
      </div>
    </div>
  )
}
