import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import test from 'node:test'

const { siteOrigin, localizedArticles } = JSON.parse(await readFile(new URL('../.generated/article-snapshot.json', import.meta.url), 'utf8'))
const readPage = (path) => readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8')

test('both home pages retain localized metadata and Google-only noindex', async () => {
  for (const language of ['ko', 'en']) {
    const html = await readPage(language === 'ko' ? 'index.html' : 'en/index.html')
    assert.ok(html.includes(`<html lang="${language}">`))
    assert.match(html, /<meta name="googlebot" content="noindex" \/>/)
    assert.doesNotMatch(html, /<meta name="robots" content="noindex/)
    assert.match(html, /"@type":"WebSite"/)
  }
})

test('every generated article matches the API snapshot used by this build', async () => {
  for (const { language, articles } of localizedArticles) {
    for (const article of articles) {
      const path = `${language === 'en' ? 'en/' : ''}articles/${article.id}/`
      const html = await readPage(`${path}index.html`)
      const structured = JSON.parse(html.match(/<script id="article-structured-data" type="application\/ld\+json">(.*?)<\/script>/s)[1])
      assert.equal(structured.headline, article.title)
      assert.equal(structured.description, article.summary)
      assert.equal(structured.articleBody, article.body.join('\n\n'))
      assert.equal(structured.author.name, article.author.name)
      assert.equal(structured.url, `${siteOrigin}/${path}`)
      assert.ok(html.includes(`<html lang="${language}">`))
      assert.match(html, /property="og:type" content="article"/)
      assert.match(html, /<meta name="googlebot" content="noindex" \/>/)
      assert.doesNotMatch(html, /content="(?:null|undefined)"/)
      if (article.image) {
        assert.equal(structured.image.url, new URL(article.image.src, siteOrigin).href)
        assert.equal(structured.image.caption, article.image.caption)
        assert.match(html, /name="twitter:card" content="summary_large_image"/)
        if (article.image.src.startsWith('/images/')) {
          await access(new URL(`../dist${article.image.src}`, import.meta.url))
        }
      }
    }
  }
})
