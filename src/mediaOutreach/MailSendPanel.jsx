import { useState } from 'react'
import { MailDraftApi, MailSendApi } from '../mediaOutreachApi.js'
import { JobStatusBadge, Notice, Panel, RawViewer, useNotice } from './shared.jsx'
import DateTimeField from './DateTimeField.jsx'

export default function MailSendPanel() {
  const { notice, ok, err, clear } = useNotice()

  const [approvedDrafts, setApprovedDrafts] = useState([])
  const [loadingDrafts, setLoadingDrafts] = useState(false)
  const [selected, setSelected] = useState(new Set())
  const [scheduledAt, setScheduledAt] = useState('')
  const [forceSend, setForceSend] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [targetResults, setTargetResults] = useState(null)

  const [journalistIdFilter, setJournalistIdFilter] = useState('')
  const [jobs, setJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [jobsLoaded, setJobsLoaded] = useState(false)
  const [busyJobId, setBusyJobId] = useState(null)
  const [rescheduleValue, setRescheduleValue] = useState({})

  async function loadApprovedDrafts() {
    clear()
    setLoadingDrafts(true)
    try {
      setApprovedDrafts(await MailDraftApi.list({ status: 'APPROVED' }))
    } catch (caught) {
      err(caught)
    } finally {
      setLoadingDrafts(false)
    }
  }

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function confirmTargets() {
    clear()
    setConfirming(true)
    setTargetResults(null)
    try {
      const result = await MailSendApi.confirmTargets({
        mailDraftIds: [...selected],
        scheduledAt: scheduledAt || null,
        forceSend,
      })
      setTargetResults(result)
      ok(`${result.filter((r) => r.accepted).length}/${result.length}건 발송 대상으로 확정되었습니다.`)
      setSelected(new Set())
    } catch (caught) {
      err(caught)
    } finally {
      setConfirming(false)
    }
  }

  async function loadJobs() {
    if (!journalistIdFilter) return
    clear()
    setLoadingJobs(true)
    try {
      setJobs(await MailSendApi.listByJournalist(Number(journalistIdFilter)))
      setJobsLoaded(true)
    } catch (caught) {
      err(caught)
    } finally {
      setLoadingJobs(false)
    }
  }

  function updateJob(updated) {
    setJobs((prev) => prev.map((job) => (job.id === updated.id ? updated : job)))
  }

  async function act(jobId, action) {
    clear()
    setBusyJobId(jobId)
    try {
      const updated = await MailSendApi[action](jobId)
      updateJob(updated)
      ok(`작업 #${jobId} ${action} 처리했습니다.`)
    } catch (caught) {
      err(caught)
    } finally {
      setBusyJobId(null)
    }
  }

  async function reschedule(jobId) {
    const value = rescheduleValue[jobId]
    if (!value) return
    clear()
    setBusyJobId(jobId)
    try {
      const updated = await MailSendApi.reschedule(jobId, value)
      updateJob(updated)
      ok(`작업 #${jobId} 일정을 변경했습니다.`)
    } catch (caught) {
      err(caught)
    } finally {
      setBusyJobId(null)
    }
  }

  return (
    <div>
      <Panel title="4. 발송 대상 확정" hint="승인된 초안 중 발송할 대상을 선택하고 확정합니다. 확정 시 중복 발송/수신거부 여부를 검증합니다.">
        <Notice notice={notice} />
        <button className="outreach-btn outreach-btn--sm" onClick={loadApprovedDrafts} disabled={loadingDrafts}>
          {loadingDrafts ? '불러오는 중…' : '승인된 초안 불러오기'}
        </button>

        {approvedDrafts.length > 0 && (
          <div className="outreach-table-wrap" style={{ marginTop: 12 }}>
            <table className="outreach-table">
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>제목</th>
                  <th>기자ID</th>
                  <th>보도자료ID</th>
                </tr>
              </thead>
              <tbody>
                {approvedDrafts.map((draft) => (
                  <tr key={draft.id}>
                    <td>
                      <input type="checkbox" checked={selected.has(draft.id)} onChange={() => toggle(draft.id)} />
                    </td>
                    <td className="outreach-mono">{draft.id}</td>
                    <td>{draft.subject}</td>
                    <td className="outreach-mono">{draft.journalistId}</td>
                    <td className="outreach-mono">{draft.pressReleaseId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="outreach-form-grid" style={{ marginTop: 14 }}>
          <div className="outreach-field">
            <label>예약 발송 시각 (선택)</label>
            <DateTimeField value={scheduledAt} onChange={setScheduledAt} placeholder="즉시 발송" />
          </div>
          <div className="outreach-field">
            <label>강제 발송</label>
            <label className="outreach-checkbox-row">
              <input type="checkbox" checked={forceSend} onChange={(event) => setForceSend(event.target.checked)} /> forceSend
            </label>
          </div>
        </div>
        <button className="outreach-btn outreach-btn--primary" disabled={confirming || selected.size === 0} onClick={confirmTargets}>
          {confirming ? '확정 중…' : `선택한 ${selected.size}건 발송 대상 확정`}
        </button>

        {targetResults && (
          <div className="outreach-table-wrap" style={{ marginTop: 14 }}>
            <table className="outreach-table">
              <thead>
                <tr>
                  <th>초안ID</th>
                  <th>기자ID</th>
                  <th>결과</th>
                  <th>작업ID</th>
                  <th>사유</th>
                </tr>
              </thead>
              <tbody>
                {targetResults.map((result) => (
                  <tr key={result.mailDraftId}>
                    <td className="outreach-mono">{result.mailDraftId}</td>
                    <td className="outreach-mono">{result.journalistId}</td>
                    <td>
                      {result.accepted ? (
                        <span className="outreach-badge outreach-badge--green">확정</span>
                      ) : (
                        <span className="outreach-badge outreach-badge--red">거부</span>
                      )}
                    </td>
                    <td className="outreach-mono">{result.jobId ?? '-'}</td>
                    <td className="outreach-muted">{result.reason ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title="발송 작업 조회/관리">
        <div className="outreach-form-grid">
          <div className="outreach-field">
            <label>기자 ID</label>
            <input value={journalistIdFilter} onChange={(event) => setJournalistIdFilter(event.target.value)} placeholder="예: 1" />
          </div>
        </div>
        <button className="outreach-btn outreach-btn--sm" disabled={loadingJobs || !journalistIdFilter} onClick={loadJobs}>
          {loadingJobs ? '조회 중…' : '조회'}
        </button>

        {jobsLoaded && jobs.length === 0 && <p className="outreach-empty">해당 기자의 발송 작업이 없습니다.</p>}

        {jobs.map((job) => (
          <div key={job.id} className="outreach-item">
            <div className="outreach-item__row">
              <div>
                <span className="outreach-mono">#{job.id}</span> <JobStatusBadge status={job.status} />{' '}
                {job.forced && <span className="outreach-badge outreach-badge--yellow">forced</span>}
              </div>
              <span className="outreach-muted">
                예약: {job.scheduledAt ?? '-'} · 발송: {job.sentAt ?? '-'} · 재시도 {job.retryCount}회
              </span>
            </div>
            {job.lastError && <div className="outreach-notice outreach-notice--err">{job.lastError}</div>}
            <div className="outreach-actions" style={{ marginTop: 10 }}>
              <button className="outreach-btn outreach-btn--sm" disabled={busyJobId === job.id} onClick={() => act(job.id, 'pause')}>
                일시정지
              </button>
              <button className="outreach-btn outreach-btn--sm" disabled={busyJobId === job.id} onClick={() => act(job.id, 'resume')}>
                재개
              </button>
              <button className="outreach-btn outreach-btn--sm outreach-btn--danger" disabled={busyJobId === job.id} onClick={() => act(job.id, 'cancel')}>
                취소
              </button>
              <DateTimeField
                value={rescheduleValue[job.id] ?? ''}
                onChange={(value) => setRescheduleValue({ ...rescheduleValue, [job.id]: value })}
                placeholder="새 발송 시각"
              />
              <button
                className="outreach-btn outreach-btn--sm"
                disabled={busyJobId === job.id || !rescheduleValue[job.id]}
                onClick={() => reschedule(job.id)}
              >
                일정 변경
              </button>
            </div>
            <RawViewer label="raw" data={job} />
          </div>
        ))}
      </Panel>
    </div>
  )
}
