export const projectTypes = [
  'Web Application',
  'E-commerce Platform',
  'Multi-Platform Integration',
  'AI/ML Development',
  'Security Audit',
  'Other',
] as const

export const features = [
  'User Authentication',
  'Payment Integration',
  'Admin Dashboard',
  'API Development',
  'Database Design',
  'Mobile Responsive',
  'SEO Optimization',
  'Third-party Integrations',
] as const

export const ecommercePlatformOptions = [
  'Imweb',
  'Cafe24',
  'WordPress',
  'Wix',
  'Other Platform',
] as const

export const budgetRanges = [
  'under_5m',
  '5m_10m',
  '10m_50m',
  '50m_200m',
  '200m_plus',
] as const

export const ecommerceBudgetRanges = [
  'under_1m',
  '1m_3m',
  '3m_5m',
  '5m_10m_ecom',
  '10m_plus_ecom',
] as const

export const timelines = [
  '1-2 months',
  '3-4 months',
  '5-6 months',
  '7-12 months',
  '12+ months',
] as const

export type EstimateFormData = {
  projectType: string
  features: string[]
  budgetRange: string
  timeline: string
  requestNotes?: string
  contactInfo: {
    name: string
    email: string
    company: string
    phone: string
  }
}

const typeCosts: Record<string, number> = {
  // 사용자 요청 반영: 주요 3개 유형 기준 단가를 각각 300만 원 하향
  'Web Application': 1850,
  'E-commerce Platform': 3650,
  'Multi-Platform Integration': 2850,
  'AI/ML Development': 4350,
  'Security Audit': 1150,
  Other: 2650,
}

const budgetMultipliers: Record<string, number> = {
  under_5m: 0.55,
  '5m_10m': 0.75,
  '10m_50m': 1,
  '50m_200m': 1.35,
  '200m_plus': 1.9,
  under_1m: 0.45,
  '1m_3m': 0.6,
  '3m_5m': 0.75,
  '5m_10m_ecom': 0.95,
  '10m_plus_ecom': 1.2,
}

const timelineMultipliers: Record<string, number> = {
  '1-2 months': 1.35,
  '3-4 months': 1.15,
  '5-6 months': 1,
  '7-12 months': 0.92,
  '12+ months': 0.85,
}

export function calculateEstimateRange(formData: EstimateFormData): string {
  if (formData.projectType === 'E-commerce Platform') {
    const selectedPlatform = formData.features[0]
    if (selectedPlatform === 'Imweb') {
      return '130만 원 - 600만 원'
    }
    if (selectedPlatform === 'Cafe24') {
      return '200만 원 - 750만 원'
    }
    if (selectedPlatform === 'WordPress' || selectedPlatform === 'Wix') {
      return '300만 원 - 850만 원'
    }
    if (selectedPlatform === 'Other Platform') {
      return '600만 원 이상'
    }
  }

  // 보안 감사는 기존 산정 로직/단가를 유지
  if (formData.projectType === 'Security Audit') {
    let baseCost = 1150

    const featureMultiplier = 1 + formData.features.length * 0.15
    baseCost *= featureMultiplier

    const legacyBudgetMultipliers: Record<string, number> = {
      under_5m: 0.5,
      '5m_10m': 0.7,
      '10m_50m': 1,
      '50m_200m': 1.5,
      '200m_plus': 2.2,
      under_1m: 0.4,
      '1m_3m': 0.55,
      '3m_5m': 0.7,
      '5m_10m_ecom': 0.9,
      '10m_plus_ecom': 1.15,
    }
    baseCost *= legacyBudgetMultipliers[formData.budgetRange] || 1

    const legacyTimelineMultipliers: Record<string, number> = {
      '1-2 months': 1.5,
      '3-4 months': 1.2,
      '5-6 months': 1,
      '7-12 months': 0.9,
      '12+ months': 0.8,
    }
    baseCost *= legacyTimelineMultipliers[formData.timeline] || 1

    const min = Math.floor(baseCost * 0.7)
    const max = Math.floor(baseCost * 1.3)
    return `${min.toLocaleString()}만 원 - ${max.toLocaleString()}만 원`
  }

  let baseCost = typeCosts[formData.projectType] || typeCosts.Other

  const featureMultiplier = 1 + formData.features.length * 0.12
  baseCost *= featureMultiplier

  const budgetMultiplier = budgetMultipliers[formData.budgetRange] || 1
  baseCost *= budgetMultiplier

  const timelineMultiplier = timelineMultipliers[formData.timeline] || 1
  baseCost *= timelineMultiplier

  // 전반적으로 500~1000만 원 낮게 체감되도록 유연 보정
  const adjustment =
    baseCost >= 4200 ? 1000 : baseCost >= 2600 ? 700 : 500

  const min = Math.max(80, Math.floor(baseCost * 0.7 - adjustment))
  const max = Math.max(min + 50, Math.floor(baseCost * 1.3 - adjustment))

  return `${min.toLocaleString()}만 원 - ${max.toLocaleString()}만 원`
}
