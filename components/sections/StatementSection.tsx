'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { motion } from 'framer-motion'

export default function StatementSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-32 md:py-48 bg-white">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="text-3xl md:text-5xl font-light tracking-tight leading-relaxed max-w-4xl mx-auto">
            We design the structure behind digital businesses.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
