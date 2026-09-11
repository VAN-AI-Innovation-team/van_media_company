import { useCallback, useEffect, useState } from 'react'
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
  getAllArticles,
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
import { useArticleRequest } from './useArticleRequest.js'
import {
  copyShareUrl,
  getShareTargets,
  shareWithDevice,
  supportsNativeShare,
} from './share.js'
import MediaOutreachPage from './MediaOutreachPage.jsx'
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

function ShareIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 4l14 16M19 4 5 20" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M14 21v-8h3l.5-4H14V7.2c0-1.2.6-2.2 2.4-2.2H18V1.5c-.7-.1-1.8-.2-3-.2-3 0-5 1.8-5 5.2V9H7v4h3v8" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle className="instagram-dot" cx="17.4" cy="6.7" r="1" />
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

function ArticleVisual({ article, detail = false }) {
  if (article.image) {
    return (
      <figure className={`article-visual article-visual--photo${detail ? ' article-visual--detail' : ''}`}>
        <img
          src={article.image.src}
          alt={article.image.alt}
          width={article.image.width}
          height={article.image.height}
          style={{
            '--image-position': article.image.objectPosition ?? '50% 50%',
            '--image-fit': detail ? 'contain' : article.image.cardFit ?? 'cover',
          }}
          loading={detail ? 'eager' : 'lazy'}
          decoding="async"
        />
        {detail && (article.image.caption || article.image.credit) && (
          <figcaption className="article-visual__caption">
            {article.image.caption && <span>{article.image.caption}</span>}
            {article.image.credit && <small>{article.image.credit}</small>}
          </figcaption>
        )}
      </figure>
    )
  }

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

function ArticleStory({ article }) {
  const inlineImages = article.inlineImages ?? []

  return (
    <div className="article-story">
      {article.body.flatMap((paragraph, index) => {
        const imagesAfterParagraph = inlineImages.filter(
          (image) => image.afterParagraph === index + 1,
        )

        return [
          <p key={`paragraph-${index}`}>{paragraph}</p>,
          ...imagesAfterParagraph.map((image) => (
            <figure className="article-story__media" key={image.id ?? image.src}>
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                style={{ '--image-position': image.objectPosition ?? '50% 50%' }}
                loading="lazy"
                decoding="async"
              />
              {(image.caption || image.credit) && (
                <figcaption>
                  {image.caption && <span>{image.caption}</span>}
                  {image.credit && <small>{image.credit}</small>}
                </figcaption>
              )}
            </figure>
          )),
        ]
      })}
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
            <span>{article.author.name}</span>
            <span className="meta-divider" aria-hidden="true" />
            <time dateTime={article.publishedAt}>{article.publishedLabel}</time>
            <span className="meta-divider" aria-hidden="true" />
            <span>{copy.readFullArticle}</span>
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
          <p>{article.author.name} · {article.publishedLabel}</p>
        </div>
      </Link>
    </article>
  )
}

function ShareTools({ article, copy }) {
  const [status, setStatus] = useState('')
  const shareUrl = new URL(
    `${window.location.pathname}${window.location.search}`,
    window.location.origin,
  ).href
  const shareData = {
    title: article.title,
    text: article.summary,
    url: shareUrl,
  }
  const shareTargets = getShareTargets({ title: article.title, url: shareUrl })
  const nativeShareAvailable = supportsNativeShare(navigator, shareData)

  const copyCurrentUrl = async (message = copy.copied) => {
    try {
      await copyShareUrl(shareUrl)
      setStatus(message)
    } catch {
      setStatus(copy.copyFailed)
    }
  }

  const shareArticle = async () => {
    const result = await shareWithDevice(shareData, navigator)

    if (result.status === 'unsupported') {
      await copyCurrentUrl(copy.shareUnsupported)
      return
    }

    if (result.status === 'shared') {
      setStatus(copy.shared)
      return
    }

    if (result.status === 'canceled') {
      setStatus(copy.shareCanceled)
      return
    }

    await copyCurrentUrl(copy.shareFallback)
  }

  return (
    <section className="share-tools" aria-labelledby="share-tools-title">
      <div>
        <p className="eyebrow">{copy.shareEyebrow}</p>
        <h3 id="share-tools-title">{copy.shareTitle}</h3>
      </div>
      <div className="share-tools__native">
        <span className="share-tools__native-icon" aria-hidden="true">
          <ShareIcon />
        </span>
        <div className="share-tools__native-copy">
          <strong>{copy.deviceShareTitle}</strong>
          <p>{copy.deviceShareDescription}</p>
          <span className="share-tools__support">
            {nativeShareAvailable ? copy.deviceShareAvailable : copy.deviceShareFallback}
          </span>
        </div>
        <button type="button" className="share-button share-button--primary" onClick={shareArticle}>
          <ShareIcon />
          {nativeShareAvailable ? copy.deviceShare : copy.copyLink}
        </button>
      </div>
      <div className="share-tools__actions">
        {nativeShareAvailable && (
          <button type="button" className="share-button" onClick={() => copyCurrentUrl()}>
            <CopyIcon /> {copy.copyLink}
          </button>
        )}
        <a
          className="social-share social-share--x"
          href={shareTargets.x}
          target="_blank"
          rel="noreferrer"
          aria-label={copy.xShareLabel}
          title={copy.xShareLabel}
        >
          <XIcon />
        </a>
        <a
          className="social-share social-share--facebook"
          href={shareTargets.facebook}
          target="_blank"
          rel="noreferrer"
          aria-label={copy.facebookShareLabel}
          title={copy.facebookShareLabel}
        >
          <FacebookIcon />
        </a>
        <a
          className="social-share social-share--instagram"
          href={shareTargets.instagram}
          target="_blank"
          rel="noreferrer"
          aria-label={copy.instagramShareLabel}
          title={copy.instagramShareLabel}
          onClick={() => { void copyCurrentUrl(copy.instagramCopied) }}
        >
          <InstagramIcon />
        </a>
      </div>
      <p className="share-tools__hint">{copy.shareHint}</p>
      <p className="share-tools__status" role="status" aria-live="polite">{status}</p>
    </section>
  )
}

function Pagination({ currentPage, totalPages, onPageChange, copy, pending = false }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label={copy.paginationLabel}>
      <button
        className="pagination__step"
        type="button"
        disabled={pending || currentPage === 1}
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
            disabled={pending}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        className="pagination__step"
        type="button"
        disabled={pending || currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {copy.next} <span aria-hidden="true">→</span>
      </button>
    </nav>
  )
}

function RequestNotice({ request, copy }) {
  if (request.status === 'loading') {
    return <p className="request-notice" role="status">{copy.loadingArticles}</p>
  }
  if (request.status === 'error') {
    return (
      <div className="request-notice request-notice--error" role="alert">
        <p>{copy.loadFailed}</p>
        <button className="share-button" type="button" onClick={request.retry}>{copy.retry}</button>
      </div>
    )
  }
  return null
}

function RecentArticles({ language, listState, listUrl, copy }) {
  const load = useCallback((signal) => getArticlePage({ page: 1, limit: 3, language, signal }), [language])
  const request = useArticleRequest(load)
  return (
    <div className="not-found-suggestions">
      <RequestNotice request={request} copy={copy} />
      {request.data?.items.length > 0 && <>
        <p>{copy.recentSuggestion}</p>
        <ul>
          {request.data.items.map((item) => (
            <li key={item.id}>
              <Link to={getArticleUrl(item.id, listState)} state={{ listUrl }}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </>}
    </div>
  )
}

function RelatedStories({ articleId, language, listState, listUrl, copy }) {
  const load = useCallback((signal) => getRelatedArticles(articleId, 3, language, { signal }), [articleId, language])
  const request = useArticleRequest(load)
  return (
    <section className="related-stories" aria-labelledby="related-stories-title">
      <div className="related-stories__heading">
        <div>
          <p className="eyebrow">RELATED STORIES</p>
          <h2 id="related-stories-title">{copy.relatedStories}</h2>
        </div>
        <Link to={listUrl}>{copy.viewAllArticles} <span aria-hidden="true">→</span></Link>
      </div>
      <RequestNotice request={request} copy={copy} />
      {request.status === 'success' && (request.data.length ? (
        <div className="related-stories__grid">
          {request.data.map((article) => (
            <RelatedArticleCard key={article.id} article={article} listState={listState} listUrl={listUrl} />
          ))}
        </div>
      ) : <p className="request-notice">{copy.noRelatedArticles}</p>)}
    </section>
  )
}

function ArticleListPage({ language, currentPage, setCurrentPage, viewMode, setViewMode }) {
  const copy = getMessages(language)
  const load = useCallback(async (signal) => {
    if (viewMode === 'list') return getArticlePage({ page: currentPage, language, signal })
    const items = await getAllArticles(language, { signal })
    return { items, totalItems: items.length, page: 1, totalPages: 1 }
  }, [language, currentPage, viewMode])
  const request = useArticleRequest(load, { retainKey: `${language}:${viewMode}` })
  const articlePage = request.data
  const isRefreshing = request.status === 'loading' && Boolean(articlePage)
  const listState = {
    language,
    page: viewMode === 'card' ? 1 : articlePage?.page ?? currentPage,
    viewMode,
  }

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
            {articlePage && <p>
              {viewMode === 'card'
                ? copy.articleCountAll(articlePage.totalItems)
                : copy.articleCount(articlePage)}
            </p>}
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

        {!isRefreshing && <RequestNotice request={request} copy={copy} />}
        {articlePage?.items.length === 0 && <p className="request-notice" role="status">{copy.noArticles}</p>}
        <div className={`article-results${isRefreshing ? ' article-results--refreshing' : ''}`}>
          <div className={`article-collection article-collection--${viewMode}`} aria-busy={request.status === 'loading'} inert={isRefreshing}>
            {articlePage?.items.map((article) => (
              <ArticleItem key={article.id} article={article} listState={listState} copy={copy} />
            ))}
          </div>
          {isRefreshing && (
            <div className="article-loading-overlay">
              <p role="status">{copy.loadingArticles}</p>
            </div>
          )}
        </div>

        {viewMode === 'list' && articlePage?.totalItems > 0 && (
          <Pagination
            currentPage={articlePage.page}
            totalPages={articlePage.totalPages}
            onPageChange={setCurrentPage}
            copy={copy}
            pending={isRefreshing}
          />
        )}
      </section>
    </main>
  )
}

function ArticleRoutePage({ language, listState }) {
  const { articleId } = useParams()
  const location = useLocation()
  const copy = getMessages(language)
  const load = useCallback((signal) => getArticleById(articleId, language, { signal }), [articleId, language])
  const request = useArticleRequest(load)
  const article = request.data
  const savedListUrl = location.state?.listUrl
  const listUrl = savedListUrl ? `${getLocalizedPath(savedListUrl.split('?')[0], language)}${savedListUrl.includes('?') ? `?${savedListUrl.split('?')[1]}` : ''}` : getListUrl({
    language,
    page: 1,
    viewMode: 'card',
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [articleId])

  useEffect(() => {
    if (article) applyArticleMetadata(article, language)
    else if (request.status === 'success') applyNotFoundMetadata(language)
    else resetArticleMetadata(language)

    return () => resetArticleMetadata(language)
  }, [article, language, request.status])

  if (request.status !== 'success') {
    return (
      <main id="main-content" className="route-placeholder">
        <section className="route-placeholder__panel" aria-label={copy.articleInfo}>
          <RequestNotice request={request} copy={copy} />
          <Link className="back-link" to={listUrl}><span aria-hidden="true">←</span> {copy.backToArticles}</Link>
        </section>
      </main>
    )
  }

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
          <RecentArticles language={language} listState={listState} listUrl={listUrl} copy={copy} />
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
            <span><small>{copy.author}</small>{article.author.name}</span>
            <time dateTime={article.publishedAt}><small>{copy.published}</small>{article.publishedLabel}</time>
          </div>
        </header>

        <ArticleVisual article={article} detail />

        <div className="article-detail__body">
          <aside aria-label={copy.articleInfo}>
            <p>{copy.articleInfo.toUpperCase()}</p>
            <dl>
              <div><dt>{copy.category}</dt><dd>{article.category}</dd></div>
              <div><dt>{copy.author}</dt><dd>{article.author.name}</dd></div>
              <div><dt>{copy.publishedBasis}</dt><dd>{article.publishedLabel}</dd></div>
            </dl>
          </aside>
          <section aria-labelledby="article-body-title">
            <p className="eyebrow">{copy.articleBodyEyebrow}</p>
            <h2 id="article-body-title">{copy.articleBodyTitle}</h2>
            <ArticleStory article={article} />
            <div className="article-highlights" aria-labelledby="article-highlights-title">
              <h3 id="article-highlights-title">{copy.highlights}</h3>
              <ul>
                {article.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
            </div>
            <ShareTools key={`${article.id}-${language}`} article={article} copy={copy} />
            <div className="route-actions">
              <Link className="back-link" to={listUrl}>
                <span aria-hidden="true">←</span> {copy.backToArticles}
              </Link>
            </div>
          </section>
        </div>
      </article>

      <RelatedStories articleId={articleId} language={language} listState={listState} listUrl={listUrl} copy={copy} />
    </main>
  )
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const language = normalizeLanguage(location.pathname.startsWith('/en') ? 'en' : 'ko')
  const currentPage = getPageNumber(searchParams.get('page'))
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
    document.querySelector('.articles')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const changeViewMode = (mode) => {
    updateSearch({
      view: mode === 'list' ? 'list' : null,
      page: null,
    })
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
        <Route path="/media-outreach" element={<MediaOutreachPage />} />
        <Route path="/en/media-outreach" element={<MediaOutreachPage />} />
      </Routes>

      <footer>
        <span>VAN NEWS</span>
      </footer>
    </div>
  )
}
