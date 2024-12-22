export type EditorTab = 'compose' | 'draft' | 'scheduled' | 'canceled'

export interface Draft {
  id: string
  title: string
  content: string
  lastEdited: Date
  status: 'draft' | 'scheduled' | 'canceled'
}

export interface ScheduledPost {
  id: string
  content: string
  scheduledFor: Date
  createdAt: Date
}

export interface EditorState {
  selectedTab: EditorTab
  content: string
  selectedDraftId: string | null
}

export interface ScheduleFormData {
  content: string
  date: Date | undefined
  time: string
}

