'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface AchievementType {
  id: string
  label: string
  labelEn: string
  color: string
  icon: string
}

const ACHIEVEMENT_TYPES: AchievementType[] = [
  { id: 'internship', label: 'تدريب', labelEn: 'Internship', color: '#0D6B6E', icon: '💼' },
  { id: 'course', label: 'دورة', labelEn: 'Course', color: '#C8991A', icon: '📚' },
  { id: 'research', label: 'بحث', labelEn: 'Research', color: '#6B5B95', icon: '🔬' },
  { id: 'certificate', label: 'شهادة', labelEn: 'Certificate', color: '#228B22', icon: '🏆' },
  { id: 'lab_report', label: 'تقرير معمل', labelEn: 'Lab Report', color: '#2E86AB', icon: '🧪' },
  { id: 'project', label: 'مشروع', labelEn: 'Project', color: '#F18F01', icon: '🚀' },
]

function generateVerificationCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function Vault() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    organization: '',
    supervisor: '',
    achievement_date: '',
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.push('/login')
      return
    }

    setUser(authUser)

    const { data } = await supabase
      .from('pow_vault')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })

    setAchievements(data || [])
    setLoading(false)
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  async function uploadFile(file: File): Promise<string | null> {
    if (!user) return null

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('pow-vault')
      .upload(fileName, file)

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('pow-vault')
      .getPublicUrl(fileName)

    return publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      let uploadUrl = null
      if (uploadedFile) {
        setUploading(true)
        uploadUrl = await uploadFile(uploadedFile)
        setUploading(false)
      }

      const verificationCode = generateVerificationCode()

      const { error } = await supabase.from('pow_vault').insert({
        user_id: user.id,
        title: formData.title,
        type: formData.type,
        description: formData.description,
        organization: formData.organization,
        supervisor: formData.supervisor,
        achievement_date: formData.achievement_date || null,
        upload_url: uploadUrl,
        verification_code: verificationCode,
        verified: false,
      })

      if (error) throw error

      setFormData({
        title: '',
        type: '',
        description: '',
        organization: '',
        supervisor: '',
        achievement_date: '',
      })
      setUploadedFile(null)
      setShowForm(false)
      loadData()
    } catch (err) {
      console.error('Error saving:', err)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  async function deleteAchievement(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الإنجاز؟')) return

    const { error } = await supabase.from('pow_vault').delete().eq('id', id)
    if (!error) {
      loadData()
    }
  }

  function copyVerificationLink(code: string) {
    const link = `${window.location.origin}/verify/${code}`
    navigator.clipboard.writeText(link)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  function getVaultStrength(): number {
    if (achievements.length === 0) return 0
    const verified = achievements.filter((a: any) => a.verified).length
    return Math.round((verified / achievements.length) * 100)
  }

  const vaultStrength = getVaultStrength()

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
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-cairo)', color: '#1A1A2E' }}>
                خزنة إنجازاتك 🔒
              </h1>
              <p className="mt-2" style={{ color: '#1A1A2E', opacity: 0.7 }}>
                كل إنجازك موثق ومُ verify هنا
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
            >
              {showForm ? 'إلغاء' : '+ أضف إنجاز جديد'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl p-4 md:p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }} dir="rtl">إجمالي الإنجازات</p>
            <p className="text-4xl font-bold" style={{ color: '#0D6B6E' }}>{achievements.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }} dir="rtl">إنجازات موثقة</p>
            <p className="text-4xl font-bold" style={{ color: '#22C55E' }}>
              {achievements.filter((a: any) => a.verified).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }} dir="rtl">قوة الخزنة</p>
            <div className="flex items-center gap-3">
              <p className="text-4xl font-bold" style={{ color: '#C8991A' }}>{vaultStrength}%</p>
              <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: '#F5E6C8' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${vaultStrength}%`, backgroundColor: '#C8991A' }}
                />
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
              إضافة إنجاز جديد
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">عنوان الإنجاز *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                    style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                    placeholder="تدريب في معمل شركة أدوية"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">النوع *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                    style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF', color: '#1A1A2E' }}
                    dir="rtl"
                  >
                    <option value="">اختر النوع</option>
                    {ACHIEVEMENT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                  placeholder="وصف ما تعلمته أو أنجزته..."
                  dir="rtl"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">الجهة/الشركة</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                    style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                    placeholder="شركة أدوية مصر"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">المشرف</label>
                  <input
                    type="text"
                    value={formData.supervisor}
                    onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                    style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                    placeholder="د.أحمد محمد"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">التاريخ</label>
                  <input
                    type="date"
                    value={formData.achievement_date}
                    onChange={(e) => setFormData({ ...formData, achievement_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                    style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">إثبات (ملف PDF أو صورة)</label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: '#C8991A' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <span style={{ color: '#1A1A2E' }}>{uploadedFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm"
                      style={{ color: '#0D6B6E' }}
                    >
                      اضغط لرفع ملف
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
                >
                  {saving ? (uploading ? '...جاري رفع الملف' : '...جاري الحفظ') : 'حفظ الإنجاز'}
                </button>
              </div>
            </form>
          </div>
        )}

        {achievements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">📁</p>
            <p className="text-xl" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
              خزنتك فاضية
            </p>
            <p className="mt-2" style={{ color: '#1A1A2E', opacity: 0.7 }}>
              أضف أول إنجازك للبدء
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement: any) => {
              const typeInfo = ACHIEVEMENT_TYPES.find(t => t.id === achievement.type)

              return (
                <div key={achievement.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {achievement.upload_url && (
                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                      <span className="text-4xl">📄</span>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-bold"
                        style={{ backgroundColor: typeInfo?.color || '#666', color: '#FFFFFF' }}
                      >
                        {typeInfo?.icon} {typeInfo?.label}
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs font-bold"
                        style={{
                          backgroundColor: achievement.verified ? '#DCFCE7' : '#FEF3C7',
                          color: achievement.verified ? '#22C55E' : '#F59E0B'
                        }}
                      >
                        {achievement.verified ? 'موثق' : 'قيد الانتظار'}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                      {achievement.title}
                    </h3>

                    {achievement.organization && (
                      <p className="text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }} dir="rtl">
                        {achievement.organization}
                      </p>
                    )}

                    {achievement.achievement_date && (
                      <p className="text-xs mt-2" style={{ color: '#0D6B6E' }}>
                        {new Date(achievement.achievement_date).toLocaleDateString('ar-EG')}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => copyVerificationLink(achievement.verification_code)}
                          className="text-xs"
                          style={{ color: '#0D6B6E' }}
                        >
                          {copiedCode === achievement.verification_code ? '✅ تم النسخ!' : '📋 نسخ رابط التحقق'}
                        </button>
                        <button
                          onClick={() => deleteAchievement(achievement.id)}
                          className="text-xs text-red-500"
                        >
                          حذف
                        </button>
                      </div>
                      <Link
                        href={`/verify/${achievement.verification_code}`}
                        className="text-xs block mt-1 truncate"
                        style={{ color: '#1A1A2E', opacity: 0.5 }}
                      >
                        biocareermap.com/verify/{achievement.verification_code}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}