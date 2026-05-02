'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) throw signInError

      if (data.user) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first')
      return
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) throw resetError
      alert('Password reset email sent! Check your inbox.')
    } catch (err) {
      setError(err.message || 'An error occurred')
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
              مرحباً بعودتك
            </h1>
            <p className="text-xl" style={{ color: '#F5E6C8', opacity: 0.8 }}>
              Welcome Back
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
              تسجيل الدخول
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }}>
              ادخل إلى حسابك واكمل رحلتك المهنية
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-md text-sm" style={{ backgroundColor: '#fee', color: '#c00' }}>
                {error}
              </div>
            )}

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
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none"
                style={{ borderColor: '#C8991A', backgroundColor: '#FFFFFF' }}
              />
            </div>

            {/* Forgot Password */}
            <div className="text-left">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium hover:opacity-80"
                style={{ color: '#0D6B6E' }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg text-lg font-bold transition-all hover:opacity-90 hover:scale-105 disabled:opacity-50"
              style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
            >
              {loading ? 'جاري الدخول...' : 'ادخل'}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }} dir="rtl">
            مش عندك حساب؟{' '}
            <Link href="/signup" className="font-medium hover:opacity-80" style={{ color: '#0D6B6E' }}>
              سجل الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
