import assert from 'node:assert/strict'
import test from 'node:test'
import { recommendJournalists } from './mediaOutreachApi.js'

const pressRelease = { keywords: ['AI', '반도체', '모빌리티'] }

const journalists = [
  { id: 1, name: '키워드 2개 일치', interestKeywords: ['AI', '반도체'], beat: '금융' },
  { id: 2, name: '키워드 1개 + 출입처 일치', interestKeywords: ['모빌리티'], beat: 'AI' },
  { id: 3, name: '불일치', interestKeywords: ['부동산'], beat: '정치' },
  { id: 4, name: '대소문자만 다름', interestKeywords: ['ai'], beat: '산업' },
]

test('recommendJournalists scores by keyword overlap and excludes non-matches', () => {
  const recommended = recommendJournalists(pressRelease, journalists)

  assert.equal(recommended.length, 3)
  assert.ok(!recommended.some((candidate) => candidate.journalist.id === 3))
})

test('recommendJournalists ranks higher overlap first and counts beat as a match', () => {
  const recommended = recommendJournalists(pressRelease, journalists)

  assert.equal(recommended[0].journalist.id, 1)
  assert.equal(recommended[0].score, 2)

  const beatMatch = recommended.find((candidate) => candidate.journalist.id === 2)
  assert.equal(beatMatch.score, 2)
  assert.equal(beatMatch.beatMatches, true)
})

test('recommendJournalists matches keywords case-insensitively', () => {
  const recommended = recommendJournalists(pressRelease, journalists)
  const caseInsensitive = recommended.find((candidate) => candidate.journalist.id === 4)

  assert.ok(caseInsensitive)
  assert.deepEqual(caseInsensitive.matchedKeywords, ['ai'])
})

test('recommendJournalists respects the limit option', () => {
  const recommended = recommendJournalists(pressRelease, journalists, { limit: 1 })
  assert.equal(recommended.length, 1)
})
