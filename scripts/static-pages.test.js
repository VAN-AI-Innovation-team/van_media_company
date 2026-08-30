import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

async function readBuiltPage(path) {
  return readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8')
}

test('Korean article page contains article-specific static sharing metadata', async () => {
  const html = await readBuiltPage('articles/1/index.html')

  assert.match(html, /<html lang="ko">/)
  assert.match(html, /property="og:type" content="article"/)
  assert.match(html, /코스피, 엔비디아 호실적/)
  assert.match(html, /"articleBody":"코스피는 엔비디아의 분기 실적 호조/)
  assert.match(html, /https:\/\/van-media-company\.vercel\.app\/articles\/1\//)
})

test('English article page has a stable localized canonical URL', async () => {
  const html = await readBuiltPage('en/articles/1/index.html')

  assert.match(html, /<html lang="en">/)
  assert.match(html, /KOSPI gains more than 1%/)
  assert.match(html, /property="og:locale" content="en_US"/)
  assert.match(html, /rel="canonical" href="https:\/\/van-media-company\.vercel\.app\/en\/articles\/1\/"/)
})

test('all Korean and English article pages are generated', async () => {
  for (const languagePrefix of ['', 'en/']) {
    for (let articleId = 1; articleId <= 6; articleId += 1) {
      const html = await readBuiltPage(`${languagePrefix}articles/${articleId}/index.html`)
      assert.match(html, /id="article-structured-data"/)
    }
  }
})
