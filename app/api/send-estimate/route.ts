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

function safeText(value: unknown): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ') || '-'
  if (value === null || value === undefined) return '-'
  const text = String(value).trim()
  return text || '-'
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function rowHtml(label: string, value: string): string {
  return `
    <tr>
      <td style="width:190px;padding:12px 14px;border:1px solid #d1d5db;background:#f8fafc;font-weight:700;color:#111827;">${escapeHtml(label)}</td>
      <td style="padding:12px 14px;border:1px solid #d1d5db;color:#111827;line-height:1.6;white-space:pre-line;">${escapeHtml(value)}</td>
    </tr>
  `
}

function normalizeGeneralSummary(data: Record<string, unknown>, estimatedCost?: string) {
  const projectType = safeText(data.projectType)
  const featureList = Array.isArray(data.features) ? data.features.map((item) => safeText(item)) : []
  const selectedPlatform = projectType === 'E-commerce Platform'
    ? (featureList[0] || '-')
    : '-'
  const selectedFeatures = projectType === 'E-commerce Platform'
    ? (featureList.slice(1).join(', ') || '-')
    : (featureList.join(', ') || '-')

  return {
    projectType,
    selectedPlatform,
    selectedFeatures,
    budgetRange: safeText(data.budgetRange),
    estimatedCost: safeText(estimatedCost),
    requestNotes: safeText(data.requestNotes),
    timeline: safeText(data.timeline),
  }
}

function buildUserHtml(
  summary: ReturnType<typeof normalizeGeneralSummary>
): string {
  return `
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IAM 견적 접수 안내</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:760px;background:#ffffff;border:2px solid #111827;">
            <tr>
              <td style="padding:24px 28px;border-bottom:2px solid #111827;">
                <h1 style="margin:0;font-size:24px;line-height:1.3;">IAM Web Architecture Studio</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <p style="margin:0 0 10px 0;">안녕하세요, IAM입니다.<br/>소중한 프로젝트 문의를 보내주셔서 감사합니다.</p>
                <p style="margin:0 0 18px 0;color:#374151;">작성해주신 내용을 기반으로 내부 검토 후<br/>순차적으로 상세 견적 및 상담을 도와드릴 예정입니다.</p>
                <h2 style="margin:0 0 10px 0;font-size:18px;">견적 요약 정보</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${rowHtml('프로젝트 유형', summary.projectType)}
                  ${rowHtml('선택 플랫폼', summary.selectedPlatform)}
                  ${rowHtml('선택 기능 목록', summary.selectedFeatures)}
                  ${rowHtml('예상 예산 범위', summary.budgetRange)}
                  ${rowHtml('예상 견적 범위', summary.estimatedCost)}
                  ${rowHtml('추가 요청사항', summary.requestNotes)}
                </table>
                <p style="margin:18px 0 0 0;color:#374151;">보다 정확한 견적은<br/>요구 기능 및 구조 분석 후 별도로 안내드릴 예정입니다.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;border-top:1px solid #e5e7eb;background:#fafafa;">
                <p style="margin:0 0 8px 0;font-weight:700;">IAM Web Architecture Studio</p>
                <p style="margin:0 0 8px 0;"><a href="${IAM_SITE_URL}" style="color:#111827;">${IAM_SITE_URL}</a></p>
                <p style="margin:0 0 12px 0;color:#6b7280;">Web Architecture · Platforms · Security</p>
                <p style="margin:0;">감사합니다.<br/>IAM 드림.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
}

function buildUserText(summary: ReturnType<typeof normalizeGeneralSummary>): string {
  return [
    '안녕하세요, IAM입니다.',
    '소중한 프로젝트 문의를 보내주셔서 감사합니다.',
    '',
    '작성해주신 내용을 기반으로 내부 검토 후',
    '순차적으로 상세 견적 및 상담을 도와드릴 예정입니다.',
    '',
    '[견적 요약 정보]',
    `- 프로젝트 유형: ${summary.projectType}`,
    `- 선택 플랫폼: ${summary.selectedPlatform}`,
    `- 선택 기능 목록: ${summary.selectedFeatures}`,
    `- 예상 예산 범위: ${summary.budgetRange}`,
    `- 예상 견적 범위: ${summary.estimatedCost}`,
    `- 추가 요청사항: ${summary.requestNotes}`,
    '',
    '보다 정확한 견적은 요구 기능 및 구조 분석 후 별도로 안내드릴 예정입니다.',
    '',
    'IAM Web Architecture Studio',
    IAM_SITE_URL,
    'Web Architecture · Platforms · Security',
    '',
    '감사합니다.',
    'IAM 드림.',
  ].join('\n')
}

function buildAdminHtml(
  contact: ContactInfo,
  summary: ReturnType<typeof normalizeGeneralSummary>,
  type: 'general' | 'security',
  services: Service[]
): string {
  const securityServiceSummary = services.length > 0
    ? services.map((s) => `${s.serviceItem ?? '-'} (${s.cost ?? '-'})`).join('\n')
    : '-'

  return `
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>견적 접수 알림</title>
  </head>
  <body style="margin:0;padding:20px;background:#f3f4f6;font-family:Arial,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:760px;margin:0 auto;background:#ffffff;border:2px solid #111827;">
      <tr>
        <td style="padding:20px 24px;border-bottom:2px solid #111827;font-size:22px;font-weight:700;">
          신규 프로젝트 요청 접수
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${rowHtml('이름', safeText(contact.name))}
            ${rowHtml('연락처', safeText(contact.phone))}
            ${rowHtml('이메일', safeText(contact.email))}
            ${rowHtml('회사명', safeText(contact.company))}
            ${rowHtml('요청 유형', type === 'security' ? '보안 감사' : '일반 프로젝트')}
            ${rowHtml('선택 플랫폼', summary.selectedPlatform)}
            ${rowHtml('예산 범위', summary.budgetRange)}
            ${rowHtml('기능 목록', type === 'security' ? securityServiceSummary : summary.selectedFeatures)}
            ${rowHtml('요청사항', summary.requestNotes)}
            ${rowHtml('예상 견적 범위', summary.estimatedCost)}
            ${rowHtml('희망 일정', summary.timeline)}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
}

