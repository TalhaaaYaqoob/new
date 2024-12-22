'use client'

import * as React from 'react'
import { SlidersHorizontal } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useEffect } from 'react'
import { getOnboardingData } from '@/app/src/services/onboarding'

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  categories: string[];
}

export function FilterDialog({ open, onOpenChange, onFilterChange }: FilterDialogProps) {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
  const [userIndustries, setUserIndustries] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getOnboardingData()
        console.log('Onboarding data:', data)
        
        if (data && Array.isArray(data.selected_industries)) {
          setUserIndustries(data.selected_industries)
        } else {
          console.log('No industries found:', data)
          setUserIndustries([])
        }
      } catch (err) {
        console.error('Error fetching industries:', err)
        setError('Failed to load industries')
      } finally {
        setIsLoading(false)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleReset = () => {
    setSelectedCategories([])
  }

  const handleApply = () => {
    onFilterChange({
      categories: selectedCategories,
    })
    onOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10 bg-emerald-600 hover:bg-emerald-700">
          <SlidersHorizontal className="h-4 w-4 text-white" />
          <span className="sr-only">Filters</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Filter by Industry</h3>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : userIndustries.length > 0 ? (
              userIndustries.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                    id={category}
                  />
                  <Label htmlFor={category} className="text-sm font-medium cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No industries selected. Please update your preferences in settings.
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700" 
            onClick={handleApply}
            disabled={isLoading || userIndustries.length === 0}
          >
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

