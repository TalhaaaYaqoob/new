import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

interface Post {
  profile_url: string
  first_name: string
  last_name: string
  headline: string
  profile_image: string
  post: {
    text: string
    posted_at: string
    likes: number
    comments: number
    shares: number
    images: string[]
  }
}

export function PostFeed({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src={post.profile_image}
              alt={`${post.first_name} ${post.last_name}`}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold">
                {post.first_name} {post.last_name}
              </h3>
              <p className="text-sm text-gray-500">{post.headline}</p>
            </div>
          </div>
          
          <p className="mb-4 whitespace-pre-wrap">{post.post.text}</p>
          
          {post.post.images?.length > 0 && (
            <div className="mb-4">
              <Image
                src={post.post.images[0]}
                alt="Post image"
                width={500}
                height={300}
                className="rounded-lg"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{post.post.likes} likes</span>
            <span>{post.post.comments} comments</span>
            <span>{post.post.shares} shares</span>
            <span>
              {formatDistanceToNow(new Date(post.post.posted_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}