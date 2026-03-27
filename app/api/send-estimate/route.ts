import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'yoojungrim102@gmail.com'
const IAM_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://iamminainstudio.com'
const IAM_EMAIL = 'yoojungrim102@gmail.com'

type Service = {
  serviceItem?: string
  cost?: string
}

type ContactInfo = {
  name?: string
  email?: string
  company?: string
  phone?: string
}

function getTransporter() {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return null
  const port = Number(process.env.SMTP_PORT) || 587
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : {}
}

function asContactInfo(value: unknown): ContactInfo {
  const info = asRecord(value)
  return {
    name: typeof info.name === 'string' ? info.name : '',
    email: typeof info.email === 'string' ? info.email : '',
    company: typeof info.company === 'string' ? info.company : '',
    phone: typeof info.phone === 'string' ? info.phone : '',
  }
}

function toKoreanLabel(key: string): string {
  const labels: Record<string, string> = {
    projectType: '프로젝트 유형',
    features: '필요 기능',
    budgetRange: '예산 범위',
    timeline: '희망 일정',
    estimatedCost: '예상 비용 범위',
    selectedServices: '선택 보안 서비스',
    selectedServiceIds: '선택 서비스 ID',
  }
  return labels[key] || key
}

function formatUnknown(value: unknown): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return '-'
    return value.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(', ')
  }
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') return JSON.stringify(value)
  const text = String(value).trim()
  return text === '' ? '-' : text
}

function buildAdminBody(
  type: 'general' | 'security',
  data: Record<string, unknown>,
  estimatedCost?: string,
  services: Service[] = []
): string {
  const contact = asContactInfo(data.contactInfo)
  const lines: string[] = [
    `[견적 요청] ${type === 'security' ? '보안 감사' : '일반 프로젝트'}`,
    '',
    '성함: ' + (contact.name || '-'),
    '회사명: ' + (contact.company || '-'),
    '연락처: ' + (contact.phone || '-'),
    '이메일: ' + (contact.email || '-'),
    '',
    '--- 견적서 체크 내용 ---',
  ]

  if (type === 'general') {
    const features = Array.isArray(data.features) ? data.features : []
    lines.push(
      `프로젝트 유형: ${formatUnknown(data.projectType)}`,
      `필요 기능: ${formatUnknown(features)}`,
      `예산 범위: ${formatUnknown(data.budgetRange)}`,
      `희망 일정: ${formatUnknown(data.timeline)}`
    )
    if (estimatedCost) {
      lines.push(`예상 비용 범위: ${estimatedCost}`)
    }
  } else {
    lines.push(`희망 일정: ${formatUnknown(data.timeline)}`)
    if (services.length > 0) {
      lines.push('선택 보안 서비스:')
      services.forEach((service) => {
        lines.push(`- ${service.serviceItem ?? '-'} (${service.cost ?? '-'})`)
      })
    } else {
      lines.push('선택 보안 서비스: -')
    }
  }

  lines.push('', '--- 문의 내용 정리 ---')
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'contactInfo') return
    if (type === 'general' && ['projectType', 'features', 'budgetRange', 'timeline'].includes(key)) return
    if (type === 'security' && ['timeline', 'selectedServiceIds'].includes(key)) return
    lines.push(`${toKoreanLabel(key)}: ${formatUnknown(value)}`)
  })

  if (type === 'general' && estimatedCost) {
    lines.push(`${toKoreanLabel('estimatedCost')}: ${estimatedCost}`)
  }

  return lines.join('\n')
}

function buildUserBody(type: string, payload: unknown, services?: Service[]): string {
  const lines = [
    '안녕하세요, IAM입니다.',
    '',
    '견적 요청이 접수되었습니다. 아래 내용으로 접수되었습니다.',
    '',
    '--- 제출하신 항목 ---',
    JSON.stringify(payload, null, 2),
  ]
  if (services && services.length > 0) {
    lines.push('', '--- 선택하신 보안 서비스 ---')
    services.forEach((s) => {
      lines.push(`- ${s.serviceItem ?? ''}: ${s.cost ?? ''}`)
    })
  }
  lines.push(
    '',
    '---',
    `IAM 사이트: ${IAM_SITE_URL}`,
    `IAM 이메일: ${IAM_EMAIL}`,
    '',
    '문의사항은 위 이메일로 연락 부탁드립니다.'
  )
  return lines.join('\n')
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      type: 'general' | 'security'
      data: Record<string, unknown>
      services?: unknown
      estimatedCost?: string
    }
    const { type, data, estimatedCost } = body
    const services: Service[] = Array.isArray(body.services)
      ? (body.services as Service[])
      : []

    const transporter = getTransporter()
    if (!transporter) {
      console.error(
        'Email transporter is not configured. Please set SMTP_USER/SMTP_PASS or GMAIL_USER/GMAIL_APP_PASSWORD.'
      )
      return NextResponse.json(
        { ok: false, error: 'Email service is not configured' },
        { status: 500 }
      )
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER || process.env.GMAIL_USER,
      to: ADMIN_EMAIL,
      subject: `[IAM 견적] ${type === 'security' ? '보안 감사' : '일반'} - ${(data?.contactInfo as { name?: string })?.name ?? ''}`,
      text: buildAdminBody(type, data, estimatedCost, services),
      replyTo: (data?.contactInfo as { email?: string })?.email,
    })

    const toUser = (data?.contactInfo as { email?: string })?.email
    if (toUser) {
      const userPayload = type === 'security'
        ? { ...data, selectedServices: services }
        : { ...data, estimatedCost }
      await transporter.sendMail({
        from: process.env.SMTP_USER || process.env.GMAIL_USER,
        to: toUser,
        subject: '[IAM] 견적 요청 접수 안내',
        text: buildUserBody(type, userPayload, services),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Send estimate error:', e)
    return NextResponse.json(
      { ok: false, error: 'Failed to send' },
      { status: 500 }
    )
  }
}
