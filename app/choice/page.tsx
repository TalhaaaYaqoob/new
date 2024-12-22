'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { PenSquare, Lightbulb } from 'lucide-react'

export default function ChoicePage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      }
    }
    checkUser()
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          What would you like to do?
        </h2>
        <div className="flex flex-col space-y-4">
          <Button
            onClick={() => router.push('/write')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-16"
          >
            <PenSquare className="mr-2 h-5 w-5" />
            Write a Post from Scratch
          </Button>
          <Button
            onClick={() => router.push('/inspo')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-16"
          >
            <Lightbulb className="mr-2 h-5 w-5" />
            Get Inspired (Inspo Wall)
          </Button>
        </div>
      </div>
    </div>
  )
}