'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ArticlePreviewProps {
  title: string
  preview: string
}

export function ArticlePreview({ title, preview }: ArticlePreviewProps) {
  return (
    <Card className="w-full transition-all duration-200 hover:shadow-md cursor-pointer">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 text-lg">
          {preview}
        </p>
      </CardContent>
    </Card>
  )
}

