interface ProgressHeaderProps {
  currentStep: number
  totalSteps: number
  title: string
}

export function ProgressHeader({ currentStep, totalSteps, title }: ProgressHeaderProps) {
  return (
    <div className="mb-6 w-full">
      <div className="mb-2 h-1 w-full bg-gray-200 rounded-full">
        <div 
          className="h-1 bg-emerald-500 rounded-full transition-all duration-300" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )
}

export function StepInfo({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <p className="text-sm text-gray-500 text-right pt-4">Step {currentStep} of {totalSteps}</p>
  )
}

