'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EditorSidebar } from '@/components/text-editor/editor-sidebar'
import { DraftsSidebar } from '@/components/text-editor/drafts-sidebar'
import { Textarea } from '@/components/ui/textarea'
import { EditorTools } from '@/components/text-editor/editor-tools'
import { ContentLoader } from '@/components/ui/content-loader'
import { Button } from '@/components/ui/button'
import { Calendar, FileText, PenSquare, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import type { Draft, EditorState, EditorTab } from '@/types/editor'
import { useScheduledPosts } from '@/contexts/scheduled-posts-context'
import { SelectionToolbar } from '@/components/text-editor/selection-toolbar'
import { BubbleMenu } from '@/components/text-editor/bubble-menu'

const SAMPLE_DRAFTS: Draft[] = [
  {
    id: '1',
    title: 'Marketing Strategy 2024',
    content: 'Our marketing strategy for 2024 focuses on...',
    lastEdited: new Date(),
    status: 'draft'
  },
  {
    id: '2',
    title: 'Team Updates',
    content: 'Weekly team updates and progress report...',
    lastEdited: new Date(),
    status: 'scheduled'
  }
]

const tabs = [
  { id: 'compose' as EditorTab, icon: PenSquare, label: 'Compose' },
  { id: 'draft' as EditorTab, icon: FileText, label: 'Draft' },
  { id: 'scheduled' as EditorTab, icon: Calendar, label: 'Scheduled' },
  { id: 'canceled' as EditorTab, icon: XCircle, label: 'Canceled' }
]

export default function WritePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialContent = searchParams.get('content') || ''

  const [isEditorSidebarCollapsed, setIsEditorSidebarCollapsed] = useState(false)
  const [drafts, setDrafts] = useState<Draft[]>(SAMPLE_DRAFTS)
  const { scheduledPosts } = useScheduledPosts()
  const [editorState, setEditorState] = useState<EditorState>({
    selectedTab: 'compose',
    content: initialContent,
    selectedDraftId: null
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [selectionPosition, setSelectionPosition] = useState<{ top: number; left: number } | null>(null)
  const [selectionStart, setSelectionStart] = useState<number>(0)
  const [selectionEnd, setSelectionEnd] = useState<number>(0)

  const handleTabSelect = (tab: EditorTab) => {
    setEditorState(prev => ({
      ...prev,
      selectedTab: tab,
      selectedDraftId: null
    }))
  }

  const handleDraftSelect = (draft: Draft) => {
    setEditorState(prev => ({
      ...prev,
      content: draft.content,
      selectedDraftId: draft.id
    }))
  }

  const handleDraftDelete = (draftId: string) => {
    setDrafts(prev => prev.filter(draft => draft.id !== draftId))
    if (editorState.selectedDraftId === draftId) {
      setEditorState(prev => ({
        ...prev,
        content: '',
        selectedDraftId: null
      }))
    }
  }

  const handleContentChange = (content: string, cursorPosition?: number) => {
    setEditorState(prev => ({
      ...prev,
      content
    }))
    setIsGenerating(false)
    
    // If a cursor position is provided, restore it after the content update
    if (cursorPosition !== undefined) {
      setTimeout(() => {
        const textarea = document.querySelector('textarea')
        if (textarea) {
          textarea.selectionStart = cursorPosition
          textarea.selectionEnd = cursorPosition
          textarea.focus()
        }
      }, 0)
    }
  }

  const handleScheduleClick = () => {
    if (editorState.content.trim()) {
      router.push(`/calendar?content=${encodeURIComponent(editorState.content)}`)
    }
  }

  const handleGenerateStart = () => {
    setIsGenerating(true)
  }

  const handleTextSelection = useCallback(() => {
    console.log('handleTextSelection triggered')
    
    const textarea = document.querySelector('textarea')
    if (!textarea) {
      console.error('Textarea element not found')
      return
    }

    const selection = window.getSelection()
    if (!selection) {
      console.error('No selection available')
      return
    }

    const selectedText = selection.toString().trim()
    console.log('Selected text:', selectedText)

    if (!selectedText) {
      console.log('No text selected, clearing selection state')
      setSelectionPosition(null)
      setSelectedText('')
      return
    }

    // Get the range and its bounding rectangle
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    console.log('Selection rectangle:', rect)

    const textareaRect = textarea.getBoundingClientRect()
    console.log('Textarea rectangle:', textareaRect)

    const position = {
      top: rect.top - textareaRect.top + textarea.scrollTop,
      left: rect.left - textareaRect.left
    }
    console.log('Calculated position:', position)

    setSelectionPosition(position)
    setSelectedText(selectedText)
    setSelectionStart(textarea.selectionStart)
    setSelectionEnd(textarea.selectionEnd)
  }, [])

  const handleChangeHook = async () => {
    try {
      if (!selectedText || selectionStart === null || selectionEnd === null) {
        throw new Error('No text selected')
      }

      const formData = new FormData()
      formData.append('user_id', '123')
      formData.append('original_hook', selectedText)
      formData.append('description', 'change hook')

      const response = await fetch('http://127.0.0.1:8001/api/v1/inline-editing/hooks/generate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Failed to generate hook: ${await response.text()}`)
      }

      const data = await response.json()
      const generated_hook = Array.isArray(data) ? data[0] : data?.generated_hook

      if (!generated_hook) {
        throw new Error('No generated hook in response')
      }

      // Get the textarea element
      const textarea = document.querySelector('textarea')
      if (!textarea) {
        throw new Error('Textarea element not found')
      }

      // Store the current scroll position
      const scrollTop = textarea.scrollTop

      // Create new content by precisely replacing only the selected text
      const beforeSelection = editorState.content.substring(0, selectionStart)
      const afterSelection = editorState.content.substring(selectionEnd)
      const newContent = beforeSelection + generated_hook + afterSelection

      // Update content while preserving cursor position and scroll
      handleContentChange(newContent, selectionStart + generated_hook.length)
      
      // Restore scroll position
      textarea.scrollTop = scrollTop

      // Clear selection state
      setSelectionPosition(null)
      setSelectedText('')

    } catch (error) {
      console.error('Error in handleChangeHook:', error)
      alert(error instanceof Error ? error.message : 'Failed to generate hook')
    }
  }

  const handleRewrite = async (tone: string, length: string) => {
    try {
      if (!selectedText || selectionStart === null || selectionEnd === null) {
        throw new Error('No text selected')
      }

      // Store current selection and scroll state
      const textarea = document.querySelector('textarea')
      if (!textarea) {
        throw new Error('Textarea element not found')
      }
      const scrollTop = textarea.scrollTop

      const formData = new FormData()
      formData.append('user_id', '123')
      formData.append('original_content', selectedText)
      formData.append('tone', tone)
      formData.append('target_length', length)
      formData.append('description', 'rewrite selected text')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      try {
        const response = await fetch('http://127.0.0.1:8001/api/v1/inline-editing/content/rewrite', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: formData,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        
        if (!data?.rewritten_content) {
          throw new Error('No rewritten content in response')
        }

        // Create new content by precisely replacing only the selected text
        const beforeSelection = editorState.content.substring(0, selectionStart)
        const afterSelection = editorState.content.substring(selectionEnd)
        const newContent = beforeSelection + data.rewritten_content + afterSelection

        // Update content while preserving cursor position and scroll
        handleContentChange(newContent, selectionStart + data.rewritten_content.length)
        
        // Restore scroll position
        textarea.scrollTop = scrollTop

        // Clear selection state
        setSelectionPosition(null)
        setSelectedText('')

      } catch (fetchError: unknown) {
        clearTimeout(timeoutId)
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            throw new Error('Request timed out - please try again')
          }
          throw fetchError
        }
        throw new Error('An unknown error occurred')
      }
    } catch (error) {
      console.error('Error in handleRewrite:', error)
      alert(error instanceof Error ? error.message : 'Failed to rewrite content')
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const bubbleMenu = document.querySelector('.bubble-menu')
      const textarea = document.querySelector('textarea')
      const target = event.target as HTMLElement
      
      // Don't close if clicking select components or their children
      if (
        target.closest('[role="combobox"]') || 
        target.closest('[role="listbox"]') ||
        target.closest('[role="option"]') ||
        bubbleMenu?.contains(target) ||
        textarea?.contains(target)
      ) {
        return
      }

      setSelectionPosition(null)
      setSelectedText('')
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    console.log('Selection state changed:', {
      selectedText,
      selectionPosition,
      selectionStart,
      selectionEnd
    })
  }, [selectedText, selectionPosition, selectionStart, selectionEnd])

  // Add this function to test the API connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/health', {
        method: 'GET',
      })
      console.log('Backend health check status:', response.status)
      const data = await response.text()
      console.log('Backend response:', data)
    } catch (error) {
      console.error('Backend connection error:', error)
    }
  }

  // Add this function to test CORS
  const testCORS = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/api/v1/inline-editing/content/rewrite', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type,Accept'
        }
      })
      console.log('CORS preflight response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (error) {
      console.error('CORS test failed:', error)
    }
  }

  // Call this in useEffect
  useEffect(() => {
    testBackendConnection()
    testCORS()
  }, [])

  return (
    <div className="min-h-screen bg-white flex relative">
      <EditorSidebar 
        isCollapsed={isEditorSidebarCollapsed}
        selectedTab={editorState.selectedTab}
        onTabSelect={handleTabSelect}
        onContentChange={handleContentChange}
        onGenerateStart={handleGenerateStart}
      />
      
      <main className={`transition-all duration-300 flex flex-1 ${
        isEditorSidebarCollapsed ? 'mr-0' : 'ml-0 mr-0'
      }`}>
        <div className="flex-1 flex flex-col w-full">
          <div className="flex-1 mt-4 relative">
            {isGenerating ? (
              <ContentLoader />
            ) : (
              <>
                <Textarea
                  placeholder="Start writing or your generated post will appear here..."
                  className="w-full h-full min-h-screen resize-none border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 px-6 pt-4"
                  value={editorState.content}
                  onChange={(e) => {
                    console.log('Textarea onChange')
                    handleContentChange(e.target.value)
                  }}
                  onMouseUp={(e) => {
                    console.log('Textarea onMouseUp')
                    handleTextSelection()
                  }}
                  onKeyUp={(e) => {
                    console.log('Textarea onKeyUp')
                    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                      handleTextSelection()
                    }
                  }}
                  onSelect={(e) => {
                    console.log('Textarea onSelect')
                    handleTextSelection()
                  }}
                />
                {selectedText && selectionPosition && (
                  <BubbleMenu
                    selectedText={selectedText}
                    onChangeHook={handleChangeHook}
                    onRewrite={handleRewrite}
                    position={selectionPosition}
                    onClose={() => {
                      setSelectionPosition(null)
                      setSelectedText('')
                    }}
                  />
                )}
              </>
            )}
          </div>
          <div className="border-t border-gray-200 bg-white flex items-center justify-between p-4">
            <EditorTools />
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleScheduleClick}
              disabled={!editorState.content.trim()}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>
        {editorState.selectedTab === 'draft' && (
          <DraftsSidebar 
            drafts={drafts}
            selectedDraftId={editorState.selectedDraftId}
            onDraftSelect={handleDraftSelect}
            onDraftDelete={handleDraftDelete}
          />
        )}
        {editorState.selectedTab === 'scheduled' && (
          <div className="w-64 border-l border-gray-200 bg-white h-screen overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Scheduled Posts</h2>
              {scheduledPosts.length > 0 ? (
                <div className="space-y-4">
                  {scheduledPosts.map((post) => (
                    <div 
                      key={post.id} 
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                        {post.content.split('\n')[0]}
                      </p>
                      <p className="text-xs text-gray-400">
                        Scheduled for {format(post.scheduledFor, 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No scheduled posts
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

