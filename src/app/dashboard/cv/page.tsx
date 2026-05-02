'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1A1A2E',
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#0D6B6E',
    marginBottom: 8,
  },
  contact: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0D6B6E',
    borderBottom: '1px solid #0D6B6E',
    paddingBottom: 4,
    marginBottom: 8,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  company: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  role: {
    fontSize: 10,
    color: '#666',
  },
  date: {
    fontSize: 9,
    color: '#888',
  },
  bullet: {
    flexDirection: 'row',
    marginTop: 2,
  },
  bulletPoint: {
    width: 10,
  },
  bulletText: {
    fontSize: 10,
    flex: 1,
  },
})

function CVPDF({ data }: { data: any }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.name}>{data.fullName}</Text>
          <Text style={pdfStyles.title}>{data.title}</Text>
          <Text style={pdfStyles.contact}>
            {data.email} | {data.phone} | {data.linkedin}
          </Text>
        </View>

        {data.summary && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Professional Summary</Text>
            <Text style={pdfStyles.summary}>{data.summary}</Text>
          </View>
        )}

        {data.experience.length > 0 && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Professional Experience</Text>
            {data.experience.map((exp: any, idx: number) => (
              <View key={idx} style={pdfStyles.experienceItem}>
                <View style={pdfStyles.experienceHeader}>
                  <Text style={pdfStyles.company}>{exp.title}</Text>
                  <Text style={pdfStyles.date}>{exp.date}</Text>
                </View>
                <Text style={pdfStyles.role}>{exp.organization}</Text>
                {exp.description && (
                  <View style={pdfStyles.bullet}>
                    <Text style={pdfStyles.bulletPoint}>-</Text>
                    <Text style={pdfStyles.bulletText}>{exp.description}</Text>
                  </View>
                )}
                {exp.verificationLink && (
                  <View style={pdfStyles.bullet}>
                    <Text style={pdfStyles.bulletPoint}>-</Text>
                    <Text style={pdfStyles.bulletText}>Verified: {exp.verificationLink}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {data.skills.length > 0 && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Skills</Text>
            <Text style={pdfStyles.summary}>{data.skills.join(' | ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

export default function CVBuilder() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [cvData, setCvData] = useState({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    linkedin: '',
    summary: '',
    experience: [] as any[],
    education: [] as any[],
    skills: [] as string[],
  })

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

    if (userData) {
      setCvData(prev => ({
        ...prev,
        fullName: userData.full_name || '',
        email: userData.email || '',
      }))
    }

    if (powData && powData.length > 0) {
      const expData = powData.map((a: any) => ({
        title: a.title,
        type: a.type,
        organization: a.organization || '',
        date: a.achievement_date ? new Date(a.achievement_date).toLocaleDateString('en-GB') : '',
        description: a.description || '',
        verificationLink: a.verification_code ? `biocareermap.com/verify/${a.verification_code}` : '',
      }))

      setCvData(prev => ({ ...prev, experience: expData }))
    }

    if (profileData?.skill_grid) {
      const skills = Object.keys(profileData.skill_grid)
        .filter(s => profileData.skill_grid[s] !== 'none' && profileData.skill_grid[s] !== 'heard')
        .slice(0, 10)
      setCvData(prev => ({ ...prev, skills }))
    }

    setProfile(profileData)
    setAchievements(powData || [])
    setLoading(false)
  }

  function generateSmartSummary() {
    if (!profile) {
      alert('Complete your profile first')
      return
    }

    const swot = profile.swot_results || {}
    const tracks = profile.career_tracks || []

    let strengths = ''
    const strengthsArr: string[] = []
    if (swot.strengths && typeof swot.strengths === 'object') {
      Object.entries(swot.strengths as Record<string, string>).forEach(([key, val]) => {
        if (val === 'stronglyagree' || val === 'agree') {
          strengthsArr.push(key)
        }
      })
    }
    if (strengthsArr.length > 0) {
      strengths = strengthsArr.slice(0, 2).join(' and ')
    }

    const trackNames = tracks.slice(0, 2).join(' and ')

    const careers: Record<string, string> = {
      academia: 'research and academia',
      sales: 'medical sales and pharma',
      qc: 'quality control',
      lab: 'laboratory technician',
      bioinfo: 'bioinformatics',
      startup: 'biotech entrepreneurship',
      writing: 'scientific writing',
      foodsafety: 'food safety',
      publichealth: 'public health',
      environment: 'environmental biology',
      genetic: 'genetic counseling',
      veterinary: 'veterinary sciences',
    }

    const careerArea = trackNames
      .split(',')
      .map(t => careers[t.trim()] || 'biology')
      .join(' and ') || 'the biotechnology sector'

    const summary = `Dedicated biology graduate with ${strengths || 'strong academic foundation'} seeking to contribute to ${careerArea}. Demonstrated commitment to continuous learning and professional growth through practical experience and hands-on projects.`

    setCvData(prev => ({ ...prev, summary }))
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      const blob = await pdf(<CVPDF data={cvData} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${cvData.fullName.replace(/\s+/g, '_')}_CV.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF generation error:', err)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="animate-pulse text-2xl" style={{ fontFamily: 'var(--font-cairo)', color: '#0D6B6E' }} dir="rtl">
          ...جاري التحميل
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }} dir="rtl">
      <div className="bg-white shadow-md p-4 md:p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-cairo)', color: '#1A1A2E' }}>
                CV بكليك واحد
              </h1>
              <p className="mt-2" style={{ color: '#1A1A2E', opacity: 0.7 }}>
                انشئ سيرتك الذاتية الاحترافية بالذكاء الاصطناعي
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateSmartSummary}
                className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
                style={{ border: '2px solid #0D6B6E', color: '#0D6B6E' }}
              >
                ملخص ذكي
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-6 py-2 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
              >
                {downloading ? '...جاري التحميل' : 'تحميل PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl p-4 md:p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                المعلومات الشخصية
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">الاسم الكامل</label>
                  <input
                    type="text"
                    value={cvData.fullName}
                    onChange={(e) => setCvData({ ...cvData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                    style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">المسمى الوظيفي</label>
                  <input
                    type="text"
                    value={cvData.title}
                    onChange={(e) => setCvData({ ...cvData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                    style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                    dir="rtl"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">البريد الإلكتروني</label>
                    <input type="email" value={cvData.email} onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                    style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">LinkedIn</label>
                    <input type="text" value={cvData.linkedin} onChange={(e) => setCvData({ ...cvData, linkedin: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                    style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                الملخص المهني
              </h2>
              <textarea
                value={cvData.summary}
                onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                placeholder="ملخص احترافي..."
                dir="rtl"
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                الإنجازات والخبرات
              </h2>
              {cvData.experience.length === 0 ? (
                <p className="text-sm" style={{ color: '#1A1A2E', opacity: 0.6 }}>لا توجد إنجازات</p>
              ) : (
                <div className="space-y-3">
                  {cvData.experience.map((exp, idx) => (
                    <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: '#F5E6C8' }}>
                      <h3 className="font-bold" style={{ color: '#1A1A2E' }} dir="rtl">{exp.title}</h3>
                      <p className="text-sm" style={{ color: '#0D6B6E' }}>{exp.organization}</p>
                      {exp.verificationLink && (
                        <p className="text-xs mt-1" style={{ color: '#0D6B6E' }}>Verified: {exp.verificationLink}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">المهارات</h2>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#0D6B6E', color: '#FFFFFF' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-lg p-8" style={{ minHeight: '700px' }}>
                <div className="border-b-2 pb-4 mb-4" style={{ borderColor: '#0D6B6E' }}>
                  <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>{cvData.fullName || 'Your Name'}</h2>
                  <p className="text-lg" style={{ color: '#0D6B6E' }}>{cvData.title || 'Professional Title'}</p>
                  <p className="text-xs mt-2" style={{ color: '#666' }}>{cvData.email} | {cvData.linkedin}</p>
                </div>

                {cvData.summary && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold mb-2" style={{ color: '#0D6B6E' }}>Professional Summary</h3>
                    <p className="text-sm" style={{ color: '#1A1A2E', lineHeight: 1.6 }}>{cvData.summary}</p>
                  </div>
                )}

                {cvData.experience.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold mb-2" style={{ color: '#0D6B6E', borderBottom: '1px solid #0D6B6E', paddingBottom: 4 }}>Professional Experience</h3>
                    {cvData.experience.map((exp, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="flex justify-between">
                          <span className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{exp.title}</span>
                          <span className="text-xs" style={{ color: '#888' }}>{exp.date}</span>
                        </div>
                        <p className="text-xs" style={{ color: '#666' }}>{exp.organization}</p>
                        {exp.verificationLink && <p className="text-xs mt-1" style={{ color: '#0D6B6E' }}>Verified: {exp.verificationLink}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {cvData.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold mb-2" style={{ color: '#0D6B6E', borderBottom: '1px solid #0D6B6E', paddingBottom: 4 }}>Skills</h3>
                    <p className="text-sm" style={{ color: '#1A1A2E' }}>{cvData.skills.join(' | ')}</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-center mt-4" style={{ color: '#1A1A2E', opacity: 0.5 }}>Generated by BioCareerMap | ATS-Optimized</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}