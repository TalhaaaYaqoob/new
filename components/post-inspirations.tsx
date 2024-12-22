import { HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function PostInspirations() {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">Post Inspirations</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>High-performing posts selected by our AI</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-emerald-600 mt-1">
        Use these high-performing posts as inspirations for your next content! Our AI engine selected these for you.
      </p>
    </div>
  )
}

