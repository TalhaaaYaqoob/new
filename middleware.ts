import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/privacy-policy(.*)',
  '/terms-of-service(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    console.log('🔒 Protecting route:', request.url)
    await auth.protect()
    console.log('✅ Protected route:', request.url)
  }
})

export const config = {
  matcher: [
    '/tools/:path*',
    '/((?!privacy-policy|terms-of-service|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}