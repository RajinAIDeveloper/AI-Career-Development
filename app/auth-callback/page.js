// app/auth-callback/page.js
'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const AUTHORIZED_EMAIL = 'ultrotech1236@gmail.com'

export default function AuthCallback() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    console.log('Auth callback - isLoaded:', isLoaded, 'user:', user)
    
    if (isLoaded) {
      if (user) {
        const userEmail = user.primaryEmailAddress?.emailAddress
        console.log('User email:', userEmail, 'Authorized email:', AUTHORIZED_EMAIL)
        
        if (userEmail === AUTHORIZED_EMAIL) {
          console.log('Access granted - redirecting to dashboard')
          toast.success('Welcome! Access granted.')
          router.push('/dashboard')
        } else {
          console.log('Access denied - unauthorized email')
          toast.error(`Access denied. Only ${AUTHORIZED_EMAIL} is authorized to use this platform.`)
          signOut()
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }
      } else {
        console.log('No user found - redirecting to sign-in')
        toast.error('Authentication failed. Please try again.')
        router.push('/sign-in')
      }
      setChecking(false)
    }
  }, [isLoaded, user, signOut, router])

  if (checking || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your access...</p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">
              Checking authorization for: {user.primaryEmailAddress?.emailAddress}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  )
}