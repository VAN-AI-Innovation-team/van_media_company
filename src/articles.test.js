import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ARTICLES_PER_PAGE,
  articles,
  getArticleById,
  getArticlePage,
  getRelatedArticles,
} from './articles.js'

test('six verified source records are available over HTTPS', () => {
  assert.equal(articles.length, 6)
  assert.equal(new Set(articles.map((article) => article.source.url)).size, 6)

  for (const article of articles) {
    assert.match(article.source.url, /^https:\/\//)
    assert.ok(article.title)
    assert.ok(article.summary)
    assert.equal(article.highlights.length, 2)
    assert.ok(article.translations.en.title)
    assert.ok(article.translations.en.summary)
  }
})

test('pagination returns three records and clamps out-of-range pages', () => {
  const firstPage = getArticlePage()
  const lastPage = getArticlePage({ page: 99 })

  assert.equal(firstPage.items.length, ARTICLES_PER_PAGE)
  assert.equal(firstPage.page, 1)
  assert.equal(firstPage.totalPages, 2)
  assert.equal(lastPage.page, 2)
  assert.equal(lastPage.items.length, 3)
})

test('English localization applies to list and detail data', () => {
  const englishPage = getArticlePage({ page: 1, language: 'en' })
  const englishArticle = getArticleById(1, 'en')

  assert.equal(englishPage.items[0].title, englishArticle.title)
  assert.equal(englishArticle.source.name, 'Yonhap News Agency')
  assert.equal(englishArticle.category, 'Finance & Markets')
})

test('related stories exclude the current article and honor the limit', () => {
  const related = getRelatedArticles(1, 3, 'en')

  assert.equal(related.length, 3)
  assert.equal(related.some((article) => article.id === 1), false)
  assert.equal(related.every((article) => article.translations.en), true)
})

test('unknown article ids return no article or related stories', () => {
  assert.equal(getArticleById('missing'), undefined)
  assert.deepEqual(getRelatedArticles('missing'), [])
})
