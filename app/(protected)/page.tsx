'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export default function Page() {
  const router = useRouter()
  const { userId, isLoaded } = useAuth()

  useEffect(() => {
    if (!isLoaded) return

    if (!userId) {
      router.push('/sign-in')
      return
    }

    router.push('/choice')
  }, [isLoaded, userId, router])

  return null
}

