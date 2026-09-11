import { useEffect, useState } from 'react'

export function useArticleRequest(load, { retainKey } = {}) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    Promise.resolve().then(() => load(controller.signal)).then(
      (data) => {
        if (!controller.signal.aborted) setResult({ load, attempt, retainKey, data, status: 'success' })
      },
      (error) => {
        if (!controller.signal.aborted) setResult({ load, attempt, retainKey, error, status: 'error' })
      },
    )
    return () => controller.abort()
  }, [load, attempt, retainKey])

  const previousData = retainKey !== undefined && result?.retainKey === retainKey && result?.status === 'success'
    ? result.data
    : undefined
  const current = result?.load === load && result.attempt === attempt && result.retainKey === retainKey
    ? result
    : { status: 'loading', data: previousData }
  return { ...current, retry: () => setAttempt((value) => value + 1) }
}
