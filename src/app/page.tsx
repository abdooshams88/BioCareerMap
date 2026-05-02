'use client'

import DirectionToggle from '@/components/DirectionToggle'
import ArabicBorder from '@/components/ArabicBorder'

export default function Home() {
  return (
    <div className="min-h-screen bg-papyrus">
      <DirectionToggle />

      {/* Made in Egypt Badge */}
      <div className="fixed top-4 left-4 z-50">
        <div
          className="px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
          style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
        >
          Made in Egypt 🇪🇬
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#1A1A2E' }}>
        {/* Animated Arabesque Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="arabesque-animation absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 5L68 25L90 25L72 38L78 58L60 46L42 58L48 38L30 25L52 25L60 5Z' fill='none' stroke='%23C8991A' stroke-width='1'/%3E%3Ccircle cx='60' cy='30' r='3' fill='%23C8991A' opacity='0.5'/%3E%3Cpath d='M30 60L38 80L60 80L42 93L48 113L30 101L12 113L18 93L0 80L22 80L30 60Z' fill='none' stroke='%230D6B6E' stroke-width='1'/%3E%3Cpath d='M90 60L98 80L120 80L102 93L108 113L90 101L72 113L78 93L60 80L82 80L90 60Z' fill='none' stroke='%230D6B6E' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Arabic Headline */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-cairo)', color: '#F5E6C8' }}
            dir="rtl"
          >
            خريطتك نحو المستقبل
          </h1>

          {/* English Subtitle */}
          <p className="text-xl md:text-2xl mb-4" style={{ color: '#F5E6C8', opacity: 0.9 }}>
            BioCareerMap — Egypt's First Career Engineering Platform for Biology Students
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto" style={{ color: '#FAFAF7', opacity: 0.8 }}>
            No wasta. No guesswork. Just a verified, structured path from your university seat to the global market.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/signup"
              className="px-8 py-4 rounded-lg text-lg font-bold transition-all hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
            >
              ابدأ رحلتك
            </a>
            <button
              onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-lg text-lg font-bold transition-all hover:scale-105"
              style={{
                border: '2px solid #C8991A',
                color: '#C8991A',
                backgroundColor: 'transparent'
              }}
            >
              اعرف أكتر
            </button>
          </div>
        </div>
      </section>

      {/* The Real Problem Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="container mx-auto max-w-6xl">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4"
            style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }}
            dir="rtl"
          >
            المشكلة الحقيقية
          </h2>
          <p className="text-center mb-12 text-lg" style={{ color: '#1A1A2E', opacity: 0.7 }}>
            The harsh reality facing Egyptian biology graduates
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Card 1 - Broken Chain */}
            <div className="rounded-lg p-8 shadow-md relative overflow-hidden" style={{ backgroundColor: '#F5E6C8' }}>
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#C8991A' }} />
              <div className="mb-6">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 24C8 15.163 15.163 8 24 8C27.496 8 30.8 9.203 33.332 11.332" stroke="#C8991A" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M40 24C40 32.837 32.837 40 24 40C20.504 40 17.2 38.797 14.668 36.668" stroke="#C8991A" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="24" cy="24" r="4" fill="#C8991A" opacity="0.3"/>
                  <rect x="22" y="12" width="4" height="24" rx="2" fill="#C8991A" opacity="0.5"/>
                  <path d="M20 20L28 28M28 20L20 28" stroke="#C8991A" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-6xl font-bold mb-3" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }}>64%</p>
              <p className="text-lg leading-relaxed" style={{ color: '#1A1A2E' }}>
                of Egyptian biology graduates work in fields completely unrelated to their degree.
              </p>
            </div>

            {/* Card 2 - Scale/Balance */}
            <div className="rounded-lg p-8 shadow-md relative overflow-hidden" style={{ backgroundColor: '#F5E6C8' }}>
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#C8991A' }} />
              <div className="mb-6">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 8V40" stroke="#C8991A" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M24 8L12 4M24 8L36 4" stroke="#C8991A" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M12 4L6 20L18 20L12 4Z" fill="#C8991A" opacity="0.3" stroke="#C8991A" strokeWidth="1.5"/>
                  <path d="M36 4L30 20L42 20L36 4Z" fill="#C8991A" opacity="0.3" stroke="#C8991A" strokeWidth="1.5"/>
                  <circle cx="12" cy="20" r="2" fill="#C8991A"/>
                  <circle cx="36" cy="20" r="2" fill="#C8991A"/>
                </svg>
              </div>
              <p className="text-6xl font-bold mb-3" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }}>87%</p>
              <p className="text-lg leading-relaxed" style={{ color: '#1A1A2E' }}>
                of Egyptian labs and companies say graduates lack practical, verifiable skills.
              </p>
            </div>

            {/* Card 3 - Compass */}
            <div className="rounded-lg p-8 shadow-md relative overflow-hidden" style={{ backgroundColor: '#F5E6C8' }}>
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#C8991A' }} />
              <div className="mb-6">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="16" stroke="#C8991A" strokeWidth="2.5"/>
                  <circle cx="24" cy="24" r="3" fill="#C8991A"/>
                  <path d="M24 8V16M24 32V40M8 24H16M32 24H40" stroke="#C8991A" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M24 8L27 16H21L24 8Z" fill="#C8991A" opacity="0.5"/>
                  <path d="M24 40L27 32H21L24 40Z" fill="#C8991A" opacity="0.5"/>
                  <path d="M8 24L16 27V21L8 24Z" fill="#C8991A" opacity="0.5"/>
                  <path d="M40 24L32 27V21L40 24Z" fill="#C8991A" opacity="0.5"/>
                </svg>
              </div>
              <p className="text-6xl font-bold mb-3" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }}>50%</p>
              <p className="text-lg leading-relaxed" style={{ color: '#1A1A2E' }}>
                of students choose their career path based on family pressure, not data.
              </p>
            </div>
          </div>

          {/* Bold Line */}
          <p
            className="text-center text-2xl md:text-3xl font-bold"
            style={{ color: '#0D6B6E', fontFamily: 'var(--font-cairo)' }}
          >
            BioCareerMap was built to fix all three.
          </p>
        </div>
      </section>

      <ArabicBorder color="#0D6B6E" />

      {/* Learn More Section */}
      <div id="learn-more">
        <ArabicBorder color="#C8991A" />

        {/* Features Section */}
        <section className="py-20 px-4" style={{ backgroundColor: '#FAFAF7' }}>
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12" style={{ color: '#0D6B6E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
              كيف نساعدك؟
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'خريطة المسار المهني',
                  titleEn: 'Career Path Mapping',
                  desc: 'Discover the exact steps from your current academic year to your dream biotech career.',
                },
                {
                  title: 'تقييم المهارات',
                  titleEn: 'Skill Assessment',
                  desc: 'SWOT analysis and skill grid to identify your strengths and areas for improvement.',
                },
                {
                  title: 'مجتمع المعرفة',
                  titleEn: 'Knowledge Community',
                  desc: 'Learn from others\' mistakes and share your journey with fellow biology students.',
                },
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-lg shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                    {item.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#C8991A' }}>{item.titleEn}</p>
                  <p style={{ color: '#1A1A2E', opacity: 0.8 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ArabicBorder color="#0D6B6E" />

        {/* Stats Section with Islamic Pattern */}
        <section className="py-20 px-4 islamic-star-pattern" style={{ backgroundColor: '#0D6B6E' }}>
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-12" style={{ color: '#F5E6C8', fontFamily: 'var(--font-cairo)' }}>
              انضم إلى ثورة التكنولوجيا الحيوية
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '1000+', label: 'طالب مسجل' },
                { number: '50+', label: 'مسار مهني' },
                { number: '200+', label: 'فرصة تدريب' },
                { number: '95%', label: 'معدل النجاح' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#C8991A' }}>{stat.number}</p>
                  <p style={{ color: '#F5E6C8' }} dir="rtl">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="container mx-auto px-4 text-center">
          <p style={{ color: '#F5E6C8' }}>© 2026 BioCareerMap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
