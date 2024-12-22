'use server'

import { getAuth } from '@clerk/nextjs/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const PostsRequestSchema = z.object({
  userId: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const auth = getAuth(request)
    const { userId } = auth
    
    console.log('User ID:', userId)
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const validatedData = PostsRequestSchema.parse({ userId })
    const supabase = createRouteHandlerClient({ cookies })

    // Get user's selected industries from onboarding_data
    const { data: onboardingData, error: onboardingError } = await supabase
      .from('onboarding')
      .select('selected_industries')
      .eq('clerk_user_id', validatedData.userId)
      .single()

    if (onboardingError) {
      console.error('Onboarding data error:', onboardingError)
      return NextResponse.json({ error: 'Failed to fetch onboarding data' }, { status: 500 })
    }

    if (!onboardingData?.selected_industries || onboardingData.selected_industries.length === 0) {
      return NextResponse.json({ error: 'No industries selected' }, { status: 400 })
    }

    // Create URLSearchParams for form data
    const formData = new URLSearchParams()
    formData.append('user_id', validatedData.userId)
    formData.append('industries', onboardingData.selected_industries.join(','))
    formData.append('days', '30')
    formData.append('posts_per_user', '2')
    formData.append('shuffle', 'false')
    formData.append('sort_by', 'likes')

    const response = await fetch(
      'http://127.0.0.1:8001/api/v1/linkedin-profile/profiles',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`)
    }

    const posts = await response.json()
    return NextResponse.json(posts)

  } catch (error) {
    console.error('Error fetching posts:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}