'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const services = {
  ko: [
    {
      title: '웹 개발',
      subtitle: '반응형 웹앱스 & 웹 서비스',
      description: '현대적인 아키텍처와 확장 가능한 인프라로 구축된 맞춤형 웹 애플리케이션.',
      icon: 'web',
    },
    {
      title: '풀스택 엔지니어링',
      subtitle: '프론트엔드부터 백엔드까지',
      description: '프론트엔드 인터페이스부터 백엔드 시스템 및 데이터베이스까지 종단간 개발.',
      icon: 'fullstack',
    },
    {
      title: '웹빌더 기반 구축',
      subtitle: '다양한 플랫폼 기반 서비스',
      description: '임웹, 카페24, Wix, Shopify, WordPress 통합 및 맞춤형 개발.',
      icon: 'platform',
    },
    {
      title: 'Python & AI 개발',
      subtitle: 'AI 모델 개발 및 데이터 분석',
      description: '데이터 처리, 머신러닝 모델 및 AI 기반 애플리케이션 개발.',
      icon: 'ai',
    },
    {
      title: '보안 & 침투 테스트',
      subtitle: '모의 해킹 및 취약점 분석',
      description: '웹 애플리케이션에 대한 포괄적인 보안 감사 및 취약점 평가.',
      icon: 'security',
    },
  ],
  en: [
    {
      title: 'Web Development',
      subtitle: 'Responsive web apps & web services',
      description: 'Custom web applications built with modern architecture and scalable infrastructure.',
      icon: 'web',
    },
    {
      title: 'Full-Stack Engineering',
      subtitle: 'From frontend to backend',
      description: 'End-to-end development from frontend interfaces to backend systems and databases.',
      icon: 'fullstack',
    },
    {
      title: 'Web Builder Based Construction',
      subtitle: 'Building services on various platforms',
      description: 'Imweb, Cafe24, Wix, Shopify, WordPress integration and custom development.',
      icon: 'platform',
    },
    {
      title: 'Python & AI Development',
      subtitle: 'AI model development and data analysis',
      description: 'Data processing, machine learning models, and AI-powered application development.',
      icon: 'ai',
    },
    {
      title: 'Security & Pen-Testing',
      subtitle: 'Vulnerability assessment and penetration testing',
      description: 'Comprehensive security audits and vulnerability assessments for web applications.',
      icon: 'security',
    },
  ],
}

// 아이콘 컴포넌트
function ServiceIcon({ type, color = '#d1d5db' }: { type: string; color?: string }) {
  switch (type) {
    case 'web':
      return (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 64 64" stroke={color} style={{ color }}>
          <rect x="8" y="12" width="48" height="36" rx="2" strokeWidth="2" />
          <line x1="8" y1="20" x2="56" y2="20" strokeWidth="2" />
          <circle cx="14" cy="16" r="1.5" fill="currentColor" />
          <circle cx="20" cy="16" r="1.5" fill="currentColor" />
          <text x="32" y="38" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.6">&lt;/&gt;</text>
        </svg>
      )
    case 'fullstack':
      return (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 64 64" stroke={color} style={{ color }}>
          <circle cx="32" cy="20" r="8" strokeWidth="2" />
          <circle cx="20" cy="40" r="6" strokeWidth="2" />
          <circle cx="44" cy="40" r="6" strokeWidth="2" />
          <rect x="18" y="50" width="28" height="8" rx="1" strokeWidth="2" />
          <line x1="32" y1="28" x2="20" y2="34" strokeWidth="2" />
          <line x1="32" y1="28" x2="44" y2="34" strokeWidth="2" />
        </svg>
      )
    case 'platform':
      return (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 64 64" stroke={color} style={{ color }}>
          <circle cx="32" cy="32" r="20" strokeWidth="2" />
          <circle cx="32" cy="16" r="4" strokeWidth="2" />
          <circle cx="48" cy="32" r="4" strokeWidth="2" />
          <circle cx="32" cy="48" r="4" strokeWidth="2" />
          <circle cx="16" cy="32" r="4" strokeWidth="2" />
        </svg>
      )
    case 'ai':
      return (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 64 64" stroke={color} style={{ color }}>
          <path d="M32 12 C20 12, 12 20, 12 32 C12 44, 20 52, 32 52 C44 52, 52 44, 52 32 C52 20, 44 12, 32 12" strokeWidth="2" fill="none" />
          <path d="M24 24 Q32 20, 40 24 Q32 28, 24 24" strokeWidth="2" fill="none" />
          <path d="M20 36 Q32 40, 44 36" strokeWidth="2" />
          <path d="M32 12 Q28 20, 32 28 Q36 20, 32 12" strokeWidth="1.5" />
        </svg>
      )
    case 'security':
      return (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 64 64" stroke={color} style={{ color }}>
          <path d="M32 8 L32 20 L20 20 L20 32 C20 44, 28 52, 32 56 C36 52, 44 44, 44 32 L44 20 L32 20 Z" strokeWidth="2" fill="none" />
          <circle cx="32" cy="32" r="8" strokeWidth="2" />
          <circle cx="32" cy="32" r="3" fill="currentColor" />
          <circle cx="32" cy="32" r="16" strokeWidth="1" opacity="0.3" />
        </svg>
      )
    default:
      return null
  }
}

