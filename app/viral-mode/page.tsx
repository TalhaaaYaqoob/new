'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { FilterDialog } from '@/components/filter-dialog'
import { useSidebar } from '@/contexts/sidebar-context'
import * as React from 'react'
import { PostCard } from '@/components/post-card'
import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/search-bar'

const TOPICS = [
  'marketing',
  'crypto',
  'saas',
  'gaming',
  'startup',
  'audience',
  'coding',
  'personal development'
]

const SIMILAR_TAGS: { [key: string]: string[] } = {
  'marketing': ['digital marketing', 'content strategy', 'social media'],
  'crypto': ['blockchain', 'bitcoin', 'ethereum'],
  'saas': ['cloud computing', 'b2b', 'subscription model'],
  'gaming': ['esports', 'game design', 'mobile gaming'],
  'startup': ['entrepreneurship', 'venture capital', 'innovation'],
  'audience': ['community building', 'engagement', 'user acquisition'],
  'coding': ['programming', 'software development', 'web development'],
  'personal development': ['self-improvement', 'productivity', 'mindfulness'],
  'digital marketing': ['seo', 'ppc', 'email marketing'],
  'content strategy': ['content marketing', 'storytelling', 'brand messaging'],
  'social media': ['influencer marketing', 'social media analytics', 'community management'],
  'blockchain': ['smart contracts', 'defi', 'nft'],
  'bitcoin': ['cryptocurrency trading', 'bitcoin mining', 'crypto wallets'],
  'ethereum': ['smart contracts', 'dapps', 'eth 2.0'],
  'cloud computing': ['iaas', 'paas', 'serverless'],
  'b2b': ['lead generation', 'account-based marketing', 'sales enablement'],
  'subscription model': ['recurring revenue', 'customer retention', 'churn reduction'],
  'esports': ['competitive gaming', 'game streaming', 'esports betting'],
  'game design': ['level design', 'game mechanics', 'user experience'],
  'mobile gaming': ['hyper-casual games', 'in-app purchases', 'mobile game monetization'],
  'entrepreneurship': ['business planning', 'startup funding', 'mvp development'],
  'venture capital': ['angel investing', 'seed funding', 'series a'],
  'innovation': ['design thinking', 'disruptive technology', 'r&d management'],
  'community building': ['online forums', 'user-generated content', 'brand ambassadors'],
  'engagement': ['user retention', 'gamification', 'interactive content'],
  'user acquisition': ['growth hacking', 'viral marketing', 'referral programs'],
  'programming': ['algorithms', 'data structures', 'software architecture'],
  'software development': ['agile methodology', 'devops', 'test-driven development'],
  'web development': ['frontend', 'backend', 'full-stack'],
  'self-improvement': ['goal setting', 'habit formation', 'time management'],
  'productivity': ['task management', 'pomodoro technique', 'workflow optimization'],
  'mindfulness': ['meditation', 'stress reduction', 'work-life balance']
}

interface Post {
  id: string;
  avatar: string;
  date: string;
  content: string;
  likes: number;
  views: number;
  categories?: string[];
  subcategories?: string[];
  specialties?: string[];
}

interface UserSettings {
  role: string;
  industry: string;
  selectedIndustries: string[];
  writingStyles: string[];
}

const fetchUserSettings = (): UserSettings => {
  // Simulating fetched user settings
  return {
    role: "Developer",
    industry: "Technology",
    selectedIndustries: ["Technology", "Education"],
    writingStyles: ['2', '5'], // Casual and Conversational
  };
};

const WRITING_STYLES: WritingStyle[] = [
  { id: '1', icon: '👔', label: 'Formal', description: 'Traditional & Corporate-friendly' },
  { id: '2', icon: '😊', label: 'Casual', description: 'Relaxed & Approachable' },
  { id: '3', icon: '💪', label: 'Inspirational', description: 'Uplifting & Motivating' },
  { id: '4', icon: '📊', label: 'Analytical', description: 'Data-focused and detailed' },
  { id: '5', icon: '💬', label: 'Conversational', description: 'Interactive & Friendly' },
  { id: '6', icon: '🎓', label: 'Authoritative', description: 'Expert & commanding' },
  { id: '7', icon: '😄', label: 'Witty', description: 'Humorous & Clever' },
  { id: '8', icon: '🎯', label: 'Persuasive', description: 'Convincing & Compelling' },
  { id: '9', icon: '📚', label: 'Educational', description: 'Informative & Instructive' },
]

interface WritingStyle {
  id: string;
  icon: string;
  label: string;
  description: string;
}

