import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import type { ScheduledPost } from '@/types/editor'

interface PostPreviewProps {
  post: ScheduledPost
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>P</AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium text-gray-900">
          Scheduled Post
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
        {post.content}
      </p>
      <p className="text-xs text-gray-400">
        Scheduled for {format(new Date(post.scheduledFor), 'MMM d, yyyy HH:mm')}
      </p>
    </div>
  )
}

