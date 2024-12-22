'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PostPreview } from './post-preview'
import type { ScheduledPost } from '@/types/editor'

interface DayModalProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  timezone: string
  scheduledPosts: ScheduledPost[]
}

export function DayModal({ isOpen, onClose, date, timezone, scheduledPosts }: DayModalProps) {
  const sortedPosts = [...scheduledPosts].sort((a, b) => 
    new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex items-center justify-between mb-4">
          <DialogTitle>
            Daily Schedule for {format(date, 'MMMM d, yyyy')}
          </DialogTitle>
          <div className="text-sm text-gray-500">
            Timezone: {timezone}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-grow mt-4 h-[60vh]">
          <div className="space-y-4 pr-4">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post) => (
                <div key={post.id} className="flex gap-4">
                  <div className="w-16 py-2 text-sm font-medium text-gray-500">
                    {format(new Date(post.scheduledFor), 'HH:mm')}
                  </div>
                  <div className="flex-1 min-h-[3rem] border-l border-gray-200 pl-4">
                    <PostPreview post={post} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No posts scheduled for this day.
              </div>
            )}
          </div>
        </ScrollArea>

        {sortedPosts.length === 0 && (
          <div className="mt-6 pt-6 border-t">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Add Post
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

