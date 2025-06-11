'use client'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Brain, FileText, Target, BarChart3, ArrowRight, Sparkles, Zap } from 'lucide-react'

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState(null)
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

  const handleGetStarted = () => {
    window.location.href = '/sign-in/'
  }

  const features = [
    {
      icon: FileText,
      title: "Smart File Analysis",
      description: "Upload CV, performance sheets - AI analyzes your career data comprehensively",
      color: "purple"
    },
    {
      icon: Target,
      title: "Personalized Recommendations", 
      description: "Get tailored skill development and career guidance with real course suggestions",
      color: "blue"
    },
    {
      icon: BarChart3,
      title: "Visual Insights",
      description: "Beautiful data visualizations reveal hidden patterns in your career progression",
      color: "cyan"
    },
    {
      icon: Brain,
      title: "AI Learning Assistant",
      description: "Interactive lessons, quizzes, and study plans powered by multiple AI agents",
      color: "emerald"
    }
  ]

  return (
    <div className="min-h-screen md:p-20 bg-slate-950 text-white overflow-hidden relative">
      
      {/* Advanced Background Animations */}
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

        {/* Floating Particles with Physics */}
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

        {/* AI System Text with Stagger */}
        {['NEURAL NETWORK', 'MULTI-AGENT', 'DEEP LEARNING', 'AI FUSION'].map((text, i) => (
          <motion.div
            key={`text-${i}`}
            className="absolute text-xs font-mono opacity-8 pointer-events-none select-none font-bold"
            style={{
              color: i % 2 === 0 ? '#8b5cf6' : '#06b6d4',
              left: `${5 + i * 22}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, Math.sin(i * 30) * 200, Math.cos(i * 45) * 150, 0],
              y: [0, Math.cos(i * 30) * 80, Math.sin(i * 45) * 120, 0],
              opacity: [0, 0.25, 0.15, 0],
              scale: [0.8, 1.1, 0.9, 0.8],
              rotateX: [0, 360],
              rotateZ: [0, Math.random() * 20 - 10]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              delay: i * 4,
              ease: [0.37, 0, 0.63, 1]
            }}
          >
            {text}
          </motion.div>
        ))}

        {/* Wave Interference Pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6,182,212,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 20%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(6,182,212,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(6,182,212,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6,182,212,0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1]
          }}
        />

        {/* Subtle Mouse Interaction */}
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

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-6xl mx-auto w-full"
        >
          
          {/* Enhanced AI Core Logo */}
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
            className="mb-8 sm:mb-12 relative"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto relative">
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-purple-500/50"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.05, 1],
                  borderColor: [
                    'rgba(139,92,246,0.5)',
                    'rgba(6,182,212,0.8)',
                    'rgba(139,92,246,0.5)'
                  ]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity },
                  borderColor: { duration: 4, repeat: Infinity }
                }}
              />
              {/* Inner Ring */}
              <motion.div
                className="absolute inset-1 sm:inset-2 rounded-full border border-cyan-400/30"
                animate={{ 
                  rotate: -360,
                  scale: [1, 0.95, 1.05, 1]
                }}
                transition={{ 
                  rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                  scale: { duration: 5, repeat: Infinity }
                }}
              />
              {/* Core with Pulse */}
              <motion.div
                className="absolute inset-3 sm:inset-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(139,92,246,0.5)',
                    '0 0 40px rgba(139,92,246,0.8), 0 0 60px rgba(6,182,212,0.6)',
                    '0 0 20px rgba(139,92,246,0.5)'
                  ],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Title Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 50, rotateX: -30 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight"
          >
            <motion.span
              className="block bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                textShadow: [
                  '0 0 0px rgba(255,255,255,0)',
                  '0 0 30px rgba(139,92,246,0.3)',
                  '0 0 0px rgba(255,255,255,0)'
                ],
                y: [0, -2, 0]
              }}
              transition={{ 
                backgroundPosition: { duration: 4, repeat: Infinity },
                textShadow: { duration: 3, repeat: Infinity },
                y: { duration: 2, repeat: Infinity }
              }}
              whileHover={{
                scale: 1.02,
                textShadow: '0 0 40px rgba(139,92,246,0.8)'
              }}
            >
              AI Career
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
                scale: [1, 1.01, 1]
              }}
              transition={{ 
                backgroundPosition: { duration: 4, repeat: Infinity },
                scale: { duration: 3, repeat: Infinity, delay: 0.5 }
              }}
              whileHover={{
                scale: 1.02,
                rotate: [0, 1, -1, 0]
              }}
            >
              Development
            </motion.span>
          </motion.h1>

          {/* Enhanced Description */}
          <motion.p
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4"
            whileHover={{
              scale: 1.01,
              textShadow: '0 0 20px rgba(139,92,246,0.2)'
            }}
          >
            <motion.span
              animate={{
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Upload your files and let our AI agents analyze your career, provide personalized 
              recommendations, and create custom learning paths for your professional growth.
            </motion.span>
          </motion.p>

          {/* Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
            className="px-4"
          >
            <motion.button
              onClick={handleGetStarted}
              className="group relative px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl overflow-hidden w-full sm:w-auto"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 60px rgba(139,92,246,0.6), 0 20px 40px rgba(139,92,246,0.3)',
                y: -5
              }}
              whileTap={{ 
                scale: 0.95,
                boxShadow: '0 0 30px rgba(139,92,246,0.4)'
              }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(139,92,246,0.3)',
                  '0 0 40px rgba(139,92,246,0.5)',
                  '0 0 20px rgba(139,92,246,0.3)'
                ]
              }}
              transition={{
                boxShadow: { duration: 3, repeat: Infinity }
              }}
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600"
                animate={{
                  background: [
                    'linear-gradient(45deg, #8b5cf6, #06b6d4)',
                    'linear-gradient(225deg, #06b6d4, #8b5cf6)',
                    'linear-gradient(45deg, #8b5cf6, #06b6d4)'
                  ],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  background: { duration: 4, repeat: Infinity },
                  scale: { duration: 2, repeat: Infinity }
                }}
              />
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Button Content */}
              <div className="relative flex items-center justify-center gap-3 sm:gap-4 text-white">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity }
                  }}
                >
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
                <motion.span
                  animate={{
                    textShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      '0 0 10px rgba(255,255,255,0.5)',
                      '0 0 0px rgba(255,255,255,0)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  START ANALYSIS
                </motion.span>
                <motion.div
                  animate={{ 
                    x: [0, 8, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative py-16 sm:py-20 lg:py-32 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          
          {/* Section Title */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4"
            >
              <span className="block bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Powered by
              </span>
              <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Multi-Agent AI System
              </span>
            </motion.h2>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group relative h-80 sm:h-96"
              >
                {/* Optimized Sparkles */}
                {hoveredCard === index && (
                  <motion.div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: '50%',
                          top: '50%'
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: [0, 1, 0], 
                          scale: [0, 1, 0],
                          x: Math.random() * 200 - 100,
                          y: Math.random() * 200 - 100,
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Card */}
                <motion.div
                  className="relative h-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8"
                  whileHover={{
                    borderColor: `rgba(${feature.color === 'purple' ? '139,92,246' : feature.color === 'blue' ? '59,130,246' : feature.color === 'cyan' ? '6,182,212' : '16,185,129'},0.6)`,
                    boxShadow: `0 20px 40px rgba(${feature.color === 'purple' ? '139,92,246' : feature.color === 'blue' ? '59,130,246' : feature.color === 'cyan' ? '6,182,212' : '16,185,129'},0.2)`
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon */}
                  <motion.div
                    className="mb-4 sm:mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${
                      feature.color === 'purple' ? 'from-purple-500 to-violet-600' :
                      feature.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                      feature.color === 'cyan' ? 'from-cyan-500 to-blue-600' :
                      'from-emerald-500 to-green-600'
                    } p-0.5`}>
                      <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                        <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base group-hover:text-slate-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Status */}
                  <motion.div
                    className="flex items-center justify-between opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="flex items-center space-x-2 text-xs sm:text-sm">
                      <motion.div
                        className="w-2 h-2 bg-green-400 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-green-400 font-medium">Active</span>
                    </div>
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}