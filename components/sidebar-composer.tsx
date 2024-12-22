'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Maximize2, Image, Smile, Copy, Upload, PenSquare, FileText, Calendar, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { EditorTab, ScheduledPost } from '@/types/editor'
import { useScheduledPosts } from '@/contexts/scheduled-posts-context'

interface SidebarComposerProps {
  initialContent?: string
  isOpen: boolean
  onClose: () => void
}

export function SidebarComposer({ 
  initialContent = '', 
  isOpen, 
  onClose,
}: SidebarComposerProps) {
  const router = useRouter()
  const [content, setContent] = useState(initialContent)
  const [selectedTab, setSelectedTab] = useState<EditorTab>('compose')
  const { scheduledPosts } = useScheduledPosts()

  const tools = [
    { icon: Copy, label: 'Copy' },
    { icon: Upload, label: 'Share' },
    { icon: Smile, label: 'Emoji' },
    { icon: Image, label: 'Image' },
  ]

  const tabs = [
    { id: 'compose' as EditorTab, icon: PenSquare, label: 'Compose' },
    { id: 'draft' as EditorTab, icon: FileText, label: 'Draft' },
    { id: 'scheduled' as EditorTab, icon: Calendar, label: 'Scheduled' },
    { id: 'canceled' as EditorTab, icon: XCircle, label: 'Canceled' }
  ]

  const handleScheduleClick = () => {
    if (content.trim()) {
      router.push(`/calendar?content=${encodeURIComponent(content)}`)
    }
  }

  const renderTabContent = (tab: EditorTab) => {
    switch (tab) {
      case 'compose':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to share?"
                className="min-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
            </div>
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tools.map((Tool) => (
                    <Button
                      key={Tool.label}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                    >
                      <Tool.icon className="h-5 w-5 text-gray-500" />
                      <span className="sr-only">{Tool.label}</span>
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/write?content=${encodeURIComponent(content)}`}>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Maximize2 className="h-5 w-5 text-gray-500" />
                      <span className="sr-only">Expand editor</span>
                    </Button>
                  </Link>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
                    onClick={handleScheduleClick}
                    disabled={!content.trim()}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'scheduled':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4">
              {scheduledPosts.length > 0 ? (
                <div className="space-y-2">
                  {scheduledPosts.map((post) => (
                    <div 
                      key={post.id} 
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {post.content}
                      </p>
                      <p className="text-xs text-gray-400">
                        Scheduled for {format(new Date(post.scheduledFor), 'MMM d, yyyy HH:mm')}
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
          </ScrollArea>
        )
      case 'draft':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="text-center text-gray-500 py-8">
                No drafts available
              </div>
            </div>
          </ScrollArea>
        )
      case 'canceled':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="text-center text-gray-500 py-8">
                No canceled posts
              </div>
            </div>
          </ScrollArea>
        )
      default:
        return null
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Edit Post</SheetTitle>
        </SheetHeader>
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as EditorTab)} className="flex flex-col h-[calc(100vh-5rem)]">
          <TabsList className="w-full h-12 grid grid-cols-4 border-b">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-white"
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="compose" className="h-full">
            {renderTabContent('compose')}
          </TabsContent>
          <TabsContent value="scheduled" className="h-full">
            {renderTabContent('scheduled')}
          </TabsContent>
          <TabsContent value="draft" className="h-full">
            {renderTabContent('draft')}
          </TabsContent>
          <TabsContent value="canceled" className="h-full">
            {renderTabContent('canceled')}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

