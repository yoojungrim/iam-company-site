'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal'
import {
  budgetRanges,
  calculateEstimateRange,
  ecommerceBudgetRanges,
  ecommercePlatformOptions,
  features,
  projectTypes,
  timelines,
  type EstimateFormData,
} from '@/lib/estimateSimulator'

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
    ecommercePlatform: '구축 플랫폼',
    budgetRange: '예산 범위',
    ecommerceBudgetNote:
      '*해당 예산은 기본 구축 기준이며, 요구되는 기능 및 인터랙션 수준, 페이지 구성에 따라 최종 비용은 조정될 수 있습니다.',
    timeline: '일정',
    contactInfo: '연락처 정보',
    estimatedCostRange: '예상 비용 범위',
    estimateDisclaimer: '본 견적은 선택하신 항목을 바탕으로 산출된 예상 금액이며, 프로젝트의 세부 범위와 투입 기술에 따라 실제 상담 시 최종 금액은 변동될 수 있습니다.',
    name: '이름',
    email: '이메일',
    company: '회사명',
    phone: '연락처',
    requestNotes: '필요 기능 및 요청사항 (선택)',
    requestNotesDescription:
      '구현을 원하시는 기능이나 참고사항이 있다면 자유롭게 기재해주세요. 아래 예시를 참고하시면 보다 정확한 견적 안내가 가능합니다.',
    requestNotesGuide:
      '요구 기능을 구체적으로 작성해주실수록, 보다 정밀한 견적 산정이 가능합니다.',
    requestNotesPlaceholder:
      `예시)

온라인 결제 기능 (카드 / 간편결제 등)
블로그 / SNS 연동 (네이버, 인스타그램 등)
카카오톡 상담 채널 또는 채팅 상담 기능
문의폼 및 고객 접수 기능
관리자 페이지 (주문 / 회원 관리 등)
로고 및 명함 디자인 병행 제작
메인 페이지 애니메이션 또는 인터랙션 효과
생성형 AI 이미지 또는 비주얼 콘텐츠 제작
다국어 지원 (영문 / 일본어 등)
예약 시스템 또는 일정 관리 기능`,
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
    ecommercePlatformLabels: {
      Imweb: '아임웹',
      Cafe24: '카페24',
      WordPress: '워드프레스',
      Wix: '윅스',
      'Other Platform': '기타 플랫폼',
    },
    ecommercePlatformDescriptions: {
      Imweb: '빠른 구축 / 비용 효율 / 운영 최적화',
      Cafe24: '쇼핑몰 특화 / 안정적인 트랜잭션 구조',
      WordPress: '높은 확장성 / 커스터마이징 중심',
      Wix: '간편 구축 / 디자인 중심 구조',
      'Other Platform': '기존 시스템 기반 / 별도 아키텍처 협의',
    },
    budgetLabels: {
      under_5m: '500만 원 미만',
      '5m_10m': '500만 원 ~ 1,000만 원',
      '10m_50m': '1,000만 원 ~ 5,000만 원',
      '50m_200m': '5,000만 원 ~ 2억 원',
      '200m_plus': '2억 원 이상',
      under_1m: '100만 원 미만',
      '1m_3m': '100만 원 ~ 300만 원',
      '3m_5m': '300만 원 ~ 500만 원',
      '5m_10m_ecom': '500만 원 ~ 1,000만 원',
      '10m_plus_ecom': '1,000만 원 이상',
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
    ecommercePlatform: 'Platform',
    budgetRange: 'Budget Range',
    ecommerceBudgetNote:
      '*This budget is based on a baseline build. Final cost may be adjusted depending on required features, interaction complexity, and page composition.',
    timeline: 'Timeline',
    contactInfo: 'Contact Information',
    estimatedCostRange: 'Estimated Cost Range',
    estimateDisclaimer: 'This estimate is based on your selections. The final quote may vary after consultation depending on project scope and technical requirements.',
    name: 'Name',
    email: 'Email',
    company: 'Company',
    phone: 'Phone',
    requestNotes: 'Required Features & Requests (Optional)',
    requestNotesDescription:
      'Please freely describe desired features or reference notes. The examples below help us provide a more accurate estimate.',
    requestNotesGuide:
      'The more specific your requirements are, the more precise your estimate can be.',
    requestNotesPlaceholder:
      `Examples)

Online payment support (card / easy pay, etc.)
Blog / social media integration (Naver, Instagram, etc.)
KakaoTalk consultation channel or live chat feature
Inquiry form and customer lead capture
Admin page (order / member management, etc.)
Logo and business card design package
Main page animation or interaction effects
Generative AI images or visual content production
Multilingual support (English / Japanese, etc.)
Reservation system or schedule management`,
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    privacyAgree: 'I agree to the collection and use of personal information (required)',
    privacyView: 'View details',
    featureLabels: Object.fromEntries(features.map((f) => [f, f])) as Record<string, string>,
    ecommercePlatformLabels: {
      Imweb: 'Imweb',
      Cafe24: 'Cafe24',
      WordPress: 'WordPress',
      Wix: 'Wix',
      'Other Platform': 'Other Platform',
    },
    ecommercePlatformDescriptions: {
      Imweb: 'Rapid launch / cost efficiency / operations optimization',
      Cafe24: 'Commerce-focused / stable transaction structure',
      WordPress: 'High scalability / customization-centric',
      Wix: 'Simple setup / design-first structure',
      'Other Platform': 'Based on existing systems / architecture by consultation',
    },
    budgetLabels: {
      under_5m: 'Under 5 million KRW',
      '5m_10m': '5 - 10 million KRW',
      '10m_50m': '10 - 50 million KRW',
      '50m_200m': '50 million - 200 million KRW',
      '200m_plus': '200 million KRW+',
      under_1m: 'Under 1 million KRW',
      '1m_3m': '1 - 3 million KRW',
      '3m_5m': '3 - 5 million KRW',
      '5m_10m_ecom': '5 - 10 million KRW',
      '10m_plus_ecom': '10 million KRW+',
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
  const [notesFocused, setNotesFocused] = useState(false)
  const [formData, setFormData] = useState<EstimateFormData>({
    projectType: '',
    features: [],
    budgetRange: '',
    timeline: '',
    requestNotes: '',
    contactInfo: {
      name: '',
      email: '',
      company: '',
      phone: '',
    },
  })

  const [estimatedCost, setEstimatedCost] = useState<string>('')

  const calculateEstimate = () => {
    setEstimatedCost(calculateEstimateRange(formData))
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

  const handleEcommercePlatformSelect = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      features: [platform],
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
      const result = (await res.json()) as { ok: boolean; userMailSent?: boolean }
      if (result.userMailSent === false) {
        alert(
          language === 'ko'
            ? '견적 요청이 접수되었습니다. 다만 확인 이메일 자동 발송에 실패해, 내부에서 별도로 안내드리겠습니다.'
            : 'Your estimate request was received, but the confirmation email failed. We will follow up manually.'
        )
      } else {
        alert(
          language === 'ko'
            ? '접수 완료: 견적 요청이 정상적으로 제출되었습니다. 곧 연락드리겠습니다.'
            : 'Completed: Your request has been successfully received. We will contact you soon.'
        )
      }
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

        <form onSubmit={handleSubmit} className="pb-[20px]">
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
                <h2 className="text-3xl font-bold mb-8">
                  {formData.projectType === 'E-commerce Platform'
                    ? t.ecommercePlatform
                    : t.requiredFeatures}
                </h2>
                {formData.projectType === 'E-commerce Platform' ? (
                  <div className="space-y-4">
                    {ecommercePlatformOptions.map((platform) => (
                      <label
                        key={platform}
                        className="flex items-center p-4 border-2 border-gray-200 cursor-pointer hover:border-black transition-colors"
                      >
                        <input
                          type="radio"
                          name="ecommercePlatform"
                          checked={formData.features[0] === platform}
                          onChange={() => handleEcommercePlatformSelect(platform)}
                          className="mr-4 w-5 h-5"
                        />
                        <div>
                          <p className="text-lg">
                            {(t.ecommercePlatformLabels as Record<string, string>)[platform] ??
                              platform}
                          </p>
                          <p className="text-sm text-gray-600">
                            {(t.ecommercePlatformDescriptions as Record<string, string>)[platform] ??
                              ''}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
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
                )}
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
                <div className="mb-8 space-y-2">
                  <h2 className="text-3xl font-bold">{t.budgetRange}</h2>
                  {formData.projectType === 'E-commerce Platform' && (
                    <p className="text-sm text-gray-600">{t.ecommerceBudgetNote}</p>
                  )}
                </div>
                <div className="space-y-4">
                  {(formData.projectType === 'E-commerce Platform'
                    ? ecommerceBudgetRanges
                    : budgetRanges
                  ).map((range) => (
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
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.requestNotes}</label>
                    <p className="mb-1 text-sm text-gray-600">{t.requestNotesDescription}</p>
                    <p className="mb-2 text-sm text-gray-600">{t.requestNotesGuide}</p>
                    <textarea
                      rows={12}
                      value={formData.requestNotes ?? ''}
                      onFocus={() => setNotesFocused(true)}
                      onBlur={() => {
                        if (!(formData.requestNotes ?? '').trim()) {
                          setNotesFocused(false)
                        }
                      }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requestNotes: e.target.value,
                        })
                      }
                      placeholder={notesFocused ? '' : t.requestNotesPlaceholder}
                      className="w-full p-4 border-2 border-gray-200 focus:border-black outline-none transition-colors min-h-[220px]"
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

          <div className="mt-12 mb-[10px] flex justify-between lg:mb-[20px]">
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
