'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/search-bar'
import { PostCard } from '@/components/post-card'
import { TrendingPosts } from '@/components/trending-posts'
import { PostInspirations } from '@/components/post-inspirations'
import { useOnboardingData } from '@/app/src/hooks/useOnboardingData'
import { FilterDialog } from '@/components/filter-dialog'
import { PenSquare } from 'lucide-react'
import Link from 'next/link'

interface LinkedInPost {
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
    id: string
  }
}

export function HomePage() {
  const [posts, setPosts] = useState<LinkedInPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: onboardingData, loading: onboardingLoading } = useOnboardingData()
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/posts')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch posts')
        }
        
        setPosts(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setError(error instanceof Error ? error.message : 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    if (!onboardingLoading) {
      fetchPosts()
    }
  }, [onboardingLoading])

  if (loading || onboardingLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <div className="text-gray-600">
          {typeof error === 'string' && error.includes('No industry selected') && 
            'Please complete your onboarding to select industries'}
        </div>
      </div>
    )
  }

  return (
    <main className="p-8">
      <PostInspirations />
      <div className="mb-8">
        <SearchBar 
          posts={[]}
          onShuffle={() => {}}
          userRole={onboardingData?.role}
          userIndustry={onboardingData?.industry}
          filterComponent={
            <FilterDialog
              open={filterOpen}
              onOpenChange={setFilterOpen}
              onFilterChange={(filters) => {
                console.log('Filters changed:', filters)
              }}
            />
          }
        />
      </div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
          {posts.map((post: LinkedInPost) => (
            <PostCard
              key={post.post.id}
              id={post.profile_url}
              avatar={post.profile_image}
              name={`${post.first_name} ${post.last_name}`}
              date={post.post.posted_at}
              content={post.post.text}
              likes={post.post.likes}
              views={post.post.shares + post.post.comments}
            />
          ))}
        </div>
      ) : (
        <TrendingPosts />
      )}

      <Link
        href="/write"
        className="fixed bottom-8 right-8 flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl z-50"
      >
        <PenSquare className="h-5 w-5" />
        <span className="text-lg font-medium">Write</span>
      </Link>
    </main>
  )
}