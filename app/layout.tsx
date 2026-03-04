import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'

export const metadata: Metadata = {
  title: 'IAM - Web Architecture',
  description: 'Web Architecture · Platforms · Security',
  openGraph: {
    title: 'IAM',
    description: 'Web Architecture · Platforms · Security',
    images: ['/img/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <LanguageProvider>
          <Navigation />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
