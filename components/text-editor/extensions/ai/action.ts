'use server'

type EditCommand = 'change-hook' | 'rewrite'

const promptFromCommand = (command: EditCommand, options?: { tone?: string, length?: string }) => {
  switch(command) {
    case 'change-hook':
      return 'Transform this text into an engaging hook while preserving the core message.'
    case 'rewrite':
      return `Rewrite this text in a ${options?.tone || 'professional'} tone, 
              aiming for ${options?.length || 'medium'} length while preserving the core message.`
  }
}

export async function generateEditorContent({ 
  command, 
  context,
  options 
}: { 
  command: EditCommand, 
  context: string,
  options?: { tone?: string, length?: string }
}) {
  try {
    const formData = new FormData()
    formData.append('user_id', '123') // Replace with actual user ID
    
    if (command === 'change-hook') {
      formData.append('selected_hook', context)
      const response = await fetch('http://127.0.0.1:8001/api/v1/inline-editing/hooks/generate', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) throw new Error('Failed to generate hook')
      const data = await response.json()
      return { output: data.generated_hook }
    } else {
      formData.append('original_content', context)
      formData.append('tone', options?.tone || 'professional')
      formData.append('target_length', options?.length || 'medium')
      formData.append('description', 'rewrite selected text')
      
      const response = await fetch('http://127.0.0.1:8001/api/v1/inline-editing/content/rewrite', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) throw new Error('Failed to rewrite content')
      const data = await response.json()
      return { output: data.rewritten_content }
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}