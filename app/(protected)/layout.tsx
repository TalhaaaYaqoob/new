'use client'

import { SidebarNav } from '@/components/sidebar-nav'
import { SidebarProvider } from '@/contexts/sidebar-context'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in')
    }
  }, [isLoaded, userId, router])

  if (!isLoaded || !userId) return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SidebarNav />
        <div className="flex-1 transition-all duration-300 ml-[var(--sidebar-width)]">
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}