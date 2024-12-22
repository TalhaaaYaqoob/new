import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const formData = await request.formData()
    
    // Create form data for the API call
    const apiFormData = new FormData()
    apiFormData.append('user_id', user.id)
    apiFormData.append('description', 'write a post')
    apiFormData.append('topic', formData.get('topic')?.toString() || '')
    apiFormData.append('writing_sample', formData.get('writing_sample')?.toString() || '')
    apiFormData.append('writing_style', formData.get('writing_style')?.toString() || 'professional')
    apiFormData.append('tone', formData.get('writing_style')?.toString() || 'professional')
    apiFormData.append('target_length', formData.get('target_length')?.toString() || 'medium')

    // Validate required fields
    if (!formData.get('topic')) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const response = await fetch('http://127.0.0.1:8001/api/v1/linkedin-post/generate', {
      method: 'POST',
      body: apiFormData
    })

    if (!response.ok) {
      throw new Error(`Generation API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ 
      generated_post: data.post_content 
    })

  } catch (error) {
    console.error('Error generating post:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate post' },
      { status: 500 }
    )
  }
}