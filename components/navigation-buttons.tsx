interface NavigationButtonsProps {
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  showBack?: boolean
  isNextDisabled?: boolean
  fullWidth?: boolean // Add this new prop
}

export function NavigationButtons({ 
  onBack, 
  onNext, 
  nextLabel = "Next", 
  showBack = true,
  isNextDisabled = false,
  fullWidth = false // Add default value
}: NavigationButtonsProps) {
  return (
    <div className={`grid ${fullWidth ? 'grid-cols-1' : 'grid-cols-2'} gap-4 mt-8`}>
      {showBack && (
        <button
          onClick={onBack}
          className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 ${fullWidth ? 'col-span-1' : ''}`}
        >
          Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`w-full px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'col-span-1' : ''}`}
      >
        {nextLabel}
      </button>
    </div>
  )
}

