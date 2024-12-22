'use client'

import { ChevronLeft, ChevronRight, PenSquare, FileText, Calendar, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { EditorTab } from '@/types/editor'
import { useState } from 'react'

interface EditorSidebarProps {
  isCollapsed: boolean
  selectedTab: EditorTab
  onTabSelect: (tab: EditorTab) => void
  onContentChange: (content: string) => void
  onGenerateStart: () => void
}

export function EditorSidebar({ 
  isCollapsed, 
  selectedTab,
  onTabSelect,
  onContentChange,
  onGenerateStart 
}: EditorSidebarProps) {
  const [topic, setTopic] = useState('')
  const [writingSample, setWritingSample] = useState('')
  const [writingStyle, setWritingStyle] = useState('professional')
  const [targetLength, setTargetLength] = useState('medium')

  const handleGenerate = async () => {
    if (!topic) {
      alert('Please enter a topic')
      return
    }

    onGenerateStart()

    try {
      const formData = new FormData()
      formData.append('topic', topic)
      formData.append('writing_sample', writingSample)
      formData.append('writing_style', writingStyle)
      formData.append('target_length', targetLength)

      const response = await fetch('/api/posts/generate', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to generate post')
      }

      const data = await response.json()
      onContentChange(data.generated_post)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate post')
    }
  }

  const tabs = [
    { id: 'compose' as EditorTab, icon: PenSquare, label: 'Compose' },
    { id: 'draft' as EditorTab, icon: FileText, label: 'Draft' },
    { id: 'scheduled' as EditorTab, icon: Calendar, label: 'Scheduled' },
    { id: 'canceled' as EditorTab, icon: XCircle, label: 'Canceled' }
  ]

  if (isCollapsed) return null

  return (
    <div className={cn(
      "fixed right-0 top-0 h-screen bg-white border-l border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 px-3",
                  selectedTab === tab.id ? "bg-white text-emerald-600" : "bg-emerald-50 text-gray-600 hover:bg-emerald-100"
                )}
                onClick={() => onTabSelect(tab.id)}
              >
                {tab.icon && <tab.icon className="h-4 w-4" />}
                {!isCollapsed && <span>{tab.label}</span>}
              </Button>
            ))}
          </nav>
        </div>

        <Button 
          onClick={handleGenerate}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
        >
          Generate Post
        </Button>
      </div>
    </div>
  )
}

