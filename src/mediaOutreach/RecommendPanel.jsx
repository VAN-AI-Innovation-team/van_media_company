import { useMemo, useState } from 'react'
import { recommendJournalists } from '../mediaOutreachApi.js'
import { Panel } from './shared.jsx'
import { useJournalists, usePressReleases } from './hooks.js'

export default function RecommendPanel() {
  const { pressReleases, loading: loadingPressReleases } = usePressReleases()
  const { journalists, loading: loadingJournalists } = useJournalists()
  const [pressReleaseId, setPressReleaseId] = useState('')

  const selectedPressRelease = pressReleases.find((p) => String(p.id) === pressReleaseId) ?? null

  const recommended = useMemo(() => {
    if (!selectedPressRelease) return []
    return recommendJournalists(selectedPressRelease, journalists)
  }, [selectedPressRelease, journalists])

  return (
    <Panel
      title="2. 기자 추천"
      hint="media-outreach 백엔드에는 추천 전용 API가 없어, 보도자료 키워드와 기자의 관심 키워드/출입처를 겹치는 정도로 점수를 매겨 클라이언트에서 추천합니다."
    >
      <div className="outreach-form-grid">
        <div className="outreach-field outreach-field--grow">
          <label>보도자료 선택</label>
          <select value={pressReleaseId} onChange={(event) => setPressReleaseId(event.target.value)}>
            <option value="">선택</option>
            {pressReleases.map((pressRelease) => (
              <option key={pressRelease.id} value={pressRelease.id}>
                #{pressRelease.id} {pressRelease.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(loadingPressReleases || loadingJournalists) && <p className="outreach-empty">불러오는 중…</p>}

      {!loadingPressReleases && pressReleases.length === 0 && (
        <p className="outreach-empty">먼저 1단계에서 보도자료를 등록해 주세요.</p>
      )}

      {selectedPressRelease && (
        <>
          <div className="outreach-chip-list" style={{ marginBottom: 16 }}>
            {selectedPressRelease.keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>

          {recommended.length === 0 && (
            <p className="outreach-empty">키워드/출입처가 겹치는 기자가 없습니다. 3단계에서 기자를 직접 선택해 메일을 생성할 수 있습니다.</p>
          )}

          {recommended.length > 0 && (
            <ul className="outreach-recommend-list">
              {recommended.map(({ journalist, score, matchedKeywords, beatMatches }) => (
                <li key={journalist.id} className="outreach-recommend-card">
                  <div className="outreach-recommend-card__header">
                    <strong>{journalist.name}</strong>
                    <span className="outreach-badge outreach-badge--blue">일치 {score}</span>
                  </div>
                  <p className="outreach-recommend-card__meta">
                    {journalist.mediaOutlet} · {journalist.beat}
                    {beatMatches && ' (출입처 일치)'}
                  </p>
                  <div className="outreach-chip-list">
                    {matchedKeywords.map((keyword) => (
                      <span key={keyword}>{keyword}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Panel>
  )
}
