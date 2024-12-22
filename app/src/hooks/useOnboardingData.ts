import { useState, useEffect } from 'react'
import { getOnboardingData } from '@/app/src/services/onboarding'
import type { FormData } from '@/types/onboarding'

export function useOnboardingData() {
  const [data, setData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const onboardingData = await getOnboardingData()
        setData(onboardingData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}