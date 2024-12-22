export type PostingReason = {
  id: string
  label: string
  isCustom?: boolean
}

export type WritingStyle = {
  id: string
  icon: string
  label: string
  description: string
}

export type FormData = {
  role: Role | ""
  industry: Industry | ""
  postingReasons: PostingReason[]
  customReason?: string
  goals: string
  selectedIndustries: string[]
  sharingPreferences: string[]
  writingStyles: string[]
  additionalInfo: string
  aiTuning: string
  primaryLanguage: string
  timezone: string
  defaultCallToAction: string
}

export type Role = 
  | "Executive"
  | "Designer"
  | "Analyst"
  | "Developer"
  | "Manager"
  | "Marketing Professional"
  | "Consultant"
  | "Writer/Editor"
  | "Customer Service Representative"
  | "Other"

export type Industry = 
  | "Business"
  | "Coaching"
  | "Creatives"
  | "Design"
  | "Finance"
  | "Global Affairs"
  | "Healthcare"
  | "Marketing & Sales"
  | "Personal Growth & Productivity"
  | "Real Estate"
  | "Sports"
  | "Tech"
  | "Web3"

