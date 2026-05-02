export const colors = {
  primary: '#0D6B6E',
  secondary: '#C8991A',
  accent: '#F5E6C8',
  dark: '#1A1A2E',
  success: '#4A7C59',
  background: '#FAFAF7',
  foreground: '#1A1A2E',
} as const

export const fonts = {
  bixie: 'var(--font-bixie)',
  cairo: 'var(--font-cairo)',
} as const

export const rtlLanguages = ['ar', 'he', 'fa', 'ur'] as const

export function isRTL(locale: string): boolean {
  return rtlLanguages.includes(locale as any)
}

export const theme = {
  colors,
  fonts,
  isRTL,
} as const
