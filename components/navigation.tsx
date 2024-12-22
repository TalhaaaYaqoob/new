'use client'

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export function Navigation() {
  return (
    <nav>
      <SignedIn>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-10 h-10"
            }
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">Sign In</Link>
      </SignedOut>
    </nav>
  )
}