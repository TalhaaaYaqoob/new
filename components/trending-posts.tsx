import { PostCard } from './post-card'

const TRENDING_POSTS = [
  {
    avatar: '/placeholder.svg',
    name: 'Sarah Wilson',
    date: '2024/08/29',
    content: 'Just launched our new AI-powered marketing analytics platform! 🚀 The response has been incredible. Our platform helps businesses understand their marketing data better than ever before. #MarTech #AI #Analytics',
    likes: 1542,
    views: 15000,
  },
  {
    avatar: '/placeholder.svg',
    name: 'David Chen',
    date: '2024/08/29',
    content: 'Three key lessons from scaling our startup to 1M users:\n\n1. Focus on user feedback\n2. Iterate quickly\n3. Build a strong team\n\nWhat\'s your biggest scaling challenge?',
    likes: 892,
    views: 12000,
  },
  {
    avatar: '/placeholder.svg',
    name: 'Emily Rodriguez',
    date: '2024/08/29',
    content: 'Breaking: Our latest research shows that companies investing in employee wellness programs see a 300% ROI. Full report in comments! 📊 #HR #Wellness #Leadership',
    likes: 723,
    views: 9000,
  }
]

export function TrendingPosts() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Trending Posts Today
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRENDING_POSTS.map((post, index) => (
          <PostCard
            key={index}
            {...post}
          />
        ))}
      </div>
    </div>
  )
}