export default function ServicesSection() {
  const { language } = useLanguage()
  const currentServices = services[language]
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0)

  useEffect(() => {
    const track = mobileTrackRef.current
    if (!track) return

    const isMobileLike = () => window.innerWidth < 1347
    if (!isMobileLike()) return

    const timer = window.setInterval(() => {
      if (!track || !isMobileLike()) return
      const cards = Array.from(track.querySelectorAll('.mobile-service-card')) as HTMLDivElement[]
      if (cards.length === 0) return

      setMobileSlideIndex((prev) => {
        const next = (prev + 1) % cards.length
        track.scrollTo({
          left: cards[next].offsetLeft - track.offsetLeft,
          behavior: 'smooth',
        })
        return next
      })
    }, 2000)

    return () => window.clearInterval(timer)
  }, [currentServices.length])

  return (
    <section id="services" className="expertise-section">
      {/* Desktop: 1347px 이상 기존 구조 유지 */}
      <div className="expertise-wrapper expertise-desktop-layout" style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 20px' }}>
          {/* 🔥 세로선 추가 (왼쪽) */}
          <div className="line-left" />

          {/* 🔥 세로선 추가 (오른쪽) */}
          <div className="line-right" />
        <h2 className="expertise-title">
          {language === 'ko' ? 'OUR EXPERTISE & INNOVATION' : 'OUR EXPERTISE & INNOVATION'}
        </h2>
        
        {/* 카드 컨테이너 */}
        <div className="cards-container">
          {/* 배경 이미지 */}
          <div 
            className="bg-bar"
            style={{
              backgroundImage: `url('/img/ChatGPT Image 2026년 2월 26일 오후 05_14_57.png')`,
            }}
          ></div>
          
          {/* 카드들 */}
          {currentServices.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} variant="desktop" />
          ))}
        </div>
      </div>

      {/* Tablet/Mobile: 1347px 미만 슬라이드 전용 구조 */}
      <div className="expertise-mobile-layout px-0 py-12">
        <div className="px-4">
          <h2 className="expertise-title mb-8 text-center">
            {language === 'ko' ? 'OUR EXPERTISE & INNOVATION' : 'OUR EXPERTISE & INNOVATION'}
          </h2>
        </div>
        <div
          ref={mobileTrackRef}
          className="expertise-mobile-track flex flex-row gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory"
        >
          {currentServices.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} variant="mobile" />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  index,
  variant = 'desktop',
}: {
  service: typeof services.ko[0]
  index: number
  variant?: 'desktop' | 'mobile'
}) {
  return (
    <div 
      className={variant === 'mobile' ? 'service-card mobile-service-card' : 'service-card'}
      style={
        variant === 'mobile'
          ? undefined
          : {
              width: '220px',
              minWidth: '220px',
              maxWidth: '220px',
              minHeight: '220px',
              maxHeight: '220px',
              height: '220px',
              flex: '0 0 220px',
            }
      }
    >
      {/* 아이콘 영역 */}
      <div className="mb-6 h-20 flex items-center justify-center">
        <ServiceIcon 
          type={service.icon} 
          color="#555555" 
        />
      </div>
      
      <div className="relative z-10" style={{ width: '100%', maxWidth: '100%' }}>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2" style={{ color: '#000000', width: '100%', maxWidth: '100%', wordWrap: 'break-word' }}>
          {service.title}
        </h3>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: '#666666', width: '100%', maxWidth: '100%', wordWrap: 'break-word' }}>
          {service.subtitle}
        </p>
      </div>
    </div>
  )
}
