'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLogin, useAuthContext } from '../../hooks'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const { login, isLoading: loginLoading } = useLogin()
  const { error, isAuthenticated, isLoading } = useAuthContext()

  // Redirect when authentication status changes
  useEffect(() => {
    console.log('Login page - Auth state changed:', { 
      isAuthenticated, 
      isLoading,
      loginSuccess
    })
    
    if (isAuthenticated && !isLoading) {
      console.log('User authenticated after login, redirecting to /initial-state from useEffect')
      window.location.replace('/initial-state')
    }
  }, [isAuthenticated, isLoading, loginSuccess])

  // Additional redirect on login success
  useEffect(() => {
    if (loginSuccess && isAuthenticated) {
      console.log('Login success detected with auth state, redirecting')
      window.location.replace('/initial-state')
    }
  }, [loginSuccess, isAuthenticated])

  // Redirect if already authenticated (e.g., page refresh while logged in)
  useEffect(() => {
    if (isAuthenticated && !isLoading && !loginLoading) {
      console.log('User already authenticated on login page, redirecting')
      window.location.replace('/initial-state')
    }
  }, [isAuthenticated, isLoading, loginLoading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.username || !formData.password) {
      return
    }

    // Basic validation
    if (formData.password.length < 8) {
      return
    }

    console.log('Attempting login with:', {
      email: formData.email,
      username: formData.username,
      hasPassword: !!formData.password
    })

    const result = await login({
      email: formData.email,
      username: formData.username,
      password: formData.password
    })

    console.log('Login result:', result)

    if (result.success) {
      console.log('Login successful, redirecting with window.location.replace()')
      setLoginSuccess(true)
      
      // Use window.location.replace for immediate and reliable redirect
      setTimeout(() => {
        console.log('Redirecting to /initial-state')
        window.location.replace('/initial-state')
      }, 100)
    }
    // Error is handled by the useAuth hook
  }

  return (
    <div className="min-h-screen text-white flex flex-col" style={{backgroundImage: 'url(/BGp.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      <div className="flex-1 px-6 flex flex-col justify-center">
        {/* Back Button */}
        <Link href="/" className="flex items-center space-x-2 mb-12 self-start">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-white">Back</span>
        </Link>

        {/* Login Title */}
        <h1 className="text-3xl font-semibold mb-12">Login</h1>

          {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Validation Helper Text */}
          <div className="text-slate-400 text-sm">
            <p>• Password must be at least 8 characters</p>
            <p>• All fields are required</p>
          </div>          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b-2 border-slate-600 py-4 px-0 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-colors text-lg"
              placeholder="Enter Email"
            />
          </div>

          {/* Username Input */}
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b-2 border-slate-600 py-4 px-0 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-colors text-lg"
              placeholder="Enter Username"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b-2 border-slate-600 py-4 px-0 pr-10 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-colors text-lg"
              placeholder="Enter Password (min 8 characters)"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                )}
              </svg>
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-gradient-to-r from-[#62CDCB] to-[#4599DB] text-white py-4 px-6 rounded-2xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-12 shadow-lg"
          >
            {loginLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-8">
          <p className="text-slate-300">
            No account?{' '}
            <Link href="/register" className="text-[#62CDCB] underline font-medium hover:text-[#4599DB] transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}