const DEFAULT_TITLE = 'VAN NEWS · 오늘의 주요 기사'
const DEFAULT_DESCRIPTION = '변화를 읽고 기록하는 VAN NEWS 미디어 플랫폼입니다.'

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

function setStructuredArticle(article, url) {
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
    datePublished: article.publishedAt,
    inLanguage: 'ko-KR',
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

export function applyArticleMetadata(article) {
  const url = window.location.href.split('#')[0]
  const title = `${article.title} | VAN NEWS`

  document.title = title
  setCanonical(url)
  setMeta('name', 'description', article.summary)
  setMeta('property', 'og:type', 'article')
  setMeta('property', 'og:site_name', 'VAN NEWS')
  setMeta('property', 'og:locale', 'ko_KR')
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', article.summary)
  setMeta('property', 'og:url', url)
  setMeta('property', 'article:published_time', article.publishedAt)
  setMeta('property', 'article:section', article.category)
  setMeta('name', 'twitter:card', 'summary')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', article.summary)
  setStructuredArticle(article, url)
}

export function applyNotFoundMetadata() {
  const url = window.location.href.split('#')[0]
  const title = '기사를 찾을 수 없습니다 | VAN NEWS'
  const description = '요청한 기사 주소를 찾을 수 없습니다.'

  document.title = title
  setCanonical(url)
  setMeta('name', 'description', description)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:url', url)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  removeMeta('property', 'article:published_time')
  removeMeta('property', 'article:section')
  document.head.querySelector('#article-structured-data')?.remove()
}

export function resetArticleMetadata() {
  const homeUrl = new URL('/', window.location.origin).href

  document.title = DEFAULT_TITLE
  setCanonical(homeUrl)
  setMeta('name', 'description', DEFAULT_DESCRIPTION)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:site_name', 'VAN NEWS')
  setMeta('property', 'og:locale', 'ko_KR')
  setMeta('property', 'og:title', DEFAULT_TITLE)
  setMeta('property', 'og:description', DEFAULT_DESCRIPTION)
  setMeta('property', 'og:url', homeUrl)
  setMeta('name', 'twitter:card', 'summary')
  setMeta('name', 'twitter:title', DEFAULT_TITLE)
  setMeta('name', 'twitter:description', DEFAULT_DESCRIPTION)
  removeMeta('property', 'article:published_time')
  removeMeta('property', 'article:section')
  document.head.querySelector('#article-structured-data')?.remove()
}
