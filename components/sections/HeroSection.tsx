'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const mainText = [
  'Web Architecture',
  '·',
  'Platforms',
  '·',
  'Security',
]

interface CharData {
  char: string
  globalIndex: number
  lineIndex: number
  charIndex: number
}

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'show' | 'hide' | 'reappear'>('show')
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    // 전체 텍스트가 나타나는 시간 계산
    const totalChars = mainText
      .filter((line) => line !== '·')
      .reduce((acc, line) => acc + line.length, 0)
    const totalAnimationTime = totalChars * 50 // 각 글자당 50ms

    // 5초 후 애니메이션 재시작
    const timer = setTimeout(() => {
      setAnimationPhase('hide')
      
      // 사라지는 애니메이션 시간 (역순)
      const hideTime = totalChars * 30
      
      setTimeout(() => {
        setAnimationKey((prev) => prev + 1)
        setAnimationPhase('reappear')
        
        // 다시 나타나는 애니메이션 후 초기 상태로
        setTimeout(() => {
          setAnimationPhase('show')
        }, totalAnimationTime)
      }, hideTime)
    }, 5000)

    return () => clearTimeout(timer)
  }, [isLoaded, animationKey])

  const getAllChars = (): CharData[] => {
    const chars: CharData[] = []
    let globalIndex = 0

    mainText.forEach((line, lineIndex) => {
      if (line === '·') {
        chars.push({
          char: line,
          globalIndex: globalIndex++,
          lineIndex,
          charIndex: -1,
        })
      } else {
        line.split('').forEach((char, charIndex) => {
          chars.push({
            char: char === ' ' ? '\u00A0' : char,
            globalIndex: globalIndex++,
            lineIndex,
            charIndex,
          })
        })
      }
    })

    return chars
  }

  const getDelay = (charData: CharData, totalChars: number): number => {
    if (animationPhase === 'show' || animationPhase === 'reappear') {
      // 순서대로 나타나기
      return charData.globalIndex * 0.05
    } else if (animationPhase === 'hide') {
      // 역순으로 사라지기
      return (totalChars - charData.globalIndex - 1) * 0.03
    }
    return 0
  }

  const allChars = getAllChars()
  const textChars = allChars.filter((c) => c.char !== '·')
  const totalTextChars = textChars.length

  return (
    <section className="h-screen flex items-center justify-center relative bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center px-8"
      >
        <h1 className="text-[48px] md:text-[72px] lg:text-[99px] font-bold tracking-tight mb-8 flex flex-col items-center" style={{ lineHeight: 'calc(1em - 6px)' }}>
          {mainText.map((line, lineIndex) => {
            if (line === '·') {
              return (
                <span key={`line-${lineIndex}-${animationKey}`} className="main-dot">
                  {line}
                </span>
              )
            }

            return (
              <span key={`line-${lineIndex}-${animationKey}`} className="block">
                {line.split('').map((char, charIndex) => {
                  const charData = allChars.find(
                    (c) => c.lineIndex === lineIndex && c.charIndex === charIndex
                  )
                  if (!charData) return null

                  return (
                    <motion.span
                      key={`char-${charData.globalIndex}-${animationKey}`}
                      initial={
                        animationPhase === 'reappear'
                          ? { opacity: 0, y: 20 }
                          : animationPhase === 'hide'
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 20 }
                      }
                      animate={
                        animationPhase === 'hide'
                          ? { opacity: 0, y: -20 }
                          : { opacity: 1, y: 0 }
                      }
                      transition={{
                        duration: 0.3,
                        delay: getDelay(charData, totalTextChars),
                        ease: 'easeOut',
                      }}
                      style={{ display: 'inline-block' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  )
                })}
              </span>
            )
          })}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-600 mt-8 max-w-2xl mx-auto"
        >
          We design the systems behind digital success.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 0.8 }}
          className="text-base md:text-lg text-gray-500 mt-4 max-w-2xl mx-auto"
        >
          아이디어를 현실로 만드는 일, 저희가 책임집니다.
        </motion.p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
