'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'

const content = {
  ko: {
    title: '프로젝트 비용 시뮬레이션',
    description: '구축 범위를 선택하고 예상 비용을 확인하세요.',
    button: '시뮬레이션 시작하기',
    tooltipLine1: '예상 비용 계산하기',
    tooltipLine2: 'Calculate estimated cost',
  },
  en: {
    title: 'Project Cost Simulation',
    description: 'Select the scope and check the estimated cost.',
    button: 'Start Simulation',
    tooltipLine1: 'Calculate estimated cost',
    tooltipLine2: '예상 비용 계산하기',
  },
}

export default function CTASection() {
  const { ref, isVisible } = useScrollAnimation()
  const { language } = useLanguage()
  const currentContent = content[language]
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <section className="py-32 md:py-48 bg-white">
      <div className="container mx-auto px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
            {currentContent.title}
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {currentContent.description}
          </p>
          <div
            className="relative inline-block"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Link href="/estimate">
              <button type="button" className="sim-btn">
                {currentContent.button}
              </button>
            </Link>
            {showTooltip && (
              <div className="cta-button-tooltip">
                <p className="cta-tooltip-text">{currentContent.tooltipLine1}</p>
                <p className="cta-tooltip-text-en">{currentContent.tooltipLine2}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
