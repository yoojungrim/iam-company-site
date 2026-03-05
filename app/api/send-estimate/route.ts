import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const ADMIN_EMAIL = 'yoojungrim102@gmail.com'
const IAM_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://iamminainstudio.com'
const IAM_EMAIL = 'yoojungrim102@gmail.com'

type Service = {
  serviceItem?: string
  cost?: string
}

function getTransporter() {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
  })
}

function buildAdminBody(type: string, payload: unknown): string {
  return [
    `[견적 요청] ${type === 'security' ? '보안 감사' : '일반 프로젝트'}`,
    '',
    '--- 제출 내용 ---',
    JSON.stringify(payload, null, 2),
  ].join('\n')
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
    const adminPayload = type === 'security'
      ? { ...data, selectedServices: services }
      : { ...data, estimatedCost }

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_USER || process.env.GMAIL_USER,
        to: ADMIN_EMAIL,
        subject: `[IAM 견적] ${type === 'security' ? '보안 감사' : '일반'} - ${(data?.contactInfo as { name?: string })?.name ?? ''}`,
        text: buildAdminBody(type, adminPayload),
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
