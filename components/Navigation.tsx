'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

const navItems = [
  { name: 'Home', korean: '홈', href: '/' },
  { name: 'About', korean: '소개', href: '/#about' },
  { name: 'Services', korean: '서비스', href: '/#services' },
  { name: 'Portfolio', korean: '포트폴리오', href: '/#portfolio' },
  { name: 'Estimate', korean: '견적', href: '/estimate' },
  { name: 'Contact', korean: '문의', href: '/#contact' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const languageRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false)
      }
    }

    if (isLanguageOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLanguageOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsLanguageOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const languages = [
    { code: 'ko' as const, name: '한국어', nameEn: 'Korean' },
    { code: 'en' as const, name: 'English', nameEn: 'ENG' },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <nav
      className={`fixed top-5 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            IAM
          </Link>
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-[14px] font-medium tracking-wide transition-colors ${
                  pathname === item.href
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <span>{language === 'ko' ? item.korean : item.name}</span>
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {language === 'ko' ? item.name : item.korean}
                </span>
              </Link>
            ))}
            <div
              ref={languageRef}
              className="relative inline-block"
              onMouseEnter={() => setIsLanguageOpen(true)}
              onMouseLeave={() => setIsLanguageOpen(false)}
            >
              <button
                type="button"
                className={`w-[5.25rem] rounded-[0.25rem] bg-black px-4 py-2 text-sm font-medium tracking-wide text-white ${
                  isLanguageOpen ? 'rounded-b-none' : ''
                } border border-gray-600`}
                style={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  borderColor: isLanguageOpen ? 'rgba(200,200,200,0.8)' : 'rgba(100,100,100,0.6)',
                  transition: 'border-color 0.3s ease',
                }}
              >
                {currentLanguage?.code === 'ko' ? '한국어' : 'ENG'}
              </button>
              {isLanguageOpen && (
                <div
                  className="absolute left-0 right-0 top-full z-50 w-full overflow-hidden border border-t-0 border-gray-600 bg-black rounded-b-[0.25rem]"
                  style={{
                    top: '100%',
                    marginTop: '-1px',
                    boxShadow: '0 0 25px rgba(180,180,180,0.9), 0 0 15px rgba(200,200,200,0.6)',
                    borderColor: 'rgba(200,200,200,0.8)',
                  }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code)
                        setIsLanguageOpen(false)
                      }}
                      className="lang-dropdown-option w-full px-4 py-2.5 text-center text-sm font-medium text-white whitespace-nowrap transition-all duration-200 border border-transparent hover:border-[#C0C0C0] hover:bg-black"
                    >
                      {lang.code === 'ko' ? lang.name : lang.nameEn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="nav-mobile-actions md:hidden flex items-center gap-2" ref={mobileMenuRef}>
            <div className="flex items-center rounded-md border border-gray-300 overflow-hidden nav-lang-buttons">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 text-sm font-medium nav-lang-btn ${
                    language === lang.code
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {lang.code === 'ko' ? 'KO' : 'EN'}
                </button>
              ))}
            </div>
            <button
              type="button"
              data-menu-toggle
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? (language === 'ko' ? '메뉴 닫기' : 'Close menu') : (language === 'ko' ? '메뉴 열기' : 'Open menu')}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="nav-menu-btn px-4 py-2 text-black border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              {isMobileMenuOpen ? (language === 'ko' ? '닫기' : 'Close') : 'Menu'}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일/태블릿 메뉴 패널 (md 미만에서만 표시) - 열리면 전체 화면 덮고 스크롤로 메뉴만 보이게 */}
      <div
        className={`nav-mobile-panel md:hidden fixed inset-0 top-0 left-0 right-0 bottom-0 z-40 bg-white shadow-lg transition-all duration-300 ease-out ${
          isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
        style={isMobileMenuOpen ? { paddingTop: '6rem' } : undefined}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col gap-6 overflow-y-auto h-full">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className={`text-lg font-medium py-2 border-b border-gray-100 ${
                pathname === item.href ? 'text-black' : 'text-gray-600'
              }`}
            >
              {language === 'ko' ? item.korean : item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              {language === 'ko' ? '언어' : 'Language'}
            </p>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code)
                  }}
                  className={`px-4 py-2 rounded text-sm font-medium border ${
                    language === lang.code
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {lang.code === 'ko' ? lang.name : lang.nameEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
