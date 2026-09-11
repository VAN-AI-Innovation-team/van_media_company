import { useState } from 'react'
import PressReleasesPanel from './mediaOutreach/PressReleasesPanel.jsx'
import RecommendPanel from './mediaOutreach/RecommendPanel.jsx'
import MailDraftsPanel from './mediaOutreach/MailDraftsPanel.jsx'
import MailSendPanel from './mediaOutreach/MailSendPanel.jsx'
import FollowUpsPanel from './mediaOutreach/FollowUpsPanel.jsx'
import { ToastProvider } from './mediaOutreach/ToastProvider.jsx'

// 흐름: 보도자료 -> 기자 추천 -> 개인화 메일 생성 -> 발송 -> 후속 연락
const STEPS = [
  { key: 'press-releases', label: '1. 보도자료', render: () => <PressReleasesPanel /> },
  { key: 'recommend', label: '2. 기자 추천', render: () => <RecommendPanel /> },
  { key: 'mail-drafts', label: '3. 메일 생성', render: () => <MailDraftsPanel /> },
  { key: 'mail-send', label: '4. 발송', render: () => <MailSendPanel /> },
  { key: 'follow-ups', label: '5. 후속 연락', render: () => <FollowUpsPanel /> },
]

export default function MediaOutreachPage() {
  const [activeStep, setActiveStep] = useState(STEPS[0].key)
  const step = STEPS.find((candidate) => candidate.key === activeStep) ?? STEPS[0]

  return (
    <ToastProvider>
      <main id="main-content" className="outreach-page">
        <p className="eyebrow">MEDIA OUTREACH</p>
        <h1>언론 컨택 자동화</h1>
        <p className="outreach-page__description">
          보도자료 등록부터 기자 추천, 개인화 메일 생성, 발송, 후속 연락까지 media-outreach 백엔드 API로 처리하는
          운영자용 화면입니다.
        </p>

        <nav className="outreach-tabs" aria-label="언론 컨택 단계">
          {STEPS.map((candidate) => (
            <button
              key={candidate.key}
              type="button"
              className={`outreach-tabs__button${activeStep === candidate.key ? ' outreach-tabs__button--active' : ''}`}
              aria-pressed={activeStep === candidate.key}
              onClick={() => setActiveStep(candidate.key)}
            >
              {candidate.label}
            </button>
          ))}
        </nav>

        <div className="outreach-step">{step.render()}</div>
      </main>
    </ToastProvider>
  )
}
