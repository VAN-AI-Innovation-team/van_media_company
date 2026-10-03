import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { getAllArticles } from '../articles.js'
import { useArticleRequest } from '../useArticleRequest.js'
import './reader.css'

const messages = {
  ko: {
    section: 'VAN NEWS · 독자 서비스',
    searchNav: '기사 검색',
    newsletterNav: '뉴스레터',
    tipNav: '제보',
    home: '기사 목록으로',
    searchTitle: '궁금한 기사를 찾아보세요',
    searchDescription: '제목, 요약, 분야, 기자 이름과 기사 내용에서 검색합니다.',
    searchLabel: '검색어',
    searchPlaceholder: '검색어를 입력하세요',
    searchButton: '검색',
    searchStart: '검색어를 입력하면 공개된 기사에서 결과를 보여드립니다.',
    searchLoading: '기사를 불러오는 중입니다…',
    searchError: '기사를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    retry: '다시 시도',
    searchCount: (count, query) => `“${query}” 검색 결과 ${count}건`,
    searchEmpty: '일치하는 기사가 없습니다. 다른 검색어를 입력해 보세요.',
    readArticle: '기사 읽기',
    newsletterTitle: 'VAN NEWS 뉴스레터',
    newsletterDescription: '관심 있는 소식을 이메일로 받아보는 화면을 미리 살펴보세요.',
    previewTitle: '화면 미리보기',
    newsletterPreview: '현재 구독 접수 기능이 연결되지 않았습니다. 입력한 정보는 저장하거나 전송하지 않습니다. 실제 이메일 주소를 입력할 필요가 없습니다.',
    email: '이메일 주소',
    emailPlaceholder: 'example@email.com',
    frequency: '받아볼 주기',
    weekly: '매주 한 번',
    monthly: '매월 한 번',
    newsletterCheck: '입력 형식 확인',
    newsletterChecked: '입력 형식을 확인했습니다. 뉴스레터 구독은 접수되지 않았습니다.',
    tipTitle: '뉴스 제보',
    tipDescription: '독자가 전할 소식의 입력 화면을 미리 살펴보세요.',
    tipPreview: '현재 제보 접수 기능이 연결되지 않았습니다. 입력한 내용은 저장하거나 전송하지 않습니다. 실제 제보나 민감한 정보는 입력하지 마세요.',
    tipSubject: '제목',
    tipSubjectPlaceholder: '제보 내용을 짧게 적어 주세요',
    tipCategory: '분야',
    tipCategoryPlaceholder: '분야를 선택하세요',
    tipCategories: ['사회', '경제', '과학·기술', '문화', '기타'],
    tipDetails: '내용',
    tipDetailsPlaceholder: '어떤 일이 있었는지 설명해 주세요 (20자 이상)',
    tipContact: '회신 이메일 (선택)',
    tipCheck: '입력 형식 확인',
    tipChecked: '입력 형식을 확인했습니다. 제보는 접수되지 않았습니다.',
  },
  en: {
    section: 'VAN NEWS · READER SERVICES',
    searchNav: 'Search',
    newsletterNav: 'Newsletter',
    tipNav: 'Send a tip',
    home: 'All articles',
    searchTitle: 'Find a story',
    searchDescription: 'Search titles, summaries, sections, reporter names, and article text.',
    searchLabel: 'Search terms',
    searchPlaceholder: 'Enter search terms',
    searchButton: 'Search',
    searchStart: 'Enter a search term to find published articles.',
    searchLoading: 'Loading articles…',
    searchError: 'Articles could not be loaded. Please try again shortly.',
    retry: 'Try again',
    searchCount: (count, query) => `${count} result${count === 1 ? '' : 's'} for “${query}”`,
    searchEmpty: 'No articles match. Try a different search term.',
    readArticle: 'Read article',
    newsletterTitle: 'VAN NEWS newsletter',
    newsletterDescription: 'Preview the form for receiving stories by email.',
    previewTitle: 'Interface preview',
    newsletterPreview: 'Subscriptions are not connected yet. Entries are neither saved nor sent. You do not need to enter a real email address.',
    email: 'Email address',
    emailPlaceholder: 'example@email.com',
    frequency: 'Delivery frequency',
    weekly: 'Once a week',
    monthly: 'Once a month',
    newsletterCheck: 'Check input format',
    newsletterChecked: 'The input format is valid. No newsletter subscription was submitted.',
    tipTitle: 'Send a news tip',
    tipDescription: 'Preview the form for sharing a story with the newsroom.',
    tipPreview: 'Tip submissions are not connected yet. Entries are neither saved nor sent. Do not enter a real tip or sensitive information.',
    tipSubject: 'Headline',
    tipSubjectPlaceholder: 'Briefly describe your tip',
    tipCategory: 'Section',
    tipCategoryPlaceholder: 'Choose a section',
    tipCategories: ['Society', 'Business', 'Science & technology', 'Culture', 'Other'],
    tipDetails: 'Details',
    tipDetailsPlaceholder: 'Describe what happened (at least 20 characters)',
    tipContact: 'Reply email (optional)',
    tipCheck: 'Check input format',
    tipChecked: 'The input format is valid. No tip was submitted.',
  },
}

