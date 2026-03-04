import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'

export const metadata: Metadata = {
  title: 'IAM - Web Architecture · Platforms · Security',
  description: 'IAM is a Web Architecture & Security-focused technology studio specializing in Web Development, Full-Stack Engineering, Multi-Platform solutions, Python & AI Development, and Security & Penetration Testing.',
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
