'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { CollectionsProvider } from '@/contexts/collections-context'
import { ScheduledPostsProvider } from '@/contexts/scheduled-posts-context'
import { SidebarProvider } from '@/contexts/sidebar-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <CollectionsProvider>
        <ScheduledPostsProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ScheduledPostsProvider>
      </CollectionsProvider>
    </ClerkProvider>
  )
}
