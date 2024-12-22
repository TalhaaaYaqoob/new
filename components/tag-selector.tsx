'use client'

import { useState, useEffect } from 'react'
import { Search, X, Plus, Minus } from 'lucide-react'
import { Input } from '@/components/ui/input'

const DEFAULT_TAGS = [
  "Networking",
  "Building a personal brand",
  "Seeking new opportunities",
  "Generating Leads",
  "Recruiting Talent",
  "Learning new skills",
  "Sharing professional expertise",
  "Promoting events or webinars",
  "Researching competitors"
]

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  disabled?: boolean
}

export function TagSelector({ selectedTags, onChange, disabled = false }: TagSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>(DEFAULT_TAGS)

  useEffect(() => {
    const filtered = availableTags
      .filter(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedTags.includes(tag)
      )
      .slice(0, 5)
    setSuggestions(filtered)
  }, [searchTerm, selectedTags, availableTags])

  const handleAddTag = (tag: string) => {
    if (!disabled && !selectedTags.includes(tag)) {
      onChange([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    if (!disabled) {
      onChange(selectedTags.filter(t => t !== tag))
    }
  }

  const handleAddCustomTag = () => {
    if (!disabled && searchTerm && !availableTags.includes(searchTerm)) {
      setAvailableTags([...availableTags, searchTerm])
      handleAddTag(searchTerm)
      setSearchTerm('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm) {
      handleAddCustomTag()
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search or add custom tags"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-9 pr-8"
          disabled={disabled}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {searchTerm && !disabled && (
        <div className="mt-2">
          <button
            onClick={handleAddCustomTag}
            className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
            disabled={disabled}
          >
            <span className="text-sm">{searchTerm}</span>
            <Plus className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}

      {suggestions.length > 0 && !disabled && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Suggestions</h4>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((tag) => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-black hover:bg-emerald-200 transition-colors"
                disabled={disabled}
              >
                <span className="text-sm">{tag}</span>
                <Plus className="h-4 w-4 ml-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedTags.length > 0 && (
        <div className="p-4 border rounded-lg bg-white">
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleRemoveTag(tag)}
                className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                disabled={disabled}
              >
                <span className="text-sm">{tag}</span>
                <Minus className="h-4 w-4 ml-1" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

