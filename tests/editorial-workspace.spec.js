import { test, expect } from '@playwright/test'

test('a local draft can move through review, desk approval, and scheduling', async ({ page }) => {
  await page.goto('/editor/')
  await expect(page.getByText('계정 권한, 서버 검수, 실제 발행 및 예약 실행은 연결되지 않았습니다.')).toBeVisible()
  await expect(page).toHaveTitle('기자 작업실 | VAN NEWS')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')

  await page.getByRole('button', { name: '검수 요청 →' }).click()
  await expect(page.getByRole('status')).toContainText('제목을 입력해 주세요')
  await page.getByLabel('작성자', { exact: true }).fill('시연 기자')
  await page.getByLabel('기사 제목').fill('프론트 검수 흐름 시연')
  await page.getByLabel('기사 요약').fill('서버 연결 없이 원고의 화면 상태를 확인합니다.')
  await page.getByLabel('기사 본문').fill('이 원고는 테스트에서 만든 시연용 기사입니다.')
  await page.getByRole('button', { name: '검수 요청 →' }).click()
  await expect(page.locator('.editorial-editor__head .editorial-status')).toHaveText('검수 요청')

  await page.getByRole('button', { name: '데스크', exact: true }).click()
  await page.getByRole('button', { name: '승인 완료 →' }).click()
  await expect(page.locator('.editorial-editor__head .editorial-status')).toHaveText('승인 완료')

  const futureLocal = await page.evaluate(() => {
    const date = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const pad = (value) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  })
  await page.getByLabel('예약 발행 일시').fill(futureLocal)
  await page.getByRole('button', { name: '예약 등록 →' }).click()
  await expect(page.locator('.editorial-editor__head .editorial-status')).toHaveText('예약 등록')
  await expect(page.getByText('시연용 상태이며 예약 시각에 실제로 기사가 게시되지는 않습니다.')).toBeVisible()

  await page.reload()
  await expect(page.locator('.editorial-editor__head .editorial-status')).toHaveText('예약 등록')
  await expect(page.getByLabel('기사 제목')).toHaveValue('프론트 검수 흐름 시연')

  await page.setViewportSize({ width: 320, height: 800 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
