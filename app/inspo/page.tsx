'use client'

import { HomePage } from '@/components/home-page'
import { useAuth } from '@clerk/nextjs'

export default function InspoPage() {
  const { userId } = useAuth()
  
  if (!userId) return null
  
  return <HomePage />
}