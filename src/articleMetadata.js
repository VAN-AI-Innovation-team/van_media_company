import { getMessages, normalizeLanguage } from './i18n.js'

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function removeMeta(attribute, key) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove()
}

function setCanonical(url) {
  let canonical = document.head.querySelector('link[rel="canonical"]')

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }

  canonical.setAttribute('href', url)
}

function setStructuredArticle(article, url, language) {
  let script = document.head.querySelector('#article-structured-data')

  if (!script) {
    script = document.createElement('script')
    script.id = 'article-structured-data'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    articleBody: article.body.join('\n\n'),
    datePublished: article.publishedAt,
    inLanguage: language === 'en' ? 'en-US' : 'ko-KR',
    mainEntityOfPage: url,
    url,
    articleSection: article.category,
    author: {
      '@type': 'Organization',
      name: 'VAN NEWS',
    },
    citation: article.source.url,
    isAccessibleForFree: true,
  })
}

export function applyArticleMetadata(article, requestedLanguage = 'ko') {
  const language = normalizeLanguage(requestedLanguage)
  const copy = getMessages(language)
  const url = new URL(window.location.pathname, window.location.origin).href
  const title = `${article.title} | VAN NEWS`

  document.title = title
  setCanonical(url)
  setMeta('name', 'description', article.summary)
  setMeta('property', 'og:type', 'article')
  setMeta('property', 'og:site_name', 'VAN NEWS')
  setMeta('property', 'og:locale', copy.locale)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', article.summary)
  setMeta('property', 'og:url', url)
  setMeta('property', 'article:published_time', article.publishedAt)
  setMeta('property', 'article:section', article.category)
  setMeta('name', 'twitter:card', 'summary')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', article.summary)
  setStructuredArticle(article, url, language)
}

export function applyNotFoundMetadata(requestedLanguage = 'ko') {
  const language = normalizeLanguage(requestedLanguage)
  const copy = getMessages(language)
  const url = new URL(window.location.pathname, window.location.origin).href
  const title = copy.notFoundMetadataTitle
  const description = copy.notFoundMetadataDescription

  document.title = title
  setCanonical(url)
  setMeta('name', 'description', description)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:locale', copy.locale)
  setMeta('property', 'og:url', url)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  removeMeta('property', 'article:published_time')
  removeMeta('property', 'article:section')
  document.head.querySelector('#article-structured-data')?.remove()
}

export function resetArticleMetadata(requestedLanguage = 'ko') {
  const language = normalizeLanguage(requestedLanguage)
  const copy = getMessages(language)
  const homeUrl = new URL(language === 'en' ? '/en/' : '/', window.location.origin).href

  document.title = copy.defaultTitle
  setCanonical(homeUrl)
  setMeta('name', 'description', copy.defaultDescription)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:site_name', 'VAN NEWS')
  setMeta('property', 'og:locale', copy.locale)
  setMeta('property', 'og:title', copy.defaultTitle)
  setMeta('property', 'og:description', copy.defaultDescription)
  setMeta('property', 'og:url', homeUrl)
  setMeta('name', 'twitter:card', 'summary')
  setMeta('name', 'twitter:title', copy.defaultTitle)
  setMeta('name', 'twitter:description', copy.defaultDescription)
  removeMeta('property', 'article:published_time')
  removeMeta('property', 'article:section')
  document.head.querySelector('#article-structured-data')?.remove()
}
