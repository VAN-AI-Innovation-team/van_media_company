import { useState } from 'react'
import { MediaOutreachApiError } from '../mediaOutreachApi.js'
import { useToast } from './ToastProvider.jsx'

export function errorText(error) {
  if (error instanceof MediaOutreachApiError) {
    const body = typeof error.body === 'string' ? error.body : JSON.stringify(error.body)
    return `HTTP ${error.status} — ${body}`
  }
  if (error instanceof Error) return error.message
  return String(error)
}

// 알림은 토스트로 뜬다. notice/clear는 과거 인라인 배너 API와 호환을 위해 남겨두되 항상 비어 있다.
export function useNotice() {
  const pushToast = useToast()
  const [notice] = useState(null)
  const ok = (text) => pushToast('ok', text)
  const err = (error) => pushToast('err', errorText(error))
  const clear = () => {}
  return { notice, ok, err, clear }
}

export function Notice({ notice }) {
  if (!notice) return null
  return <div className={`outreach-notice outreach-notice--${notice.type}`}>{notice.text}</div>
}

export function Panel({ title, hint, children }) {
  return (
    <section className="outreach-panel">
      <h2>{title}</h2>
      {hint && <p className="outreach-panel__hint">{hint}</p>}
      {children}
    </section>
  )
}

export function Badge({ text, tone = 'gray' }) {
  return <span className={`outreach-badge outreach-badge--${tone}`}>{text}</span>
}

const DRAFT_TONE = { DRAFT: 'gray', EDITED: 'blue', APPROVED: 'green' }
export function DraftStatusBadge({ status }) {
  return <Badge text={status} tone={DRAFT_TONE[status] ?? 'gray'} />
}

const JOB_TONE = {
  SCHEDULED: 'blue',
  QUEUED: 'blue',
  SENDING: 'yellow',
  SENT: 'green',
  FAILED: 'red',
  CANCELLED: 'gray',
  PAUSED: 'yellow',
}
export function JobStatusBadge({ status }) {
  return <Badge text={status} tone={JOB_TONE[status] ?? 'gray'} />
}

const FOLLOWUP_TONE = { PENDING: 'yellow', SENT: 'green', CANCELLED: 'gray' }
export function FollowUpStatusBadge({ status }) {
  return <Badge text={status} tone={FOLLOWUP_TONE[status] ?? 'gray'} />
}

export function RawViewer({ label, data }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="outreach-raw">
      <button type="button" className="outreach-raw__toggle" onClick={() => setOpen((value) => !value)}>
        {open ? '▾' : '▸'} {label}
      </button>
      {open && <pre className="outreach-raw__body">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}

export function splitKeywords(input) {
  return input
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)
}
