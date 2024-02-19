import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  // pages can be accessed as guest
  publicRoutes: ['/api/uploadthing'],
  // page with no auth info
  // ignoredRoutes: ['/no-auth-in-this-route'],
})

export const config = {
  // Protects all routes, including api/trpc.
  // Docs: https://clerk.com/docs/references/nextjs/auth-middleware
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
