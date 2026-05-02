'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CAREER_TRACKS = [
  { id: 'academia', titleAr: 'أكاديميا و البحث', titleEn: 'Academia & Research', icon: '🔬', action: 'ابحث عن معمل بحثي', color: '#0D6B6E' },
  { id: 'sales', titleAr: 'مبيعات طبية و أدوية', titleEn: 'Medical Sales & Pharma', icon: '💼', action: 'تقدم لوظيفة', color: '#C8991A' },
  { id: 'qc', titleAr: 'التحكم في الجودة', titleEn: 'Quality Control (QC)', icon: '⚙️', action: 'اخد شهادة ISO', color: '#1A1A2E' },
  { id: 'lab', titleAr: 'فني مختبرات', titleEn: 'Medical Lab Technician', icon: '🧪', action: 'تدرب في معمل', color: '#2E86AB' },
  { id: 'bioinfo', titleAr: 'المعلومات الحيوية', titleEn: 'Bioinformatics', icon: '💻', action: 'تعلم Python', color: '#6B5B95' },
  { id: 'startup', titleAr: 'ريادة الأعمال', titleEn: 'Biotech Startup', icon: '🚀', action: 'ابدأ مشروعك', color: '#F18F01' },
  { id: 'writing', titleAr: 'الكتابة العلمية', titleEn: 'Scientific Writing', icon: '✍️', action: 'ابدأ كتابة', color: '#8B4513' },
  { id: 'foodsafety', titleAr: 'سلامة الغذاء', titleEn: 'Food Safety & HACCP', icon: '🍎', action: 'اخد شهادة HACCP', color: '#228B22' },
  { id: 'publichealth', titleAr: 'الصحة العامة', titleEn: 'Public Health', icon: '🏥', action: 'قدم لماجستير', color: '#DC143C' },
  { id: 'environment', titleAr: 'البيئة و الحياة البرية', titleEn: 'Environmental Biology', icon: '🌳', action: 'ابحث عن مشروع', color: '#2E8B57' },
  { id: 'genetic', titleAr: 'إرشاد الجينات', titleEn: 'Genetic Counseling', icon: '🧬', action: 'تعلم الأساسيات', color: '#9932CC' },
  { id: 'veterinary', titleAr: 'صحة الحيوان', titleEn: 'Animal Health', icon: '🐾', action: 'تدرب في Clinic', color: '#DAA520' },
]

const SEMESTER_MISSIONS = {
  '1st Year': [
    { title: 'استكشف التخصصات', desc: ' اقرأ عن مجالات علم الحياة المختلفة', type: 'activity' },
    { title: 'انضم لمجموعة', desc: 'ابحث عن مجموعه علميه في جامعتك', type: 'activity' },
    { title: 'ابدأ مدونة', desc: 'سجل ملاحظاتك اليومية في مكان', type: 'course' },
  ],
  '2nd Year': [
    { title: 'تدرب الصيف', desc: 'ابحث عن تدريب صيفي في معمل', type: 'internship' },
    { title: 'تعلم مهارات', desc: 'ابدأ تعلم PCR أو ELISA', type: 'course' },
    { title: 'شارك في بحث', desc: 'انضم لفريق بحثي كمتطوع', type: 'activity' },
  ],
  '3rd Year': [
    { title: 'تدرب متقدم', desc: 'ابحث عن تدريب في شركه أدويه', type: 'internship' },
    { title: 'قدم بحث', desc: 'قدم posters البحث في مؤتمرات', type: 'activity' },
    { title: 'ابدأ تخصص', desc: 'قرر مجالك الرئيسي', type: 'course' },
  ],
  '4th Year': [
    { title: 'التدريب النهائي', desc: 'ابدأ التدريب العملي الكامل', type: 'internship' },
    { title: 'اكتب البحث', desc: 'ابدأ كتابة بحث التخرج', type: 'course' },
    { title: 'جهز السيرة', desc: 'جهز سيرتك الذاتية الاحترافية', type: 'activity' },
  ],
  'Graduate': [
    { title: 'ابحث عن وظيفة', desc: 'قدم على وظائف حقيقية', type: 'internship' },
    { title: 'تقدم ل masters', desc: 'قدم على برامج الماجستير', type: 'course' },
    { title: '-network', desc: 'وسع شبكة معارفك المهنية', type: 'activity' },
  ],
}

