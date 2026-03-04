'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal'

export type SecurityFormData = {
  selectedServiceIds: number[]
  timeline: string
  contactInfo: {
    name: string
    email: string
    company: string
    phone: string
  }
}

// 기준 비용(만 원)은 내부 산정용, 표에는 미노출
const securityServices = [
  {
    id: 0,
    serviceItem: '웹 서비스 보안 점검',
    serviceItemEn: 'Web Service Security Assessment',
    scope: '단일 도메인 / 주요 기능 중심',
    scopeEn: 'Single domain / Core features',
    costMin: 200,
    costMax: 400,
    remarks: '취약점 스캐닝 및 수동 점검',
    remarksEn: 'Vulnerability scanning and manual review',
  },
  {
    id: 1,
    serviceItem: '엔터프라이즈 보안 감사',
    serviceItemEn: 'Enterprise Security Audit',
    scope: '복잡한 로직 / 결제·회원 DB 포함',
    scopeEn: 'Complex logic / Payment & member DB',
    costMin: 400,
    costMax: 800,
    remarks: '비즈니스 로직 심층 분석',
    remarksEn: 'In-depth business logic analysis',
  },
  {
    id: 2,
    serviceItem: '모바일 앱 보안 진단',
    serviceItemEn: 'Mobile App Security Assessment',
    scope: 'Android 또는 iOS (플랫폼당)',
    scopeEn: 'Android or iOS (per platform)',
    costMin: 300,
    costMax: 600,
    remarks: '소스코드 및 통신 구간 분석',
    remarksEn: 'Source code and communication analysis',
  },
  {
    id: 3,
    serviceItem: '정밀 모의해킹',
    serviceItemEn: 'Precision Penetration Testing',
    scope: '시나리오 기반 침투 테스트',
    scopeEn: 'Scenario-based penetration test',
    costMin: 500,
    costMax: 1000,
    remarks: '실전 해킹 방어 시뮬레이션',
    remarksEn: 'Real-world attack simulation',
  },
  {
    id: 4,
    serviceItem: '인프라 및 클라우드 진단',
    serviceItemEn: 'Infrastructure & Cloud Assessment',
    scope: '서버 1대 또는 클라우드 설정',
    scopeEn: 'Single server or cloud setup',
    costMin: 50,
    costMax: 300,
    remarks: '인프라 취약점 및 설정 오류 점검',
    remarksEn: 'Infrastructure vulnerabilities and misconfigurations',
  },
]

const timelines = [
  { value: 'min_1-2_weeks', labelKo: '최소 1~2주', labelEn: 'Min. 1-2 weeks' },
  { value: '1-3_months', labelKo: '1개월~3개월', labelEn: '1-3 months' },
  { value: '3-6_months', labelKo: '3개월~6개월', labelEn: '3-6 months' },
  { value: '6_months_plus', labelKo: '6개월 이상', labelEn: '6+ months' },
]

