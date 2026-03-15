'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal'

type FormData = {
  projectType: string
  features: string[]
  budgetRange: string
  timeline: string
  contactInfo: {
    name: string
    email: string
    company: string
    phone: string
  }
}

const projectTypes = [
  'Web Application',
  'E-commerce Platform',
  'Multi-Platform Integration',
  'AI/ML Development',
  'Security Audit',
  'Other',
]

const features = [
  'User Authentication',
  'Payment Integration',
  'Admin Dashboard',
  'API Development',
  'Database Design',
  'Mobile Responsive',
  'SEO Optimization',
  'Third-party Integrations',
]

const budgetRanges = [
  'under_5m',
  '5m_10m',
  '10m_50m',
  '50m_200m',
  '200m_plus',
]

const timelines = [
  '1-2 months',
  '3-4 months',
  '5-6 months',
  '7-12 months',
  '12+ months',
]

const estimateCopy = {
  ko: {
    title: '프로젝트 견적',
    stepOf: (step: number) => `5단계 중 ${step}단계`,
    projectType: '프로젝트 유형',
    projectTypeLabels: {
      'Web Application': '웹 애플리케이션',
      'E-commerce Platform': '이커머스플랫폼(웹빌더 기반 구축)',
      'Multi-Platform Integration': '멀티 플랫폼 연동',
      'AI/ML Development': 'AI/ML 개발',
      'Security Audit': '보안 감사',
      'Other': '기타',
    },
    requiredFeatures: '필요 기능',
    budgetRange: '예산 범위',
    timeline: '일정',
    contactInfo: '연락처 정보',
    estimatedCostRange: '예상 비용 범위',
    estimateDisclaimer: '본 견적은 선택하신 항목을 바탕으로 산출된 예상 금액이며, 프로젝트의 세부 범위와 투입 기술에 따라 실제 상담 시 최종 금액은 변동될 수 있습니다.',
    name: '이름',
    email: '이메일',
    company: '회사명',
    phone: '연락처',
    back: '이전',
    next: '다음',
    submit: '제출',
    privacyAgree: '개인정보 수집 및 이용에 동의합니다 (필수)',
    privacyView: '내용보기',
    featureLabels: {
      'User Authentication': '사용자 인증',
      'Payment Integration': '결제 연동',
      'Admin Dashboard': '관리자 대시보드',
      'API Development': 'API 개발',
      'Database Design': 'DB 설계',
      'Mobile Responsive': '모바일 반응형',
      'SEO Optimization': 'SEO 최적화',
      'Third-party Integrations': '서드파티 연동',
    },
    budgetLabels: {
      under_5m: '500만 원 미만',
      '5m_10m': '500만 원 ~ 1,000만 원',
      '10m_50m': '1,000만 원 ~ 5,000만 원',
      '50m_200m': '5,000만 원 ~ 2억 원',
      '200m_plus': '2억 원 이상',
    },
    timelineLabels: {
      '1-2 months': '1~2개월',
      '3-4 months': '3~4개월',
      '5-6 months': '5~6개월',
      '7-12 months': '7~12개월',
      '12+ months': '12개월 이상',
    },
  },
  en: {
    title: 'Project Estimate',
    stepOf: (step: number) => `Step ${step} of 5`,
    projectType: 'Project Type',
    projectTypeLabels: Object.fromEntries(projectTypes.map((t) => [t, t])) as Record<string, string>,
    requiredFeatures: 'Required Features',
    budgetRange: 'Budget Range',
    timeline: 'Timeline',
    contactInfo: 'Contact Information',
    estimatedCostRange: 'Estimated Cost Range',
    estimateDisclaimer: 'This estimate is based on your selections. The final quote may vary after consultation depending on project scope and technical requirements.',
    name: 'Name',
    email: 'Email',
    company: 'Company',
    phone: 'Phone',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    privacyAgree: 'I agree to the collection and use of personal information (required)',
    privacyView: 'View details',
    featureLabels: Object.fromEntries(features.map((f) => [f, f])) as Record<string, string>,
    budgetLabels: {
      under_5m: 'Under 5 million KRW',
      '5m_10m': '5 - 10 million KRW',
      '10m_50m': '10 - 50 million KRW',
      '50m_200m': '50 million - 200 million KRW',
      '200m_plus': '200 million KRW+',
    } as Record<string, string>,
    timelineLabels: Object.fromEntries(timelines.map((t) => [t, t])) as Record<string, string>,
  },
}

