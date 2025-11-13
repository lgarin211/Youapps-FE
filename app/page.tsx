'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../hooks'

export default function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuthContext()
  const router = useRouter()

  // Redirect authenticated users to initial-state
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/initial-state')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{backgroundImage: 'url(/BGp.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Don't show anything if authenticated (will redirect)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{backgroundImage: 'url(/BGp.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white flex flex-col" style={{backgroundImage: 'url(/BGp.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Loker App</h1>
          <p className="text-slate-300 text-lg">Find your dream job</p>
        </div>
        
        <div className="w-full max-w-sm space-y-4">
          <Link 
            href="/login" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-medium text-center block hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            Login
          </Link>
          
          <Link 
            href="/register" 
            className="w-full border-2 border-blue-600 text-blue-400 py-4 px-6 rounded-2xl font-medium text-center block hover:bg-blue-600 hover:text-white transition-all"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}