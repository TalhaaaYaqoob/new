'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ThumbsUp, ThumbsDown, PenSquare, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SidebarComposer } from './sidebar-composer'

interface NewsCardProps {
  headline: string;
  summary: string;
  newsLink: string;
  imageUrl: string;
  date: string;
}

export function NewsCard({
  headline,
  summary,
  newsLink,
  imageUrl,
  date
}: NewsCardProps) {
  const [reaction, setReaction] = useState<'agree' | 'disagree' | null>(null)
  const [isComposerOpen, setIsComposerOpen] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-4 flex-grow space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900">{headline}</h3>
          <p className="text-sm text-gray-600">{summary}</p>
        </div>

        <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={headline}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-600 hover:text-emerald-600",
                reaction === 'agree' && "text-emerald-600 bg-emerald-50"
              )}
              onClick={() => setReaction(reaction === 'agree' ? null : 'agree')}
            >
              <ThumbsUp className="h-4 w-4 mr-2 text-emerald-500" />
              Agree
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-600 hover:text-red-600",
                reaction === 'disagree' && "text-red-600 bg-red-50"
              )}
              onClick={() => setReaction(reaction === 'disagree' ? null : 'disagree')}
            >
              <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
              Disagree
            </Button>
          </div>
          <div className="text-sm text-gray-500">{date}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <a 
            href={newsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
          >
            Read full article
            <ExternalLink className="h-4 w-4" />
          </a>
          <Button 
            variant="default"
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setIsComposerOpen(true)}
          >
            <PenSquare className="h-4 w-4 mr-2" />
            Turn Into Post
          </Button>
        </div>
      </div>
      <SidebarComposer
        initialContent={headline + "\n\n" + summary}
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
      />
    </div>
  )
}

