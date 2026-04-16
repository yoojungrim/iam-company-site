'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const services = {
  ko: [
    { title: '웹 개발', subtitle: '반응형 웹앱스 & 웹 서비스', icon: 'web' },
    { title: '풀스택 엔지니어링', subtitle: '프론트엔드부터 백엔드까지', icon: 'fullstack' },
    { title: '웹빌더 기반 구축', subtitle: '다양한 플랫폼 기반 서비스', icon: 'platform' },
    { title: 'Python & AI 개발', subtitle: 'AI 모델 개발 및 데이터 분석', icon: 'ai' },
    { title: '보안 & 침투 테스트', subtitle: '모의 해킹 및 취약점 분석', icon: 'security' },
  ],
  en: [
    { title: 'Web Development', subtitle: 'Responsive web apps', icon: 'web' },
    { title: 'Full-Stack Engineering', subtitle: 'Frontend to backend', icon: 'fullstack' },
    { title: 'Web Builder', subtitle: 'Platform based build', icon: 'platform' },
    { title: 'Python & AI', subtitle: 'AI & Data', icon: 'ai' },
    { title: 'Security', subtitle: 'Pen testing', icon: 'security' },
  ],
}

export default function ServicesSection() {
  const { language } = useLanguage()
  const currentServices = services[language]
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const timer = setInterval(() => {
      const cards = track.querySelectorAll('.mobile-service-card')
      if (!cards.length) return

      const card = cards[0] as HTMLElement

      track.scrollBy({
        left: card.offsetWidth + 25,
        behavior: 'smooth',
      })
    }, 3000) // ✅ 3초

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="expertise-section">

      {/* 데스크탑 */}
      <div className="expertise-wrapper expertise-desktop-layout">
        <h2 className="expertise-title">
          OUR EXPERTISE & INNOVATION
        </h2>

        <div className="cards-container">
          {currentServices.map((service, index) => (
            <div key={index} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 모바일 */}
      <div className="expertise-mobile-layout py-12">

        <h2 className="expertise-title text-center mb-8">
          OUR EXPERTISE & INNOVATION
        </h2>

        <div
          ref={trackRef}
          className="expertise-mobile-track flex gap-[25px] overflow-x-auto snap-x snap-mandatory"
        >
          {currentServices.map((service, index) => (
            <div
              key={index}
              className="service-card mobile-service-card snap-start flex-shrink-0"
            >
              <h3>{service.title}</h3>
              <p>{service.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}