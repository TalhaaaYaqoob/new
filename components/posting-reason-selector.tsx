'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PostingReason } from '@/types/onboarding'

const DEFAULT_REASONS: PostingReason[] = [
  { id: '1', label: 'Networking' },
  { id: '2', label: 'Building a personal brand' },
  { id: '3', label: 'Seeking new opportunities' },
  { id: '4', label: 'Generating Leads' },
  { id: '5', label: 'Recruiting Talent' },
  { id: '6', label: 'Learning new skills' },
  { id: '7', label: 'Sharing professional expertise' },
  { id: '8', label: 'Promoting events or webinars' },
  { id: '9', label: 'Researching competitors' },
  { id: '10', label: 'Other' }
]

interface PostingReasonSelectorProps {
  selectedReasons: PostingReason[]
  customReason: string
  onChange: (reasons: PostingReason[], customReason: string) => void
  disabled?: boolean
}

export function PostingReasonSelector({ 
  selectedReasons, 
  customReason, 
  onChange,
  disabled = false
}: PostingReasonSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(
    selectedReasons.some(reason => reason.id === '10')
  )
  const [customInput, setCustomInput] = useState('')
  const [customReasons, setCustomReasons] = useState<PostingReason[]>([])

  const handleReasonToggle = (reason: PostingReason) => {
    if (disabled) return;

    const updatedReasons = selectedReasons.some(r => r.id === reason.id)
      ? selectedReasons.filter(r => r.id !== reason.id)
      : [...selectedReasons, reason];
    
    if (reason.id === '10') {
      setShowCustomInput(!selectedReasons.some(r => r.id === '10'))
    }
    onChange(updatedReasons, reason.id === '10' ? '' : customReason)
  }

  const handleAddCustomReason = () => {
    if (disabled) return;

    if (customInput.trim()) {
      const newCustomReason: PostingReason = {
        id: `custom-${customReasons.length + 1}`,
        label: customInput.trim(),
        isCustom: true
      }
      setCustomReasons([...customReasons, newCustomReason])
      onChange([...selectedReasons, newCustomReason], customReason)
      setCustomInput('')
    }
  }

  return (
    <div className="space-y-4">
      {DEFAULT_REASONS.map((reason) => (
        <div key={reason.id} className="flex items-center space-x-3">
          <div 
            className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-colors
              ${selectedReasons.some(r => r.id === reason.id) 
                ? 'border-emerald-500 bg-emerald-500' 
                : 'border-gray-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500'}
            `}
            onClick={() => handleReasonToggle(reason)}
          >
            {selectedReasons.some(r => r.id === reason.id) && (
              <svg 
                className="w-3 h-3 text-white" 
                fill="none" 
                strokeWidth="2"
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>
          <label 
            className={`flex-1 text-base cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleReasonToggle(reason)}
          >
            {reason.label}
          </label>
        </div>
      ))}

      {customReasons.map((reason) => (
        <div key={reason.id} className="flex items-center space-x-3">
          <div 
            className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-colors
              ${selectedReasons.some(r => r.id === reason.id) 
                ? 'border-emerald-500 bg-emerald-500' 
                : 'border-gray-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500'}
            `}
            onClick={() => handleReasonToggle(reason)}
          >
            {selectedReasons.some(r => r.id === reason.id) && (
              <svg 
                className="w-3 h-3 text-white" 
                fill="none" 
                strokeWidth="2"
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>
          <label 
            className={`flex-1 text-base cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleReasonToggle(reason)}
          >
            {reason.label}
          </label>
        </div>
      ))}
      
      {showCustomInput && (
        <div className="flex gap-2 mt-2">
          <Input
            type="text"
            placeholder="Enter your reason"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1"
            disabled={disabled}
          />
          <Button
            onClick={handleAddCustomReason}
            disabled={!customInput.trim() || disabled}
            size="default"
            variant="outline"
            className="px-3"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add custom reason</span>
          </Button>
        </div>
      )}
    </div>
  )
}

