'use client'

const content = {
  ko: {
    title: 'IAM 개인정보처리방침',
    close: '닫기',
    section1Title: '◈ 1. 개인정보의 수집 및 이용 목적',
    section1Body:
      'IAM은 다음의 목적을 위해 개인정보를 수집하고 이용합니다. 수집된 개인정보는 정해진 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경될 시에는 사전 동의를 구할 예정입니다.',
    section1List: [
      '프로젝트 견적 산출 및 서비스 상담 안내',
      '보안 감사 및 기술 컨설팅 범위 확정을 위한 기초 자료 확인',
      '서비스 이용에 따른 본인 확인 및 고객 문의 대응',
    ],
    section2Title: '◈ 2. 수집하는 개인정보의 항목',
    section2Body:
      'IAM은 원활한 상담 및 견적 제공을 위해 아래와 같은 정보를 수집하고 있습니다.',
    section2Items: '필수 항목: 이름, 이메일, 연락처, 회사명',
    section2Purpose: '수집 목적: 프로젝트 견적 산출 및 보안 감사 기술 상담',
    section2Retention: '보유 및 이용 기간: 목적 달성 후 1년 또는 고객 요청 시 즉시 파기',
    section3Title: '◈ 3. 개인정보의 보유 및 이용 기간',
    section3P1:
      '수집된 개인정보는 프로젝트 상담 및 견적 제공 목적이 달성될 때까지 보유합니다.',
    section3P2:
      '단, 상담 이력 관리 및 사후 관리를 위해 목적 달성 후 1년간 보관하며, 이용자의 파기 요청이 있을 경우 지체 없이 파기합니다.',
    section4Title: '◈ 4. 개인정보의 파기 절차 및 방법',
    section4P1:
      'IAM은 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.',
    section4P2:
      '전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.',
    section5Title: '◈ 5. 정보주체의 권리 및 행사방법',
    section5P1:
      '이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 수집 동의 철회 및 삭제를 요청할 수 있습니다.',
    section5P2:
      '개인정보 보호책임자 혹은 대표 메일(yoojungrim102@gmail.com)을 통해 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.',
    section6Title: '◈ 6. 개인정보 보호책임자',
    section6Name: 'IAM 대표이사 AIN',
    section6Contact: '연락처: yoojungrim102@gmail.com',
  },
  en: {
    title: 'IAM Privacy Policy',
    close: 'Close',
    section1Title: '◈ 1. Purpose of Collection and Use of Personal Information',
    section1Body:
      'IAM collects and uses personal information for the following purposes. Collected information is not used for any purpose other than those stated, and we will seek prior consent if the purpose of use changes.',
    section1List: [
      'Project estimate and service consultation',
      'Confirmation of scope for security audit and technical consulting',
      'Identity verification and customer inquiry response',
    ],
    section2Title: '◈ 2. Personal Information Collected',
    section2Body: 'IAM collects the following information for smooth consultation and estimates.',
    section2Items: 'Required: Name, Email, Phone, Company name',
    section2Purpose: 'Purpose: Project estimates and security audit technical consultation',
    section2Retention: 'Retention: 1 year after purpose is fulfilled, or immediate destruction upon request',
    section3Title: '◈ 3. Retention and Use Period',
    section3P1:
      'Collected personal information is retained until the purpose of consultation and estimate provision is achieved.',
    section3P2:
      'For consultation history and follow-up, we retain it for 1 year after the purpose is achieved and will destroy it without delay upon the user’s request.',
    section4Title: '◈ 4. Destruction Procedure and Method',
    section4P1:
      'IAM destroys personal information without delay when it is no longer necessary due to expiration of the retention period or achievement of the purpose.',
    section4P2:
      'Information in electronic form is deleted using technical methods that prevent recovery.',
    section5Title: '◈ 5. Data Subject Rights',
    section5P1:
      'Users may at any time access, correct, withdraw consent, or request deletion of their personal information.',
    section5P2:
      'Please contact the privacy officer or representative email (yoojungrim102@gmail.com) in writing, by phone, or email, and we will respond without delay.',
    section6Title: '◈ 6. Privacy Officer',
    section6Name: 'IAM CEO AIN',
    section6Contact: 'Contact: yoojungrim102@gmail.com',
  },
}

export default function PrivacyPolicyModal({
  isOpen,
  onClose,
  language = 'ko',
}: {
  isOpen: boolean
  onClose: () => void
  language?: 'ko' | 'en'
}) {
  if (!isOpen) return null
  const t = content[language]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-lg font-bold">{t.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
            aria-label={t.close}
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>
        <div className="max-h-[calc(85vh-80px)] overflow-y-auto px-6 py-5 text-sm text-gray-700 leading-relaxed">
          <section className="mb-5">
            <h3 className="mb-2 font-bold text-black">{t.section1Title}</h3>
            <p className="mb-2">{t.section1Body}</p>
            <ul className="list-disc pl-5 space-y-1">
              {t.section1List.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="mb-5">
            <h3 className="mb-2 font-bold text-black">{t.section2Title}</h3>
            <p className="mb-2">{t.section2Body}</p>
            <p className="mb-1">{t.section2Items}</p>
            <p className="mb-1">{t.section2Purpose}</p>
            <p>{t.section2Retention}</p>
          </section>
          <section className="mb-5">
            <h3 className="mb-2 font-bold text-black">{t.section3Title}</h3>
            <p className="mb-2">{t.section3P1}</p>
            <p>{t.section3P2}</p>
          </section>
          <section className="mb-5">
            <h3 className="mb-2 font-bold text-black">{t.section4Title}</h3>
            <p className="mb-2">{t.section4P1}</p>
            <p>{t.section4P2}</p>
          </section>
          <section className="mb-5">
            <h3 className="mb-2 font-bold text-black">{t.section5Title}</h3>
            <p className="mb-2">{t.section5P1}</p>
            <p>{t.section5P2}</p>
          </section>
          <section>
            <h3 className="mb-2 font-bold text-black">{t.section6Title}</h3>
            <p className="mb-1">{t.section6Name}</p>
            <p>{t.section6Contact}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
