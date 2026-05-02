'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const TOTAL_STEPS = 3

const SWOT_FIELDS = [
  { key: 'strengths', labelAr: 'نقاط القوة', placeholder: 'اكتب نقاط قوتك...' },
  { key: 'weaknesses', labelAr: 'نقاط الضعف', placeholder: 'اكتب نقاط ضعفك...' },
  { key: 'opportunities', labelAr: 'الفرص', placeholder: 'اكتب الفرص المتاحة...' },
  { key: 'threats', labelAr: 'التهديدات', placeholder: 'اكتب التهديدات المحتملة...' },
]

const CAREER_TRACKS = [
  { id: 'research', titleAr: 'البحث العلمي', titleEn: 'Research', desc: 'Focus on scientific research and discovery' },
  { id: 'clinical', titleAr: 'المختبرات السريرية', titleEn: 'Clinical', desc: 'Work in clinical labs and diagnostics' },
  { id: 'industry', titleAr: 'الصناعة', titleEn: 'Industry', desc: 'Biotech and pharmaceutical companies' },
]

const SKILL_CATEGORIES = [
  { category: 'labSkills', labelAr: 'مهارات المختبر', labelEn: 'Lab Skills' },
  { category: 'softSkills', labelAr: 'المهارات الناعمة', labelEn: 'Soft Skills' },
  { category: 'technicalSkills', labelAr: 'المهارات التقنية', labelEn: 'Technical Skills' },
]

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

export default function Onboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')

  const [swotData, setSwotData] = useState({ strengths: '', weaknesses: '', opportunities: '', threats: '' })
  const [selectedTrack, setSelectedTrack] = useState('')
  const [skillGrid, setSkillGrid] = useState({ labSkills: [], softSkills: [], technicalSkills: [] })

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
      if (data.swot_results) setSwotData(data.swot_results)
      if (data.career_tracks && data.career_tracks.length > 0) {
        setSelectedTrack(data.career_tracks[0])
        setCurrentStep(2)
      }
      if (data.skill_grid) {
        setSkillGrid(data.skill_grid)
        setCurrentStep(3)
      }
    }
  }

  async function saveProgress() {
    setLoading(true)
    try {
      const { error } = await supabase.from('profiles').upsert({
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

  async function handleNext() {
    await saveProgress()
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else {
      await supabase.from('profiles').update({ completed_onboarding: true }).eq('user_id', userId)
      router.push('/dashboard')
    }
  }

  function handleBack() {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const progressWidth = (currentStep / TOTAL_STEPS) * 100

  function handleSwotChange(key: string, value: string) {
    setSwotData(prev => ({ ...prev, [key]: value }))
  }

  function handleSkillClick(category: string, level: string) {
    const prefix = level.charAt(0)
    setSkillGrid(prev => {
      const current = prev[category] || []
      const exists = current.some((s: string) => s.startsWith(prefix))
      if (exists) {
        return { ...prev, [category]: current.filter((s: string) => !s.startsWith(prefix)) }
      } else {
        return { ...prev, [category]: [...current, `${prefix}:${level}`] }
      }
    })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }} dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: '#1A1A2E' }}>Step {currentStep} of {TOTAL_STEPS}</span>
            <span className="text-sm" style={{ color: '#1A1A2E', opacity: 0.6 }}>{Math.round(progressWidth)}%</span>
          </div>
          <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#F5E6C8' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressWidth}%`, backgroundColor: '#C8991A' }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">التقييم الذاتي (SWOT)</h2>
              <p className="mb-8" style={{ color: '#1A1A2E', opacity: 0.7 }}>Step 1: Identify your strengths, weaknesses, opportunities, and threats</p>
              <div className="space-y-6">
                {SWOT_FIELDS.map((item) => (
                  <div key={item.key}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#0D6B6E' }} dir="rtl">{item.labelAr}</h3>
                    <textarea
                      className="w-full p-4 rounded-lg border"
                      rows={3}
                      placeholder={item.placeholder}
                      dir="rtl"
                      style={{ borderColor: '#C8991A', backgroundColor: '#FAFAF7' }}
                      value={swotData[item.key]}
                      onChange={(e) => handleSwotChange(item.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">اختر المسار المهني</h2>
              <p className="mb-8" style={{ color: '#1A1A2E', opacity: 0.7 }}>Step 2: Select your primary career track</p>
              <div className="grid md:grid-cols-3 gap-4">
                {CAREER_TRACKS.map((track) => (
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
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">تقييم المهارات</h2>
              <p className="mb-8" style={{ color: '#1A1A2E', opacity: 0.7 }}>Step 3: Select your current skill levels</p>
              <div className="space-y-4">
                {SKILL_CATEGORIES.map((item) => (
                  <div key={item.category} className="p-4 rounded-lg" style={{ backgroundColor: '#F5E6C8' }}>
                    <h3 className="font-bold mb-3" style={{ color: '#1A1A2E' }} dir="rtl">{item.labelAr}</h3>
                    <div className="flex gap-3 flex-wrap">
                      {SKILL_LEVELS.map((level) => (
                        <button
                          key={level}
                          onClick={() => handleSkillClick(item.category, level)}
                          className="px-4 py-2 rounded-md text-sm transition-all"
                          style={{
                            backgroundColor: skillGrid[item.category]?.some((s: string) => s.includes(level)) ? '#C8991A' : '#FFFFFF',
                            color: skillGrid[item.category]?.some((s: string) => s.includes(level)) ? '#1A1A2E' : '#1A1A2E',
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
