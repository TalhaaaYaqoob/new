'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, ThumbsUp, Eye, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Collection } from '@/types/collection'
import { cn } from '@/lib/utils'
import { useCollections } from '@/contexts/collections-context'

interface CollectionCardProps {
  collection: Collection
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

export function CollectionCard({ collection }: CollectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { removePostFromCollection } = useCollections()

  const handleDeletePost = (postId: string) => {
    removePostFromCollection(collection.id, postId)
  }

  return (
    <Card className="w-full transition-all duration-200">
      <CardHeader 
        className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <span>{collection.icon}</span>
          <span>{collection.name}</span>
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold">{collection.posts.length}</div>
          <div className="text-gray-500">
            {collection.posts.length === 1 ? 'Post' : 'Posts'}
          </div>
        </div>

        <div className={cn(
          "space-y-4 overflow-hidden transition-all duration-200",
          isExpanded ? "mt-6" : "mt-2"
        )}>
          {isExpanded ? (
            collection.posts.map((post) => (
              <div 
                key={post.id} 
                className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.avatar} alt="Avatar" />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-400 text-sm">{post.date}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeletePost(post.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                  </Button>
                </div>
                <p className="text-gray-600 mb-3">{post.content}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-gray-500">
                    <ThumbsUp className="h-4 w-4 mr-1.5 text-emerald-500" />
                    <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Eye className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">{formatNumber(post.views)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              {collection.posts.slice(0, 2).map((post) => (
                <div key={post.id} className="text-sm text-gray-600">
                  <div className="text-gray-400 mb-1">{post.date}</div>
                  <p className="line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-gray-500">
                      <ThumbsUp className="h-4 w-4 mr-1.5 text-emerald-500" />
                      <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Eye className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">{formatNumber(post.views)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {collection.posts.length > 2 && (
                <div className="text-sm text-blue-600 mt-2">
                  +{collection.posts.length - 2} more
                </div>
              )}
            </>
          )}

          {collection.posts.length === 0 && (
            <div className="text-sm text-gray-500">
              No posts in this collection yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

