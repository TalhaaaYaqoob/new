'use client'

import { Copy, Upload, Smile, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function EditorTools() {
  const tools = [
    { icon: Copy, label: 'Copy Text', action: () => {} },
    { icon: Upload, label: 'Upload File', action: () => {} },
    { icon: Smile, label: 'Emoji', action: () => {} },
    { icon: Image, label: 'GIF', action: () => {} },
  ]

  return (
    <div className="border-t border-gray-200 bg-white w-full flex items-center gap-1">
      <TooltipProvider>
        {tools.map((Tool) => (
          <Tooltip key={Tool.label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={Tool.action}
              >
                <Tool.icon className="h-4 w-4" />
                <span className="sr-only">{Tool.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{Tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}

