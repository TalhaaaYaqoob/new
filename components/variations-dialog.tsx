'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface VariationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (variation: string) => void
  originalPost: string
  userId: string
}

export function VariationsDialog({
  open,
  onOpenChange,
  onGenerate,
  originalPost,
  userId
}: VariationsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [variationLevel, setVariationLevel] = useState(50)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('user_id', userId)
      formData.append('original_post', originalPost)
      formData.append('variation_level', variationLevel.toString())

      const response = await fetch('/api/posts/regenerate', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to generate variation')
      }

      const data = await response.json()
      onGenerate(data.generated_post)
    } catch (error) {
      console.error('Error generating variation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Post Variation</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Variation Level: {variationLevel}%
          </label>
          <Slider
            value={[variationLevel]}
            onValueChange={([value]) => setVariationLevel(value)}
            min={0}
            max={100}
            step={10}
            className="mb-6"
          />
          <Button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate Variation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