const VACATION_PULSE = [
  { title: 'تدريب صيفي', desc: 'MASc internship في معمل أو شركة أدوية', season: 'summer' },
  { title: 'دورة online', desc: 'اتعلم مهاره جديده مثل Python أو bioinformatics', season: 'both' },
  { title: 'مشروع بحث', desc: 'ساعد باحث في جامعة خلال الصيف', season: 'summer' },
  { title: 'تطوع', desc: 'تطوع في مستشفى أو مركز بيئي', season: 'both' },
  { title: 'دراسة اللغة', desc: 'تحسن لغتك الإنجليزية أو تعلم لغة جديدة', season: 'both' },
]

const MOCK_COMMUNITY = {
  mistakes: [
    { id: 1, title: 'كنت بسأل أسئلة "غبية" في المعمل', author: 'مصطفي', upvotes: 47, time: '2h ago' },
    { id: 2, title: '第一次面试的时候太紧张了', author: 'سارة', upvotes: 32, time: '5h ago' },
    { id: 3, title: 'قبلتjob بدون ما أفهم إيه职责', author: 'أحمد', upvotes: 28, time: '1d ago' },
  ],
  reviews: [
    { id: 1, company: 'Pharma Corp', rating: 4, salary: '8000-12000', time: '3h ago' },
    { id: 2, company: 'Egypt Lab', rating: 3, salary: '6000-9000', time: '1d ago' },
    { id: 3, company: 'BioGen', rating: 5, salary: '12000-18000', time: '2d ago' },
  ],
}

