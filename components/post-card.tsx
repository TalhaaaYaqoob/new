'use client'

import { useState } from 'react'
import { Star, StarIcon, ThumbsUp, Eye, PenSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarComposer } from './sidebar-composer'
import { CollectionDialog } from './collection-dialog'
import { cn } from '@/lib/utils'
import { VariationsDialog } from './variations-dialog'
import { useCollections } from '@/contexts/collections-context'
import type { SavedPost } from '@/types/collection'

interface PostCardProps {
  id?: string
  avatar: string
  name: string
  date: string
  content: string | null
  likes: number
  views: number
  isScheduled?: boolean
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M+`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k+`
  }
  return num.toString()
}

export function PostCard({ 
  id = Math.random().toString(36).substr(2, 9),
  avatar, 
  name, 
  date, 
  content = '', 
  likes, 
  views,
  isScheduled = false 
}: PostCardProps) {
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isVariationsOpen, setIsVariationsOpen] = useState(false)
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false)
  const [initialContent, setInitialContent] = useState(content)
  const { collections, addPostToCollection } = useCollections()
  const [showFullContent, setShowFullContent] = useState(false)

  const post: SavedPost = {
    id,
    content: content || '',
    date,
    avatar,
    likes,
    views,
    name
  }

  const isInAnyCollection = collections.some(
    collection => collection.posts.some(p => p.id === id)
  )

  const handleStarClick = () => {
    if (!isInAnyCollection) {
      addPostToCollection('all', post)
      setIsCollectionDialogOpen(true)
    } else {
      setIsCollectionDialogOpen(true)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatar} alt="Avatar" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span className="text-gray-400 text-xs">{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-8 w-8 text-gray-400 hover:text-emerald-500",
                  isInAnyCollection && "text-emerald-500"
                )}
                onClick={handleStarClick}
              >
                {isInAnyCollection ? (
                  <StarIcon className="h-4 w-4 fill-current" />
                ) : (
                  <Star className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex-grow mb-3">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {content && content.length > 280 ? (
                <>
                  {showFullContent ? content : `${content.slice(0, 280)}...`}
                  <button 
                    className="text-blue-600 hover:text-blue-700 ml-1"
                    onClick={() => setShowFullContent(!showFullContent)}
                  >
                    {showFullContent ? 'Show less' : 'Read more'}
                  </button>
                </>
              ) : content}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-gray-500">
                <ThumbsUp className="h-4 w-4 mr-1.5 text-emerald-500" />
                <span className="text-sm font-medium">{formatNumber(likes)}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Eye className="h-4 w-4 mr-1.5" />
                <span className="text-sm">{formatNumber(views)}</span>
              </div>
            </div>
            
            <Button 
              variant="default"
              size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setIsVariationsOpen(true)}
            >
              <PenSquare className="h-4 w-4 mr-2" />
              Turn Into Post
            </Button>
          </div>
        </div>
      </div>

      <VariationsDialog
        open={isVariationsOpen}
        onOpenChange={setIsVariationsOpen}
        onGenerate={(variation) => {
          setIsVariationsOpen(false)
          setIsComposerOpen(true)
          // Pass the generated variation to the composer
          setInitialContent(variation)
        }}
        originalPost={content || ''}
        userId={id}
      />
      <SidebarComposer
        initialContent={content || ''}
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
      />
      <CollectionDialog
        open={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
        post={post}
      />
    </>
  )
}

