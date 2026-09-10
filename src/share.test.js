import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getShareTargets,
  shareWithDevice,
  supportsNativeShare,
} from './share.js'

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

test('native share support is detected from the browser API', () => {
  assert.equal(supportsNativeShare({ share() {} }), true)
  assert.equal(
    supportsNativeShare(
      { share() {}, canShare: () => true },
      { title: '기사', url: 'https://example.com/' },
    ),
    true,
  )
  assert.equal(
    supportsNativeShare(
      { share() {}, canShare: () => false },
      { title: '기사', url: 'https://example.com/' },
    ),
    false,
  )
  assert.equal(supportsNativeShare({}), false)
  assert.equal(supportsNativeShare(undefined), false)
})

test('device share passes the complete article payload to the operating system', async () => {
  const calls = []
  const navigatorObject = {
    async share(payload) {
      calls.push(payload)
    },
  }
  const payload = {
    title: '기사 제목',
    text: '기사 요약',
    url: 'https://example.com/articles/1/',
  }

  const result = await shareWithDevice(payload, navigatorObject)

  assert.deepEqual(result, { status: 'shared' })
  assert.deepEqual(calls, [payload])
})

test('device share distinguishes cancellation, failure, and unsupported browsers', async () => {
  const canceled = await shareWithDevice(
    { title: '기사', text: '요약', url: 'https://example.com/' },
    {
      async share() {
        const error = new Error('user canceled')
        error.name = 'AbortError'
        throw error
      },
    },
  )
  const failure = await shareWithDevice(
    { title: '기사', text: '요약', url: 'https://example.com/' },
    {
      async share() {
        throw new Error('share target unavailable')
      },
    },
  )
  const unsupported = await shareWithDevice(
    { title: '기사', text: '요약', url: 'https://example.com/' },
    {},
  )
  const rejectedByCanShare = await shareWithDevice(
    { title: '기사', text: '요약', url: 'https://example.com/' },
    { share() {}, canShare: () => false },
  )

  assert.deepEqual(canceled, { status: 'canceled' })
  assert.equal(failure.status, 'failed')
  assert.equal(failure.error.message, 'share target unavailable')
  assert.deepEqual(unsupported, { status: 'unsupported' })
  assert.deepEqual(rejectedByCanShare, { status: 'unsupported' })
})
