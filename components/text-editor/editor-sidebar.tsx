'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, PenSquare, XCircle } from 'lucide-react'
import type { EditorTab } from '@/types/editor'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const WRITING_STYLES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sarcastic', label: 'Sarcastic' }
]

const TARGET_LENGTHS = [
  { value: 'short', label: 'Short (< 150 words)' },
  { value: 'medium', label: 'Medium (150-300 words)' },
  { value: 'long', label: 'Long (> 300 words)' }
]

const tabs = [
  { id: 'compose' as EditorTab, icon: PenSquare, label: 'Compose' },
  { id: 'draft' as EditorTab, icon: FileText, label: 'Draft' },
  { id: 'scheduled' as EditorTab, icon: Calendar, label: 'Scheduled' },
  { id: 'canceled' as EditorTab, icon: XCircle, label: 'Canceled' }
]

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGenerate = async () => {
    if (!topic) {
      alert('Please enter a topic')
      return
    }

    setIsSubmitting(true)
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
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCollapsed) return null

  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-screen">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabSelect(tab.id)}
              className={`flex-1 p-2 text-sm font-medium ${
                selectedTab === tab.id
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 mx-auto" />
              <span className="mt-1 block text-xs">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {selectedTab === 'compose' && (
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1.5">
            <Label htmlFor="topic" className="text-sm font-medium">Topic (Required)</Label>
            <Input
              id="topic"
              placeholder="Enter your topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="writing-sample" className="text-sm font-medium">Writing Sample (Optional)</Label>
            <Textarea
              id="writing-sample"
              placeholder="Paste a sample of your writing style"
              value={writingSample}
              onChange={(e) => setWritingSample(e.target.value)}
              className="h-24"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="writing-style" className="text-sm font-medium">Writing Style</Label>
            <Select value={writingStyle} onValueChange={setWritingStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WRITING_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="target-length" className="text-sm font-medium">Target Length</Label>
            <Select value={targetLength} onValueChange={setTargetLength}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TARGET_LENGTHS.map((length) => (
                  <SelectItem key={length.value} value={length.value}>
                    {length.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerate}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Generating...' : 'Generate Post'}
          </Button>
        </div>
      )}
    </div>
  )
}

