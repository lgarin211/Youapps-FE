'use client'

import { useEffect } from 'react'
import { useAuthContext } from '../hooks'

export default function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuthContext()

  // Auto-redirect based on authentication status
  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure auth state is stable
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          console.log('User authenticated, redirecting to /initial-state')
          window.location.replace('/initial-state')
        } else {
          console.log('User not authenticated, redirecting to /login')
          window.location.replace('/login')
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, isLoading])

  // Always show loading while checking authentication and redirecting
  return (
    <div className="min-h-screen text-white flex items-center justify-center" style={{backgroundImage: 'url(/BGp.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>{isLoading ? 'Loading...' : 'Redirecting...'}</p>
      </div>
    </div>
  )

}