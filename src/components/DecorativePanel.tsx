'use client'

export default function DecorativePanel({ titleAr, titleEn }: { titleAr: string; titleEn: string }) {
  return (
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
            {titleAr}
          </h1>
          {titleEn && (
            <p className="text-xl" style={{ color: '#F5E6C8', opacity: 0.8 }}>
              {titleEn}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
