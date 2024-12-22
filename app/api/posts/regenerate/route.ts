import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const formData = await request.formData()
    const user_id = formData.get('user_id')
    const original_post = formData.get('original_post')
    const variation_level = formData.get('variation_level')

    // Validate required fields
    if (!user_id || !original_post || !variation_level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create form data for the API call
    const apiFormData = new FormData()
    apiFormData.append('user_id', user_id.toString())
    apiFormData.append('original_post', original_post.toString())
    apiFormData.append('variation_level', variation_level.toString())

    const response = await fetch(
      'http://127.0.0.1:8001/api/v1/linkedin-post/regenerate',
      {
        method: 'POST',
        body: apiFormData
      }
    )

    if (!response.ok) {
      throw new Error(`Regeneration API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}