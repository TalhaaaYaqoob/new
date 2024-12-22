import { Loader2 } from 'lucide-react'

export function ContentLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-gray-50 rounded-lg border border-gray-200">
      <div className="space-y-6 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Generating Your Post</h3>
          <p className="text-sm text-gray-500">
            Our AI is crafting your content. This may take a few moments...
          </p>
        </div>
      </div>
    </div>
  )
}