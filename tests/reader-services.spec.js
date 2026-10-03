import { test, expect } from '@playwright/test'
import ko from './fixtures/articles.ko.json' with { type: 'json' }
import en from './fixtures/articles.en.json' with { type: 'json' }

test('search finds a published story and keeps the selected language', async ({ page }) => {
  await page.route('**/api/articles**', (route) => {
    const url = new URL(route.request().url())
    const records = url.searchParams.get('language') === 'en' ? en : ko
    const path = url.pathname.replace('/api/articles', '')
    if (path === '') return route.fulfill({ json: records })
    if (path.endsWith('/related')) return route.fulfill({ json: records.filter((item) => item.id !== 3).slice(0, 3) })
    const article = records.find((item) => String(item.id) === path.slice(1))
    return route.fulfill({ status: article ? 200 : 404, json: article ?? { error: 'not found' } })
  })

  await page.goto('/')
  await page.getByRole('navigation', { name: '사이트 메뉴' }).getByRole('link', { name: '기사 검색' }).click()
  await page.getByRole('searchbox', { name: '검색어' }).fill('대장암')
  await page.getByRole('button', { name: '검색', exact: true }).click()
  await expect(page).toHaveURL(/\/search\/\?q=/)
  await expect(page.locator('.reader-result')).toHaveCount(1)
  await page.locator('.reader-result h3 a').click()
  await expect(page.locator('#article-title')).toHaveText(ko[2].title)

  await page.goto('/en/search/?q=colorectal')
  await expect(page.locator('.reader-result')).toHaveCount(1)
  await expect(page.locator('.reader-result h3 a')).toHaveAttribute('href', '/en/articles/3/')
})

test('newsletter and tip forms validate locally without submitting', async ({ page }) => {
  const submissions = []
  page.on('request', (request) => {
    if (request.method() !== 'GET') submissions.push(request.url())
  })

  await page.goto('/newsletter/')
  await page.getByRole('textbox', { name: '이메일 주소' }).fill('demo@example.com')
  await page.getByRole('button', { name: '입력 형식 확인' }).click()
  await expect(page.getByRole('status')).toContainText('구독은 접수되지 않았습니다')

  await page.goto('/tips/')
  await page.getByRole('textbox', { name: '제목' }).fill('시연용 제보 제목')
  await page.getByRole('combobox', { name: '분야' }).selectOption('1')
  await page.getByRole('textbox', { name: '내용' }).fill('이 문장은 실제 제보가 아닌 프론트 화면 입력 확인용 문장입니다.')
  await page.getByRole('button', { name: '입력 형식 확인' }).click()
  await expect(page.getByRole('status')).toContainText('제보는 접수되지 않았습니다')
  expect(submissions).toEqual([])

  await page.setViewportSize({ width: 320, height: 800 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
