'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const egyptianUniversities = [
  'Ain Shams University',
  'Alexandria University',
  'Assiut University',
  'Benha University',
  'Beni-Suef University',
  'Cairo University',
  'Damanhour University',
  'Egypt-Japan University of Science and Technology',
  'Fayoum University',
  'Helwan University',
  'Kafrelsheikh University',
  'Mansoura University',
  'Menoufia University',
  'Minia University',
  'October 6 University',
  'Port Said University',
  'Suez Canal University',
  'Tanta University',
  'Zagazig University',
  'American University in Cairo',
  'British University in Egypt',
  'German University in Cairo',
  'Misr University for Science and Technology',
  'Nahda University',
  'Future University in Egypt',
  'Other',
]

const yearsOfStudy = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Graduate',
]

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullNameAr: '',
    fullNameEn: '',
    university: '',
    yearOfStudy: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!agreeTerms) {
      setError('You must agree to maintain academic honesty')
      return
    }

    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullNameEn,
            full_name_ar: formData.fullNameAr,
            university: formData.university,
            year_of_study: formData.yearOfStudy,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: formData.email,
          full_name: formData.fullNameEn,
          university: formData.university,
          year_of_study: formData.yearOfStudy,
        })
      }

      router.push('/onboarding')
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#0D6B6E' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="arabesque-animation absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 5L68 25L90 25L72 38L78 58L60 46L42 58L48 38L30 25L52 25L60 5Z' fill='none' stroke='%23C8991A' stroke-width='1'/%3E%3Ccircle cx='60' cy='30' r='3' fill='%23C8991A' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
          }} />
        </div>
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center px-8">
            <h1
              className="text-6xl md:text-8xl font-bold mb-4"
              style={{
                fontFamily: 'var(--font-cairo)',
                color: '#F5E6C8',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
              dir="rtl"
            >
              بداية الطريق
            </h1>
            <p className="text-xl" style={{ color: '#F5E6C8', opacity: 0.8 }}>
              The Beginning of the Road
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2
              className="text-3xl font-bold"
              style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }}
              dir="rtl"
            >
              سجل حساب جديد
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }}>
              This platform is exclusively for Egyptian biology and bioscience students
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-md text-sm" style={{ backgroundColor: '#fee', color: '#c00' }}>
                {error}
              </div>
            )}

            {/* Name Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="fullNameAr" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">
                  الاسم بالعربية
                </label>
                <input
                  id="fullNameAr"
                  name="fullNameAr"
                  type="text"
                  required
                  value={formData.fullNameAr}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                  placeholder="محمد أحمد"
                  dir="rtl"
                />
              </div>
              <div>
                <label htmlFor="fullNameEn" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }}>
                  Full Name (English)
                </label>
                <input
                  id="fullNameEn"
                  name="fullNameEn"
                  type="text"
                  required
                  value={formData.fullNameEn}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                  placeholder="Mohamed Ahmed"
                />
              </div>
            </div>

            {/* University */}
            <div>
              <label htmlFor="university" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">
                الجامعة
              </label>
              <select
                id="university"
                name="university"
                required
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF', color: '#1A1A2E' }}
                dir="rtl"
              >
                <option value="">اختر جامعتك</option>
                {egyptianUniversities.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>

            {/* Year of Study */}
            <div>
              <label htmlFor="yearOfStudy" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }} dir="rtl">
                سنة الدراسة
              </label>
              <select
                id="yearOfStudy"
                name="yearOfStudy"
                required
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF', color: '#1A1A2E' }}
                dir="rtl"
              >
                <option value="">اختر السنة الدراسية</option>
                {yearsOfStudy.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                id="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded"
                style={{ accentColor: '#C8991A' }}
              />
              <label htmlFor="agreeTerms" className="text-sm" style={{ color: '#1A1A2E', opacity: 0.8 }}>
                I agree to maintain academic honesty — false information will result in permanent account removal
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg text-lg font-bold transition-all hover:opacity-90 hover:scale-105 disabled:opacity-50"
              style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
            >
              {loading ? 'جاري التسجيل...' : 'أنشئ حسابك'}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium hover:opacity-80" style={{ color: '#0D6B6E' }}>
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
