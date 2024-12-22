'use client'

import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/contexts/sidebar-context'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from 'lucide-react'
import type { FormData, Role, Industry, WritingStyle } from '@/types/onboarding'

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

export const INDUSTRIES: { value: Industry; label: string }[] = [
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

// Mock function to fetch user data - replace with actual API call
const fetchUserData = async (): Promise<FormData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        role: "Developer",
        industry: "Business",
        postingReasons: [{ id: '1', label: 'Networking' }, { id: '2', label: 'Building a personal brand' }],
        customReason: "",
        goals: "Improve my professional network and share knowledge",
        selectedIndustries: ["Business", "Design"],
        sharingPreferences: ["coding tips", "tech news", "industry insights"],
        writingStyles: ['2', '5'],
        additionalInfo: "I'm particularly interested in AI and machine learning topics",
        aiTuning: "Focus on developer-centric content",
        primaryLanguage: "en",
        timezone: "UTC-08:00",
        defaultCallToAction: "Feel free to connect if you want to discuss tech!"
      });
    }, 1000);
  });
};

const SettingsPage: React.FC = () => {
  const { isCollapsed } = useSidebar()
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
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      try {
        const userData = await fetchUserData()
        setFormData(userData)
      } catch (error) {
        console.error("Failed to load user data:", error)
        // Handle error (e.g., show error message to user)
      }
      setIsLoading(false)
    }

    loadUserData()
  }, [])

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      setHasChanges(true)
      return newData
    })
  }

  const handleSave = () => {
    if (hasChanges) {
      setShowWarning(true)
    } else {
      // If no changes, just disable editing mode
      setIsEditing(false)
    }
  }

  const confirmSave = () => {
    // Here you would typically save the form data to your backend
    console.log('Saving settings:', formData)
    setShowWarning(false)
    setIsEditing(false)
    setHasChanges(false)
    // You could also show a success message to the user
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'}`}>
      <main className="p-8">
        <div className="max-w-4xl mx-auto relative">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <Button 
              onClick={() => setIsEditing(!isEditing)} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isEditing ? "Cancel" : "Update Information"}
            </Button>
          </div>
          
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => updateFormData('role', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="role">
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
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Your Industry</label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => updateFormData('industry', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="industry">
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
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content Preferences</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Industries to Post About</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {INDUSTRIES.map((industry) => (
                        <Button
                          key={industry.value}
                          variant={formData.selectedIndustries.includes(industry.value) ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => {
                            if (isEditing) {
                              const updatedIndustries = formData.selectedIndustries.includes(industry.value)
                                ? formData.selectedIndustries.filter(i => i !== industry.value)
                                : [...formData.selectedIndustries, industry.value]
                              updateFormData('selectedIndustries', updatedIndustries)
                            }
                          }}
                          disabled={!isEditing}
                        >
                          {industry.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Sharing Preferences</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.sharingPreferences.map((preference) => (
                        <Badge key={preference} variant="secondary" className="text-sm py-1 px-2">
                          {preference}
                          {isEditing && (
                            <Button
                              variant="ghost"
                              className="h-4 w-4 p-0 ml-2"
                              onClick={() => updateFormData('sharingPreferences', formData.sharingPreferences.filter(p => p !== preference))}>
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </Badge>
                      ))}
                      {isEditing && (
                        <Input
                          type="text"
                          placeholder="Add new preference"
                          className="w-40"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const newPreference = e.currentTarget.value.trim()
                              if (newPreference && !formData.sharingPreferences.includes(newPreference)) {
                                updateFormData('sharingPreferences', [...formData.sharingPreferences, newPreference])
                                e.currentTarget.value = ''
                              }
                            }
                          }}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Writing Styles</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {WRITING_STYLES.map((style) => (
                        <Button
                          key={style.id}
                          variant={formData.writingStyles.includes(style.id) ? "default" : "outline"}
                          className={`h-auto flex flex-col items-start p-4 ${!isEditing && 'cursor-default'}`}
                          onClick={() => {
                            if (isEditing) {
                              const updatedStyles = formData.writingStyles.includes(style.id)
                                ? formData.writingStyles.filter(id => id !== style.id)
                                : [...formData.writingStyles, style.id]
                              updateFormData('writingStyles', updatedStyles)
                            }
                          }}
                          disabled={!isEditing}
                        >
                          <div className="text-2xl mb-2">{style.icon}</div>
                          <div className="font-medium text-sm">{style.label}</div>
                          <div className="text-xs text-left mt-1">{style.description}</div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Primary Language</label>
                  <Select
                    value={formData.primaryLanguage}
                    onValueChange={(value) => updateFormData('primaryLanguage', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select your primary language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => updateFormData('timezone', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((timezone) => (
                        <SelectItem key={timezone.value} value={timezone.value}>
                          {timezone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="callToAction" className="block text-sm font-medium text-gray-700 mb-1">Default Call to Action</label>
                  <Textarea
                    id="callToAction"
                    placeholder="Enter your default call to action for posts..."
                    value={formData.defaultCallToAction}
                    onChange={(e) => updateFormData('defaultCallToAction', e.target.value)}
                    className="min-h-[100px]"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any additional information about your content goals?"
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                    className="min-h-[100px]"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label htmlFor="aiTuning" className="block text-sm font-medium text-gray-700 mb-1">AI Tuning</label>
                  <Textarea
                    id="aiTuning"
                    placeholder="Help us fine-tune the AI to match your preferences..."
                    value={formData.aiTuning}
                    onChange={(e) => updateFormData('aiTuning', e.target.value)}
                    className="min-h-[100px]"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </section>
          </div>

          {isEditing && (
            <div className="mt-8">
              <Button onClick={handleSave} className="w-full">
                Save Settings
              </Button>
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This change is irreversible. Are you sure you want to update your information?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SettingsPage

