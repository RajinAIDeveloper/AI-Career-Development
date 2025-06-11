// app/dashboard/layout.js - Enhanced Responsive Layout with Clerk Authentication
'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import toast from 'react-hot-toast'
import {
  Brain, BarChart3, Target, BookOpen, TestTube, Settings,
  Menu, X, Home, FileText, User, Bell, Search, HelpCircle,
  ChevronRight, Zap, Activity, TrendingUp, Clock, LogOut,
  Shield, CheckCircle
} from 'lucide-react'
import { AnalysisProvider } from './context/AnalysisContext'
import { SettingsProvider } from './context/SettingsContext'
import { useAnalysis } from './context/AnalysisContext'
import { useSettings } from './context/SettingsContext'
import DebugControl from '../../components/DebugControl'
import { logger } from '../../utils/Logger'

const AUTHORIZED_EMAILS = ['orpabcic@gmail.com', 'ultrotech1236@gmail.com'];

// Auth Check Component
const AuthGuard = ({ children }) => {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        toast.error('Please sign in to access the dashboard')
        router.push('/')
        return
      }

      const userEmail = user.primaryEmailAddress?.emailAddress
if (!AUTHORIZED_EMAILS.includes(userEmail)) {
        toast.error('Access denied. You are not authorized to access this dashboard.')
        signOut()
        router.push('/')
        return
      }
    }
  }, [isLoaded, user, signOut, router])

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }


  return children
}

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    
    const handleResize = () => {
      setIsMediumScreen(mediaQuery.matches);
    };
    handleResize();
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Analysis', href: '/dashboard/analysis', icon: Brain },
    { name: 'Recommendations', href: '/dashboard/recommendations', icon: Target },
    { name: 'Visualizations', href: '/dashboard/visualizations', icon: BarChart3 },
    { name: 'Learning', href: '/dashboard/learn', icon: BookOpen },
    { name: 'Testing', href: '/dashboard/test', icon: TestTube },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings }
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const overlayVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  if (!isMounted) {
    return (
      <div className="fixed top-0 left-0 z-50 h-full w-64 sm:w-72 bg-white shadow-xl transform -translate-x-full 
                     md:relative md:translate-x-0 md:shadow-none md:border-r md:border-gray-200">
        <SidebarContent
          navigationItems={navigationItems}
          pathname={pathname}
          onClose={onClose}
        />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && !isMediumScreen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={isMediumScreen ? false : "closed"}
        animate={isMediumScreen ? "open" : (isOpen ? "open" : "closed")}
        variants={sidebarVariants}
        transition={isMediumScreen ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 z-50 h-full w-64 sm:w-72 bg-white shadow-xl 
                   md:static md:h-auto md:!translate-x-0 md:shadow-none md:border-r md:border-gray-200"
      >
        <SidebarContent
          navigationItems={navigationItems}
          pathname={pathname}
          onClose={onClose}
        />
      </motion.div>
    </>
  );
};

const SidebarContent = ({ navigationItems, pathname, onClose }) => {
  const { settings } = useSettings();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
      router.push('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-gray-900 text-sm sm:text-base">AI Career</h1>
              <p className="text-xs text-gray-500">Development Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-2 sm:p-3 md:p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                logger.userAction(`Navigate to ${item.name}`);
                if (typeof onClose === 'function') onClose(); 
              }}
              className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-blue-600' : ''}`} />
              <span className="font-medium text-sm sm:text-base">{item.name}</span>
              {isActive && (
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-auto text-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 sm:p-3 md:p-4 border-t border-gray-200">
        {/* Authentication Status */}
        {/* <div className="mb-3 p-2 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-700 font-medium">Authorized Access</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Shield className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600 truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div> */}

        {/* Model Status Indicator */}
        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">
              Model: {settings.geminiModel?.replace('gemini-', '').toUpperCase() || 'Loading...'}
            </span>
          </div>
          {settings.debugMode && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-orange-600">Debug Mode</span>
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className="space-y-2">
          {/* <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0 hidden sm:block">
              <div className="font-medium text-gray-900 truncate text-sm">
                {user?.firstName || 'Career Analyst'}
              </div>
              <div className="text-xs text-gray-500 truncate">AI-Powered Platform</div>
            </div>
          </div> */}

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};

const TopBar = ({ onMenuClick }) => {
  const pathname = usePathname();
  const { currentAgent, isProcessing } = useAnalysis();
  const { settings } = useSettings();
  const { user } = useUser();

  const getPageTitle = useCallback(() => {
    switch (pathname) {
      case '/dashboard': return 'Dashboard'
      case '/dashboard/analysis': return 'Career Analysis'
      case '/dashboard/recommendations': return 'Recommendations'
      case '/dashboard/visualizations': return 'Visualizations'
      case '/dashboard/learn': return 'Learning Path'
      case '/dashboard/test': return 'Skills Testing'
      case '/dashboard/settings': return 'Settings'
      default: return 'Dashboard'
    }
  }, [pathname]);

  const getPageDescription = useCallback(() => {
    switch (pathname) {
      case '/dashboard': return 'Upload your CV and let AI analyze your career'
      case '/dashboard/analysis': return 'AI-powered analysis of your career data'
      case '/dashboard/recommendations': return 'Personalized career growth recommendations'
      case '/dashboard/visualizations': return 'Interactive charts and career insights'
      case '/dashboard/learn': return 'AI-generated learning paths and courses'
      case '/dashboard/test': return 'Skills validation and assessment tests'
      case '/dashboard/settings': return 'Configure your AI career platform'
      default: return 'AI-powered career development platform'
    }
  }, [pathname]);

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-black" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">
              {getPageTitle()}
            </h1>
            {currentAgent && isProcessing ? (
              <p className="text-xs sm:text-sm text-blue-600 flex items-center gap-1 mt-1">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-3 h-3" />
                </motion.div>
                <span className="truncate">
                  {currentAgent.charAt(0).toUpperCase() + currentAgent.slice(1).replace('-', ' ')} is processing...
                </span>
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                {getPageDescription()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
          {/* User Welcome */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">
              Welcome, {user?.firstName || 'User'}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <span className="text-sm text-green-700 font-medium">6 Agents Ready</span>
          </div>

          {/* Current AI Model Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-lg">
            <Brain className="w-3 h-3 text-blue-600" />
            <span className="text-xs text-blue-700 font-medium">
              {settings.geminiModel?.replace('gemini-', '').replace('-', ' ').toUpperCase() || 'Loading...'}
            </span>
          </div>

          {settings.debugMode && (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-lg">
              <Activity className="w-3 h-3 text-orange-600" />
              <span className="text-xs text-orange-700 font-medium">Debug</span>
            </div>
          )}

          {/* Auth Status Indicator */}
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
            <Shield className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-700 font-medium">Secured</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const SidebarWrapper = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [isClientMediumScreen, setIsClientMediumScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const updateScreenSize = () => setIsClientMediumScreen(mediaQuery.matches);
    updateScreenSize();
    mediaQuery.addEventListener('change', updateScreenSize);
    return () => mediaQuery.removeEventListener('change', updateScreenSize);
  }, []);

  useEffect(() => {
    if (!isClientMediumScreen) {
      setSidebarOpen(false);
    }
  }, [pathname, isClientMediumScreen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isClientMediumScreen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isClientMediumScreen]);

  useEffect(() => {
    logger.componentMount('DashboardLayout');
    if (process.env.NODE_ENV === 'development') {
      logger.info('Dashboard', 'Development mode enabled with enhanced logging')
      logger.group('System Information', () => {
        if (typeof window !== 'undefined') {
          logger.info('Browser', navigator.userAgent)
          logger.info('Screen', `${screen.width}x${screen.height}`)
        }
      })
    }
    return () => {
      logger.componentUnmount('DashboardLayout');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <SettingsProvider>
        <AnalysisProvider>
          <SidebarWrapper>
            {children}
          </SidebarWrapper>
        </AnalysisProvider>
      </SettingsProvider>
    </AuthGuard>
  );
}
