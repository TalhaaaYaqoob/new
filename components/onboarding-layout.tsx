import { PropsWithChildren } from "react"
import { ProgressHeader, StepInfo } from "./progress-header"
import { NavigationButtons } from "./navigation-buttons"
import Image from 'next/image'

interface OnboardingLayoutProps extends PropsWithChildren {
  currentStep: number
  totalSteps: number
  title: string
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  showBack?: boolean
  isNextDisabled?: boolean
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  title,
  onBack,
  onNext,
  nextLabel,
  showBack,
  isNextDisabled
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/placeholder-logo.svg"
            alt="Company Logo"
            width={100}
            height={40}
            className="mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 text-center">Let's get to know you</h2>
        </div>
        <ProgressHeader 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          title={title} 
        />
        <div className="space-y-6">
          {children}
        </div>
        <StepInfo currentStep={currentStep} totalSteps={totalSteps} />
        <NavigationButtons
          onBack={onBack}
          onNext={onNext}
          nextLabel={nextLabel}
          showBack={showBack}
          isNextDisabled={isNextDisabled}
          fullWidth={currentStep === 1}
        />
      </div>
    </div>
  )
}

