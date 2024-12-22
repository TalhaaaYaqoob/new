'use client'

import React, { createContext, useContext, useState } from 'react'
import type { ScheduledPost } from '@/types/editor'

type ScheduledPostsContextType = {
  scheduledPosts: ScheduledPost[]
  addScheduledPost: (post: ScheduledPost) => void
}

const ScheduledPostsContext = createContext<ScheduledPostsContextType | undefined>(undefined)

export function ScheduledPostsProvider({ children }: { children: React.ReactNode }) {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])

  const addScheduledPost = (post: ScheduledPost) => {
    setScheduledPosts(prev => [...prev, post])
  }

  return (
    <ScheduledPostsContext.Provider value={{ scheduledPosts, addScheduledPost }}>
      {children}
    </ScheduledPostsContext.Provider>
  )
}

export function useScheduledPosts() {
  const context = useContext(ScheduledPostsContext)
  if (context === undefined) {
    throw new Error('useScheduledPosts must be used within a ScheduledPostsProvider')
  }
  return context
}

