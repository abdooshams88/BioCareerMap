'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function DirectionToggle() {
  const pathname = usePathname()
  const router = useRouter()

  const toggleDirection = () => {
    const html = document.documentElement
    const currentDir = html.dir || 'ltr'
    const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr'
    const newLang = newDir === 'rtl' ? 'ar' : 'en'

    html.dir = newDir
    html.lang = newLang

    document.body.classList.toggle('rtl', newDir === 'rtl')
  }

  return (
    <button
      onClick={toggleDirection}
      className="fixed top-4 right-4 z-50 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
      style={{ backgroundColor: '#0D6B6E' }}
    >
      Toggle RTL/LTR
    </button>
  )
}
