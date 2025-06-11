'use client'
import { SignIn } from '@clerk/nextjs'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Brain, Shield, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    
    setIsLoaded(true)
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      
      {/* Advanced Background Animations - Simplified for Auth */}
      <div className="absolute inset-0">
        {/* Dynamic Grid Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-15"
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px', '0px 0px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(139,92,246,0.4) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Morphing Energy Orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${100 + i * 20}px`,
              height: `${100 + i * 20}px`,
              left: `${10 + i * 25}%`,
              top: `${15 + i * 20}%`,
            }}
            animate={{
              x: [0, Math.sin(i * 60) * 100, Math.cos(i * 45) * 60, 0],
              y: [0, Math.cos(i * 60) * 80, Math.sin(i * 45) * 50, 0],
              scale: [1, 1.3, 0.9, 1],
              rotate: [0, 180, 360],
              borderRadius: ["50%", "40%", "60%", "50%"],
              background: [
                `radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)`,
                `radial-gradient(ellipse, rgba(6,182,212,0.5) 0%, transparent 70%)`,
                `radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)`
              ]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
            }}
          />
        ))}

        {/* Neural Network */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {[...Array(8)].map((_, i) => {
            const x = 15 + (i % 3) * 30
            const y = 20 + Math.floor(i / 3) * 25
            return (
              <motion.g key={`node-${i}`}>
                <motion.circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="1.5"
                  fill="#8b5cf6"
                  animate={{
                    r: [1.5, 4, 2, 1.5],
                    opacity: [0.3, 0.8, 0.5, 0.3],
                    fill: ['#8b5cf6', '#06b6d4', '#8b5cf6']
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: [0.4, 0, 0.6, 1]
                  }}
                />
                {i < 7 && (
                  <motion.path
                    d={`M ${x}% ${y}% Q ${x + 15}% ${y - 5}% ${x + 30}% ${y + 25}%`}
                    stroke="url(#authGradient)"
                    strokeWidth="1"
                    fill="none"
                    animate={{
                      strokeDasharray: ['0 100', '50 50', '100 0', '0 100'],
                      opacity: [0.2, 0.6, 0.3, 0.2]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      delay: i * 0.7,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.g>
            )
          })}
          <defs>
            <motion.linearGradient 
              id="authGradient"
              animate={{
                x1: ["0%", "100%", "0%"],
                y1: ["0%", "100%", "0%"]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
            </motion.linearGradient>
          </defs>
        </svg>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? '#8b5cf6' : '#06b6d4',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 4px currentColor'
            }}
            animate={{
              x: [0, Math.sin(i * 45) * 150, Math.cos(i * 30) * 120, 0],
              y: [0, Math.cos(i * 45) * 100, Math.sin(i * 30) * 150, 0],
              scale: [0.5, 1, 0.7, 0.5],
              opacity: [0, 0.8, 0.4, 0]
            }}
            transition={{
              duration: 12 + Math.random() * 3,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Mouse Interaction */}
        <motion.div
          className="absolute w-24 h-24 rounded-full pointer-events-none opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)',
            x: useTransform(mouseX, (value) => value - 48),
            y: useTransform(mouseY, (value) => value - 48),
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <Link href="/">
              <motion.button
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                <span className="text-sm font-medium">Back to Home</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-8 sm:mb-10"
          >
            {/* AI Logo */}
            <motion.div
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.3, delay: 0.4 }}
              className="mb-6"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto relative">
                <motion.div
                  className="absolute inset-0 rounded-full border border-purple-500/50"
                  animate={{ 
                    rotate: 360,
                    borderColor: [
                      'rgba(139,92,246,0.5)',
                      'rgba(6,182,212,0.6)',
                      'rgba(139,92,246,0.5)'
                    ]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    borderColor: { duration: 3, repeat: Infinity }
                  }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 15px rgba(139,92,246,0.4)',
                      '0 0 25px rgba(139,92,246,0.6)',
                      '0 0 15px rgba(139,92,246,0.4)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <motion.span
                className="block bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity 
                }}
              >
                Welcome Back
              </motion.span>
            </h1>
            
            <motion.p
              className="text-slate-400 text-sm sm:text-base leading-relaxed"
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Sign in to access your AI Career Development Platform
            </motion.p>
          </motion.div>

          {/* Sign In Form */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            className="relative"
          >
            {/* Glassmorphism Container */}
            <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 sm:p-8 overflow-hidden">
              
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center justify-center space-x-2 mb-6 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity 
                  }}
                >
                  <Shield className="w-4 h-4 text-green-400" />
                </motion.div>
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  Secure Authentication
                </span>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 bg-green-400 rounded-full"
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Clerk Sign In Component */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <SignIn 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300',
                      card: 'shadow-none border-0 bg-transparent',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border border-slate-700 hover:border-slate-600 bg-slate-800/50 hover:bg-slate-800/80 text-white transition-all duration-300',
                      socialButtonsBlockButtonText: 'text-white',
                      formFieldInput: 'border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-slate-800/50 text-white placeholder-slate-400 transition-all duration-300',
                      formFieldLabel: 'text-slate-300',
                      identityPreviewText: 'text-slate-300',
                      identityPreviewEditButton: 'text-purple-400 hover:text-purple-300',
                      formResendCodeLink: 'text-purple-400 hover:text-purple-300',
                      footerActionLink: 'text-purple-400 hover:text-purple-300',
                      footerActionText: 'text-slate-400',
                      dividerLine: 'bg-slate-700',
                      dividerText: 'text-slate-400',
                      formFieldSuccessText: 'text-green-400',
                      formFieldErrorText: 'text-red-400',
                      alertText: 'text-slate-300',
                      formFieldInputShowPasswordButton: 'text-slate-400 hover:text-slate-300',
                      otpCodeFieldInput: 'border-slate-700 focus:border-purple-500 bg-slate-800/50 text-white',
                      formHeaderTitle: 'text-white',
                      formHeaderSubtitle: 'text-slate-400'
                    },
                    layout: {
                      logoImageUrl: undefined,
                      showOptionalFields: true,
                    },
                  }}
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  afterSignInUrl="/auth-callback"
                />
              </motion.div>
            </div>

            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-3xl -z-10 blur-xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-6 sm:mt-8"
          >
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-slate-500">
              <Sparkles className="w-3 h-3" />
              <span>Authorized users only</span>
              <Sparkles className="w-3 h-3" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}