import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { WRITING_STYLES, TARGET_LENGTHS } from '@/app/write/constants'

interface BubbleMenuProps {
  selectedText: string
  onChangeHook: () => Promise<void>
  onRewrite: (tone: string, length: string) => Promise<void>
  position: { top: number; left: number } | null
  onClose: () => void
}

export function BubbleMenu({ 
  selectedText, 
  onChangeHook, 
  onRewrite, 
  position,
  onClose 
}: BubbleMenuProps) {
  console.log('BubbleMenu render:', { 
    selectedText, 
    position,
    hasText: Boolean(selectedText),
    hasPosition: Boolean(position)
  })
  
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const menuRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toneSelectOpen, setToneSelectOpen] = useState(false)
  const [lengthSelectOpen, setLengthSelectOpen] = useState(false)

  const handleToneChange = (value: string) => {
    setTone(value)
    setToneSelectOpen(false)
  }

  const handleLengthChange = (value: string) => {
    setLength(value)
    setLengthSelectOpen(false)
  }

  const handleRewriteClick = async () => {
    try {
      setIsLoading(true)
      console.log('Starting rewrite...')
      await onRewrite(tone, length)
      console.log('Rewrite completed')
    } catch (error) {
      console.error('Rewrite error:', error)
      alert(error instanceof Error ? error.message : 'Failed to rewrite content')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('BubbleMenu mounted with position:', position)
    return () => console.log('BubbleMenu unmounted')
  }, [position])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      if (
        toneSelectOpen || 
        lengthSelectOpen ||
        target.closest('[data-radix-select-viewport]') ||
        target.closest('[role="combobox"]') || 
        target.closest('[role="listbox"]') ||
        target.closest('[role="option"]') ||
        menuRef.current?.contains(target)
      ) {
        return
      }

      onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose, toneSelectOpen, lengthSelectOpen])

  if (!position || !selectedText) {
    console.log('BubbleMenu not showing because:', {
      hasPosition: Boolean(position),
      hasText: Boolean(selectedText)
    })
    return null
  }

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed z-[100] bg-white shadow-lg rounded-lg border p-2 flex gap-2 items-center bubble-menu"
      style={{ 
        top: `${Math.max(10, position.top - 50)}px`,
        left: `${position.left}px`,
        transform: 'translateY(-100%)'
      }}
      onMouseEnter={() => console.log('Mouse entered BubbleMenu')}
      onMouseLeave={() => console.log('Mouse left BubbleMenu')}
    >
      <Button 
        variant="outline" 
        size="sm"
        onClick={onChangeHook}
        disabled={isLoading}
      >
        Change Hook
      </Button>
      
      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <Select
          value={tone}
          onValueChange={handleToneChange}
          open={toneSelectOpen}
          onOpenChange={setToneSelectOpen}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            {WRITING_STYLES.map(style => (
              <SelectItem 
                key={style.value} 
                value={style.value}
              >
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={length}
          onValueChange={handleLengthChange}
          open={lengthSelectOpen}
          onOpenChange={setLengthSelectOpen}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select length" />
          </SelectTrigger>
          <SelectContent>
            {TARGET_LENGTHS.map(l => (
              <SelectItem 
                key={l.value} 
                value={l.value}
              >
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          variant="default" 
          size="sm"
          onClick={handleRewriteClick}
          disabled={isLoading}
        >
          {isLoading ? 'Rewriting...' : 'Rewrite'}
        </Button>
      </div>
    </motion.div>
  )
}
