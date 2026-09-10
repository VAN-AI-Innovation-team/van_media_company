import { useCallback, useEffect, useState } from 'react'
import { JournalistApi, PressReleaseApi } from '../mediaOutreachApi.js'

export function useJournalists() {
  const [journalists, setJournalists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setJournalists(await JournalistApi.list())
    } catch (caught) {
      setError(caught)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { journalists, loading, error, reload }
}

export function usePressReleases() {
  const [pressReleases, setPressReleases] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setPressReleases(await PressReleaseApi.list())
    } catch (caught) {
      setError(caught)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { pressReleases, loading, error, reload }
}
