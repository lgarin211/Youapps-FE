'use client'

import { useState, useEffect } from 'react'
import { useProfile } from '../../../hooks'

interface ProfileManagerProps {
  children: React.ReactNode
}

export default function ProfileManager({ children }: ProfileManagerProps) {
  const { profile, isLoading, error, getProfile, hasProfile } = useProfile()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Show welcome message for new users without profile
    if (!isLoading && !hasProfile && !error) {
      setShowWelcome(true)
    }
  }, [isLoading, hasProfile, error])

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-blue-800 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to Your Profile!</h1>
            <p className="text-slate-300 mb-6">
              Let&apos;s set up your profile so others can get to know you better.
              You can add your basic information, interests, and more.
            </p>
          </div>
          
          <button
            onClick={() => setShowWelcome(false)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-2xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}