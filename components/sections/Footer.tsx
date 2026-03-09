'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

const footerIcons = [
  { src: '/icons/React.png', alt: 'React' },
  { src: '/icons/Node.js.png', alt: 'Node.js' },
  { src: '/icons/TypeScript.png', alt: 'TypeScript' },
  { src: '/icons/JavaScript.png', alt: 'JavaScript' },
  { src: '/icons/Python.png', alt: 'Python' },
  { src: '/icons/Docker.png', alt: 'Docker' },
  { src: '/icons/Spring.png', alt: 'Spring' },
  { src: '/icons/Oracle.png', alt: 'Oracle' },
  { src: '/icons/C++ (CPlusPlus).png', alt: 'C++' },
  { src: '/icons/KakaoTalk_20260304_133304363.png', alt: 'Linux', round: true },
  { src: '/icons/KakaoTalk_20260304_133453259.png', alt: 'Next.js', round: true },
]

const content = {
  ko: {
    brand: 'IAM',
    tagline: '웹 아키텍처 및 보안 중심 기술 스튜디오.',
    creditLine1: '본 웹사이트는 AIN (CEO, IAM)이',
    creditLine2: '직접 디자인 및 개발하였습니다.',
    services: '서비스',
    serviceLines: [
      '웹 개발 / 풀스택 엔지니어링',
      'AI 플랫폼 구축 / Python & AI 개발',
      '보안 및 침투 테스트 / 보안 감사',
    ],
    contact: '연락처',
    companyLine1: '상호: 아이엠(IAM) | 대표: 고아인',
    companyLine2: '총괄 매니저 : 서민호',
    emailLabel: '이메일:',
    email1: 'yoojungrim102@gmail.com',
    email2: 'iam.web.mai@gmail.com',
    bizInfo: '사업자등록번호: [309-29-01800] | 통신판매업신고: 제 2026-부산해운대-0261호',
    copyright: '© 2026 IAM Studio. All rights reserved.',
    copyrightLine4: 'Exclusively designed and developed by AIN, CEO of IAM.',
    copyrightLine5: 'Unauthorized reproduction prohibited.',
  },
  en: {
    brand: 'IAM',
    tagline: 'Web architecture & security-focused technology studio.',
    creditLine1: 'Exclusively designed and developed by AIN,',
    creditLine2: 'CEO of IAM.',
    services: 'Services',
    serviceLines: [
      'Web Development / Full-Stack Engineering',
      'AI Platform Construction / Python & AI Development',
      'Security & Pen-Testing / Security Audit',
    ],
    contact: 'Contact',
    companyLine1: 'Company: IAM | CEO: Go A-in',
    companyLine2: 'General Manager : Seo Min-ho',
    emailLabel: 'Email:',
    email1: 'yoojungrim102@gmail.com',
    email2: 'iam.web.mai@gmail.com',
    bizInfo: 'Biz Reg No: 309-29-01800 | Mail-order: 2026-Busan-Haeundae-0261',
    copyright: '© 2026 IAM Studio. All rights reserved.',
    copyrightLine4: 'Exclusively designed and developed by AIN, CEO of IAM.',
    copyrightLine5: 'Unauthorized reproduction prohibited.',
  },
}

export default function Footer() {
  const { language } = useLanguage()
  const t = content[language]

  return (
    <footer id="contact" className="footer-minimal">
      <div className="container mx-auto px-8">
        <div className="footer-grid">
          <div className="footer-grid-col-brand">
            <h3 className="footer-brand">{t.brand}</h3>
            <p className="footer-tagline">{t.tagline}</p>
            <p className="footer-credit">{t.creditLine1}<br />{t.creditLine2}</p>
          </div>
          <div className="footer-grid-sep" aria-hidden="true" />
          <div className="footer-grid-col-services">
            <h4 className="footer-heading">{t.services}</h4>
            <ul className="footer-list">
              {t.serviceLines.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="footer-grid-sep" aria-hidden="true" />
          <div className="footer-grid-col-contact">
            <h4 className="footer-heading">{t.contact}</h4>
            <ul className="footer-list">
              <li>{t.companyLine1}</li>
              <li>{t.companyLine2}</li>
              <li className="flex gap-2">
                <span className="shrink-0">{t.emailLabel}</span>
                <div className="space-y-1">
                  <a href="mailto:yoojungrim102@gmail.com">{t.email1}</a>
                  <div>
                    <a href="mailto:iam.web.mai@gmail.com">{t.email2}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-text">
            <p>{t.bizInfo}</p>
            <p>{t.copyright}</p>
            <p>{t.copyrightLine4}</p>
            <p>{t.copyrightLine5}</p>
          </div>
          <div className="footer-icons">
            {footerIcons.map((icon) => (
              <span
                key={icon.src}
                className={`footer-icon-wrap ${icon.round ? 'footer-icon-wrap--round' : ''}`}
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={28}
                  height={28}
                  className="footer-icon"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
