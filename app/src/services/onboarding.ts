import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { FormData } from '@/types/onboarding'

export async function saveOnboardingData(formData: FormData, userId: string) {
  const supabase = createClientComponentClient()
  
  if (!userId) {
    throw new Error('Authentication required')
  }

  // Only include fields that are actually used in the onboarding steps
  const dbData = {
    clerk_user_id: userId,
    role: formData.role,
    industry: formData.industry,
    posting_reasons: formData.postingReasons,
    custom_reason: formData.customReason,
    goals: formData.goals,
    selected_industries: formData.selectedIndustries,
    writing_styles: formData.writingStyles
  }

  // First check if user already has onboarding data
  const { data: existingData } = await supabase
    .from('onboarding')
    .select()
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (existingData) {
    const { data, error } = await supabase
      .from('onboarding')
      .update(dbData)
      .eq('clerk_user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('onboarding')
      .insert(dbData)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export async function getOnboardingData() {
  const supabase = createClientComponentClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Authentication required')
  }

  console.log('Current user ID:', user.id)

  // Get onboarding data with maybeSingle() instead of single()
  const { data, error } = await supabase
    .from('onboarding')
    .select('selected_industries')
    .eq('clerk_user_id', user.id)
    .maybeSingle()

  // If no data found or error, return empty array
  if (error || !data) {
    console.log('No onboarding data found for user:', user.id)
    return { selected_industries: [] }
  }

  console.log('Found onboarding data:', data)
  return data
}