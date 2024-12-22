'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar } from '@/components/calendar'
import { DayModal } from '@/components/day-modal'
import { SchedulePostForm } from '@/components/schedule-post-form'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useSidebar } from '@/contexts/sidebar-context'
import { useScheduledPosts } from '@/contexts/scheduled-posts-context'
import type { ScheduleFormData, ScheduledPost } from '@/types/editor'

export default function CalendarPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isCollapsed } = useSidebar()
  const { scheduledPosts, addScheduledPost } = useScheduledPosts()
  
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [showScheduleForm, setShowScheduleForm] = React.useState(false)

  // Get content from URL if it exists
  const content = searchParams.get('content')

  // This would normally come from your user settings
  const userTimezone = "UTC-08:00" 

  const handleDayClicked = (date: Date) => {
    setSelectedDate(date)
  }

  const handleCloseModal = () => {
    setSelectedDate(null)
  }

  React.useEffect(() => {
    if (content) {
      setShowScheduleForm(true)
    }
  }, [content])

  const handleSchedule = (data: ScheduleFormData) => {
    if (data.date && data.time) {
      // Create the scheduled date by combining the date and time
      const [hours, minutes] = data.time.split(':')
      const scheduledDate = new Date(data.date)
      scheduledDate.setHours(parseInt(hours, 10))
      scheduledDate.setMinutes(parseInt(minutes, 10))

      const newPost: ScheduledPost = {
        id: Math.random().toString(36).substr(2, 9),
        content: data.content,
        scheduledFor: scheduledDate,
        createdAt: new Date()
      }

      addScheduledPost(newPost)
      setShowScheduleForm(false)
      router.push('/calendar')
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'}`}>
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendar</h1>
          <Calendar onDayClicked={handleDayClicked} scheduledPosts={scheduledPosts} />
          {selectedDate && (
            <DayModal
              isOpen={!!selectedDate}
              onClose={handleCloseModal}
              date={selectedDate}
              timezone={userTimezone}
              scheduledPosts={scheduledPosts.filter(post => 
                post.scheduledFor.toDateString() === selectedDate.toDateString()
              )}
            />
          )}
          
          <Dialog open={showScheduleForm} onOpenChange={setShowScheduleForm}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogTitle>Schedule Post</DialogTitle>
              <DialogDescription>
                Choose a date and time to schedule your post.
              </DialogDescription>
              <SchedulePostForm
                content={content || ''}
                onSchedule={handleSchedule}
                onCancel={() => {
                  setShowScheduleForm(false)
                  router.push('/calendar')
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}