const securityCopy = {
  ko: {
    title: '보안 감사 견적',
    stepOf: (step: number) => `5단계 중 ${step}단계`,
    step1Title: '서비스 항목 선택',
    step1Desc: '필요한 보안 서비스를 선택해 주세요.',
    step2Title: '희망 일정',
    step3Title: '예상 비용 요약',
    step4Title: '연락처 정보',
    tableSelect: '선택',
    tableService: '서비스 항목',
    tableScope: '점검 대상/범위',
    tableRemarks: '비고',
    costRangeLabel: '예상 비용 (VAT 별도)',
    vatNote: '(VAT 별도)',
    name: '이름',
    email: '이메일',
    company: '회사명',
    phone: '연락처',
    back: '이전',
    next: '다음',
    submit: '제출',
    submitSuccess: '견적 요청이 제출되었습니다. 곧 연락드리겠습니다.',
    submitError: '제출에 실패했습니다. 잠시 후 다시 시도해 주세요.',
    fillRequired: '이름, 이메일, 회사명, 연락처를 모두 입력해 주세요.',
    privacyAgree: '개인정보 수집 및 이용에 동의합니다 (필수)',
    privacyView: '내용보기',
    estimatedCostRange: '예상 비용 범위',
    estimateDisclaimer:
      '본 견적은 선택하신 항목을 바탕으로 산출된 예상 금액이며, 프로젝트의 세부 범위와 투입 기술에 따라 실제 상담 시 최종 금액은 변동될 수 있습니다.',
    // Step 3 notices
    step3Notice1Title: '◈ 프로젝트 견적 안내 사항',
    step3Notice1Body:
      '위 금액은 중소·중견기업(SMB)을 대상으로 한 보편적인 시장 평균가입니다. 본 견적은 한국인터넷진흥원(KISA)에서 가이드하는 소프트웨어 기술자 노임단가를 기본 베이스로 하여 산정한 금액입니다.',
    step3Notice2Title: '◈ 견적 변동 안내 (상세 상담 필요)',
    step3Notice2Body:
      '다음에 해당하는 경우, 점검의 난이도와 투입 인력의 등급, 행정 절차의 복잡성에 따라 별도의 산정 기준이 적용되오니 반드시 별도 문의를 부탁드립니다.',
    step3Notice3Title: '◈ 별도 산정 케이스',
    step3Notice3Case1: '금융 및 공공기관: 높은 보안 요구 수준 및 특수 규정 준수 필요 시',
    step3Notice3Case2: '화이트박스(White Box) 점검: 소스 코드 전수 분석이 포함되는 정밀 진단 시',
    step3Notice3Case3: '긴급 점검: 시스템 오픈 직전 또는 보안 사고 대응을 위한 즉각적인 투입 필요 시',
    step3Notice3Case4: '대규모 기업 및 해외 기업: 다국어 지원, 대규모 자산(IP/서버) 및 복잡한 아키텍처 진단 시',
    // Step 4 notices
    step4Notice1Title: '◈ 보안 감사 필수 기술자문료 고지',
    step4Notice1BodyBefore:
      '보안 감사는 고도의 전문 지식이 투입되는 정밀 작업입니다. 프로젝트의 안전한 설계와 정확한 범위 확정을 위해 기술 미팅 시 ',
    step4Notice1BodyBold: '기술자문료 100만 원이 별도',
    step4Notice1BodyAfter: '로 발생함을 알려드립니다.',
    step4Notice2Title: '◈ 자문료 산정 및 조정 불가 원칙',
    step4Notice2P1:
      '기술자문료는 최상의 서비스 품질과 진단의 객관성을 유지하기 위해 투입되는 필수 재원입니다.',
    step4Notice2P2:
      '본 자문료는 IAM의 전문 기술력이 집약된 독립적인 서비스 항목이므로, 임의로 감액하거나 생략할 수 없음을 단호히 밝힙니다.',
    step4Notice2P3:
      '프로젝트 계약 체결 여부와 관계없이 타 항목으로의 비용 전산이나 사후 차감은 불가능하며, 이는 타협하지 않는 보안 원칙을 지키기 위한 IAM의 확고한 운영 방침입니다.',
    step4Notice3Title: '◈ 서비스 책임 및 데이터 무결성',
    step4Notice3P1:
      '보안 감사는 고객사에서 제공하는 데이터의 정확성을 바탕으로 진행됩니다.',
    step4Notice3P2Before:
      '요청하신 내용이 실제 시스템 환경과 상이하거나, 필수 자료가 누락되어 발생하는 분석 오류 및 결과에 대해서는 ',
    step4Notice3P2Bold: '귀사에 어떠한 법적 책임도 없음',
    step4Notice3P2After: '을 미리 고지드립니다.',
    step4Notice3P3:
      '정확한 진단을 위해 최신 인프라 구성도 및 자산 명세서를 반드시 제출해 주시기 바랍니다.',
    step4Notice4Title: '◈ 유의사항',
    step4Notice4Body:
      '상기 산출 금액은 이해를 돕기 위한 예상 수치이며, 프로젝트의 실제 구성과 요구사항 정의에 따라 최종 확정 견적은 달라질 수 있습니다. 정확한 비용은 상담을 통해 재안내해 드립니다.',
  },
  en: {
    title: 'Security Audit Estimate',
    stepOf: (step: number) => `Step ${step} of 5`,
    step1Title: 'Select Service',
    step1Desc: 'Select the security services you need.',
    step2Title: 'Preferred Timeline',
    step3Title: 'Cost Summary',
    step4Title: 'Contact Information',
    tableSelect: 'Select',
    tableService: 'Service',
    tableScope: 'Scope / Target',
    tableRemarks: 'Remarks',
    costRangeLabel: 'Est. Cost (ex. VAT)',
    vatNote: '(ex. VAT)',
    name: 'Name',
    email: 'Email',
    company: 'Company',
    phone: 'Phone',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    submitSuccess: 'Your request has been submitted. We will contact you soon.',
    submitError: 'Submission failed. Please try again later.',
    fillRequired: 'Please fill in name, email, company, and phone.',
    privacyAgree: 'I agree to the collection and use of personal information (required)',
    privacyView: 'View details',
    estimatedCostRange: 'Estimated Cost Range',
    estimateDisclaimer:
      'This estimate is based on your selections. The final quote may vary after consultation depending on project scope and technical requirements.',
    // Step 3 notices
    step3Notice1Title: '◈ Project Estimate Notice',
    step3Notice1Body:
      'The amounts above are general market averages for small and medium-sized businesses (SMB). This estimate is based on the software engineer rate guidelines provided by the Korea Internet & Security Agency (KISA).',
    step3Notice2Title: '◈ Estimate Variation Notice (Consultation Required)',
    step3Notice2Body:
      'For the cases listed below, separate pricing criteria may apply depending on the complexity of the assessment, level of personnel required, and administrative procedures. Please contact us for a separate quote.',
    step3Notice3Title: '◈ Separate Pricing Cases',
    step3Notice3Case1: 'Financial and public sector: When higher security requirements and special regulatory compliance are required',
    step3Notice3Case2: 'White Box assessment: When full source code analysis is included in the assessment',
    step3Notice3Case3: 'Urgent assessment: When immediate deployment is required before system launch or for security incident response',
    step3Notice3Case4: 'Large enterprises and overseas: Multi-language support, large-scale assets (IP/server), and complex architecture assessment',
    // Step 4 notices
    step4Notice1Title: '◈ Mandatory Technical Advisory Fee Notice',
    step4Notice1BodyBefore:
      'Security audits require highly specialized expertise. For the technical meeting to ensure safe project design and accurate scope definition, ',
    step4Notice1BodyBold: 'a technical advisory fee of KRW 1,000,000 is charged separately',
    step4Notice1BodyAfter: '.',
    step4Notice2Title: '◈ Advisory Fee: Non-Negotiable',
    step4Notice2P1:
      'The technical advisory fee is an essential resource invested to maintain the highest service quality and objectivity of the assessment.',
    step4Notice2P2:
      'This advisory fee is a standalone service that reflects IAM’s specialized expertise; we firmly state that it cannot be arbitrarily reduced or waived.',
    step4Notice2P3:
      'Regardless of whether a project contract is concluded, allocation of this fee to other line items or post-hoc deduction is not permitted. This is IAM’s firm operational policy to uphold non-negotiable security principles.',
    step4Notice3Title: '◈ Service Liability and Data Integrity',
    step4Notice3P1:
      'Security audits are conducted based on the accuracy of data provided by the client.',
    step4Notice3P2Before:
      'We assume ',
    step4Notice3P2Bold: 'no legal liability',
    step4Notice3P2After:
      ' for any analysis errors or results arising from discrepancies between the requested scope and the actual system environment, or from missing required documentation.',
    step4Notice3P3:
      'Please submit up-to-date infrastructure diagrams and asset inventories for an accurate assessment.',
    step4Notice4Title: '◈ Important Notice',
    step4Notice4Body:
      'The amounts above are estimates for reference only. The final quote may vary depending on the actual project structure and requirements. Exact pricing will be provided after consultation.',
  },
}

