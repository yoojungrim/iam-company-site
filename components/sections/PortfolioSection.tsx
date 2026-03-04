'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState, useRef } from 'react'

const portfolioItems = {
  ko: [
    {
      title: '엔터프라이즈 플랫폼',
      description: '멀티테넌트 SaaS 플랫폼을 위한 풀스택 아키텍처',
      category: '웹 개발',
    },
    {
      title: '이커머스 통합',
      description: '통합 백엔드를 갖춘 멀티 플랫폼 커머스 솔루션',
      category: '멀티 플랫폼',
    },
    {
      title: '보안 감사',
      description: '포괄적인 침투 테스트 및 보안 조치',
      category: '보안',
    },
  ],
  en: [
    {
      title: 'Enterprise Platform',
      description: 'Full-stack architecture for multi-tenant SaaS platform',
      category: 'Web Development',
    },
    {
      title: 'E-commerce Integration',
      description: 'Multi-platform commerce solution with unified backend',
      category: 'Multi-Platform',
    },
    {
      title: 'Security Audit',
      description: 'Comprehensive penetration testing and remediation',
      category: 'Security',
    },
  ],
}

const STATUS_LABELS = ['DEPLOYED', 'ACTIVE', 'SECURED'] as const

function StatusTyping({ text, isCenter }: { text: string; isCenter: boolean }) {
  const [displayLength, setDisplayLength] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'hold' | 'erasing'>('typing')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const speed = isCenter ? 40 : 60

  useEffect(() => {
    if (phase === 'typing') {
      if (displayLength >= text.length) {
        timeoutRef.current = setTimeout(() => setPhase('hold'), 1500)
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
      }
      timeoutRef.current = setTimeout(() => setDisplayLength((n) => n + 1), speed)
    } else if (phase === 'hold') {
      timeoutRef.current = setTimeout(() => setPhase('erasing'), 1500)
    } else {
      if (displayLength <= 0) {
        setPhase('typing')
        setDisplayLength(0)
        return
      }
      timeoutRef.current = setTimeout(() => setDisplayLength((n) => n - 1), speed)
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [phase, displayLength, text.length, speed])

  return (
    <div className="portfolio-status">
      <span className="status-text">{text.slice(0, displayLength)}</span>
      <span className="status-cursor" />
    </div>
  )
}

export default function PortfolioSection() {
  const { ref, isVisible } = useScrollAnimation()
  const { language } = useLanguage()
  const currentItems = portfolioItems[language]
  const [showUpdatePopup, setShowUpdatePopup] = useState(false)

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="container mx-auto px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="portfolio-heading"
        >
          <h2 className="portfolio-heading-main">DEPLOYED SYSTEMS</h2>
          <p className="portfolio-heading-sub">
            {language === 'ko' ? '운영중인 시스템' : 'Systems in production'}
          </p>
        </motion.div>
        <div className="portfolio-grid">
          {currentItems.map((item, index) => (
            <PortfolioCard
              key={index}
              item={item}
              index={index}
              statusLabel={STATUS_LABELS[index]}
              isCenter={index === 1}
              onCardClick={() => setShowUpdatePopup(true)}
            />
          ))}
        </div>
      </div>
      {showUpdatePopup && (
        <div
          className="portfolio-update-popup-overlay"
          onClick={() => setShowUpdatePopup(false)}
          role="dialog"
          aria-modal="true"
          aria-label={language === 'ko' ? '업데이트 예정' : 'Update coming soon'}
        >
          <div
            className="portfolio-update-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="portfolio-update-popup-text">
              업데이트 예정
            </p>
            <p className="portfolio-update-popup-text-en">
              Update coming soon
            </p>
            <button
              type="button"
              className="portfolio-update-popup-btn"
              onClick={() => setShowUpdatePopup(false)}
            >
              {language === 'ko' ? '확인' : 'OK'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function PortfolioCard({
  item,
  index,
  statusLabel,
  isCenter,
  onCardClick,
}: {
  item: (typeof portfolioItems.ko)[0]
  index: number
  statusLabel: (typeof STATUS_LABELS)[number]
  isCenter: boolean
  onCardClick: () => void
}) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`portfolio-card ${isCenter ? 'portfolio-card-center' : ''}`}
      onClick={onCardClick}
      onKeyDown={(e) => e.key === 'Enter' && onCardClick()}
      role="button"
      tabIndex={0}
    >
      <div className="portfolio-card-inner">
        <div className="portfolio-card-label">{item.category}</div>
        <h3 className="portfolio-card-title">{item.title}</h3>
        <p className="portfolio-card-description">{item.description}</p>
        <StatusTyping text={statusLabel} isCenter={isCenter} />
      </div>
    </motion.div>
  )
}
