'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { ScheduleFormData } from '@/types/editor'

interface SchedulePostFormProps {
  content: string
  onSchedule: (data: ScheduleFormData) => void
  onCancel: () => void
}

export function SchedulePostForm({ content, onSchedule, onCancel }: SchedulePostFormProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>('')

  // Generate time slots every 30 minutes
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    return `${hour.toString().padStart(2, '0')}:${minute}`
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (date && time) {
      onSchedule({ content, date, time })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600 line-clamp-3">{content}</p>
        </Card>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full p-4"
              disabled={(date) => date < new Date()}
              classNames={{
                months: "w-full",
                month: "w-full",
                table: "w-full",
                head_cell: "w-full text-muted-foreground font-normal",
                cell: "w-full text-center p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "w-full h-12 p-0 font-normal aria-selected:opacity-100",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                nav_button: "h-8 w-8",
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={!date || !time}
        >
          Schedule Post
        </Button>
      </div>
    </form>
  )
}

