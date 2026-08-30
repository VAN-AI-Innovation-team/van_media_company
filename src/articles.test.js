import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ARTICLES_PER_PAGE,
  articles,
  getAllArticles,
  getArticleById,
  getArticlePage,
  getRelatedArticles,
  localizeArticle,
} from './articles.js'

test('six full-article records are available with source bylines', () => {
  assert.equal(articles.length, 6)
  assert.equal(new Set(articles.map((article) => article.id)).size, 6)

  for (const article of articles) {
    assert.ok(article.title)
    assert.ok(article.summary)
    assert.ok(article.author.id)
    assert.match(article.author.name, / · /)
    assert.match(article.author.name, /기자$/)
    assert.match(article.author.nameEn, / · /)
    assert.equal('source' in article, false)
    assert.equal(article.highlights.length, 2)
    assert.ok(article.body.length >= 5)
    assert.ok(article.translations.en.title)
    assert.ok(article.translations.en.summary)
    assert.ok(article.translations.en.body.length >= 5)
  }
})

test('card data returns all six articles in either language', () => {
  const koreanCards = getAllArticles('ko')
  const englishCards = getAllArticles('en')

  assert.equal(koreanCards.length, 6)
  assert.equal(englishCards.length, 6)
  assert.equal(englishCards[0].title, articles[0].translations.en.title)
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
  assert.equal(englishArticle.author.name, 'Yonhap News Agency · Kim Yoo-hyang')
  assert.equal(englishArticle.category, 'Finance & Markets')
  assert.match(englishArticle.image.alt, /Hana Bank dealing room/)
  assert.equal(englishArticle.image.src, '/images/internal-review/01-kospi.jpg')
  assert.equal(englishArticle.image.width, 1200)
  assert.match(englishArticle.image.caption, /Hana Bank headquarters/)
  assert.match(englishArticle.image.credit, /Yonhap News Agency/)
})

test('inline image localization keeps media fields and translates its copy', () => {
  const example = {
    ...articles[1],
    inlineImages: [{
      id: 'chart',
      afterParagraph: 2,
      src: '/images/chart.webp',
      width: 1200,
      height: 800,
      alt: '한국어 설명',
      caption: '한국어 캡션',
      credit: '사진: VAN NEWS',
    }],
    translations: {
      ...articles[1].translations,
      en: {
        ...articles[1].translations.en,
        inlineImages: [{
          id: 'chart',
          alt: 'English description',
          caption: 'English caption',
          credit: 'Photo: VAN NEWS',
        }],
      },
    },
  }
  const localized = localizeArticle(example, 'en')

  assert.equal(localized.inlineImages[0].src, '/images/chart.webp')
  assert.equal(localized.inlineImages[0].width, 1200)
  assert.equal(localized.inlineImages[0].afterParagraph, 2)
  assert.equal(localized.inlineImages[0].alt, 'English description')
  assert.equal(localized.inlineImages[0].credit, 'Photo: VAN NEWS')
})

test('article images include accessible media metadata', () => {
  assert.equal(articles.length, 6)

  for (const article of articles) {
    assert.ok(article.image.width)
    assert.ok(article.image.height)
    assert.ok(article.image.alt)
    assert.ok(article.image.caption)
    assert.ok(article.image.credit)
    assert.equal(article.image.internalReviewOnly, true)
    assert.match(article.image.sourceUrl, /^https:\/\//)
  }
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