function getLanguage(language) {
  return language === 'en' ? 'en' : 'ko'
}

function getPaths(language) {
  const prefix = language === 'en' ? '/en' : ''
  return {
    home: `${prefix}/`,
    search: `${prefix}/search`,
    newsletter: `${prefix}/newsletter`,
    tips: `${prefix}/tips`,
    article: (id) => `${prefix}/articles/${encodeURIComponent(id)}/`,
  }
}

function ReaderLayout({ language, page, title, description, children }) {
  const copy = messages[language]
  const paths = getPaths(language)
  const navItems = [
    { key: 'search', href: paths.search, label: copy.searchNav },
    { key: 'newsletter', href: paths.newsletter, label: copy.newsletterNav },
    { key: 'tips', href: paths.tips, label: copy.tipNav },
  ]

  return (
    <main id="main-content" className="reader-page">
      <div className="reader-page__container">
        <Link className="reader-page__home" to={paths.home}>← {copy.home}</Link>
        <header className="reader-page__header">
          <p className="reader-page__eyebrow">{copy.section}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
        <nav className="reader-nav" aria-label={language === 'en' ? 'Reader services' : '독자 서비스'}>
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              aria-current={page === item.key ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </main>
  )
}

function searchableText(article) {
  return [
    article.title,
    article.summary,
    article.category,
    article.author?.name,
    ...(article.highlights ?? []),
    ...(article.body ?? []),
  ].filter(Boolean).join(' ').normalize('NFKC').toLocaleLowerCase()
}

export function SearchPage({ language: requestedLanguage = 'ko' }) {
  const language = getLanguage(requestedLanguage)
  const copy = messages[language]
  const paths = getPaths(language)
  const [searchParams, setSearchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()
  const [draft, setDraft] = useState(query)
  const load = useCallback((signal) => getAllArticles(language, { signal }), [language])
  const request = useArticleRequest(load)
  const normalizedQuery = query.normalize('NFKC').toLocaleLowerCase()
  const results = request.status === 'success' && normalizedQuery
    ? request.data.filter((article) => searchableText(article).includes(normalizedQuery))
    : []

  useEffect(() => setDraft(query), [query])

  function handleSearch(event) {
    event.preventDefault()
    const nextQuery = draft.trim()
    setSearchParams(nextQuery ? { q: nextQuery } : {})
  }

  return (
    <ReaderLayout language={language} page="search" title={copy.searchTitle} description={copy.searchDescription}>
      <section className="reader-panel" aria-label={copy.searchNav}>
        <form className="reader-search" role="search" onSubmit={handleSearch}>
          <label htmlFor="reader-search-input">{copy.searchLabel}</label>
          <div className="reader-search__row">
            <input
              id="reader-search-input"
              type="search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={copy.searchPlaceholder}
              maxLength={120}
            />
            <button type="submit">{copy.searchButton}</button>
          </div>
        </form>

        <div className="reader-results" aria-live="polite" aria-busy={Boolean(query && request.status === 'loading')}>
          {!query && <p className="reader-results__message">{copy.searchStart}</p>}
          {query && request.status === 'loading' && <p className="reader-results__message" role="status">{copy.searchLoading}</p>}
          {query && request.status === 'error' && (
            <div className="reader-results__message" role="alert">
              <p>{copy.searchError}</p>
              <button type="button" className="reader-secondary-button" onClick={request.retry}>{copy.retry}</button>
            </div>
          )}
          {query && request.status === 'success' && (
            <>
              <h2 className="reader-results__heading">{copy.searchCount(results.length, query)}</h2>
              {results.length === 0 && <p className="reader-results__message">{copy.searchEmpty}</p>}
              {results.length > 0 && (
                <ul className="reader-results__list">
                  {results.map((article) => (
                    <li key={article.id}>
                      <article className="reader-result">
                        <div className="reader-result__meta">
                          <span>{article.category}</span>
                          {article.publishedLabel && <time dateTime={article.publishedAt}>{article.publishedLabel}</time>}
                        </div>
                        <h3><Link to={paths.article(article.id)}>{article.title}</Link></h3>
                        <p>{article.summary}</p>
                        <div className="reader-result__footer">
                          <span>{article.author?.name}</span>
                          <Link to={paths.article(article.id)} aria-label={`${copy.readArticle}: ${article.title}`}>
                            {copy.readArticle} <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>
    </ReaderLayout>
  )
}

function PreviewNotice({ children, language }) {
  const copy = messages[language]
  return (
    <aside className="reader-preview" aria-label={copy.previewTitle}>
      <strong>{copy.previewTitle}</strong>
      <p>{children}</p>
    </aside>
  )
}

export function NewsletterPage({ language: requestedLanguage = 'ko' }) {
  const language = getLanguage(requestedLanguage)
  const copy = messages[language]
  const [checked, setChecked] = useState(false)

  function handleCheck(event) {
    event.preventDefault()
    event.currentTarget.reset()
    setChecked(true)
  }

  return (
    <ReaderLayout language={language} page="newsletter" title={copy.newsletterTitle} description={copy.newsletterDescription}>
      <section className="reader-panel reader-panel--form">
        <PreviewNotice language={language}>{copy.newsletterPreview}</PreviewNotice>
        <form className="reader-form" autoComplete="off" onSubmit={handleCheck} onInput={() => setChecked(false)}>
          <div className="reader-field">
            <label htmlFor="reader-newsletter-email">{copy.email}</label>
            <input
              id="reader-newsletter-email"
              name="email"
              type="email"
              placeholder={copy.emailPlaceholder}
              maxLength={254}
              autoComplete="off"
              required
            />
          </div>
          <div className="reader-field">
            <label htmlFor="reader-newsletter-frequency">{copy.frequency}</label>
            <select id="reader-newsletter-frequency" name="frequency" defaultValue="weekly">
              <option value="weekly">{copy.weekly}</option>
              <option value="monthly">{copy.monthly}</option>
            </select>
          </div>
          <button className="reader-primary-button" type="submit">{copy.newsletterCheck}</button>
          <p className="reader-form__status" role="status" aria-live="polite">
            {checked ? copy.newsletterChecked : ''}
          </p>
        </form>
      </section>
    </ReaderLayout>
  )
}

export function TipPage({ language: requestedLanguage = 'ko' }) {
  const language = getLanguage(requestedLanguage)
  const copy = messages[language]
  const [checked, setChecked] = useState(false)

  function handleCheck(event) {
    event.preventDefault()
    event.currentTarget.reset()
    setChecked(true)
  }

  return (
    <ReaderLayout language={language} page="tips" title={copy.tipTitle} description={copy.tipDescription}>
      <section className="reader-panel reader-panel--form">
        <PreviewNotice language={language}>{copy.tipPreview}</PreviewNotice>
        <form className="reader-form" autoComplete="off" onSubmit={handleCheck} onInput={() => setChecked(false)}>
          <div className="reader-form__grid">
            <div className="reader-field">
              <label htmlFor="reader-tip-subject">{copy.tipSubject}</label>
              <input
                id="reader-tip-subject"
                name="subject"
                type="text"
                minLength={4}
                maxLength={120}
                placeholder={copy.tipSubjectPlaceholder}
                autoComplete="off"
                required
              />
            </div>
            <div className="reader-field">
              <label htmlFor="reader-tip-category">{copy.tipCategory}</label>
              <select id="reader-tip-category" name="category" defaultValue="" required>
                <option value="" disabled>{copy.tipCategoryPlaceholder}</option>
                {copy.tipCategories.map((category, index) => (
                  <option value={index + 1} key={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="reader-field">
            <label htmlFor="reader-tip-details">{copy.tipDetails}</label>
            <textarea
              id="reader-tip-details"
              name="details"
              minLength={20}
              maxLength={3000}
              rows={8}
              placeholder={copy.tipDetailsPlaceholder}
              required
            />
          </div>
          <div className="reader-field">
            <label htmlFor="reader-tip-contact">{copy.tipContact}</label>
            <input
              id="reader-tip-contact"
              name="contact"
              type="email"
              maxLength={254}
              placeholder={copy.emailPlaceholder}
              autoComplete="off"
            />
          </div>
          <button className="reader-primary-button" type="submit">{copy.tipCheck}</button>
          <p className="reader-form__status" role="status" aria-live="polite">
            {checked ? copy.tipChecked : ''}
          </p>
        </form>
      </section>
    </ReaderLayout>
  )
}
