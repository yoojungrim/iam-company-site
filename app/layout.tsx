import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Navigation from '@/components/Navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://iamminainstudio.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'IAM - Web Architecture',
  description: 'Web Architecture · Platforms · Security',
  icons: {
    icon: [
      { url: '/img/faviconian11.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/faviconian11.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/img/faviconian11.png',
  },
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
        url: `${siteUrl}/img/og-image.png?v=2`,
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
    images: [`${siteUrl}/img/og-image.png?v=2`],
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

  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
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
