'use client'

import * as XLSX from 'xlsx'
import { Download, Search } from 'lucide-react'
import { NewsCard } from '@/components/news-card'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/contexts/sidebar-context'
import { exportToXLS } from '@/utils/export'
import { FilterDialog } from '@/components/filter-dialog'
import { useState } from 'react'

const SAMPLE_NEWS = [
  {
    headline: "AI Startup Revolutionizes Content Creation with New Platform",
    summary: "A groundbreaking AI platform promises to transform how businesses create and manage content, offering advanced automation and personalization features.",
    newsLink: "https://example.com/news/1",
    imageUrl: "/placeholder.svg?height=400&width=600",
    date: "2024/12/16"
  },
  {
    headline: "Tech Giants Announce Collaboration on Sustainable Computing Initiative",
    summary: "Major technology companies join forces to develop eco-friendly computing solutions, aiming to reduce carbon footprint in data centers worldwide.",
    newsLink: "https://example.com/news/2",
    imageUrl: "/placeholder.svg?height=400&width=600",
    date: "2024/12/16"
  },
  {
    headline: "New Study Reveals Emerging Social Media Trends for 2024",
    summary: "Research highlights shifting user behaviors and platform preferences, providing valuable insights for digital marketers and content creators.",
    newsLink: "https://example.com/news/3",
    imageUrl: "/placeholder.svg?height=400&width=600",
    date: "2024/12/16"
  },
  {
    headline: "Breakthrough in Natural Language Processing Enhances AI Communication",
    summary: "Scientists develop new algorithms that significantly improve AI's understanding and generation of human language, opening doors for advanced applications.",
    newsLink: "https://example.com/news/4",
    imageUrl: "/placeholder.svg?height=400&width=600",
    date: "2024/12/16"
  },
  {
    headline: "Global Survey Shows Changing Workplace Communication Patterns",
    summary: "Research indicates significant shifts in how professionals communicate at work, with implications for productivity and collaboration tools.",
    newsLink: "https://example.com/news/5",
    imageUrl: "/placeholder.svg?height=400&width=600",
    date: "2024/12/16"
  },
  {
    headline: "Innovation in Digital Marketing: AI-Powered Personalization",
    summary: "New marketing platforms leverage artificial intelligence to deliver highly personalized content experiences, revolutionizing customer engagement.",
    newsLink: "https://example.com/news/6",
    imageUrl: "/placeholder.svg?height=400&width=600",
    date: "2024/12/16"
  }
]

export default function NewsPage() {
  const { isCollapsed } = useSidebar()
  const [filterOpen, setFilterOpen] = useState(false)

  const handleExport = () => {
    const postsData = SAMPLE_NEWS.map(({ headline, summary, date }) => ({
      headline,
      summary,
      date
    }))
    exportToXLS(postsData, 'news_posts.xls')
  }

  return (
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'}`}>
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Top News</h1>
            <p className="text-gray-600 text-lg mb-6">
              Here are news from your industry. Post them directly or add your unique point of view.
            </p>
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search industry news..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <FilterDialog
                open={filterOpen}
                onOpenChange={setFilterOpen}
                onFilterChange={() => {}}
              />
              <Button 
                variant="outline" 
                onClick={handleExport}
                className="text-emerald-600 hover:text-emerald-700 h-10 border-emerald-600 hover:border-emerald-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_NEWS.map((news, index) => (
              <NewsCard
                key={index}
                headline={news.headline}
                summary={news.summary}
                newsLink={news.newsLink}
                imageUrl={news.imageUrl}
                date={news.date}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

