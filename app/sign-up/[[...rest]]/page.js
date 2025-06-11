'use client'
import { SignUp } from '@clerk/nextjs'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Brain, ArrowLeft, Sparkles, UserPlus, Zap, Star } from 'lucide-react'

export default function SignUpPage() {
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

  const handleGoBack = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      
      {/* Advanced Background Animations - Same as Landing Page */}
      <div className="absolute inset-0">
        {/* Dynamic Grid Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-20"
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
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-15"
            style={{
              width: `${80 + i * 15}px`,
              height: `${80 + i * 15}px`,
              left: `${15 + i * 15}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              x: [0, Math.sin(i * 60) * 120, Math.cos(i * 45) * 80, 0],
              y: [0, Math.cos(i * 60) * 100, Math.sin(i * 45) * 60, 0],
              scale: [1, 1.4, 0.8, 1.2, 1],
              rotate: [0, 180, 360],
              borderRadius: ["50%", "40%", "60%", "50%"],
              background: [
                `radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)`,
                `radial-gradient(ellipse, rgba(6,182,212,0.6) 0%, transparent 70%)`,
                `radial-gradient(circle, rgba(16,185,129,0.6) 0%, transparent 70%)`,
                `radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)`
              ]
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
            }}
          />
        ))}

        {/* Complex Neural Network */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          {[...Array(12)].map((_, i) => {
            const x = 10 + (i % 4) * 25
            const y = 15 + Math.floor(i / 4) * 25
            return (
              <motion.g key={`node-${i}`}>
                <motion.circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="2"
                  fill="#8b5cf6"
                  animate={{
                    r: [2, 6, 3, 2],
                    opacity: [0.3, 1, 0.6, 0.3],
                    fill: ['#8b5cf6', '#06b6d4', '#10b981', '#8b5cf6']
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: [0.4, 0, 0.6, 1]
                  }}
                />
                {/* Dynamic Connections */}
                {i < 11 && (
                  <motion.path
                    d={`M ${x}% ${y}% Q ${x + 12}% ${y - 5 + Math.sin(i) * 10}% ${x + 25}% ${y + (Math.floor((i + 1) / 4) - Math.floor(i / 4)) * 25}%`}
                    stroke="url(#dynamicGradient)"
                    strokeWidth="1.5"
                    fill="none"
                    animate={{
                      strokeDasharray: ['0 100', '30 70', '100 0', '0 100'],
                      opacity: [0.2, 0.8, 0.4, 0.2],
                      strokeWidth: [1, 2.5, 1]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.g>
            )
          })}
          <defs>
            <motion.linearGradient 
              id="dynamicGradient"
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
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
            </motion.linearGradient>
          </defs>
        </svg>

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#06b6d4' : '#10b981',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 6px currentColor'
            }}
            animate={{
              x: [
                0, 
                Math.sin(i * 45) * 200, 
                Math.cos(i * 30) * 150,
                Math.sin(i * 60) * 180,
                0
              ],
              y: [
                0, 
                Math.cos(i * 45) * 120, 
                Math.sin(i * 30) * 200,
                Math.cos(i * 60) * 100,
                0
              ],
              scale: [0.5, 1.2, 0.8, 1.5, 0.5],
              opacity: [0, 0.8, 0.4, 0.9, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 5,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: Math.random() * 3
            }}
          />
        ))}

        {/* Mouse Interaction */}
        <motion.div
          className="absolute w-32 h-32 rounded-full pointer-events-none opacity-8"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
            x: useTransform(mouseX, (value) => value - 64),
            y: useTransform(mouseY, (value) => value - 64),
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
      <div className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto"
        >

          {/* Back Button */}
          <motion.button
            onClick={handleGoBack}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="group mb-6 sm:mb-8 flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-300"
          >
            <motion.div
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
            <span className="text-sm sm:text-base font-medium">Back to Home</span>
          </motion.button>

          {/* AI Core Logo */}
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
            className="mb-6 sm:mb-8 relative flex justify-center"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-500/50"
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.05, 1],
                  borderColor: [
                    'rgba(6,182,212,0.5)',
                    'rgba(139,92,246,0.8)',
                    'rgba(6,182,212,0.5)'
                  ]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity },
                  borderColor: { duration: 4, repeat: Infinity }
                }}
              />
              {/* Core with Pulse */}
              <motion.div
                className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(6,182,212,0.5)',
                    '0 0 40px rgba(6,182,212,0.8), 0 0 60px rgba(139,92,246,0.6)',
                    '0 0 20px rgba(6,182,212,0.5)'
                  ],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, -360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
              <motion.span
                className="block bg-gradient-to-r from-cyan-200 via-purple-200 to-white bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  backgroundPosition: { duration: 4, repeat: Infinity },
                }}
              >
                Join the Future
              </motion.span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed">
              Create your account and unlock AI-powered career development
            </p>
          </motion.div>

          {/* Sign Up Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            whileHover={{
              boxShadow: '0 20px 40px rgba(6,182,212,0.2)',
              scale: 1.01
            }}
            className="relative group"
          >
            {/* Enhanced Sparkles on Hover */}
            <motion.div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    background: i % 2 === 0 ? '#06b6d4' : '#8b5cf6'
                  }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1.5, 0],
                    x: Math.random() * 250 - 125,
                    y: Math.random() * 250 - 125,
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>

            {/* Card */}
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-cyan-500/50 transition-all duration-500">
              
              {/* New User Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-3 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-gradient-to-r from-cyan-600 to-purple-600 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <UserPlus className="w-3 h-3" />
                  </motion.div>
                  <span>New Account</span>
                  <Star className="w-3 h-3" />
                </div>
              </motion.div>

              {/* Clerk Sign Up Component */}
              <div className="mt-4">
                <SignUp 
                  appearance={{
                    elements: {
                      // Main container
                      card: 'bg-transparent shadow-none border-0 p-0',
                      
                      // Header elements (hidden)
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      
                      // Form styling
                      formButtonPrimary: `
                        bg-gradient-to-r from-cyan-600 to-purple-600 
                        hover:from-cyan-700 hover:to-purple-700 
                        text-white font-semibold py-3 px-6 rounded-xl
                        transition-all duration-300 transform hover:scale-105
                        shadow-lg hover:shadow-cyan-500/25
                        border-0 text-base w-full
                      `,
                      
                      // Input fields
                      formFieldInput: `
                        bg-slate-800/50 border border-slate-700 
                        focus:border-cyan-500 focus:ring-cyan-500/20
                        text-white placeholder-slate-400 rounded-xl px-4 py-3
                        backdrop-blur-sm transition-all duration-300
                        text-base w-full
                      `,
                      
                      // Labels
                      formFieldLabel: 'text-slate-300 font-medium text-sm mb-2 block',
                      
                      // Social buttons
                      socialButtonsBlockButton: `
                        border border-slate-700 hover:border-cyan-500/50 
                        bg-slate-800/30 hover:bg-slate-800/50 text-white
                        rounded-xl px-4 py-3 transition-all duration-300
                        backdrop-blur-sm text-base w-full
                      `,
                      
                      // Divider
                      dividerLine: 'bg-slate-700',
                      dividerText: 'text-slate-400 text-sm',
                      
                      // Links
                      footerActionLink: 'text-cyan-400 hover:text-cyan-300 transition-colors duration-300',
                      
                      // Error messages
                      formFieldErrorText: 'text-red-400 text-sm mt-1',
                      
                      // Root element
                      rootBox: 'w-full',
                      
                      // Form wrapper
                      form: 'space-y-4',
                    },
                    variables: {
                      colorPrimary: '#06b6d4',
                      colorText: '#ffffff',
                      colorTextSecondary: '#94a3b8',
                      colorBackground: 'transparent',
                      colorInputBackground: 'rgba(30, 41, 59, 0.5)',
                      colorInputText: '#ffffff',
                      borderRadius: '0.75rem',
                    },
                  }}
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  afterSignUpUrl="/auth-callback"
                />
              </div>
            </div>
          </motion.div>

          {/* Status Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-6 sm:mt-8"
          >
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-slate-500">
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Registration Active - Join thousands of users</span>
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              </motion.div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}