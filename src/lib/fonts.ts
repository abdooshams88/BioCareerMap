import localFont from 'next/font/local'

export const bixie = localFont({
  src: [
    {
      path: '../../public/fonts/bixie-regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-bixie',
  display: 'swap',
})
