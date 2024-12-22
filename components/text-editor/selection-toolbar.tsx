import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WRITING_STYLES, TARGET_LENGTHS } from '@/app/write/constants'

interface SelectionToolbarProps {
  selectedText: string
  onChangeHook: () => Promise<void>
  onRewrite: (tone: string, length: string) => Promise<void>
  position: { top: number; left: number } | null
}

export function SelectionToolbar({ 
  selectedText, 
  onChangeHook, 
  onRewrite,
  position 
}: SelectionToolbarProps) {
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')

  if (!position || !selectedText) return null

  return (
    <div 
      className="fixed z-[100] bg-white shadow-lg rounded-lg border p-2 flex gap-2 items-center selection-toolbar"
      style={{ 
        top: `${position.top - 10}px`,
        left: `${position.left}px`
      }}
    >
      <Button 
        variant="outline" 
        size="sm"
        onClick={onChangeHook}
      >
        Change Hook
      </Button>
      
      <div className="flex items-center gap-2">
        <Select
          value={tone}
          onValueChange={setTone}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            {WRITING_STYLES.map(style => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={length}
          onValueChange={setLength}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select length" />
          </SelectTrigger>
          <SelectContent>
            {TARGET_LENGTHS.map(l => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          variant="default" 
          size="sm"
          onClick={() => onRewrite(tone, length)}
        >
          Rewrite
        </Button>
      </div>
    </div>
  )
}