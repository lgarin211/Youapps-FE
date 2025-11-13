import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '../hooks'

export const metadata: Metadata = {
  title: 'Loker Mobile App',
  description: 'Mobile web application for job seekers',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="text-white min-h-screen" style={{backgroundImage: 'url(/BGp.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
        <AuthProvider>
          <div className="max-w-md mx-auto min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}