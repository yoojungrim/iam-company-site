import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://iamminainstudio.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'IAM - Web Architecture',
  description: 'Web Architecture · Platforms · Security',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'IAM',
    description: 'Web Architecture · Platforms · Security',
    url: siteUrl,
    siteName: 'IAM',
    images: [
      {
        url: '/img/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IAM - Web Architecture',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IAM',
    description: 'Web Architecture · Platforms · Security',
    images: ['/img/og-image.png'],
  },
  verification: {
    google: 'c81e315ded240371',
    other: {
      'naver-site-verification': '3158eef9ac04eddd147d156601c22d1c85fa853d',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IAM',
    url: 'https://iamminainstudio.com',
    logo: 'https://iamminainstudio.com/img/og-image.png',
    sameAs: ['https://github.com/yoojungrim'],
    description: 'Web Architecture · Platforms · Security',
  }

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LanguageProvider>
          <Navigation />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