function buildAdminText(
  contact: ContactInfo,
  summary: ReturnType<typeof normalizeGeneralSummary>,
  type: 'general' | 'security',
  services: Service[]
): string {
  const securityServiceSummary = services.length > 0
    ? services.map((s) => `${s.serviceItem ?? '-'} (${s.cost ?? '-'})`).join(', ')
    : '-'

  return [
    '[견적 접수] 새로운 프로젝트 요청이 도착했습니다',
    '',
    `이름: ${safeText(contact.name)}`,
    `연락처: ${safeText(contact.phone)}`,
    `이메일: ${safeText(contact.email)}`,
    `회사명: ${safeText(contact.company)}`,
    `요청 유형: ${type === 'security' ? '보안 감사' : '일반 프로젝트'}`,
    `선택 플랫폼: ${summary.selectedPlatform}`,
    `예산 범위: ${summary.budgetRange}`,
    `기능 목록: ${type === 'security' ? securityServiceSummary : summary.selectedFeatures}`,
    `요청사항: ${summary.requestNotes}`,
    `예상 견적 범위: ${summary.estimatedCost}`,
    `희망 일정: ${summary.timeline}`,
  ].join('\n')
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
    const contact = asContactInfo(data.contactInfo)
    const summary = normalizeGeneralSummary(data, estimatedCost)

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
      subject: '[견적 접수] 새로운 프로젝트 요청이 도착했습니다',
      text: buildAdminText(contact, summary, type, services),
      html: buildAdminHtml(contact, summary, type, services),
      replyTo: contact.email || undefined,
    })

    const toUser = contact.email
    let userMailSent = false
    if (toUser) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER || process.env.GMAIL_USER,
          to: toUser,
          subject: '[ IAM ] 웹 개발 프로젝트 견적 요청이 정상적으로 접수되었습니다',
          text: buildUserText(summary),
          html: buildUserHtml(summary),
        })
        userMailSent = true
      } catch (userMailError) {
        userMailSent = false
        console.error('User confirmation email failed:', userMailError)
      }
    }

    return NextResponse.json({ ok: true, userMailSent })
  } catch (e) {
    console.error('Send estimate error:', e)
    return NextResponse.json(
      { ok: false, error: 'Failed to send' },
      { status: 500 }
    )
  }
}
