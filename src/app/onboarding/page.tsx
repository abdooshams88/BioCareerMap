'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const TOTAL_STEPS = 3

export default function Onboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')

  // Step 1: SWOT Data
  const [swotData, setSwotData] = useState({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  })

  // Step 2: Career Track
  const [selectedTrack, setSelectedTrack] = useState('')

  // Step 3: Skill Grid
  const [skillGrid, setSkillGrid] = useState({
    labSkills: [],
    softSkills: [],
    technicalSkills: [],
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUserId(user.id)
    loadProgress(user.id)
  }

  const loadProgress = async (uid) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', uid)
      .single()

    if (data) {
      if (data.swot_results) setSwotData(data.swot_results)
      if (data.career_tracks) {
        setSelectedTrack(data.career_tracks[0] || '')
        setCurrentStep(2)
      }
      if (data.skill_grid) {
        setSkillGrid(data.skill_grid)
        setCurrentStep(3)
      }
    }
  }

  const saveProgress = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          swot_results: swotData,
          career_tracks: selectedTrack ? [selectedTrack] : [],
          skill_grid: skillGrid,
          completed_onboarding: currentStep === TOTAL_STEPS,
          updated_at: new Date(),
        })

      if (error) throw error
    } catch (err) {
      console.error('Error saving progress:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    await saveProgress()
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else {
      await supabase
        .from('profiles')
        .update({ completed_onboarding: true })
        .eq('user_id', userId)

      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progressWidth = (currentStep / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }} dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: '#1A1A2E' }}>
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-sm" style={{ color: '#1A1A2E', opacity: 0.6 }}>
              {Math.round(progressWidth)}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#F5E6C8' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressWidth}%`,
                backgroundColor: '#C8991A',
              }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                التقييم الذاتي (SWOT)
              </h2>
              <p className="mb-8" style={{ color: '#1A1A2E', opacity: 0.7 }}>
                Step 1: Identify your strengths, weaknesses, opportunities, and threats
              </p>

              <div className="space-y-6">
                {['strengths', 'weaknesses', 'opportunities', 'threats'].map((category) => (
                  <div key={category}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#0D6B6E' }} dir="rtl">
                      {category === 'strengths' && 'نقاط القوة'}
                      {category === 'weaknesses' && 'نقاط الضعف'}
                      {category === 'opportunities' && 'الفرص'}
                      {category === 'threats' && 'التهديدات'}
                    </h3>
                    <textarea
                      className="w-full p-4 rounded-lg border"
                      rows={3}
                      placeholder={
                        category === 'strengths' ? 'اكتب نقاط قوتك...' :
                        category === 'weaknesses' ? 'اكتب نقاط ضعفك...' :
                        category === 'opportunities' ? 'اكتب الفرص المتاحة...' :
                        'اكتب التهديدات المحتملة...'
                      }
                      dir="rtl"
                      style={{ borderColor: '#C8991A', backgroundColor: '#FAFAF7' }}
                      onChange={(e) => {
                        const items = e.target.value.split('\n').filter(s => s.trim())
                        setSwotData(prev => ({ ...prev, [category]: items }))
                      }}
                      value={swotData[category].join('\n')}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                اختر المسار المهني
              </h2>
              <p className="mb-8" style={{ color: '#1A1A2E', opacity: 0.7 }}>
                Step 2: Select your primary career track
              </p>

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

          {currentStep === 3 && (
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                تقييم المهارات
              </h2>
              <p className="mb-8" style={{ color: '#1A1A2E', opacity: 0.7 }}>
                Step 3: Select your current skill levels
              </p>

              <div className="space-y-4">
                {[
                  { category: 'labSkills', labelAr: 'مهارات المختبر', labelEn: 'Lab Skills' },
                  { category: 'softSkills', labelAr: 'المهارات الناعمة', labelEn: 'Soft Skills' },
                  { category: 'technicalSkills', labelAr: 'المهارات التقنية', labelEn: 'Technical Skills' },
                ].map(({ category, labelAr, labelEn }) => (
                  <div key={category} className="p-4 rounded-lg" style={{ backgroundColor: '#F5E6C8' }}>
                    <h3 className="font-bold mb-3" style={{ color: '#1A1A2E' }} dir="rtl">{labelAr}</h3>
                    <div className="flex gap-3 flex-wrap">
                      {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setSkillGrid(prev => ({
                              ...prev,
                              [category]: [...prev[category].filter(s => !s.startsWith(level.charAt(0)), `${level.charAt(0)}:${level}`]
                            }))
                          }}
                          className="px-4 py-2 rounded-md text-sm transition-all"
                          style={{
                            backgroundColor: skillGrid[category].some(s => s.includes(level)) ? '#C8991A' : '#FFFFFF',
                            color: skillGrid[category].some(s => s.includes(level)) ? '#1A1A2E' : '#1A1A2E',
                            border: '1px solid #C8991A',
                          }}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
            disabled={loading || (currentStep === 2 && !selectedTrack)}
            className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
          >
            {loading ? 'جاري الحفظ...' : currentStep === TOTAL_STEPS ? 'إنهاء' : 'التالي'}
          </button>
        </div>
      </div>
    </div>
  )
}
