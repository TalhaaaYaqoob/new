'use client'

import { ArticlePreview } from './article-preview'

interface Article {
  id: number
  title: string
  content: string
}

interface ArticleListProps {
  articles: Article[]
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      {articles.map(article => (
        <ArticlePreview
          key={article.id}
          title={article.title}
          preview={article.content}
        />
      ))}
    </div>
  )
}

