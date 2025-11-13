'use client'

import React from 'react'
import { useProfile, useAuthContext } from '../../../hooks'

interface ProfileStatusProps {
  className?: string
}

export default function ProfileStatus({ className = '' }: ProfileStatusProps) {
  const { profile, isLoading, error, hasProfile } = useProfile()
  const { token, isAuthenticated, user } = useAuthContext()

  // Debug info (akan ditampilkan di console)
  React.useEffect(() => {
    console.log('ProfileStatus - Auth status:', {
      isAuthenticated,
      hasToken: !!token,
      tokenLength: token?.length,
      user,
      profile,
      error
    });
  }, [isAuthenticated, token, user, profile, error]);

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-4 h-4 border-b-2 border-blue-400 rounded-full animate-spin"></div>
        <span className="text-sm text-slate-300">Syncing...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span className="text-sm text-red-400">Sync failed</span>
      </div>
    )
  }

  if (hasProfile) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <span className="text-sm text-yellow-400">Setup needed</span>
    </div>
  )
}