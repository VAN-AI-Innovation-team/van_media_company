import { useState } from 'react'
import { articles } from './articles.js'
import './App.css'

function GridIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <rect x="2.5" y="2.5" width="5.5" height="5.5" rx="1" />
      <rect x="12" y="2.5" width="5.5" height="5.5" rx="1" />
      <rect x="2.5" y="12" width="5.5" height="5.5" rx="1" />
      <rect x="12" y="12" width="5.5" height="5.5" rx="1" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M3 4.5h14M3 10h14M3 15.5h14" />
    </svg>
  )
}

function ViewButton({ active, children, icon, onClick }) {
  return (
    <button
      className="view-button"
      type="button"
      aria-pressed={active}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

function ArticleVisual({ article }) {
  return (
    <div
      className={`article-visual article-visual--${article.visual}`}
      style={{ '--article-accent': article.accent }}
      aria-hidden="true"
    >
      <span className="visual-orbit" />
      <span className="visual-panel" />
      <strong>{article.category}</strong>
    </div>
  )
}

function ArticleItem({ article }) {
  return (
    <article
      className="article-item"
      style={{ '--article-accent': article.accent }}
    >
      <ArticleVisual article={article} />
      <div className="article-copy">
        <span className="article-category">{article.category}</span>
        <h2>{article.title}</h2>
        <p className="article-summary">{article.summary}</p>
        <div className="article-meta">
          <span>{article.reporter}</span>
          <span className="meta-divider" aria-hidden="true" />
          <time dateTime={article.publishedAt}>{article.publishedLabel}</time>
          <span className="meta-divider" aria-hidden="true" />
          <span>읽는 시간 {article.readTime}</span>
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const [viewMode, setViewMode] = useState('card')

  return (
    <div className="site-shell">
      <header className="masthead">
        <a className="brand" href="#main-content" aria-label="Newsroom 홈">
          <span className="brand-mark" aria-hidden="true">V</span>
          <span>
            <strong>VAN NEWS</strong>
            <small>MEDIA PLATFORM</small>
          </span>
        </a>
        <p>NEWSROOM</p>
      </header>

      <main id="main-content">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">LATEST STORIES</p>
          <h1 id="page-title">
            오늘의 주요 기사
            <span>변화를 읽고, 기록합니다.</span>
          </h1>
          <p className="intro-copy">
            우리 곁에서 시작된 변화와 그 변화를 만드는 사람들의 이야기를 전합니다.
          </p>
        </section>

        <section className="articles" aria-labelledby="articles-title">
          <div className="article-toolbar">
            <div>
              <h2 id="articles-title">전체 기사</h2>
              <p>총 {articles.length}개의 기사</p>
            </div>

            <div className="view-toggle" aria-label="기사 보기 방식">
              <ViewButton
                active={viewMode === 'card'}
                icon={<GridIcon />}
                onClick={() => setViewMode('card')}
              >
                카드형
              </ViewButton>
              <ViewButton
                active={viewMode === 'list'}
                icon={<ListIcon />}
                onClick={() => setViewMode('list')}
              >
                리스트형
              </ViewButton>
            </div>
          </div>

          <div className={`article-collection article-collection--${viewMode}`}>
            {articles.map((article) => (
              <ArticleItem key={article.id} article={article} />
            ))}
          </div>
        </section>
      </main>

      <footer>
        <span>VAN NEWS</span>
        <p>언론사 미디어 플랫폼 프론트엔드 · 1단계</p>
      </footer>
    </div>
  )
}