export default function EstimatePage() {
  const { language } = useLanguage()
  const router = useRouter()
  const t = estimateCopy[language]
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    features: [],
    budgetRange: '',
    timeline: '',
    contactInfo: {
      name: '',
      email: '',
      company: '',
      phone: '',
    },
  })

  const [estimatedCost, setEstimatedCost] = useState<string>('')

  const calculateEstimate = () => {
    let baseCost = 0

    // 프로젝트 유형별 기본 단가 (만 원, 기준 -350만 원 적용)
    const typeCosts: Record<string, number> = {
      'Web Application': 2150,
      'E-commerce Platform': 3650,
      'Multi-Platform Integration': 3150,
      'AI/ML Development': 4650,
      'Security Audit': 1150,
      'Other': 2650,
    }
    baseCost = typeCosts[formData.projectType] || 2650

    // 기능 수에 따른 가산
    const featureMultiplier = 1 + formData.features.length * 0.15
    baseCost *= featureMultiplier

    // 예산 구간 보정 (원화 기준)
    const budgetMultipliers: Record<string, number> = {
      under_5m: 0.5,
      '5m_10m': 0.7,
      '10m_50m': 1,
      '50m_200m': 1.5,
      '200m_plus': 2.2,
    }
    const budgetMultiplier = budgetMultipliers[formData.budgetRange] || 1
    baseCost *= budgetMultiplier

    // 일정 보정 (짧을수록 가산)
    const timelineMultipliers: Record<string, number> = {
      '1-2 months': 1.5,
      '3-4 months': 1.2,
      '5-6 months': 1,
      '7-12 months': 0.9,
      '12+ months': 0.8,
    }
    const timelineMultiplier = timelineMultipliers[formData.timeline] || 1
    baseCost *= timelineMultiplier

    const min = Math.floor(baseCost * 0.7)
    const max = Math.floor(baseCost * 1.3)

    setEstimatedCost(`${min.toLocaleString()}만 원 - ${max.toLocaleString()}만 원`)
  }

  const isContactValid = () => {
    const c = formData.contactInfo
    return (
      c.name.trim() !== '' &&
      c.email.trim() !== '' &&
      c.company.trim() !== '' &&
      c.phone.trim() !== ''
    )
  }

  const handleNext = () => {
    if (step === 1 && formData.projectType === 'Security Audit') {
      router.push('/estimate/security')
      return
    }
    if (step < 5) {
      setStep(step + 1)
      if (step === 4) {
        calculateEstimate()
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.back()
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToPrivacy) {
      setPrivacyModalOpen(true)
      return
    }
    if (!isContactValid()) {
      alert(language === 'ko' ? '이름, 이메일, 회사명, 연락처를 모두 입력해 주세요.' : 'Please fill in name, email, company, and phone.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/send-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'general',
          data: formData,
          estimatedCost,
        }),
      })
      if (!res.ok) throw new Error('Send failed')
      alert(language === 'ko' ? '견적 요청이 제출되었습니다. 곧 연락드리겠습니다.' : 'Your request has been submitted. We will contact you soon.')
    } catch {
      alert(language === 'ko' ? '제출에 실패했습니다. 잠시 후 다시 시도해 주세요.' : 'Submission failed. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-8 py-16 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600">
            {t.stepOf(step)}
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 mx-1 ${
                  s <= step ? 'bg-black' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold mb-8">{t.projectType}</h2>
                <div className="space-y-4">
                  {projectTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center p-4 border-2 border-gray-200 cursor-pointer hover:border-black transition-colors"
                    >
                      <input
                        type="radio"
                        name="projectType"
                        value={type}
                        checked={formData.projectType === type}
                        onChange={(e) =>
                          setFormData({ ...formData, projectType: e.target.value })
                        }
                        className="mr-4 w-5 h-5"
                      />
                      <span className="text-lg">{(t.projectTypeLabels as Record<string, string>)[type] ?? type}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold mb-8">{t.requiredFeatures}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center p-4 border-2 border-gray-200 cursor-pointer hover:border-black transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="mr-4 w-5 h-5"
                      />
                      <span className="text-lg">{(t.featureLabels as Record<string, string>)[feature] ?? feature}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold mb-8">{t.budgetRange}</h2>
                <div className="space-y-4">
                  {budgetRanges.map((range) => (
                    <label
                      key={range}
                      className="flex items-center p-4 border-2 border-gray-200 cursor-pointer hover:border-black transition-colors"
                    >
                      <input
                        type="radio"
                        name="budgetRange"
                        value={range}
                        checked={formData.budgetRange === range}
                        onChange={(e) =>
                          setFormData({ ...formData, budgetRange: e.target.value })
                        }
                        className="mr-4 w-5 h-5"
                      />
                      <span className="text-lg">{(t.budgetLabels as Record<string, string>)[range] ?? range}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold mb-8">{t.timeline}</h2>
                <div className="space-y-4">
                  {timelines.map((timeline) => (
                    <label
                      key={timeline}
                      className="flex items-center p-4 border-2 border-gray-200 cursor-pointer hover:border-black transition-colors"
                    >
                      <input
                        type="radio"
                        name="timeline"
                        value={timeline}
                        checked={formData.timeline === timeline}
                        onChange={(e) =>
                          setFormData({ ...formData, timeline: e.target.value })
                        }
                        className="mr-4 w-5 h-5"
                      />
                      <span className="text-lg">{(t.timelineLabels as Record<string, string>)[timeline] ?? timeline}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold mb-8">{t.contactInfo}</h2>
                <div className="mb-8 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="p-6 bg-gray-50 border-2 border-black flex-shrink-0 min-w-0 md:max-w-sm">
                    <p className="text-sm text-gray-600 mb-2">{t.estimatedCostRange}</p>
                    {estimatedCost ? (
                      <p className="text-3xl font-bold">{estimatedCost}</p>
                    ) : (
                      <p className="text-gray-400">—</p>
                    )}
                  </div>
                  <p className="text-[15px] text-gray-600 flex-1 min-w-0">
                    {t.estimateDisclaimer}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.name} *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, name: e.target.value },
                        })
                      }
                      className="w-full p-4 border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.email} *</label>
                    <input
                      type="email"
                      required
                      value={formData.contactInfo.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, email: e.target.value },
                        })
                      }
                      className="w-full p-4 border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.company} *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.company}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, company: e.target.value },
                        })
                      }
                      className="w-full p-4 border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.phone} *</label>
                    <input
                      type="tel"
                      required
                      value={formData.contactInfo.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, phone: e.target.value },
                        })
                      }
                      className="w-full p-4 border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step === 5 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreedToPrivacy}
                  onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">{t.privacyAgree}</span>
              </label>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(true)}
                className="text-sm underline"
                style={{ color: '#999999' }}
              >
                [{t.privacyView}]
              </button>
            </div>
          )}

          <div className="flex justify-between mt-12">
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-4 border-2 border-black text-black font-medium transition-colors hover:bg-black hover:text-white"
            >
              {t.back}
            </button>
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  (step === 1 && !formData.projectType) ||
                  (step === 3 && !formData.budgetRange) ||
                  (step === 4 && !formData.timeline)
                }
                className={`px-8 py-4 bg-black text-white font-medium transition-colors ${
                  (step === 1 && !formData.projectType) ||
                  (step === 3 && !formData.budgetRange) ||
                  (step === 4 && !formData.timeline)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-800'
                }`}
              >
                {t.next}
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting || !isContactValid() || !agreedToPrivacy}
                className={`px-8 py-4 bg-black text-white font-medium transition-colors ${
                  submitting || !isContactValid() || !agreedToPrivacy ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                }`}
              >
                {submitting ? '...' : t.submit}
              </button>
            )}
          </div>
        </form>
        <PrivacyPolicyModal
          isOpen={privacyModalOpen}
          onClose={() => setPrivacyModalOpen(false)}
          language={language}
        />
      </div>
    </div>
  )
}
