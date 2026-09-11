import { useState } from 'react'
import { FollowUpApi } from '../mediaOutreachApi.js'
import { FollowUpStatusBadge, Notice, Panel, RawViewer, useNotice } from './shared.jsx'
import { useJournalists, usePressReleases } from './hooks.js'

export default function FollowUpsPanel() {
  const { journalists } = useJournalists()
  const { pressReleases } = usePressReleases()
  const { notice, ok, err, clear } = useNotice()

  const [pending, setPending] = useState([])
  const [loadingPending, setLoadingPending] = useState(false)
  const [pendingLoaded, setPendingLoaded] = useState(false)

  const [journalistIdFilter, setJournalistIdFilter] = useState('')
  const [byJournalist, setByJournalist] = useState(null)
  const [loadingByJournalist, setLoadingByJournalist] = useState(false)

  const [manualForm, setManualForm] = useState({ journalistId: '', pressReleaseId: '' })
  const [adding, setAdding] = useState(false)

  const [timelineJournalistId, setTimelineJournalistId] = useState('')
  const [timeline, setTimeline] = useState(null)
  const [loadingTimeline, setLoadingTimeline] = useState(false)

  const [busyId, setBusyId] = useState(null)

  function journalistName(id) {
    return journalists.find((j) => j.id === id)?.name ?? `#${id}`
  }
  function pressReleaseTitle(id) {
    return pressReleases.find((p) => p.id === id)?.title ?? `#${id}`
  }

  async function loadPending() {
    clear()
    setLoadingPending(true)
    try {
      setPending(await FollowUpApi.pending())
      setPendingLoaded(true)
    } catch (caught) {
      err(caught)
    } finally {
      setLoadingPending(false)
    }
  }

  async function loadByJournalist() {
    if (!journalistIdFilter) return
    clear()
    setLoadingByJournalist(true)
    try {
      setByJournalist(await FollowUpApi.byJournalist(Number(journalistIdFilter)))
    } catch (caught) {
      err(caught)
    } finally {
      setLoadingByJournalist(false)
    }
  }

  async function addManual() {
    clear()
    setAdding(true)
    try {
      const created = await FollowUpApi.addManual({
        journalistId: Number(manualForm.journalistId),
        pressReleaseId: Number(manualForm.pressReleaseId),
      })
      ok(`후속 연락 #${created.id}을(를) 등록했습니다.`)
      setManualForm({ journalistId: '', pressReleaseId: '' })
      setPending((prev) => [created, ...prev])
    } catch (caught) {
      err(caught)
    } finally {
      setAdding(false)
    }
  }

  function replaceIn(list, updated) {
    return list.map((item) => (item.id === updated.id ? updated : item))
  }

  async function send(id) {
    clear()
    setBusyId(id)
    try {
      const updated = await FollowUpApi.send(id)
      setPending((prev) => replaceIn(prev, updated))
      setByJournalist((prev) => (prev ? replaceIn(prev, updated) : prev))
      ok(`후속 연락 #${id} 메일을 생성/발송했습니다.`)
    } catch (caught) {
      err(caught)
    } finally {
      setBusyId(null)
    }
  }

  async function cancel(id) {
    if (!window.confirm(`후속 연락 #${id}을(를) 취소할까요?`)) return
    clear()
    setBusyId(id)
    try {
      await FollowUpApi.cancel(id)
      setPending((prev) => prev.filter((item) => item.id !== id))
      setByJournalist((prev) => (prev ? prev.filter((item) => item.id !== id) : prev))
      ok(`후속 연락 #${id}을(를) 취소했습니다.`)
    } catch (caught) {
      err(caught)
    } finally {
      setBusyId(null)
    }
  }

  async function loadTimeline() {
    if (!timelineJournalistId) return
    clear()
    setLoadingTimeline(true)
    try {
      setTimeline(await FollowUpApi.timeline(Number(timelineJournalistId)))
    } catch (caught) {
      err(caught)
    } finally {
      setLoadingTimeline(false)
    }
  }

  function renderRow(followUp) {
    return (
      <tr key={followUp.id}>
        <td className="outreach-mono">{followUp.id}</td>
        <td>{journalistName(followUp.journalistId)}</td>
        <td>{pressReleaseTitle(followUp.pressReleaseId)}</td>
        <td>{followUp.sequenceNo}</td>
        <td className="outreach-mono">{followUp.dueAt}</td>
        <td>
          <FollowUpStatusBadge status={followUp.status} />
        </td>
        <td className="outreach-actions">
          <button
            className="outreach-btn outreach-btn--sm outreach-btn--primary"
            disabled={busyId === followUp.id || followUp.status !== 'PENDING'}
            onClick={() => send(followUp.id)}
          >
            발송
          </button>
          <button
            className="outreach-btn outreach-btn--sm outreach-btn--danger"
            disabled={busyId === followUp.id || followUp.status !== 'PENDING'}
            onClick={() => cancel(followUp.id)}
          >
            취소
          </button>
        </td>
      </tr>
    )
  }

  return (
    <div>
      <Panel title="5. 후속 연락 수동 등록" hint="미회신 기자는 백엔드가 매일 자동으로 등록하지만, 필요하면 수동으로도 추가할 수 있습니다.">
        <Notice notice={notice} />
        <div className="outreach-form-grid">
          <div className="outreach-field">
            <label>기자</label>
            <select value={manualForm.journalistId} onChange={(event) => setManualForm({ ...manualForm, journalistId: event.target.value })}>
              <option value="">선택</option>
              {journalists.map((journalist) => (
                <option key={journalist.id} value={journalist.id}>
                  #{journalist.id} {journalist.name}
                </option>
              ))}
            </select>
          </div>
          <div className="outreach-field">
            <label>보도자료</label>
            <select
              value={manualForm.pressReleaseId}
              onChange={(event) => setManualForm({ ...manualForm, pressReleaseId: event.target.value })}
            >
              <option value="">선택</option>
              {pressReleases.map((pressRelease) => (
                <option key={pressRelease.id} value={pressRelease.id}>
                  #{pressRelease.id} {pressRelease.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="outreach-btn outreach-btn--primary"
          disabled={adding || !manualForm.journalistId || !manualForm.pressReleaseId}
          onClick={addManual}
        >
          등록
        </button>
      </Panel>

      <Panel title="대기 중인 후속 연락 (pending)">
        <button className="outreach-btn outreach-btn--sm" onClick={loadPending} disabled={loadingPending}>
          {loadingPending ? '조회 중…' : '조회'}
        </button>
        {pendingLoaded && pending.length === 0 && <p className="outreach-empty">대기 중인 후속 연락이 없습니다.</p>}
        {pending.length > 0 && (
          <div className="outreach-table-wrap" style={{ marginTop: 12 }}>
            <table className="outreach-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>기자</th>
                  <th>보도자료</th>
                  <th>차수</th>
                  <th>예정일</th>
                  <th>상태</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{pending.map(renderRow)}</tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title="기자별 후속 연락 조회">
        <div className="outreach-form-grid">
          <div className="outreach-field">
            <label>기자 ID</label>
            <input value={journalistIdFilter} onChange={(event) => setJournalistIdFilter(event.target.value)} placeholder="예: 1" />
          </div>
        </div>
        <button className="outreach-btn outreach-btn--sm" disabled={loadingByJournalist || !journalistIdFilter} onClick={loadByJournalist}>
          {loadingByJournalist ? '조회 중…' : '조회'}
        </button>
        {byJournalist !== null && byJournalist.length === 0 && <p className="outreach-empty">이력이 없습니다.</p>}
        {byJournalist && byJournalist.length > 0 && (
          <div className="outreach-table-wrap" style={{ marginTop: 12 }}>
            <table className="outreach-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>기자</th>
                  <th>보도자료</th>
                  <th>차수</th>
                  <th>예정일</th>
                  <th>상태</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{byJournalist.map(renderRow)}</tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title="최초 발송~후속 연락 통합 타임라인">
        <div className="outreach-form-grid">
          <div className="outreach-field">
            <label>기자 ID</label>
            <input value={timelineJournalistId} onChange={(event) => setTimelineJournalistId(event.target.value)} placeholder="예: 1" />
          </div>
        </div>
        <button className="outreach-btn outreach-btn--sm" disabled={loadingTimeline || !timelineJournalistId} onClick={loadTimeline}>
          {loadingTimeline ? '조회 중…' : '조회'}
        </button>
        {timeline !== null &&
          (timeline.length === 0 ? (
            <p className="outreach-empty">이력이 없습니다.</p>
          ) : (
            <RawViewer label={`타임라인 상세 보기 (${timeline.length}건)`} data={timeline} />
          ))}
      </Panel>
    </div>
  )
}
