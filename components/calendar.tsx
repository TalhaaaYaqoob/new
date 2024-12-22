'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayClickedHandler } from '@/types/calendar'
import { Button } from '@/components/ui/button'
import { 
  addMonths, 
  subMonths, 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns'
import type { ScheduledPost } from '@/types/editor'

interface CalendarProps {
  onDayClicked: DayClickedHandler
  scheduledPosts: ScheduledPost[]
}

export function Calendar({ onDayClicked, scheduledPosts }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const hasPostsOnDay = (day: Date) => {
    return scheduledPosts.some(post => isSameDay(new Date(post.scheduledFor), day))
  }

  return (
    <div className="w-full mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {daysInMonth.map((day, index) => (
          <Button
            key={day.toString()}
            variant="outline"
            className={`h-16 ${
              !isSameMonth(day, currentMonth) ? 'invisible' : ''
            } ${
              isToday(day) ? 'border-emerald-500 text-emerald-600' : ''
            } relative`}
            onClick={() => onDayClicked(day)}
          >
            <time dateTime={format(day, 'yyyy-MM-dd')}>
              {format(day, 'd')}
            </time>
            {hasPostsOnDay(day) && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

