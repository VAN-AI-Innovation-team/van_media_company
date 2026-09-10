import { normalizeLanguage } from './i18n.js'

export const ARTICLES_PER_PAGE = 3
export const ARTICLE_BACKEND_ORIGIN = 'https://press-media-recommendation-backend.onrender.com'

export class ArticleApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ArticleApiError'
    this.status = status
  }
}

function positiveInteger(value, fallback) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 && number <= 2147483647 ? number : fallback
}

function validArticleId(id) {
  return /^\d{1,19}$/.test(String(id)) && BigInt(id) > 0n && BigInt(id) <= 9223372036854775807n
}

function stringArray(value) {
  if (value == null) return []
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new ArticleApiError('Invalid article text array')
  }
  return value
}

function normalizeArticle(article) {
  if (!article || !validArticleId(article.id) || typeof article.title !== 'string'
    || typeof article.summary !== 'string' || typeof article.category !== 'string'
    || typeof article.author?.name !== 'string') {
    throw new ArticleApiError('Invalid article response')
  }
  return {
    ...article,
    body: stringArray(article.body),
    highlights: stringArray(article.highlights),
    image: article.image?.src ? article.image : null,
    inlineImages: article.inlineImages ?? [],
  }
}

function normalizeArticles(items) {
  if (!Array.isArray(items)) throw new ArticleApiError('Invalid article list response')
  return items.map(normalizeArticle)
}

export function createArticleClient({
  baseUrl = '/api',
  fetchImpl = (...args) => fetch(...args),
  timeoutMs = 60000,
} = {}) {
  const base = baseUrl.replace(/\/+$/, '')

  async function request(path, params, { signal, allowNotFound = false } = {}) {
    const controller = new AbortController()
    const abort = () => controller.abort(signal.reason)
    if (signal?.aborted) abort()
    else signal?.addEventListener('abort', abort, { once: true })
    const timeout = setTimeout(() => controller.abort(new ArticleApiError('Article request timed out')), timeoutMs)
    try {
      const response = await fetchImpl(`${base}/articles${path}?${new URLSearchParams(params)}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })
      if (allowNotFound && response.status === 404) return null
      if (!response.ok) throw new ArticleApiError(`Article request failed (${response.status})`, response.status)
      try {
        return await response.json()
      } catch (error) {
        if (controller.signal.aborted) throw controller.signal.reason
        throw new ArticleApiError(`Invalid article JSON: ${error.message}`)
      }
    } finally {
      clearTimeout(timeout)
      signal?.removeEventListener('abort', abort)
    }
  }

  async function getAllArticles(language = 'ko', options = {}) {
    return normalizeArticles(await request('', { language: normalizeLanguage(language) }, options))
  }

  async function getArticlePage({ page = 1, limit = ARTICLES_PER_PAGE, language = 'ko', signal } = {}) {
    const params = {
      page: positiveInteger(page, 1),
      limit: positiveInteger(limit, ARTICLES_PER_PAGE),
      language: normalizeLanguage(language),
    }
    const readPage = async () => {
      const data = await request('/page', params, { signal })
      if (!data || !Number.isSafeInteger(data.totalItems) || data.totalItems < 0
        || !Number.isInteger(data.totalPages) || data.totalPages < 1
        || !Number.isInteger(data.page) || data.page < 1
        || !Number.isInteger(data.limit) || data.limit < 1) {
        throw new ArticleApiError('Invalid pagination response')
      }
      return { ...data, items: normalizeArticles(data.items) }
    }
    let data = await readPage()
    // The backend returns empty items for a page beyond the last page.
    if (data.page > data.totalPages) {
      params.page = data.totalPages
      data = await readPage()
    }
    return data
  }

  async function getArticleById(id, language = 'ko', options = {}) {
    if (!validArticleId(id)) return null
    const data = await request(`/${encodeURIComponent(id)}`, { language: normalizeLanguage(language) }, {
      ...options, allowNotFound: true,
    })
    return data === null ? null : normalizeArticle(data)
  }

  async function getRelatedArticles(id, limit = 3, language = 'ko', options = {}) {
    if (!validArticleId(id)) return []
    const data = await request(`/${encodeURIComponent(id)}/related`, {
      limit: positiveInteger(limit, 3), language: normalizeLanguage(language),
    }, options)
    return normalizeArticles(data)
  }
  return { getAllArticles, getArticlePage, getArticleById, getRelatedArticles }
}

export const { getAllArticles, getArticlePage, getArticleById, getRelatedArticles } = createArticleClient({
  baseUrl: import.meta.env?.VITE_ARTICLE_API_BASE_URL || '/api',
})
