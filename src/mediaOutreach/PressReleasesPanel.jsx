import { useState } from 'react'
import { PressReleaseApi } from '../mediaOutreachApi.js'
import { Notice, Panel, splitKeywords, useNotice } from './shared.jsx'
import { usePressReleases } from './hooks.js'

export default function PressReleasesPanel() {
  const { pressReleases, loading, reload } = usePressReleases()
  const { notice, ok, err, clear } = useNotice()
  const [form, setForm] = useState({ title: '', content: '', keywords: '' })
  const [creating, setCreating] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  async function create() {
    clear()
    setCreating(true)
    try {
      await PressReleaseApi.create({
        title: form.title,
        content: form.content,
        keywords: splitKeywords(form.keywords),
      })
      ok('보도자료를 등록했습니다.')
      setForm({ title: '', content: '', keywords: '' })
      reload()
    } catch (caught) {
      err(caught)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <Panel title="1. 보도자료 등록">
        <Notice notice={notice} />
        <div className="outreach-form-grid">
          <div className="outreach-field outreach-field--grow">
            <label>제목</label>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </div>
          <div className="outreach-field outreach-field--grow">
            <label>키워드 (콤마 구분)</label>
            <input
              value={form.keywords}
              onChange={(event) => setForm({ ...form, keywords: event.target.value })}
              placeholder="AI, 반도체"
            />
          </div>
        </div>
        <div className="outreach-field outreach-field--grow" style={{ marginBottom: 12 }}>
          <label>본문</label>
          <textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows={5} />
        </div>
        <button className="outreach-btn outreach-btn--primary" disabled={creating || !form.title || !form.content} onClick={create}>
          {creating ? '등록 중…' : '등록'}
        </button>
      </Panel>

      <Panel title={`보도자료 목록 (${pressReleases.length})`}>
        <button className="outreach-btn outreach-btn--sm" onClick={reload} disabled={loading}>
          새로고침
        </button>

        {pressReleases.length === 0 && !loading && <p className="outreach-empty">등록된 보도자료가 없습니다.</p>}

        {pressReleases.map((pressRelease) => (
          <div key={pressRelease.id} className="outreach-item">
            <div className="outreach-item__row">
              <div>
                <span className="outreach-mono">#{pressRelease.id}</span> <strong>{pressRelease.title}</strong>
              </div>
              <button
                className="outreach-btn outreach-btn--sm"
                onClick={() => setExpandedId(expandedId === pressRelease.id ? null : pressRelease.id)}
              >
                {expandedId === pressRelease.id ? '본문 닫기' : '본문 보기'}
              </button>
            </div>
            <div className="outreach-chip-list">
              {pressRelease.keywords.map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
            {expandedId === pressRelease.id && <p className="outreach-item__body">{pressRelease.content}</p>}
          </div>
        ))}
      </Panel>
    </div>
  )
}
