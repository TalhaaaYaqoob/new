'use client'

import * as React from 'react'
import { Search, SlidersHorizontal, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PostCard } from './post-card'
import { useState } from 'react'
import type { Role, Industry } from '@/types/onboarding'

interface Post {
  id: string;
  avatar: string;
  name: string;
  date: string;
  content: string;
  likes: number;
  views: number;
}

interface SearchBarProps {
  posts: Post[];
  onShuffle: () => void;
  filterComponent: React.ReactNode;
  userRole?: Role | "";
  userIndustry?: Industry | "";
}

export function SearchBar({ posts, onShuffle, filterComponent, userRole, userIndustry }: SearchBarProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  //const [searchType, setSearchType] = React.useState("viral")
  

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        {/* Remove Select component */}
        {/*<Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SEARCH_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>*/}

        <div className="flex-1 relative">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search viral posts..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  onClick={() => setOpen(true)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--trigger-width] p-0" align="start">
              <Command>
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {SEARCH_SUGGESTIONS.map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        onSelect={(value) => {
                          setValue(value)
                          setOpen(false)
                        }}
                      >
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {filterComponent}
        <Button 
          variant="default" 
          size="icon" 
          className="h-10 w-10 bg-emerald-600 hover:bg-emerald-700"
          onClick={onShuffle}
        >
          <Shuffle className="h-4 w-4" />
          <span className="sr-only">Shuffle posts</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            avatar={post.avatar}
            name={post.name}
            date={post.date}
            content={post.content}
            likes={post.likes}
            views={post.views}
          />
        ))}
      </div>
    </div>
  )
}

const SEARCH_SUGGESTIONS = [
  "Marketing strategies",
  "Leadership tips",
  "Industry trends",
  "Professional development",
  "Networking advice"
]

//const SEARCH_TYPES = [
//  { value: "viral", label: "Viral Posts" },
//  { value: "news", label: "News Search" },
//]

