import Link from 'next/link'

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/biocareermap',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.301c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/biocareermap',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1-2.063-2.065 2.064 2.064 0 0 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/biocareermap',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.849 0-3.204.012-3.584.069-4.849.148-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 3.662a8.338 8.338 0 1 0 0 16.676 8.339 8.339 0 0 0 0-16.676zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'X/Twitter',
    href: 'https://x.com/biocareermap',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

const quickLinks = [
  { label: 'Home', labelAr: 'الرئيسية', href: '/' },
  { label: 'Features', labelAr: 'الميزات', href: '/#features' },
  { label: 'Community', labelAr: 'المجتمع', href: '/community' },
  { label: 'About', labelAr: 'عن الموقع', href: '/about' },
  { label: 'Login', labelAr: 'تسجيل الدخول', href: '/login' },
  { label: 'Sign Up', labelAr: 'سجل الآن', href: '/signup' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A1A2E' }}>
      {/* Pharaonic Gold decorative line */}
      <div className="h-1" style={{ backgroundColor: '#C8991A' }} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Column */}
          <div>
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-cairo)', color: '#F5E6C8' }}
              dir="rtl"
            >
              عن BioCareerMap
            </h3>
            <p className="mb-4" style={{ color: '#FAFAF7', opacity: 0.8 }}>
              Egypt's first career engineering platform for biology students. We provide a verified, structured path from your university seat to the global biotech market.
            </p>
            <p className="text-sm" style={{ color: '#FAFAF7', opacity: 0.6 }}>
              No wasta. No guesswork. Just results.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-cairo)', color: '#F5E6C8' }}
              dir="rtl"
            >
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:opacity-80"
                    style={{ color: '#FAFAF7', opacity: 0.8 }}
                  >
                    {link.labelAr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-cairo)', color: '#F5E6C8' }}
              dir="rtl"
            >
              تواصل معنا
            </h3>
            <div className="space-y-3" style={{ color: '#FAFAF7', opacity: 0.8 }}>
              <p>Email: info@biocareermap.com</p>
              <p>Phone: +20 123 456 7890</p>
              <p dir="rtl">القاهرة، مصر</p>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 py-6 border-t border-b" style={{ borderColor: 'rgba(245, 230, 200, 0.2)' }}>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:scale-110 hover:opacity-80"
              style={{ color: '#F5E6C8' }}
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 text-center">
          <p style={{ color: '#F5E6C8', fontFamily: 'var(--font-cairo)' }} dir="rtl">
            صُنع بـ ❤️ في مصر
          </p>
          <p className="text-sm mt-2" style={{ color: '#FAFAF7', opacity: 0.6 }}>
            © 2026 BioCareerMap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