export default function SecurityEstimatePage() {
  const { language } = useLanguage()
  const router = useRouter()
  const t = securityCopy[language]
  const [step, setStep] = useState(1)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [formData, setFormData] = useState<SecurityFormData>({
    selectedServiceIds: [],
    timeline: '',
    contactInfo: { name: '', email: '', company: '', phone: '' },
  })
  const [submitting, setSubmitting] = useState(false)

  const toggleService = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedServiceIds: prev.selectedServiceIds.includes(id)
        ? prev.selectedServiceIds.filter((x) => x !== id)
        : [...prev.selectedServiceIds, id],
    }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToPrivacy) {
      setPrivacyModalOpen(true)
      return
    }
    if (!isContactValid()) {
      alert(t.fillRequired)
      return
    }
    setSubmitting(true)
    try {
      const selectedForEmail = securityServices
        .filter((s) => formData.selectedServiceIds.includes(s.id))
        .map((s) => {
          const item = s as typeof s & { serviceItemEn?: string }
          return {
            serviceItem:
              language === 'ko' ? s.serviceItem : item.serviceItemEn ?? s.serviceItem,
            cost:
              language === 'ko'
                ? `${s.costMin}만 원 ~ ${s.costMax}만 원`
                : `${s.costMin} - ${s.costMax} million KRW`,
          }
        })
      const res = await fetch('/api/send-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'security',
          data: formData,
          services: selectedForEmail,
        }),
      })
      if (!res.ok) throw new Error('Send failed')
      alert(t.submitSuccess)
      setFormData({
        selectedServiceIds: [],
        timeline: '',
        contactInfo: { name: '', email: '', company: '', phone: '' },
      })
      setStep(1)
    } catch {
      alert(t.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }
  const handleBack = () => {
    if (step > 1) setStep(step - 1)
    else router.back()
  }

  const canNextStep1 = formData.selectedServiceIds.length > 0
  const canNextStep2 = formData.timeline !== ''

  const selectedServices = securityServices.filter((s) =>
    formData.selectedServiceIds.includes(s.id)
  )
  const totalCostMin = selectedServices.reduce(
    (sum, s) => sum + (s.costMin ?? 0),
    0
  )
  const totalCostMax = selectedServices.reduce(
    (sum, s) => sum + (s.costMax ?? 0),
    0
  )
  const costRangeText =
    totalCostMin > 0 && totalCostMax > 0
      ? language === 'ko'
        ? `${totalCostMin.toLocaleString()}만 원 ~ ${totalCostMax.toLocaleString()}만 원`
        : `${totalCostMin.toLocaleString()} - ${totalCostMax.toLocaleString()} million KRW`
      : ''

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-8 py-16 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600">{t.stepOf(step)}</p>
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
                <h2 className="text-3xl font-bold mb-2">{t.step1Title}</h2>
                <p className="text-gray-600 mb-6">{t.step1Desc}</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 w-12">
                          {t.tableSelect}
                        </th>
                        <th className="border border-gray-300 p-3">
                          {t.tableService}
                        </th>
                        <th className="border border-gray-300 p-3">
                          {t.tableScope}
                        </th>
                        <th className="border border-gray-300 p-3">
                          {t.tableRemarks}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {securityServices.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3">
                            <input
                              type="checkbox"
                              checked={formData.selectedServiceIds.includes(
                                row.id
                              )}
                              onChange={() => toggleService(row.id)}
                              className="w-5 h-5"
                            />
                          </td>
                          <td className="border border-gray-300 p-3 font-medium">
                            {language === 'ko' ? row.serviceItem : (row as { serviceItemEn?: string }).serviceItemEn ?? row.serviceItem}
                          </td>
                          <td className="border border-gray-300 p-3 text-gray-700">
                            {language === 'ko' ? row.scope : (row as { scopeEn?: string }).scopeEn ?? row.scope}
                          </td>
                          <td className="border border-gray-300 p-3 text-gray-600 text-sm">
                            {language === 'ko' ? row.remarks : (row as { remarksEn?: string }).remarksEn ?? row.remarks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <h2 className="text-3xl font-bold mb-8">{t.step2Title}</h2>
                <div className="space-y-4">
                  {timelines.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center p-4 border-2 border-gray-200 cursor-pointer hover:border-black transition-colors"
                    >
                      <input
                        type="radio"
                        name="timeline"
                        value={opt.value}
                        checked={formData.timeline === opt.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            timeline: e.target.value,
                          })
                        }
                        className="mr-4 w-5 h-5"
                      />
                      <span className="text-lg">
                        {language === 'ko' ? opt.labelKo : opt.labelEn}
                      </span>
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
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold mb-6">{t.step3Title}</h2>
                {costRangeText && (
                  <div className="p-6 bg-gray-50 border-2 border-black">
                    <p className="text-sm text-gray-600 mb-1">
                      {t.costRangeLabel}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold">
                      {costRangeText}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{t.vatNote}</p>
                  </div>
                )}
                <div className="space-y-6 text-[15px] text-gray-700 leading-relaxed">
                  <section>
                    <h3 className="text-[18px] font-bold text-black mb-2">
                      {t.step3Notice1Title}
                    </h3>
                    <p>{t.step3Notice1Body}</p>
                  </section>
                  <section>
                    <h3 className="text-[18px] font-bold text-black mb-2">
                      {t.step3Notice2Title}
                    </h3>
                    <p>{t.step3Notice2Body}</p>
                  </section>
                  <section>
                    <h3 className="text-[18px] font-bold text-black mb-2">
                      {t.step3Notice3Title}
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t.step3Notice3Case1}</li>
                      <li>{t.step3Notice3Case2}</li>
                      <li>{t.step3Notice3Case3}</li>
                      <li>{t.step3Notice3Case4}</li>
                    </ul>
                  </section>
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
                <div className="space-y-6 text-[15px] text-gray-700 leading-relaxed">
                  <section>
                    <h3 className="text-[18px] font-bold text-black mb-2">
                      {t.step4Notice1Title}
                    </h3>
                    <p>
                      {t.step4Notice1BodyBefore}
                      <strong>{t.step4Notice1BodyBold}</strong>
                      {t.step4Notice1BodyAfter}
                    </p>
                  </section>
                  <section>
                    <h3 className="text-[18px] font-bold text-black mb-2">
                      {t.step4Notice2Title}
                    </h3>
                    <p className="mb-2">{t.step4Notice2P1}</p>
                    <p className="mb-2">{t.step4Notice2P2}</p>
                    <p>{t.step4Notice2P3}</p>
                  </section>
                  <section>
                    <h3 className="text-[18px] font-bold text-black mb-2">
                      {t.step4Notice3Title}
                    </h3>
                    <p className="mb-2">{t.step4Notice3P1}</p>
                    <p className="mb-2">
                      {t.step4Notice3P2Before}
                      <strong>{t.step4Notice3P2Bold}</strong>
                      {t.step4Notice3P2After}
                    </p>
                    <p>{t.step4Notice3P3}</p>
                  </section>
                  <section>
                    <h3 className="text-[18px] font-bold text-black mb-2">
                      {t.step4Notice4Title}
                    </h3>
                    <p>{t.step4Notice4Body}</p>
                  </section>
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
                <h2 className="text-3xl font-bold mb-8">{t.step4Title}</h2>
                <div className="mb-8 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="p-6 bg-gray-50 border-2 border-black flex-shrink-0 min-w-0 md:max-w-sm">
                    <p className="text-sm text-gray-600 mb-1">
                      {t.estimatedCostRange}
                    </p>
                    {costRangeText ? (
                      <p className="text-2xl md:text-3xl font-bold">
                        {costRangeText}
                      </p>
                    ) : (
                      <p className="text-gray-400">—</p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">{t.vatNote}</p>
                  </div>
                  <p className="text-[15px] text-gray-600 flex-1 min-w-0">
                    {t.estimateDisclaimer}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.name} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: {
                            ...formData.contactInfo,
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full p-4 border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.email} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.contactInfo.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: {
                            ...formData.contactInfo,
                            email: e.target.value,
                          },
                        })
                      }
                      className="w-full p-4 border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.company} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactInfo.company}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: {
                            ...formData.contactInfo,
                            company: e.target.value,
                          },
                        })
                      }
                      className="w-full p-4 border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.contactInfo.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: {
                            ...formData.contactInfo,
                            phone: e.target.value,
                          },
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
                  (step === 1 && !canNextStep1) || (step === 2 && !canNextStep2)
                }
                className={`px-8 py-4 bg-black text-white font-medium transition-colors ${
                  (step === 1 && !canNextStep1) || (step === 2 && !canNextStep2)
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
                  submitting || !isContactValid() || !agreedToPrivacy
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-800'
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
