import { useEffect, useState } from 'react'

export function useArticleRequest(load) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    Promise.resolve().then(() => load(controller.signal)).then(
      (data) => {
        if (!controller.signal.aborted) setResult({ load, attempt, data, status: 'success' })
      },
      (error) => {
        if (!controller.signal.aborted) setResult({ load, attempt, error, status: 'error' })
      },
    )
    return () => controller.abort()
  }, [load, attempt])

  const current = result?.load === load && result.attempt === attempt
    ? result
    : { status: 'loading', data: undefined }
  return { ...current, retry: () => setAttempt((value) => value + 1) }
}
