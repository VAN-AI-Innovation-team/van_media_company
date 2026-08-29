import { useEffect, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router'
import {
  articles,
  getArticleById,
  getArticlePage,
  getRelatedArticles,
} from './articles.js'
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
      <Link
        className="article-link"
        to={`/articles/${article.id}`}
        aria-label={`${article.title} 기사 보기`}
      >
        <ArticleVisual article={article} />
        <div className="article-copy">
          <span className="article-category">{article.category}</span>
          <h2>{article.title}</h2>
          <p className="article-summary">{article.summary}</p>
          <div className="article-meta">
            <span>{article.source.name}</span>
            <span className="meta-divider" aria-hidden="true" />
            <time dateTime={article.publishedAt}>{article.publishedLabel}</time>
            <span className="meta-divider" aria-hidden="true" />
            <span>실제 기사 원문 연결</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function RelatedArticleCard({ article }) {
  return (
    <article className="related-article" style={{ '--article-accent': article.accent }}>
      <Link to={`/articles/${article.id}`}>
        <ArticleVisual article={article} />
        <div>
          <span>{article.category}</span>
          <h3>{article.title}</h3>
          <p>{article.source.name} · {article.publishedLabel}</p>
        </div>
      </Link>
    </article>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label="기사 목록 페이지">
      <button
        className="pagination__step"
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <span aria-hidden="true">←</span> 이전
      </button>

      <div className="pagination__pages">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className="pagination__number"
            type="button"
            aria-current={currentPage === pageNumber ? 'page' : undefined}
            aria-label={`${pageNumber}페이지`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        className="pagination__step"
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음 <span aria-hidden="true">→</span>
      </button>
    </nav>
  )
}

function ArticleListPage({ currentPage, setCurrentPage, viewMode, setViewMode }) {
  const articlePage = getArticlePage({ page: currentPage })

  return (
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
            <p>
              총 {articlePage.totalItems}개의 실제 기사 · {articlePage.page} /{' '}
              {articlePage.totalPages} 페이지
            </p>
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
          {articlePage.items.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </div>

        <Pagination
          currentPage={articlePage.page}
          totalPages={articlePage.totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  )
}

function ArticleRoutePage() {
  const { articleId } = useParams()
  const article = getArticleById(articleId)
  const relatedArticles = getRelatedArticles(articleId)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [articleId])

  if (!article) {
    return (
      <main id="main-content" className="route-placeholder">
        <section className="route-placeholder__panel" aria-labelledby="route-title">
          <p className="eyebrow">ARTICLE NOT FOUND</p>
          <h1 id="route-title">요청한 기사를 찾을 수 없습니다.</h1>
          <p>주소를 다시 확인하거나 전체 기사 목록으로 돌아가 주세요.</p>
          <Link className="back-link" to="/">
            <span aria-hidden="true">←</span> 전체 기사로 돌아가기
          </Link>
          <div className="not-found-suggestions">
            <p>대신 최근 기사를 확인해 보세요.</p>
            <ul>
              {articles.slice(0, 3).map((item) => (
                <li key={item.id}><Link to={`/articles/${item.id}`}>{item.title}</Link></li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main
      id="main-content"
      className="article-detail"
      style={{ '--article-accent': article.accent }}
    >
      <nav className="article-breadcrumb" aria-label="현재 위치">
        <Link to="/">전체 기사</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{article.category}</span>
      </nav>

      <article className="article-detail__article" aria-labelledby="article-title">
        <header className="article-detail__header">
          <p className="eyebrow">{article.category} · ARTICLE {article.id}</p>
          <h1 id="article-title">{article.title}</h1>
          <div className="article-detail__meta">
            <span><small>출처</small>{article.source.name}</span>
            <time dateTime={article.publishedAt}><small>발행일</small>{article.publishedLabel}</time>
          </div>
          <p className="article-detail__lead">{article.summary}</p>
        </header>

        <ArticleVisual article={article} />

        <div className="article-detail__body">
          <aside aria-label="기사 정보">
            <p>ARTICLE INFO</p>
            <dl>
              <div><dt>분야</dt><dd>{article.category}</dd></div>
              <div><dt>출처</dt><dd>{article.source.name}</dd></div>
              <div><dt>게시 기준</dt><dd>{article.publishedLabel}</dd></div>
            </dl>
          </aside>
          <section aria-labelledby="article-summary-title">
            <p className="eyebrow">EDITOR&apos;S SUMMARY</p>
            <h2 id="article-summary-title">기사 핵심 요약</h2>
            <p>{article.summary}</p>
            <div className="article-highlights" aria-labelledby="article-highlights-title">
              <h3 id="article-highlights-title">핵심 포인트</h3>
              <ul>
                {article.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
            </div>
            <div className="source-notice">
              <strong>원문 이용 안내</strong>
              <p>기사 전문은 복제하지 않았습니다. 아래 버튼을 누르면 해당 언론사의 실제 원문으로 이동합니다.</p>
            </div>
            <div className="route-actions">
              <a
                className="source-link"
                href={article.source.url}
                target="_blank"
                rel="noreferrer"
              >
                {article.source.name} 원문 기사 보기 <span aria-hidden="true">↗</span>
              </a>
              <Link className="back-link" to="/">
                <span aria-hidden="true">←</span> 전체 기사로 돌아가기
              </Link>
            </div>
          </section>
        </div>
      </article>

      <section className="related-stories" aria-labelledby="related-stories-title">
        <div className="related-stories__heading">
          <div>
            <p className="eyebrow">RELATED STORIES</p>
            <h2 id="related-stories-title">함께 읽을 기사</h2>
          </div>
          <Link to="/">전체 기사 보기 <span aria-hidden="true">→</span></Link>
        </div>
        <div className="related-stories__grid">
          {relatedArticles.map((relatedArticle) => (
            <RelatedArticleCard key={relatedArticle.id} article={relatedArticle} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const [viewMode, setViewMode] = useState('card')
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="site-shell">
      <header className="masthead">
        <Link className="brand" to="/" aria-label="VAN News 홈">
          <span className="brand-mark" aria-hidden="true">V</span>
          <span>
            <strong>VAN NEWS</strong>
            <small>MEDIA PLATFORM</small>
          </span>
        </Link>
        <p>NEWSROOM</p>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <ArticleListPage
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          }
        />
        <Route path="/articles/:articleId" element={<ArticleRoutePage />} />
      </Routes>

      <footer>
        <span>VAN NEWS</span>
        <p>언론사 미디어 플랫폼 프론트엔드</p>
      </footer>
    </div>
  )
}
