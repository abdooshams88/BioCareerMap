import DirectionToggle from '@/components/DirectionToggle'
import ArabicBorder from '@/components/ArabicBorder'

export default function Home() {
  return (
    <div className="min-h-screen bg-papyrus islamic-pattern">
      <DirectionToggle />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: '#0D6B6E', fontFamily: 'var(--font-bixie)' }}>
            BioCareerMap
          </h1>
          <p className="text-xl md:text-2xl mb-8" style={{ color: '#1A1A2E' }}>
            Navigate Your Biotechnology Career Path
          </p>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#1A1A2E', opacity: 0.8 }}>
            Discover opportunities, explore career trajectories, and unlock your potential in the life sciences industry.
          </p>
        </section>

        <ArabicBorder />

        {/* Color Palette Showcase */}
        <section className="my-16">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#0D6B6E' }}>
            Design System Colors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Primary', color: '#0D6B6E', label: 'Deep Nile Teal' },
              { name: 'Secondary', color: '#C8991A', label: 'Pharaonic Gold' },
              { name: 'Accent', color: '#F5E6C8', label: 'Desert Sand' },
              { name: 'Dark', color: '#1A1A2E', label: 'Deep Kohl' },
              { name: 'Success', color: '#4A7C59', label: 'Papyrus Green' },
              { name: 'Background', color: '#FAFAF7', label: 'Off-White Papyrus' },
            ].map((item) => (
              <div key={item.name} className="rounded-lg shadow-md overflow-hidden">
                <div
                  className="h-32 flex items-end p-4"
                  style={{ backgroundColor: item.color }}
                >
                  <span className="text-sm font-semibold" style={{ color: item.color === '#F5E6C8' || item.color === '#FAFAF7' ? '#1A1A2E' : '#FAFAF7' }}>
                    {item.label}
                  </span>
                </div>
                <div className="p-4" style={{ backgroundColor: '#FAFAF7' }}>
                  <p className="font-bold" style={{ color: '#1A1A2E' }}>{item.name}</p>
                  <p className="text-sm" style={{ color: '#1A1A2E', opacity: 0.6 }}>{item.color}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <ArabicBorder color="#0D6B6E" />

        {/* Typography Section */}
        <section className="my-16">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#0D6B6E' }}>
            Typography
          </h2>
          <div className="space-y-6" style={{ backgroundColor: '#FAFAF7' }} className="p-8 rounded-lg">
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#C8991A' }}>BIXIE Font (Arabic-Inspired)</h3>
              <p className="text-4xl" style={{ fontFamily: 'var(--font-bixie)', color: '#1A1A2E' }}>
                BioCareerMap - بيوكير ماب
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#C8991A' }}>Cairo Font (Google Fonts)</h3>
              <p className="text-4xl" style={{ fontFamily: 'var(--font-cairo)', color: '#1A1A2E' }}>
                BioCareerMap - بيوكير ماب
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#C8991A' }}>Body Text</h3>
              <p style={{ fontFamily: 'var(--font-cairo)', color: '#1A1A2E' }}>
                The biotechnology industry offers diverse career opportunities across research, development, manufacturing, and commercial roles. Explore your path today.
              </p>
              <p className="mt-2" style={{ fontFamily: 'var(--font-cairo)', color: '#1A1A2E' }} dir="rtl">
                تقدم صناعة التكنولوجيا الحيوية فرصًا مهنية متنوعة في مجالات البحث والتطوير والتصنيع والأدوار التجارية. استكشف مسارك اليوم.
              </p>
            </div>
          </div>
        </section>

        <ArabicBorder />

        {/* Islamic Pattern Demo */}
        <section className="my-16 p-12 rounded-lg islamic-star-pattern" style={{ backgroundColor: '#0D6B6E' }}>
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: '#F5E6C8' }}>
            Islamic Geometric Pattern
          </h2>
          <p className="text-center" style={{ color: '#FAFAF7' }}>
            Subtle arabesque patterns inspired by Islamic architecture
          </p>
        </section>

        {/* Sample Cards */}
        <section className="my-16">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#0D6B6E' }}>
            Sample Components
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#FAFAF7', borderLeft: '4px solid #0D6B6E' }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A2E' }}>Research Scientist</h3>
              <p style={{ color: '#1A1A2E', opacity: 0.8 }}>Conduct experiments and analyze data to advance biotech innovations.</p>
            </div>
            <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#FAFAF7', borderLeft: '4px solid #C8991A' }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A2E' }}>Lab Manager</h3>
              <p style={{ color: '#1A1A2E', opacity: 0.8 }}>Oversee laboratory operations and ensure compliance with regulations.</p>
            </div>
            <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#FAFAF7', borderLeft: '4px solid #4A7C59' }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A2E' }}>Bioinformatics Analyst</h3>
              <p style={{ color: '#1A1A2E', opacity: 0.8 }}>Use computational tools to analyze biological data and genomic sequences.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="container mx-auto px-4 text-center">
          <p style={{ color: '#F5E6C8' }}>© 2026 BioCareerMap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
