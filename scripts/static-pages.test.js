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
  assert.match(html, /AI 기대와 금리 인상이 엇갈린 하루/)
  assert.match(html, /"@type":"NewsArticle"/)
  assert.match(html, /"articleBody":"코스피는 엔비디아의 실적 발표 이후/)
  assert.match(html, /property="og:image" content="https:\/\/van-media-company\.vercel\.app\/images\/internal-review\/01-kospi\.jpg"/)
  assert.match(html, /name="twitter:card" content="summary_large_image"/)
  assert.match(html, /"@type":"ImageObject"/)
  assert.match(html, /"caption":"27일 서울 중구 하나은행 본점/)
  assert.match(html, /"creditText":"내부 검토용 · 사진: 서대연 기자 \/ 연합뉴스"/)
  assert.doesNotMatch(html, /"citation":/)
  assert.match(html, /https:\/\/van-media-company\.vercel\.app\/articles\/1\//)
})

test('each story keeps its own source image metadata', async () => {
  const secondArticle = await readBuiltPage('articles/2/index.html')
  const thirdArticle = await readBuiltPage('articles/3/index.html')

  assert.match(secondArticle, /images\/internal-review\/02-growth\.webp/)
  assert.doesNotMatch(secondArticle, /03-blood-screening\.png/)
  assert.match(secondArticle, /name="twitter:card" content="summary_large_image"/)
  assert.match(thirdArticle, /images\/internal-review\/03-blood-screening\.png/)
})

test('English article page has a stable localized canonical URL', async () => {
  const html = await readBuiltPage('en/articles/1/index.html')

  assert.match(html, /<html lang="en">/)
  assert.match(html, /AI optimism and rate hike/)
  assert.match(html, /property="og:locale" content="en_US"/)
  assert.match(html, /property="og:image:alt" content="A market board showing the KOSPI/)
  assert.match(html, /"caption":"A market board at Hana Bank headquarters/)
  assert.match(html, /"creditText":"Internal review only · Photo: Seo Dae-yeon \/ Yonhap News Agency"/)
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