const SAMPLE_POSTS: Post[] = [
  { id: '1', avatar: '/placeholder.svg', date: '2024/08/29', content: "10 Marketing Strategies for 2024", likes: 1500, views: 10000, categories: ['Marketing'], subcategories: ['Digital Marketing'], specialties: ['SEO'] },
  { id: '2', avatar: '/placeholder.svg', date: '2024/08/29', content: "The Future of Cryptocurrency", likes: 2000, views: 15000, categories: ['Crypto'], subcategories: ['Blockchain'], specialties: ['Bitcoin'] },
  { id: '3', avatar: '/placeholder.svg', date: '2024/08/29', content: "Building a Successful SaaS Product", likes: 1800, views: 12000, categories: ['SaaS'], subcategories: ['Cloud Computing'], specialties: ['Subscription Model'] },
  { id: '4', avatar: '/placeholder.svg', date: '2024/08/29', content: "Game Development Trends", likes: 1200, views: 8000, categories: ['Gaming'], subcategories: ['Game Design'], specialties: ['Mobile Gaming'] },
  { id: '5', avatar: '/placeholder.svg', date: '2024/08/29', content: "Startup Funding 101", likes: 2200, views: 18000, categories: ['Startup'], subcategories: ['Entrepreneurship'], specialties: ['Venture Capital'] },
  { id: '6', avatar: '/placeholder.svg', date: '2024/08/29', content: "Growing Your Online Audience", likes: 1600, views: 11000, categories: ['Audience'], subcategories: ['Community Building'], specialties: ['User Acquisition'] },
  { id: '7', avatar: '/placeholder.svg', date: '2024/08/29', content: "Coding Best Practices", likes: 1400, views: 9000, categories: ['Coding'], subcategories: ['Programming'], specialties: ['Software Development'] },
  { id: '8', avatar: '/placeholder.svg', date: '2024/08/29', content: "Email Marketing Tips", likes: 1300, views: 8500, categories: ['Marketing'], subcategories: ['Digital Marketing'], specialties: ['Email Marketing'] },
  { id: '9', avatar: '/placeholder.svg', date: '2024/08/29', content: "Blockchain Technology Explained", likes: 1900, views: 14000, categories: ['Crypto'], subcategories: ['Blockchain'], specialties: ['Ethereum'] },
  { id: '10', avatar: '/placeholder.svg', date: '2024/08/29', content: "Customer Retention Strategies for SaaS", likes: 1700, views: 11500, categories: ['SaaS'], subcategories: ['Cloud Computing'], specialties: ['Subscription Model'] },
  { id: '11', avatar: '/placeholder.svg', date: '2024/08/29', content: "Mobile Game Monetization", likes: 1100, views: 7500, categories: ['Gaming'], subcategories: ['Mobile Gaming'], specialties: ['In-App Purchases'] },
  { id: '12', avatar: '/placeholder.svg', date: '2024/08/29', content: "Pitch Deck Essentials", likes: 2100, views: 17000, categories: ['Startup'], subcategories: ['Entrepreneurship'], specialties: ['Pitching'] },
]

interface FilterState {
  categories: string[];
  subcategories: string[];
  specialties: string[];
}

export default function ViralModePage() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [activeTags, setActiveTags] = useState<string[]>(TOPICS)
  const [isOptimized, setIsOptimized] = useState(false)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    subcategories: [],
    specialties: []
  })
  const { isCollapsed } = useSidebar()

  useEffect(() => {
    const settings = fetchUserSettings();
    setUserSettings(settings);
  }, []);

  const handleTopicClick = (topic: string) => {
    setSearchTerm(topic)
    filterPosts(topic)
    setActiveTags(SIMILAR_TAGS[topic] || [topic])
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    filterPosts(newSearchTerm)
    if (newSearchTerm === '') {
      setActiveTags(TOPICS)
    } else {
      const matchingTags = Object.keys(SIMILAR_TAGS).filter(tag => 
        tag.toLowerCase().includes(newSearchTerm.toLowerCase())
      )
      setActiveTags(matchingTags.length > 0 ? matchingTags : [newSearchTerm])
    }
  }

  const filterPosts = (term: string) => {
    let filtered = SAMPLE_POSTS.filter(post => 
      post.content.toLowerCase().includes(term.toLowerCase())
    )

    if (filters.categories.length > 0 || filters.subcategories.length > 0 || filters.specialties.length > 0) {
      filtered = filtered.filter(post => {
        const postCategories = post.categories || []
        const postSubcategories = post.subcategories || []
        const postSpecialties = post.specialties || []

        return (
          filters.categories.some(category => postCategories.includes(category)) ||
          filters.subcategories.some(subcategory => postSubcategories.includes(subcategory)) ||
          filters.specialties.some(specialty => postSpecialties.includes(specialty))
        )
      })
    }

    if (isOptimized && userSettings) {
      filtered = filtered.filter(post => {
        const isRelevantIndustry = userSettings.selectedIndustries.some(industry => 
          post.content.toLowerCase().includes(industry.toLowerCase())
        )
        const isRelevantRole = post.content.toLowerCase().includes(userSettings.role.toLowerCase())
        const isRelevantStyle = userSettings.writingStyles.some(style => {
          const styleLabel = WRITING_STYLES.find(ws => ws.id === style)?.label.toLowerCase()
          return styleLabel && post.content.toLowerCase().includes(styleLabel)
        })

        return isRelevantIndustry || isRelevantRole || isRelevantStyle
      })
    }

    setFilteredPosts(filtered)
  }

  const handleOptimizeToggle = () => {
    setIsOptimized(!isOptimized)
    filterPosts(searchTerm)
  }

  const handleShuffle = () => {
    const shuffled = [...filteredPosts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFilteredPosts(shuffled);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  useEffect(() => {
    filterPosts(searchTerm)
  }, [filters, searchTerm, isOptimized])

  return (
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'}`}>
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
            Find viral posts to get inspired by
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            We use AI to analyze posts and match them with your search
          </p>

          <SearchBar
            posts={filteredPosts}
            onShuffle={handleShuffle}
            filterComponent={
              <FilterDialog
                open={filterOpen}
                onOpenChange={setFilterOpen}
                onFilterChange={handleFilterChange}
              />
            }
          />

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {activeTags.map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 rounded-full bg-emerald-100 text-black hover:bg-emerald-200 transition-colors"
                onClick={() => handleTopicClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Switch id="optimize" checked={isOptimized} onCheckedChange={handleOptimizeToggle} />
            <label
              htmlFor="optimize"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Optimize results for my account
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                avatar={post.avatar}
                date={post.date}
                content={post.content}
                likes={post.likes}
                views={post.views}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

