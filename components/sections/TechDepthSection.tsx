'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import TerminalMini from './TerminalMini'

const content = {
  ko: {
    architecture: 'ARCHITECTURE',
    items: [
      'Security First',
      'Scalable Core',
      'Clean Engineering',
      'Intelligent Systems',
    ],
    title: '',
    coreFirst: 'Core first.',
    everythingElse: 'Everything else follows.',
  },
  en: {
    architecture: 'ARCHITECTURE',
    items: [
      'Security First',
      'Scalable Core',
      'Clean Engineering',
      'Intelligent Systems',
    ],
    title: '보이는 것보다 중요한 것을 설계합니다.',
    coreFirst: 'Core first.',
    everythingElse: 'Everything else follows.',
  },
}

export default function TechDepthSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  const { ref, isVisible } = useScrollAnimation()
  const { language } = useLanguage()
  const currentContent = content[language]

  return (
    <section
      ref={sectionRef}
      className="pt-28 pb-12 md:pt-40 md:pb-20 bg-black text-white relative overflow-hidden mt-[30px]"
    >
      <div className="absolute inset-0 opacity-5">
        <GridPattern />
      </div>
      <div className="container mx-auto px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-20">
          {/* 왼쪽 기존 내용 */}
          <div className="flex-1 lg:min-w-0" style={{ transform: 'translateY(-20px)' }}>
          <motion.div
            ref={ref}
            style={{ y, opacity, marginLeft: '55px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-200 mb-6">
                {currentContent.architecture}
              </h3>
              <div className="space-y-4 max-w-3xl">
                {currentContent.items.map((text, index) => (
                  <TechItem key={index} text={text} isLast={index === currentContent.items.length - 1} />
                ))}
              </div>
            </div>
            
            <h2 className="font-bold tracking-tight mb-8" style={{ fontSize: 'clamp(30px, 4vw, 45px)' }}>
              {currentContent.title}
            </h2>
            
            <p className="text-gray-300 mb-4" style={{ fontSize: '28px' }}>
              {currentContent.coreFirst}
            </p>
            <p className="text-2xl md:text-3xl text-gray-300">
              {currentContent.everythingElse}
            </p>
          </motion.div>
          </div>

          {/* 오른쪽 터미널 - lg 이하에서 아래로 배치 */}
          <div className="flex-1 flex justify-center lg:min-w-0">
            <TerminalMini />
          </div>
        </div>
      </div>
    </section>
  )
}

function TechItem({ text, isLast }: { text: string; isLast: boolean }) {
  return (
    <div className="flex items-start">
      <span className="text-gray-400 mr-4 font-mono">
        {isLast ? '└──' : '├──'}
      </span>
      <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-mono">{text}</p>
    </div>
  )
}

function GridPattern() {
  return (
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px',
    }} />
  )
}
