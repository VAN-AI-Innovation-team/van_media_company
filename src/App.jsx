import { useEffect, useState } from 'react'
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router'
import {
  getArticleById,
  getArticlePage,
  getRelatedArticles,
} from './articles.js'
import {
  applyArticleMetadata,
  applyNotFoundMetadata,
  resetArticleMetadata,
} from './articleMetadata.js'
import { getMessages, normalizeLanguage } from './i18n.js'
import { copyShareUrl, getShareTargets } from './share.js'
import './App.css'

function getPageNumber(value) {
  const page = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(page) && page > 0 ? page : 1
}

function getStateQuery({ page, viewMode }) {
  const params = new URLSearchParams()

  if (page > 1) params.set('page', String(page))
  if (viewMode === 'list') params.set('view', 'list')

  const query = params.toString()
  return query ? `?${query}` : ''
}

function getListUrl(state) {
  const pathname = state.language === 'en' ? '/en/' : '/'
  return `${pathname}${getStateQuery(state)}`
}

function getArticleUrl(articleId, state) {
  const prefix = state.language === 'en' ? '/en' : ''
  return `${prefix}/articles/${articleId}/`
}

function getLocalizedPath(pathname, language) {
  const pathWithoutLanguage = pathname.replace(/^\/en(?=\/|$)/, '') || '/'

  if (language === 'en') {
    return pathWithoutLanguage === '/' ? '/en/' : `/en${pathWithoutLanguage}`
  }

  return pathWithoutLanguage
}

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

