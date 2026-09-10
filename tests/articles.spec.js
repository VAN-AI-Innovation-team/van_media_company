import { test, expect } from '@playwright/test'
import ko from './fixtures/articles.ko.json' with { type: 'json' }
import en from './fixtures/articles.en.json' with { type: 'json' }

async function serveArticles(route) {
  const url = new URL(route.request().url())
  const records = url.searchParams.get('language') === 'en' ? en : ko
  const path = url.pathname.replace('/api/articles', '')
  if (path === '') return route.fulfill({ json: records })
  if (path === '/page') {
    const page = Number(url.searchParams.get('page'))
    const limit = Number(url.searchParams.get('limit'))
    return route.fulfill({ json: { items: records.slice((page - 1) * limit, page * limit), page, limit, totalItems: 6, totalPages: Math.ceil(6 / limit) } })
  }
  const id = Number(path.split('/')[1])
  if (path.endsWith('/related')) return route.fulfill({ json: records.filter((a) => a.id !== id).slice(0, 3) })
  const article = records.find((a) => a.id === id)
  return route.fulfill({ status: article ? 200 : 404, json: article ?? { error: 'missing' } })
}

test('cards, pagination, localized detail, related stories and return state', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.route('**/api/articles**', serveArticles)
  await page.goto('/')
  await expect(page.locator('.article-item')).toHaveCount(6)
  await page.getByRole('button', { name: '리스트형', exact: true }).click()
  await expect(page.locator('.article-item')).toHaveCount(3)
  await page.getByRole('button', { name: '2페이지', exact: true }).click()
  await expect(page.locator('.article-item h2').first()).toHaveText(ko[3].title)
  await page.locator('.article-link').first().click()
  await expect(page.locator('#article-title')).toHaveText(ko[3].title)
  await expect(page.locator('.article-story > p')).toHaveCount(5)
  await expect(page.locator('.related-article')).toHaveCount(3)
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.locator('#article-title')).toHaveText(en[3].title)
  await expect(page).toHaveTitle(`${en[3].title} | VAN NEWS`)
  await expect(page.locator('meta[property="og:image:width"]')).toHaveCount(0)
  await page.getByRole('link', { name: 'Back to all stories' }).click()
  await expect(page).toHaveURL(/\/en\/\?.*page=2/)
  await expect(page.locator('.article-item h2').first()).toHaveText(en[3].title)
  expect(errors).toEqual([])
})

test('loading, server error, retry and empty state', async ({ page }) => {
  let respond
  await page.route('**/api/articles?**', (route) => { respond = route })
  await page.goto('/')
  await expect(page.getByRole('status')).toContainText('불러오는 중')
  await expect(page.locator('.article-item')).toHaveCount(0)
  await respond.fulfill({ status: 503, body: 'Unavailable' })
  await expect(page.getByRole('alert')).toContainText('불러오지 못했습니다')
  await page.unroute('**/api/articles?**')
  await page.route('**/api/articles?**', (route) => route.fulfill({ json: [] }))
  await page.getByRole('button', { name: '다시 시도' }).click()
  await expect(page.getByRole('status')).toHaveText('아직 등록된 기사가 없습니다.')
})

test('late Korean response cannot overwrite the English route', async ({ page }) => {
  let delayed
  await page.route('**/api/articles**', (route) => {
    if (route.request().url().includes('language=ko')) delayed = route
    else return serveArticles(route)
  })
  await page.goto('/')
  await expect(page.getByRole('status')).toContainText('불러오는 중')
  await expect.poll(() => Boolean(delayed)).toBe(true)
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.locator('.article-item h2').first()).toHaveText(en[0].title)
  await delayed.fulfill({ json: ko })
  await expect(page.locator('.article-item h2').first()).toHaveText(en[0].title)
})

test('detail outage differs from 404 and related failure keeps the article readable', async ({ page }) => {
  await page.route('**/api/articles**', serveArticles)
  await page.route('**/api/articles/1?**', (route) => route.fulfill({ status: 500, body: 'error' }))
  await page.goto('/articles/1/')
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page.getByRole('heading', { name: '요청한 기사를 찾을 수 없습니다.' })).toHaveCount(0)
  await page.unroute('**/api/articles/1?**')
  await page.route('**/api/articles/1/related?**', (route) => route.fulfill({ status: 503, body: 'error' }))
  await page.getByRole('button', { name: '다시 시도' }).click()
  await expect(page.locator('#article-title')).toHaveText(ko[0].title)
  await expect(page.locator('.related-stories [role="alert"]')).toBeVisible()
  await page.goto('/articles/999/')
  await expect(page.getByRole('heading', { name: '요청한 기사를 찾을 수 없습니다.' })).toBeVisible()
  await expect(page.locator('.not-found-suggestions li')).toHaveCount(3)
})

test('out-of-range direct list URL and mobile detail layout', async ({ page }) => {
  await page.route('**/api/articles**', serveArticles)
  await page.goto('/?view=list&page=99')
  await expect(page.locator('.article-item h2').first()).toHaveText(ko[3].title)
  await expect(page.getByRole('button', { name: '2페이지', exact: true })).toHaveAttribute('aria-current', 'page')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('.article-link').first().click()
  await expect(page.locator('#article-title')).toHaveText(ko[3].title)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('live API through the local proxy @live', async ({ page }) => {
  test.skip(!process.env.TEST_LIVE_API, 'Enable TEST_LIVE_API=1 to check the deployed backend')
  test.setTimeout(180000)
  await page.goto('/')
  await expect(page.locator('.article-item').first()).toBeVisible({ timeout: 65000 })
  await page.locator('.article-link').first().click()
  await expect(page.locator('#article-title')).toBeVisible({ timeout: 65000 })
  await expect(page.locator('.related-article').first()).toBeVisible({ timeout: 65000 })
})
