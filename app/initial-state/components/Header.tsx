import Link from 'next/link'
import { useAuthContext, useLogout } from '../../../hooks'
import ProfileStatus from './ProfileStatus'

export default function Header() {
  const { user } = useAuthContext()
  const { logout } = useLogout()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="px-6 py-4 mt-2 space-y-2">
      {/* Top row - navigation and user */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-white ml-2 text-sm">Back</span>
        </Link>
        
        <span className="text-white font-medium text-base">
          @{user?.username || 'user'}
        </span>
        
        <button 
          onClick={handleLogout}
          className="text-white hover:text-red-400 transition-colors"
          title="Logout"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 13v-2H7V8l-5 4 5 4v-3z"/>
            <path d="M20 3h-9c-1.11 0-2 .89-2 2v4h2V5h9v14h-9v-4H9v4c0 1.11.89 2 2 2h9c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2z"/>
          </svg>
        </button>
      </div>

      {/* Bottom row - profile status */}
      <div className="flex justify-center">
        <ProfileStatus />
      </div>
    </div>
  )
}