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

function clearSocialImageMetadata() {
  removeMeta('property', 'og:image')
  removeMeta('property', 'og:image:alt')
  removeMeta('property', 'og:image:width')
  removeMeta('property', 'og:image:height')
  removeMeta('name', 'twitter:image')
  removeMeta('name', 'twitter:image:alt')
}

function setStructuredArticle(article, url, language, imageUrl) {
  let script = document.head.querySelector('#article-structured-data')

  if (!script) {
    script = document.createElement('script')
    script.id = 'article-structured-data'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
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
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'VAN NEWS',
    },
    ...(imageUrl
      ? {
          image: {
            '@type': 'ImageObject',
            url: imageUrl,
            width: article.image.width,
            height: article.image.height,
            caption: article.image.caption,
            creditText: article.image.credit,
          },
        }
      : {}),
    isAccessibleForFree: true,
  })
}

export function applyArticleMetadata(article, requestedLanguage = 'ko') {
  const language = normalizeLanguage(requestedLanguage)
  const copy = getMessages(language)
  const url = new URL(window.location.pathname, window.location.origin).href
  const title = `${article.title} | VAN NEWS`
  const imageUrl = article.image
    ? new URL(article.image.src, window.location.origin).href
    : null

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
  setMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', article.summary)
  if (imageUrl) {
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:alt', article.image.alt)
    if (article.image.width) setMeta('property', 'og:image:width', article.image.width)
    else removeMeta('property', 'og:image:width')
    if (article.image.height) setMeta('property', 'og:image:height', article.image.height)
    else removeMeta('property', 'og:image:height')
    setMeta('name', 'twitter:image', imageUrl)
    setMeta('name', 'twitter:image:alt', article.image.alt)
  } else {
    clearSocialImageMetadata()
  }
  setStructuredArticle(article, url, language, imageUrl)
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
  setMeta('name', 'twitter:card', 'summary')
  clearSocialImageMetadata()
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
  clearSocialImageMetadata()
  removeMeta('property', 'article:published_time')
  removeMeta('property', 'article:section')
  document.head.querySelector('#article-structured-data')?.remove()
}
