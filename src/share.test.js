import assert from 'node:assert/strict'
import test from 'node:test'
import { getShareTargets } from './share.js'

test('external share targets encode the article title and full URL', () => {
  const title = '기사 제목 & Article'
  const url = 'https://example.com/articles/1?lang=en&page=2'
  const targets = getShareTargets({ title, url })

  assert.equal(
    targets.x,
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  )
  assert.equal(
    targets.facebook,
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  )
  assert.equal(targets.instagram, 'https://www.instagram.com/')
})
