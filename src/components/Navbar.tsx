'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isArabic, setIsArabic] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLanguage = () => {
    const newIsArabic = !isArabic
    setIsArabic(newIsArabic)
    const html = document.documentElement
    html.dir = newIsArabic ? 'rtl' : 'ltr'
    html.lang = newIsArabic ? 'ar' : 'en'
  }

  const navLinks = [
    { label: 'Home', labelAr: 'الرئيسية', href: '/' },
    { label: 'Features', labelAr: 'الميزات', href: '/#features' },
    { label: 'Community', labelAr: 'المجتمع', href: '/community' },
    { label: 'About', labelAr: 'عن الموقع', href: '/about' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: 'var(--font-cairo)', color: '#0D6B6E' }}
              dir="ltr"
            >
              BioCareerMap
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium transition-colors hover:opacity-70"
                style={{ color: '#1A1A2E' }}
              >
                {isArabic ? link.labelAr : link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:opacity-80"
              style={{ border: '1px solid #0D6B6E', color: '#0D6B6E' }}
            >
              {isArabic ? 'English' : 'العربية'}
            </button>
            <Link
              href="/login"
              className="font-medium transition-colors hover:opacity-70"
              style={{ color: '#1A1A2E' }}
            >
              {isArabic ? 'تسجيل الدخول' : 'Login'}
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
            >
              {isArabic ? 'سجل الآن' : 'Sign Up'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md"
            style={{ color: '#1A1A2E' }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18" strokeLinecap="round" />
                <path d="M6 6L18 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18" strokeLinecap="round" />
                <path d="M3 6h18" strokeLinecap="round" />
                <path d="M3 18h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t" style={{ borderColor: '#F5E6C8' }}>
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 font-medium"
                  style={{ color: '#1A1A2E' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {isArabic ? link.labelAr : link.label}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-3" style={{ borderColor: '#F5E6C8' }}>
                <button
                  onClick={() => {
                    toggleLanguage()
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 font-medium"
                  style={{ color: '#0D6B6E' }}
                >
                  {isArabic ? 'English' : 'العربية'}
                </button>
                <Link
                  href="/login"
                  className="block py-2 font-medium"
                  style={{ color: '#1A1A2E' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {isArabic ? 'تسجيل الدخول' : 'Login'}
                </Link>
                <Link
                  href="/signup"
                  className="block text-center py-3 rounded-lg text-sm font-bold"
                  style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {isArabic ? 'سجل الآن' : 'Sign Up'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