const SIDEBAR_LINKS = [
  { id: 'dashboard', label: 'لوحة التحكم', labelEn: 'Dashboard', icon: 'home', href: '/dashboard' },
  { id: 'roadmap', label: 'خريطة طريقي', labelEn: 'My Roadmap', icon: 'map', href: '/roadmap' },
  { id: 'vault', label: 'خزنة PoW', labelEn: 'PoW Vault', icon: 'folder', href: '/vault' },
  { id: 'cv', label: 'م Builder', labelEn: 'CV Builder', icon: 'file', href: '/cv' },
  { id: 'reviews', label: 'تقييمات الشركات', labelEn: 'Company Reviews', icon: 'star', href: '/reviews' },
  { id: 'mistakes', title: 'أرشيف الأخطاء', labelEn: 'Mistakes Archive', icon: 'alert', href: '/mistakes' },
  { id: 'biolock', label: 'BioLock', labelEn: 'BioLock', icon: 'lock', href: '/biolock' },
  { id: 'aid', label: 'مساعدة مالية', labelEn: 'Financial Aid', icon: 'dollar', href: '/aid' },
]

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [powEntries, setPowEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.push('/login')
      return
    }

    const { data: userData } = await supabase.from('users').select('*').eq('id', authUser.id).single()
    const { data: profileData } = await supabase.from('profiles').select('*').eq('user_id', authUser.id).single()
    const { data: powData } = await supabase.from('pow_vault').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false })

    setUser(userData)
    setProfile(profileData)
    setPowEntries(powData || [])
    setLoading(false)
  }

  function calculateReadinessScore() {
    if (!profile) return 0
    let score = 0

    if (profile.swot_results && Object.keys(profile.swot_results).length > 0) score += 25
    if (profile.skill_grid && Object.keys(profile.skill_grid).length > 0) score += 25
    if (profile.career_tracks && profile.career_tracks.length >= 3) score += 25
    if (powEntries && powEntries.length > 0) score += 25

    return Math.min(score, 100)
  }

  function getYearMissions() {
    const year = profile?.year_of_study || '1st Year'
    return SEMESTER_MISSIONS[year as keyof typeof SEMESTER_MISSIONS] || SEMESTER_MISSIONS['1st Year']
  }

  const readinessScore = calculateReadinessScore()
  const userName = user?.full_name?.split(' ')[0] || 'طالب'
  const selectedTracks = profile?.career_tracks || []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="animate-pulse text-2xl" style={{ fontFamily: 'var(--font-cairo)', color: '#0D6B6E' }} dir="rtl">
          جاري التحميل...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }} dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 fixed inset-y-0 right-0 z-40" style={{ backgroundColor: '#1A1A2E' }}>
          <div className="absolute inset-0 opacity-5">
            <div className="arabesque-pattern absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L35 20L50 20L38 30L42 45L30 36L18 45L22 30L10 20L25 20L30 5Z' fill='none' stroke='%23C8991A' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }} />
          </div>
          
          <div className="relative z-10 p-6">
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-cairo)', color: '#0D6B6E' }}>
              BioCareerMap
            </h1>
            <p className="text-sm mt-1" style={{ color: '#F5E6C8', opacity: 0.7 }}>
              خريطتك نحو المستقبل
            </p>
          </div>

          <nav className="relative z-10 flex-1 px-4 py-4 space-y-2">
            {SIDEBAR_LINKS.map(link => (
              <Link
                key={link.id}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:opacity-80"
                style={{ 
                  backgroundColor: link.id === 'dashboard' ? '#C8991A' : 'transparent',
                  color: link.id === 'dashboard' ? '#1A1A2E' : '#F5E6C8'
                }}
              >
                <span className="text-lg">{link.id === 'dashboard' ? '🏠' : link.id === 'roadmap' ? '🗺️' : link.id === 'vault' ? '📁' : link.id === 'cv' ? '📄' : link.id === 'reviews' ? '⭐' : link.id === 'mistakes' ? '⚠️' : link.id === 'biolock' ? '🔒' : '💰'}</span>
                <span style={{ fontFamily: 'var(--font-cairo)' }}>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="relative z-10 p-4 border-t" style={{ borderColor: '#0D6B6E' }}>
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
              className="w-full py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ border: '1px solid #C8991A', color: '#C8991A' }}
            >
              تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:mr-64 p-4 md:p-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-cairo)', color: '#1A1A2E' }}>
              أهلاً يا {userName}، إزيك النهارده؟
            </h1>
            <p className="mt-2 text-lg" style={{ color: '#1A1A2E', opacity: 0.7 }}>
             _ready for your career journey? Let's make progress today.
            </p>
          </div>

          {/* Overall Progress */}
          <div className="mb-8 p-6 rounded-lg bg-white shadow-md">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                جاهزيتك المهنية
              </h2>
              <span className="text-2xl font-bold" style={{ color: '#C8991A' }}>{readinessScore}%</span>
            </div>
            <div className="w-full h-4 rounded-full" style={{ backgroundColor: '#F5E6C8' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${readinessScore}%`, backgroundColor: '#C8991A' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm" style={{ color: '#1A1A2E', opacity: 0.6 }}>
              <span dir="rtl">SWOT</span>
              <span dir="rtl">Skills</span>
              <span dir="rtl">Tracks</span>
              <span dir="rtl">PoW</span>
            </div>
          </div>

          {/* Career Tracks */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
              مساراتك المهنية
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { key: 'primary', label: 'أساسي', track: selectedTracks[0] },
                { key: 'secondary', label: 'ثانوي', track: selectedTracks[1] },
                { key: 'tertiary', label: 'ثالث', track: selectedTracks[2] },
              ].map((item, idx) => {
                const trackInfo = CAREER_TRACKS.find(t => t.id === item.track)
                if (!trackInfo) {
                  return (
                    <div key={item.key} className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '2px dashed #E5E7EB' }}>
                      <p className="text-lg font-bold mb-2" style={{ color: '#1A1A2E', opacity: 0.5 }} dir="rtl">{item.label}</p>
                      <p className="text-sm" style={{ color: '#1A1A2E', opacity: 0.5 }}>لم يختار بع ye</p>
                    </div>
                  )
                }
                return (
                  <div key={item.key} className="p-6 rounded-lg shadow-md transition-all hover:scale-105">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-3xl">{trackInfo.icon}</span>
                      <span className="px-3 py-1 rounded text-xs font-bold" style={{ backgroundColor: trackInfo.color, color: '#FFFFFF' }}>
                        {item.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                      {trackInfo.titleAr}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: '#1A1A2E', opacity: 0.7 }} dir="rtl">{trackInfo.action}</p>
                    <div className="flex justify-center">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="4" fill="none" />
                          <circle cx="32" cy="32" r="28" stroke={trackInfo.color} strokeWidth="4" fill="none" 
                            strokeDasharray={`${(idx + 1) * 28} 176`} />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: trackInfo.color }}>
                          {Math.round((idx + 1) * 33)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Semester Missions */}
          <div className="mb-8 p-6 rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
              مهام الفصل الدراسي
            </h2>
            <div className="space-y-4">
              {getYearMissions().map((mission: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F5E6C8' }}>
                  <span className="text-2xl">{mission.type === 'internship' ? '💼' : mission.type === 'course' ? '📚' : '🎯'}</span>
                  <div className="flex-1">
                    <h3 className="font-bold" style={{ color: '#1A1A2E' }} dir="rtl">{mission.title}</h3>
                    <p className="text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }}>{mission.desc}</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg text-sm font-bold" style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}>
                    ابدأ
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Vacation Pulse */}
          <div className="mb-8 p-6 rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
              Vacation Pulse
            </h2>
            <p className="mb-4 text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }} dir="rtl">
              إيه اللي يعمله студенты летом؟
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {VACATION_PULSE.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: '#E5E7EB' }}>
                  <h3 className="font-bold" style={{ color: '#1A1A2E' }} dir="rtl">{item.title}</h3>
                  <p className="text-xs" style={{ color: '#0D6B6E' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Community Feed */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mistakes Archive */}
            <div className="p-6 rounded-lg bg-white shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                  أحدث الأخطاء
                </h2>
                <Link href="/mistakes" className="text-sm" style={{ color: '#0D6B6E' }}>كل الملفات →</Link>
              </div>
              <div className="space-y-3">
                {MOCK_COMMUNITY.mistakes.map(mistake => (
                  <div key={mistake.id} className="p-3 rounded-lg" style={{ backgroundColor: '#FEF3F3' }}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">⚠️</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm" style={{ color: '#1A1A2E' }} dir="rtl">{mistake.title}</p>
                        <div className="flex justify-between mt-2 text-xs" style={{ color: '#1A1A2E', opacity: 0.6 }}>
                          <span>by {mistake.author}</span>
                          <span>❤️ {mistake.upvotes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Reviews */}
            <div className="p-6 rounded-lg bg-white shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                  تقييمات الشركات
                </h2>
                <Link href="/reviews" className="text-sm" style={{ color: '#0D6B6E' }}>كل التقييمات →</Link>
              </div>
              <div className="space-y-3">
                {MOCK_COMMUNITY.reviews.map(review => (
                  <div key={review.id} className="p-3 rounded-lg" style={{ backgroundColor: '#F5E6C8' }}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold" style={{ color: '#1A1A2E' }}>{review.company}</h3>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ color: i < review.rating ? '#C8991A' : '#E5E7EB' }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#0D6B6E' }}>{review.salary} EGP</p>
                    <p className="text-xs mt-1" style={{ color: '#1A1A2E', opacity: 0.6 }}>{review.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
