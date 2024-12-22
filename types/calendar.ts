export type DayClickedHandler = (date: Date) => void

export interface ScheduledPost {
  id: string
  content: string
  scheduledTime: string
  likes?: number
  views?: number
  avatar?: string
}

export interface TimeSlot {
  time: string
  posts: ScheduledPost[]
}

