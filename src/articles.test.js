import assert from 'node:assert/strict'
import test from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'
import ko from '../tests/fixtures/articles.ko.json' with { type: 'json' }
import en from '../tests/fixtures/articles.en.json' with { type: 'json' }
import { ArticleApiError, createArticleClient } from './articles.js'

function fixtureClient(handler) {
  const calls = []
  const client = createArticleClient({
    baseUrl: 'https://api.example.test/api/',
    fetchImpl: async (url, options) => {
      calls.push({ url: new URL(url), options })
      return handler(new URL(url), options)
    },
  })
  return { client, calls }
}

test('all four endpoints use localized API responses and preserve nested data', async () => {
  const { client, calls } = fixtureClient((url) => {
    const records = url.searchParams.get('language') === 'en' ? en : ko
    if (url.pathname.endsWith('/page')) return Response.json({ items: records.slice(3), page: 2, limit: 3, totalItems: 6, totalPages: 2 })
    if (url.pathname.endsWith('/related')) return Response.json(records.slice(3))
    if (url.pathname.endsWith('/1')) return Response.json(records[0])
    return Response.json(records)
  })
  assert.equal((await client.getAllArticles('ko')).length, 6)
  const all = await client.getAllArticles('en')
  assert.equal(all[0].title, en[0].title)
  assert.notEqual(all[0].title, ko[0].title)
  assert.deepEqual(all[0].image, en[0].image)
  assert.deepEqual((await client.getArticlePage({ page: 2, language: 'en' })).items.map((a) => a.id), [4, 5, 6])
  assert.deepEqual((await client.getArticleById('1', 'en')).body, en[0].body)
  assert.deepEqual((await client.getRelatedArticles(1, 3, 'en')).map((a) => a.id), [4, 5, 6])
  assert.deepEqual(calls.map(({ url }) => url.pathname), ['/api/articles', '/api/articles', '/api/articles/page', '/api/articles/1', '/api/articles/1/related'])
  assert.equal(calls[2].url.searchParams.get('limit'), '3')
  assert.equal(calls[4].url.searchParams.get('language'), 'en')
})

test('out-of-range pages refetch the last server page', async () => {
  const { client, calls } = fixtureClient((url) => {
    const page = Number(url.searchParams.get('page'))
    return Response.json({ items: page > 2 ? [] : ko.slice(3), page, limit: 3, totalItems: 6, totalPages: 2 })
  })
  const data = await client.getArticlePage({ page: 99 })
  assert.equal(data.page, 2)
  assert.equal(data.items.length, 3)
  assert.equal(calls.length, 2)
})

test('invalid pagination inputs use safe defaults and empty results remain valid', async () => {
  const { client, calls } = fixtureClient(() => Response.json({ items: [], page: 1, limit: 3, totalItems: 0, totalPages: 1 }))
  assert.deepEqual((await client.getArticlePage({ page: Infinity, limit: -1, language: 'fr' })).items, [])
  assert.equal(calls[0].url.search, '?page=1&limit=3&language=ko')
})

test('only a detail 404 means not found; outages and invalid JSON reject', async () => {
  const missing = fixtureClient(() => Response.json({ error: 'missing' }, { status: 404 })).client
  assert.equal(await missing.getArticleById(999), null)
  await assert.rejects(missing.getRelatedArticles(1), { status: 404 })
  const unavailable = fixtureClient(() => new Response('Unavailable', { status: 503 })).client
  await assert.rejects(unavailable.getArticleById(1), { status: 503 })
  const invalid = fixtureClient(() => new Response('<html>Wrong rewrite</html>')).client
  await assert.rejects(invalid.getAllArticles(), ArticleApiError)
  const network = fixtureClient(() => { throw new TypeError('Failed to fetch') }).client
  await assert.rejects(network.getAllArticles(), TypeError)
})

test('invalid ids never become requests or output paths', async () => {
  const { client, calls } = fixtureClient(() => { throw new Error('Must not fetch') })
  for (const id of ['missing', '../page', '0', '9223372036854775808', null]) {
    assert.equal(await client.getArticleById(id), null)
    assert.deepEqual(await client.getRelatedArticles(id), [])
  }
  assert.equal(calls.length, 0)
})

test('nullable media and arrays render safely; malformed payloads reject', async () => {
  const { client } = fixtureClient(() => Response.json({ ...ko[0], body: null, highlights: null, image: { src: null } }))
  const article = await client.getArticleById(1)
  assert.deepEqual(article.body, [])
  assert.deepEqual(article.highlights, [])
  assert.equal(article.image, null)
  for (const data of [{}, [{ ...ko[0], body: 'not an array' }], [{ ...ko[0], author: null }]]) {
    await assert.rejects(fixtureClient(() => Response.json(data)).client.getAllArticles(), ArticleApiError)
  }
})

test('abort and timeout cancel pending fetches without returning fixture data', async () => {
  const fetchImpl = async (_url, { signal }) => {
    await delay(1000, null, { signal })
    return Response.json(ko)
  }
  const controller = new AbortController()
  const pending = createArticleClient({ fetchImpl }).getAllArticles('ko', { signal: controller.signal })
  controller.abort()
  await assert.rejects(pending, { name: 'AbortError' })
  await assert.rejects(createArticleClient({ fetchImpl, timeoutMs: 10 }).getAllArticles())
})
