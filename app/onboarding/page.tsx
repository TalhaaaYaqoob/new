'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { OnboardingLayout } from '@/components/onboarding-layout'
import { PostingReasonSelector } from '@/components/posting-reason-selector'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CheckIcon as Checkbox, Check } from 'lucide-react'
import type { FormData, Role, Industry, WritingStyle, PostingReason } from '@/types/onboarding'
import { TagSelector } from '@/components/tag-selector'
import { Button } from '@/components/ui/button'
import { NavigationButtons } from '@/components/navigation-buttons'
import { saveOnboardingData } from '@/app/src/services/onboarding'

const ROLES: { value: Role; label: string }[] = [
  { value: "Executive", label: "Executive (CEO, CFO, CTO, etc.)" },
  { value: "Designer", label: "Designer (Graphic, UI/UX, Product)" },
  { value: "Analyst", label: "Analyst (Business, Data, etc.)" },
  { value: "Developer", label: "Developer (Web, Software, Mobile)" },
  { value: "Manager", label: "Manager (Project, Sales, Marketing, etc.)" },
  { value: "Marketing Professional", label: "Marketing Professional" },
  { value: "Consultant", label: "Consultant" },
  { value: "Writer/Editor", label: "Writer/Editor" },
  { value: "Customer Service Representative", label: "Customer Service Representative" },
  { value: "Other", label: "Other" }
]

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "Business", label: "Business" },
  { value: "Coaching", label: "Coaching" },
  { value: "Creatives", label: "Creatives" },
  { value: "Design", label: "Design" },
  { value: "Finance", label: "Finance" },
  { value: "Global Affairs", label: "Global Affairs" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Marketing & Sales", label: "Marketing & Sales" },
  { value: "Personal Growth & Productivity", label: "Personal Growth & Productivity" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Sports", label: "Sports" },
  { value: "Tech", label: "Tech" },
  { value: "Web3", label: "Web3" }
]

const WRITING_STYLES: WritingStyle[] = [
  { id: '1', icon: '👔', label: 'Formal', description: 'Traditional & Corporate-friendly' },
  { id: '2', icon: '😊', label: 'Casual', description: 'Relaxed & Approachable' },
  { id: '3', icon: '💪', label: 'Inspirational', description: 'Uplifting & Motivating' },
  { id: '4', icon: '📊', label: 'Analytical', description: 'Data-focused and detailed' },
  { id: '5', icon: '💬', label: 'Conversational', description: 'Interactive & Friendly' },
  { id: '6', icon: '🎓', label: 'Authoritative', description: 'Expert & commanding' },
  { id: '7', icon: '😄', label: 'Witty', description: 'Humorous & Clever' },
  { id: '8', icon: '🎯', label: 'Persuasive', description: 'Convincing & Compelling' },
  { id: '9', icon: '📚', label: 'Educational', description: 'Informative & Instructive' },
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'nl', label: 'Dutch' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
]

const TIMEZONES = [
  { value: 'UTC-12:00', label: '(GMT-12:00) International Date Line West' },
  { value: 'UTC-11:00', label: '(GMT-11:00) Midway Island, Samoa' },
  { value: 'UTC-10:00', label: '(GMT-10:00) Hawaii' },
  { value: 'UTC-09:00', label: '(GMT-09:00) Alaska' },
  { value: 'UTC-08:00', label: '(GMT-08:00) Pacific Time (US & Canada)' },
  { value: 'UTC-07:00', label: '(GMT-07:00) Mountain Time (US & Canada)' },
  { value: 'UTC-06:00', label: '(GMT-06:00) Central Time (US & Canada)' },
  { value: 'UTC-05:00', label: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: 'UTC-04:00', label: '(GMT-04:00) Atlantic Time (Canada)' },
  { value: 'UTC-03:00', label: '(GMT-03:00) Buenos Aires, Georgetown' },
  { value: 'UTC-02:00', label: '(GMT-02:00) Mid-Atlantic' },
  { value: 'UTC-01:00', label: '(GMT-01:00) Azores, Cape Verde Is.' },
  { value: 'UTC+00:00', label: '(GMT) Western Europe Time, London' },
  { value: 'UTC+01:00', label: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris' },
  { value: 'UTC+02:00', label: '(GMT+02:00) Kaliningrad, South Africa' },
  { value: 'UTC+03:00', label: '(GMT+03:00) Baghdad, Riyadh, Moscow, St. Petersburg' },
  { value: 'UTC+04:00', label: '(GMT+04:00) Abu Dhabi, Muscat, Baku, Tbilisi' },
  { value: 'UTC+05:00', label: '(GMT+05:00) Ekaterinburg, Islamabad, Karachi' },
  { value: 'UTC+06:00', label: '(GMT+06:00) Almaty, Dhaka' },
  { value: 'UTC+07:00', label: '(GMT+07:00) Bangkok, Hanoi, Jakarta' },
  { value: 'UTC+08:00', label: '(GMT+08:00) Beijing, Perth, Singapore, Hong Kong' },
  { value: 'UTC+09:00', label: '(GMT+09:00) Tokyo, Seoul, Osaka, Sapporo' },
  { value: 'UTC+10:00', label: '(GMT+10:00) Eastern Australia, Guam' },
  { value: 'UTC+11:00', label: '(GMT+11:00) Magadan, Solomon Islands' },
  { value: 'UTC+12:00', label: '(GMT+12:00) Auckland, Wellington' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    role: "",
    industry: "",
    postingReasons: [],
    customReason: "",
    goals: "",
    selectedIndustries: [],
    sharingPreferences: [],
    writingStyles: [],
    additionalInfo: "",
    aiTuning: "",
    primaryLanguage: "",
    timezone: "",
    defaultCallToAction: ""
  })
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (!userId) {
      router.push('/sign-in')
    }
  }, [userId, router])

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    } else if (currentStep === 4) {
      try {
        if (!userId) {
          router.push('/sign-in')
          return
        }
        await saveOnboardingData(formData, userId)
        setIsCompleted(true)
        console.log('Onboarding completed:', formData)
      } catch (error) {
        console.error('Error saving onboarding data:', error)
        alert('Failed to save onboarding data. Please try again.')
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-900">
                What is your role?
              </label>
              <Select
                value={formData.role}
                onValueChange={(value) => updateFormData('role', value)}
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm font-medium text-gray-900">
                What's your industry?
              </label>
              <Select
                value={formData.industry}
                onValueChange={(value) => updateFormData('industry', value)}
              >
                <SelectTrigger id="industry" className="w-full">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Why are you posting?</h3>
              <div className="h-[300px] overflow-y-auto pr-2">
                <PostingReasonSelector
                  selectedReasons={formData.postingReasons}
                  customReason={formData.customReason || ''}
                  onChange={(reasons, customReason) => {
                    setFormData(prev => ({
                      ...prev,
                      postingReasons: reasons,
                      customReason
                    }))
                  }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">My goals are...</h3>
              <Textarea
                placeholder="Share your goals with us"
                value={formData.goals}
                onChange={(e) => updateFormData('goals', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-2">
            {INDUSTRIES.map((industry) => (
              <button
                key={industry.value}
                onClick={() => {
                  if (!formData.selectedIndustries.includes(industry.value) && 
                      formData.selectedIndustries.length >= 4) {
                    return; // Prevent selecting more than 4
                  }
                  if (formData.selectedIndustries.includes(industry.value)) {
                    updateFormData('selectedIndustries', 
                      formData.selectedIndustries.filter(i => i !== industry.value)
                    )
                  } else {
                    updateFormData('selectedIndustries', 
                      [...formData.selectedIndustries, industry.value]
                    )
                  }
                }}
                disabled={!formData.selectedIndustries.includes(industry.value) && 
                         formData.selectedIndustries.length >= 4}
                className={`w-full flex items-center justify-between p-2 rounded-lg border transition-colors text-sm
                  ${formData.selectedIndustries.includes(industry.value)
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50'
                  }
                  ${(!formData.selectedIndustries.includes(industry.value) && 
                     formData.selectedIndustries.length >= 4)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                  }`}
              >
                <span className="font-medium">{industry.label}</span>
                {formData.selectedIndustries.includes(industry.value) && (
                  <Check className="h-4 w-4 text-emerald-500 ml-2" />
                )}
              </button>
            ))}
            <p className="text-sm text-gray-500 mt-2">
              {formData.selectedIndustries.length === 4 
                ? "Maximum selections reached" 
                : `${4 - formData.selectedIndustries.length} selections remaining (optional)`}
            </p>
          </div>
        )
      case 4:
        return (
          <div className="grid grid-cols-3 gap-4">
            {WRITING_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => {
                  const updatedStyles = formData.writingStyles.includes(style.id)
                    ? formData.writingStyles.filter(id => id !== style.id)
                    : [...formData.writingStyles, style.id]
                  updateFormData('writingStyles', updatedStyles)
                }}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData.writingStyles.includes(style.id)
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-gray-200 hover:border-emerald-200'
                }`}
              >
                <div className="text-2xl mb-2">{style.icon}</div>
                <div className="font-medium text-sm">{style.label}</div>
                <div className="text-xs text-gray-500">{style.description}</div>
                {formData.writingStyles.includes(style.id) && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "What's your role/Industry?"
      case 2: return "Why are you posting?"
      case 3: return "What industry would you like to post about? (Max 4)"
      case 4: return "What's your writing style?"
      default: return ""
    }
  }

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1: return !formData.role || !formData.industry
      case 2: return formData.postingReasons.length === 0 || 
          (formData.postingReasons.some(r => r.id === '10') && !formData.customReason) ||
          !formData.goals
      case 3: return formData.selectedIndustries.length > 4
      case 4: return formData.writingStyles.length === 0
      default: return false
    }
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Onboarding Complete!</h2>
          <p className="text-gray-600 mb-8 text-center">
            Thank you for completing the onboarding process. What would you like to do next?
          </p>
          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => router.push('/inspo')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Inspire Me
            </Button>
            <Button
              onClick={() => router.push('/write')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Write A Post
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={4}
      title={getStepTitle()}
      onBack={handleBack}
      onNext={handleNext}
      nextLabel={currentStep === 4 ? "Complete" : "Next"}
      showBack={currentStep > 1}
      isNextDisabled={isNextDisabled()}
    >
      {renderStep()}
    </OnboardingLayout>
  )
}