function LanguageSwitch({ language, onLanguageChange, copy }) {
  return (
    <div className="language-switch" role="group" aria-label={copy.languageLabel}>
      <button
        type="button"
        aria-label={copy.korean}
        aria-pressed={language === 'ko'}
        onClick={() => onLanguageChange('ko')}
      >
        KO
      </button>
      <button
        type="button"
        aria-label={copy.english}
        aria-pressed={language === 'en'}
        onClick={() => onLanguageChange('en')}
      >
        EN
      </button>
    </div>
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

function ArticleItem({ article, listState, copy }) {
  return (
    <article
      className="article-item"
      style={{ '--article-accent': article.accent }}
    >
      <Link
        className="article-link"
        to={getArticleUrl(article.id, listState)}
        state={{ listUrl: getListUrl(listState) }}
        aria-label={copy.articleLinkLabel(article.title)}
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
            <span>{copy.realSource}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function RelatedArticleCard({ article, listState, listUrl }) {
  return (
    <article className="related-article" style={{ '--article-accent': article.accent }}>
      <Link to={getArticleUrl(article.id, listState)} state={{ listUrl }}>
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

function ShareTools({ article, copy }) {
  const [status, setStatus] = useState('')
  const shareUrl = new URL(window.location.pathname, window.location.origin).href
  const shareTargets = getShareTargets({ title: article.title, url: shareUrl })
  const supportsNativeShare = typeof navigator.share === 'function'

  const copyCurrentUrl = async (message = copy.copied) => {
    try {
      await copyShareUrl(shareUrl)
      setStatus(message)
    } catch {
      setStatus(copy.copyFailed)
    }
  }

  const shareArticle = async () => {
    if (!supportsNativeShare) {
      await copyCurrentUrl(copy.shareUnsupported)
      return
    }

    try {
      await navigator.share({
        title: article.title,
        text: article.summary,
        url: shareUrl,
      })
      setStatus(copy.shared)
    } catch (error) {
      if (error?.name === 'AbortError') {
        setStatus(copy.shareCanceled)
        return
      }

      await copyCurrentUrl(copy.shareFallback)
    }
  }

  return (
    <section className="share-tools" aria-labelledby="share-tools-title">
      <div>
        <p className="eyebrow">{copy.shareEyebrow}</p>
        <h3 id="share-tools-title">{copy.shareTitle}</h3>
      </div>
      <div className="share-tools__actions">
        <button type="button" className="share-button share-button--primary" onClick={shareArticle}>
          <span aria-hidden="true">↗</span>
          {supportsNativeShare ? copy.share : copy.copyLink}
        </button>
        {supportsNativeShare && (
          <button type="button" className="share-button" onClick={() => copyCurrentUrl()}>
            <span aria-hidden="true">⧉</span> {copy.copyLink}
          </button>
        )}
        <a href={shareTargets.x} target="_blank" rel="noreferrer" aria-label={copy.xShareLabel}>X</a>
        <a
          href={shareTargets.facebook}
          target="_blank"
          rel="noreferrer"
          aria-label={copy.facebookShareLabel}
        >
          f
        </a>
      </div>
      <p className="share-tools__status" role="status" aria-live="polite">{status}</p>
    </section>
  )
}

function Pagination({ currentPage, totalPages, onPageChange, copy }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label={copy.paginationLabel}>
      <button
        className="pagination__step"
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <span aria-hidden="true">←</span> {copy.previous}
      </button>

      <div className="pagination__pages">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className="pagination__number"
            type="button"
            aria-current={currentPage === pageNumber ? 'page' : undefined}
            aria-label={copy.pageLabel(pageNumber)}
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
        {copy.next} <span aria-hidden="true">→</span>
      </button>
    </nav>
  )
}

function ArticleListPage({ language, currentPage, setCurrentPage, viewMode, setViewMode }) {
  const copy = getMessages(language)
  const articlePage = getArticlePage({ page: currentPage, language })
  const listState = { language, page: articlePage.page, viewMode }

  useEffect(() => {
    resetArticleMetadata(language)
  }, [language])

  return (
    <main id="main-content">
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">{copy.latestStories}</p>
        <h1 id="page-title">
          {copy.heroTitle}
          <span>{copy.heroAccent}</span>
        </h1>
        <p className="intro-copy">{copy.heroDescription}</p>
      </section>

      <section className="articles" aria-labelledby="articles-title">
        <div className="article-toolbar">
          <div>
            <h2 id="articles-title">{copy.allArticles}</h2>
            <p>{copy.articleCount(articlePage)}</p>
          </div>

          <div className="view-toggle" aria-label={copy.viewModeLabel}>
            <ViewButton
              active={viewMode === 'card'}
              icon={<GridIcon />}
              onClick={() => setViewMode('card')}
            >
              {copy.cardView}
            </ViewButton>
            <ViewButton
              active={viewMode === 'list'}
              icon={<ListIcon />}
              onClick={() => setViewMode('list')}
            >
              {copy.listView}
            </ViewButton>
          </div>
        </div>

        <div className={`article-collection article-collection--${viewMode}`}>
          {articlePage.items.map((article) => (
            <ArticleItem key={article.id} article={article} listState={listState} copy={copy} />
          ))}
        </div>

        <Pagination
          currentPage={articlePage.page}
          totalPages={articlePage.totalPages}
          onPageChange={setCurrentPage}
          copy={copy}
        />
      </section>
    </main>
  )
}

function ArticleRoutePage({ language, listState }) {
  const { articleId } = useParams()
  const location = useLocation()
  const copy = getMessages(language)
  const article = getArticleById(articleId, language)
  const relatedArticles = getRelatedArticles(articleId, 3, language)
  const recentArticles = getArticlePage({ page: 1, limit: 3, language }).items
  const listUrl = location.state?.listUrl ?? getListUrl({
    language,
    page: 1,
    viewMode: 'card',
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [articleId])

  useEffect(() => {
    if (article) applyArticleMetadata(article, language)
    else applyNotFoundMetadata(language)

    return () => resetArticleMetadata(language)
  }, [article, language])

  if (!article) {
    return (
      <main id="main-content" className="route-placeholder">
        <section className="route-placeholder__panel" aria-labelledby="route-title">
          <p className="eyebrow">{copy.notFoundEyebrow}</p>
          <h1 id="route-title">{copy.notFoundTitle}</h1>
          <p>{copy.notFoundDescription}</p>
          <Link className="back-link" to={listUrl}>
            <span aria-hidden="true">←</span> {copy.backToArticles}
          </Link>
          <div className="not-found-suggestions">
            <p>{copy.recentSuggestion}</p>
            <ul>
              {recentArticles.map((item) => (
                <li key={item.id}>
                  <Link to={getArticleUrl(item.id, listState)} state={{ listUrl }}>
                    {item.title}
                  </Link>
                </li>
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
      <nav className="article-breadcrumb" aria-label={copy.breadcrumbLabel}>
        <Link to={listUrl}>{copy.allArticles}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{article.category}</span>
      </nav>

      <article className="article-detail__article" aria-labelledby="article-title">
        <header className="article-detail__header">
          <p className="eyebrow">{article.category} · {copy.articleLabel} {article.id}</p>
          <h1 id="article-title">{article.title}</h1>
          <div className="article-detail__meta">
            <span><small>{copy.source}</small>{article.source.name}</span>
            <time dateTime={article.publishedAt}><small>{copy.published}</small>{article.publishedLabel}</time>
          </div>
          <p className="article-detail__lead">{article.summary}</p>
        </header>

        <ArticleVisual article={article} />

        <div className="article-detail__body">
          <aside aria-label={copy.articleInfo}>
            <p>{copy.articleInfo.toUpperCase()}</p>
            <dl>
              <div><dt>{copy.category}</dt><dd>{article.category}</dd></div>
              <div><dt>{copy.source}</dt><dd>{article.source.name}</dd></div>
              <div><dt>{copy.publishedBasis}</dt><dd>{article.publishedLabel}</dd></div>
            </dl>
          </aside>
          <section aria-labelledby="article-summary-title">
            <p className="eyebrow">{copy.editorSummary}</p>
            <h2 id="article-summary-title">{copy.summaryTitle}</h2>
            <p>{article.summary}</p>
            <div className="article-highlights" aria-labelledby="article-highlights-title">
              <h3 id="article-highlights-title">{copy.highlights}</h3>
              <ul>
                {article.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
            </div>
            <div className="source-notice">
              <strong>{copy.sourceNoticeTitle}</strong>
              <p>{copy.sourceNoticeBody}</p>
            </div>
            <ShareTools key={`${article.id}-${language}`} article={article} copy={copy} />
            <div className="route-actions">
              <a
                className="source-link"
                href={article.source.url}
                target="_blank"
                rel="noreferrer"
              >
                {copy.originalArticle(article.source.name)} <span aria-hidden="true">↗</span>
              </a>
              <Link className="back-link" to={listUrl}>
                <span aria-hidden="true">←</span> {copy.backToArticles}
              </Link>
            </div>
          </section>
        </div>
      </article>

      <section className="related-stories" aria-labelledby="related-stories-title">
        <div className="related-stories__heading">
          <div>
            <p className="eyebrow">RELATED STORIES</p>
            <h2 id="related-stories-title">{copy.relatedStories}</h2>
          </div>
          <Link to={listUrl}>{copy.viewAllArticles} <span aria-hidden="true">→</span></Link>
        </div>
        <div className="related-stories__grid">
          {relatedArticles.map((relatedArticle) => (
            <RelatedArticleCard
              key={relatedArticle.id}
              article={relatedArticle}
              listState={listState}
              listUrl={listUrl}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const language = normalizeLanguage(location.pathname.startsWith('/en') ? 'en' : 'ko')
  const currentPage = getArticlePage({
    page: getPageNumber(searchParams.get('page')),
  }).page
  const viewMode = searchParams.get('view') === 'list' ? 'list' : 'card'
  const copy = getMessages(language)
  const listState = { language, page: currentPage, viewMode }

  const updateSearch = (updates) => {
    const next = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined) next.delete(key)
      else next.set(key, String(value))
    })

    setSearchParams(next)
  }

  const changeLanguage = (nextLanguage) => {
    const pathname = getLocalizedPath(location.pathname, nextLanguage)
    navigate(`${pathname}${location.search}`, {
      replace: true,
      state: location.state,
    })
  }

  const changePage = (page) => {
    updateSearch({ page: page > 1 ? page : null })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const changeViewMode = (mode) => {
    updateSearch({ view: mode === 'list' ? 'list' : null })
  }

  useEffect(() => {
    document.documentElement.lang = copy.htmlLanguage
  }, [copy.htmlLanguage])

  return (
    <div className="site-shell">
      <header className="masthead">
        <Link className="brand" to={getListUrl(listState)} aria-label={copy.homeLabel}>
          <span className="brand-mark" aria-hidden="true">V</span>
          <span>
            <strong>VAN NEWS</strong>
            <small>MEDIA PLATFORM</small>
          </span>
        </Link>
        <div className="masthead-actions">
          <p>{copy.newsroom}</p>
          <LanguageSwitch
            language={language}
            onLanguageChange={changeLanguage}
            copy={copy}
          />
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <ArticleListPage
              language={language}
              currentPage={currentPage}
              setCurrentPage={changePage}
              viewMode={viewMode}
              setViewMode={changeViewMode}
            />
          }
        />
        <Route
          path="/en"
          element={
            <ArticleListPage
              language={language}
              currentPage={currentPage}
              setCurrentPage={changePage}
              viewMode={viewMode}
              setViewMode={changeViewMode}
            />
          }
        />
        <Route
          path="/articles/:articleId"
          element={<ArticleRoutePage language={language} listState={listState} />}
        />
        <Route
          path="/en/articles/:articleId"
          element={<ArticleRoutePage language={language} listState={listState} />}
        />
      </Routes>

      <footer>
        <span>VAN NEWS</span>
        <p>{copy.footerDescription}</p>
      </footer>
    </div>
  )
}
