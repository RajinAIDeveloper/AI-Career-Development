// app/dashboard/analysis/page.js - Fully Responsive Production Version
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { 
  Briefcase, Code, GraduationCap, Trophy, Award, User, BarChart3, 
  TrendingUp, DollarSign, Calendar, MapPin, Mail, Phone, Loader,
  CheckCircle, AlertCircle, Target, Star, Users, Building, 
  Download, Filter, Eye, EyeOff, Maximize2, RefreshCw, Info, 
  Settings, Share2, XCircle, ArrowUp, ArrowDown, Equal, Zap,
  Brain, Clock, Activity, Globe, Search, BookOpen, Lightbulb,
  Menu, X
} from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext'

// Enhanced Loading State with progress indicators
const LoadingState = ({ message, progress = 0 }) => (
  <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-4 sm:mb-6"
    >
      <Brain className="w-full h-full text-blue-600" />
    </motion.div>
    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700 mb-2 sm:mb-3">AI Analysis Engine</h2>
    <p className="text-gray-500 text-sm sm:text-lg mb-3 sm:mb-4 px-2">{message}</p>
    
    {/* Progress Bar */}
    <div className="w-full max-w-xs sm:max-w-md mx-auto mb-4 sm:mb-6">
      <div className="bg-gray-200 rounded-full h-1.5 sm:h-2">
        <motion.div 
          className="bg-blue-600 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mt-2">{progress}% Complete</p>
    </div>

    <div className="mt-4 sm:mt-6 flex justify-center space-x-1 sm:space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full"
          animate={{ y: [-10, 0, -10] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </div>
)

const EmptyState = ({ icon: Icon, title, message, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12 sm:py-16 lg:py-20 px-4"
  >
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-6 sm:mb-8 flex items-center justify-center">
      <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
    </div>
    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">{title}</h2>
    <p className="text-gray-600 max-w-lg mx-auto text-sm sm:text-lg mb-6 sm:mb-8 px-4">{message}</p>
    {action}
  </motion.div>
)

const MissingDataCard = ({ title, icon: Icon, reason, suggestion, actionButton }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-gray-400 transition-colors"
  >
    <div className="text-center">
      <div className="bg-gray-200 rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-400" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3 px-2">{reason}</p>
      {suggestion && (
        <p className="text-blue-600 text-xs sm:text-sm mb-3 sm:mb-4 px-2">{suggestion}</p>
      )}
      {actionButton}
    </div>
  </motion.div>
)

const ErrorBanner = ({ error, details, onRetry, source }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6"
  >
    <div className="flex items-start gap-2 sm:gap-3">
      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-red-800 text-sm sm:text-base">Analysis Generation Failed</h3>
        <p className="text-xs sm:text-sm text-red-700 mt-1 break-words">{error}</p>
        {details && (
          <details className="mt-2">
            <summary className="text-xs sm:text-sm text-red-600 cursor-pointer hover:text-red-700">
              Show technical details
            </summary>
            <pre className="text-xs text-red-600 mt-1 bg-red-100 p-2 rounded overflow-auto max-h-24 sm:max-h-32">
              {details}
            </pre>
          </details>
        )}
        <p className="text-xs text-red-600 mt-1">Source: {source}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-2 text-xs sm:text-sm text-red-800 hover:text-red-900 font-medium flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry Analysis
          </button>
        )}
      </div>
    </div>
  </motion.div>
)

// Enhanced Analysis Card with better performance and features
const EnhancedAnalysisCard = ({ 
  title, 
  children, 
  icon: Icon, 
  color,
  isExpanded = false,
  onToggleExpand,
  isVisible = true,
  onToggleVisibility,
  metric,
  trend,
  isEmpty = false,
  actions = []
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggleExpand?.()
    }
  }, [onToggleExpand])

  if (isEmpty) {
    return (
      <MissingDataCard
        title={title}
        icon={Icon}
        reason="No data available for this section"
        suggestion="Upload a more detailed CV for comprehensive analysis"
        actionButton={
          <button className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition-colors">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
            Learn More
          </button>
        }
      />
    )
  }

  return (
    <motion.div
      layout
      initial={{ y: 20, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: isVisible ? 1 : 0.5,
        scale: isVisible ? 1 : 0.98
      }}
      whileHover={{ scale: isVisible ? 1.01 : 0.98 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${
        isVisible ? 'hover:shadow-xl' : 'opacity-50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className={`p-4 sm:p-6 ${color} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm flex-shrink-0">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white truncate">{title}</h3>
              {metric && (
                <div className="flex items-center gap-1 sm:gap-2 mt-1">
                  <span className="text-white/90 text-sm sm:text-lg font-semibold">{metric}</span>
                  {trend && (
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium ${
                      trend.direction === 'up' ? 'bg-green-500/20 text-green-100' :
                      trend.direction === 'down' ? 'bg-red-500/20 text-red-100' :
                      'bg-gray-500/20 text-gray-100'
                    }`}>
                      {trend.direction === 'up' ? <ArrowUp className="w-2 h-2 sm:w-3 sm:h-3" /> :
                       trend.direction === 'down' ? <ArrowDown className="w-2 h-2 sm:w-3 sm:h-3" /> :
                       <Equal className="w-2 h-2 sm:w-3 sm:h-3" />}
                      <span className="hidden sm:inline">{trend.value}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Actions Menu */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="sm:hidden">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Custom Actions */}
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  title={action.tooltip}
                >
                  <action.icon className="w-4 h-4" />
                </button>
              ))}
              
              <button
                onClick={onToggleVisibility}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title={isVisible ? 'Hide section' : 'Show section'}
              >
                {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={onToggleExpand}
                onKeyPress={handleKeyPress}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
                tabIndex={0}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Actions Dropdown */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="sm:hidden absolute top-full left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10"
            >
              <div className="flex flex-wrap gap-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.onClick()
                      setShowActions(false)
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
                    title={action.tooltip}
                  >
                    <action.icon className="w-4 h-4" />
                    <span>{action.tooltip}</span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    onToggleVisibility()
                    setShowActions(false)
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
                >
                  {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{isVisible ? 'Hide' : 'Show'}</span>
                </button>
                <button
                  onClick={() => {
                    onToggleExpand()
                    setShowActions(false)
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className={`p-4 sm:p-6 ${isExpanded ? 'min-h-[400px] sm:min-h-[600px]' : ''}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Enhanced Personal Info Card with better data handling
const PersonalInfoCard = ({ personalInfo }) => {
  const isEmpty = !personalInfo || !Object.values(personalInfo).some(v => v && v.toString().trim())
  const completeness = useMemo(() => {
    if (!personalInfo) return 0
    const fields = ['name', 'contact', 'location', 'linkedIn']
    const filledFields = fields.filter(field => personalInfo[field]?.toString().trim())
    return Math.round((filledFields.length / fields.length) * 100)
  }, [personalInfo])

  return (
    <EnhancedAnalysisCard
      title="Personal Information"
      icon={User}
      color="bg-gradient-to-r from-indigo-500 to-indigo-600"
      isEmpty={isEmpty}
      metric="Profile"
      trend={{ direction: completeness > 75 ? 'up' : 'equal', value: `${completeness}% Complete` }}
      actions={[
        {
          icon: Download,
          onClick: () => {
            console.log('Export personal info')
          },
          tooltip: 'Export as vCard'
        }
      ]}
    >
      {!isEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {personalInfo.name && (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 sm:gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{personalInfo.name}</p>
              </div>
            </motion.div>
          )}
          {personalInfo.contact && (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 sm:gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Contact</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{personalInfo.contact}</p>
              </div>
            </motion.div>
          )}
          {personalInfo.location && (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 sm:gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100"
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{personalInfo.location}</p>
              </div>
            </motion.div>
          )}
          {personalInfo.linkedIn && (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 sm:gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">LinkedIn</p>
                <a 
                  href={personalInfo.linkedIn} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors text-sm sm:text-base truncate block"
                >
                  View Profile
                </a>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </EnhancedAnalysisCard>
  )
}

// Enhanced Experience Card with timeline visualization
const ExperienceCard = ({ experience }) => {
  const isEmpty = !experience || (!experience.totalYears && !experience.roles?.length)
  const [selectedRole, setSelectedRole] = useState(null)

  const handleRoleClick = (role, index) => {
    setSelectedRole(selectedRole === index ? null : index)
  }

  return (
    <EnhancedAnalysisCard
      title="Professional Experience"
      icon={Briefcase}
      color="bg-gradient-to-r from-blue-500 to-blue-600"
      isEmpty={isEmpty}
      metric={`${experience?.totalYears || 0} Years`}
      trend={{ direction: 'up', value: experience?.currentLevel || 'N/A' }}
      actions={[
        {
          icon: Search,
          onClick: () => {
            console.log('Search experience')
          },
          tooltip: 'Search Experience'
        }
      ]}
    >
      {!isEmpty && (
        <>
          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl border border-blue-200 cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-blue-700">Experience</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{experience.totalYears || 0}</div>
              <div className="text-xs sm:text-sm text-blue-700">Years Total</div>
              <div className="mt-1 sm:mt-2 text-xs text-blue-600">
                Since {new Date().getFullYear() - (experience.totalYears || 0)}
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl border border-green-200 cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="text-xs sm:text-sm font-medium text-green-700">Level</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-600 truncate">{experience.currentLevel || 'N/A'}</div>
              <div className="text-xs sm:text-sm text-green-700">Current Position</div>
              <div className="mt-1 sm:mt-2 text-xs text-green-600">
                Career progression tracked
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl border border-purple-200 cursor-pointer sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <span className="text-xs sm:text-sm font-medium text-purple-700">Roles</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">{experience.roles?.length || 0}</div>
              <div className="text-xs sm:text-sm text-purple-700">Total Positions</div>
              <div className="mt-1 sm:mt-2 text-xs text-purple-600">
                Avg. {experience.roles?.length ? Math.round((experience.totalYears || 0) / experience.roles.length * 10) / 10 : 0} years/role
              </div>
            </motion.div>
          </div>

          {/* Current Position Highlight */}
          {experience.currentRole && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
            >
              <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                Current Position
              </h4>
              <p className="text-lg sm:text-xl font-semibold text-blue-600 mb-1 sm:mb-2">{experience.currentRole}</p>
              {experience.currentCompany && (
                <p className="text-gray-700 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <Building className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  {experience.currentCompany}
                </p>
              )}
            </motion.div>
          )}

          {/* Enhanced Career Timeline */}
          {experience.roles && experience.roles.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              <h4 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                Career Timeline
              </h4>
              {experience.roles.map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-6 sm:pl-8 pb-4 sm:pb-6 border-l-2 border-blue-200 last:border-l-0"
                >
                  <div className="absolute -left-1.5 sm:-left-2 top-0 w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full hover:scale-125 transition-transform cursor-pointer"></div>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleRoleClick(role, index)}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
                      <div className="min-w-0 flex-1">
                        <h5 className="font-semibold text-gray-900 text-base sm:text-lg">{role.title}</h5>
                        <p className="text-blue-600 font-medium text-sm sm:text-base">{role.company}</p>
                      </div>
                      <div className="flex flex-col sm:text-right gap-1">
                        <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                          {role.duration}
                        </span>
                        {index === 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded self-start sm:self-end">Current</span>
                        )}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {selectedRole === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          {role.responsibilities && role.responsibilities.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Key Responsibilities:</p>
                              <ul className="space-y-1">
                                {role.responsibilities.map((resp, i) => (
                                  <li key={i} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
                                    <span className="break-words">{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {role.achievements && role.achievements.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Key Achievements:</p>
                              <ul className="space-y-1">
                                {role.achievements.map((achievement, i) => (
                                  <li key={i} className="text-xs sm:text-sm text-green-600 flex items-start gap-2">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                                    <span className="break-words">{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {role.technologies && role.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                        {role.technologies.slice(0, selectedRole === index ? undefined : 5).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {tech}
                          </span>
                        ))}
                        {selectedRole !== index && role.technologies.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{role.technologies.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </EnhancedAnalysisCard>
  )
}

// Enhanced Skills Card with better categorization
const SkillsCard = ({ skills }) => {
  const isEmpty = !skills || (!skills.technical?.length && !skills.soft?.length && !skills.tools?.length)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSkills = useMemo(() => {
    if (!skills) return {}
    
    const filterBySearch = (skillsList) => {
      if (!searchTerm) return skillsList
      return skillsList?.filter(skill => 
        skill.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    }

    return {
      technical: selectedCategory === 'all' || selectedCategory === 'technical' ? filterBySearch(skills.technical) : [],
      soft: selectedCategory === 'all' || selectedCategory === 'soft' ? filterBySearch(skills.soft) : [],
      tools: selectedCategory === 'all' || selectedCategory === 'tools' ? filterBySearch(skills.tools) : []
    }
  }, [skills, selectedCategory, searchTerm])

  const totalSkills = useMemo(() => {
    return (skills?.technical?.length || 0) + (skills?.soft?.length || 0) + (skills?.tools?.length || 0)
  }, [skills])

  return (
    <EnhancedAnalysisCard
      title="Skills & Technologies"
      icon={Code}
      color="bg-gradient-to-r from-green-500 to-green-600"
      isEmpty={isEmpty}
      metric={`${totalSkills} Skills`}
      trend={{ direction: 'up', value: 'Diverse' }}
      actions={[
        {
          icon: Search,
          onClick: () => {
            document.getElementById('skills-search')?.focus()
          },
          tooltip: 'Search Skills'
        }
      ]}
    >
      {!isEmpty && (
        <div className="space-y-4 sm:space-y-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="skills-search"
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'technical', 'soft', 'tools'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          {filteredSkills.technical && filteredSkills.technical.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Code className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                Technical Skills ({filteredSkills.technical.length})
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {filteredSkills.technical.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-xl border border-green-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{skill.name}</span>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium self-start">
                        {skill.category}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-600 mb-2 gap-1">
                      <span className="font-medium">{skill.proficiency}</span>
                      {skill.yearsUsed && <span>{skill.yearsUsed} years</span>}
                    </div>
                    {/* Proficiency Bar */}
                    {skill.proficiency && (
                      <div className="mb-2">
                        <div className="bg-white/60 rounded-full h-1.5 sm:h-2">
                          <div 
                            className="bg-green-500 h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${
                                skill.proficiency.toLowerCase().includes('expert') ? 90 :
                                skill.proficiency.toLowerCase().includes('advanced') ? 75 :
                                skill.proficiency.toLowerCase().includes('intermediate') ? 60 :
                                skill.proficiency.toLowerCase().includes('beginner') ? 30 : 50
                              }%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {skill.context && (
                      <p className="text-xs text-gray-500 bg-white/60 p-2 rounded break-words">{skill.context}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {filteredSkills.soft && filteredSkills.soft.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                Soft Skills ({filteredSkills.soft.length})
              </h4>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {filteredSkills.soft.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs sm:text-sm rounded-full font-medium border border-blue-300 cursor-pointer hover:shadow-md transition-all"
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Platforms */}
          {filteredSkills.tools && filteredSkills.tools.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                Tools & Platforms ({filteredSkills.tools.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {filteredSkills.tools.map((tool, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 block truncate">{tool.name}</span>
                      <p className="text-xs text-gray-500 truncate">({tool.category})</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {searchTerm && Object.values(filteredSkills).every(skillSet => !skillSet?.length) && (
            <div className="text-center py-6 sm:py-8">
              <Search className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">No skills found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}
    </EnhancedAnalysisCard>
  )
}

// Enhanced Skill Gaps Card with actionable recommendations
const SkillGapsCard = ({ skillGaps }) => {
  const isEmpty = !skillGaps || skillGaps.length === 0

  const priorityColor = (importance) => {
    switch (importance?.toLowerCase()) {
      case 'critical': return 'from-red-50 to-red-100 border-red-200'
      case 'high': return 'from-orange-50 to-orange-100 border-orange-200'
      case 'medium': return 'from-yellow-50 to-yellow-100 border-yellow-200'
      default: return 'from-blue-50 to-blue-100 border-blue-200'
    }
  }

  const priorityBadge = (importance) => {
    switch (importance?.toLowerCase()) {
      case 'critical': return 'bg-red-200 text-red-800'
      case 'high': return 'bg-orange-200 text-orange-800'
      case 'medium': return 'bg-yellow-200 text-yellow-800'
      default: return 'bg-blue-200 text-blue-800'
    }
  }

  return (
    <EnhancedAnalysisCard
      title="Skill Gaps Analysis"
      icon={AlertCircle}
      color="bg-gradient-to-r from-red-500 to-red-600"
      isEmpty={isEmpty}
      metric={`${skillGaps?.length || 0} Gaps`}
      trend={{ direction: 'down', value: 'Priority' }}
      actions={[
        {
          icon: Lightbulb,
          onClick: () => {
            console.log('Get learning recommendations')
          },
          tooltip: 'Get Learning Recommendations'
        }
      ]}
    >
      {!isEmpty && (
        <div className="space-y-3 sm:space-y-4">
          {skillGaps.map((gap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className={`p-3 sm:p-4 bg-gradient-to-r ${priorityColor(gap.importance)} rounded-xl border cursor-pointer hover:shadow-md transition-all`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 sm:mb-3 gap-2">
                <h4 className="font-semibold text-gray-900 flex-1 text-sm sm:text-base">{gap.gap}</h4>
                <div className="flex items-center gap-2 self-start">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${priorityBadge(gap.importance)}`}>
                    {gap.importance}
                  </span>
                  {gap.importance?.toLowerCase() === 'critical' && (
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 break-words">{gap.reason}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                {gap.marketDemand && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    <span className="text-xs text-gray-600">Market Demand: {gap.marketDemand}</span>
                  </div>
                )}
                
                <button className="text-xs bg-white/60 hover:bg-white/80 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-gray-700 transition-colors self-start sm:self-auto">
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
          
          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skillGaps.length * 0.1 + 0.2 }}
            className="pt-3 sm:pt-4 border-t border-gray-200"
          >
            <button className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
              <Lightbulb className="w-4 h-4" />
              Generate Learning Plan
            </button>
          </motion.div>
        </div>
      )}
    </EnhancedAnalysisCard>
  )
}

// Enhanced Career Opportunities Card
const CareerOpportunitiesCard = ({ opportunities }) => {
  const isEmpty = !opportunities || opportunities.length === 0

  return (
    <EnhancedAnalysisCard
      title="Career Opportunities"
      icon={Target}
      color="bg-gradient-to-r from-green-500 to-green-600"
      isEmpty={isEmpty}
      metric={`${opportunities?.length || 0} Paths`}
      trend={{ direction: 'up', value: 'Growth' }}
    >
      {!isEmpty && (
        <div className="space-y-3 sm:space-y-4">
          {opportunities.map((opp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 sm:mb-3 gap-2">
                <h4 className="font-semibold text-gray-900 text-base sm:text-lg">{opp.role}</h4>
                <span className={`px-2 py-1 text-xs rounded-full font-medium self-start ${
                  opp.probability === 'High' ? 'bg-green-200 text-green-800' :
                  opp.probability === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {opp.probability} Probability
                </span>
              </div>
              
              {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                <div className="mb-2 sm:mb-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Skills Needed:</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {opp.requiredSkills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                {opp.timeToAchieve && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span>Timeline: {opp.timeToAchieve}</span>
                  </div>
                )}
                {opp.salaryRange && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span>Salary: {opp.salaryRange}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </EnhancedAnalysisCard>
  )
}

// Enhanced Salary Insights Card
const SalaryInsightsCard = ({ salaryInsights }) => {
  const isEmpty = !salaryInsights

  return (
    <EnhancedAnalysisCard
      title="Salary Insights"
      icon={DollarSign}
      color="bg-gradient-to-r from-yellow-500 to-orange-500"
      isEmpty={isEmpty}
      metric={salaryInsights?.currentEstimate || 'N/A'}
      trend={{ direction: 'up', value: salaryInsights?.growthPotential || 'TBD' }}
    >
      {!isEmpty && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-xl border border-yellow-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Current Estimate</h4>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600 mb-1 sm:mb-2">{salaryInsights.currentEstimate}</p>
              {salaryInsights.marketComparison && (
                <p className="text-xs sm:text-sm text-gray-600 break-words">{salaryInsights.marketComparison}</p>
              )}
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl border border-green-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Growth Potential</h4>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mb-1 sm:mb-2">{salaryInsights.growthPotential}</p>
              <p className="text-xs sm:text-sm text-gray-600">Increase potential with skill development</p>
            </motion.div>
          </div>

          {salaryInsights.factors && salaryInsights.factors.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                Influencing Factors
              </h4>
              <div className="space-y-1 sm:space-y-2">
                {salaryInsights.factors.map((factor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-gray-700 break-words">{factor}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </EnhancedAnalysisCard>
  )
}

// Enhanced Filter Controls with export functionality
const FilterControls = ({ onRetry, analysisResults, onExportAnalysis }) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      if (onExportAnalysis) {
        await onExportAnalysis()
      } else {
        // Default export logic
        const data = JSON.stringify(analysisResults, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `career-analysis-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          Analysis Controls
        </h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
          >
            {isExporting ? (
              <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            Export Analysis
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
            Share Report
          </button>
          {analysisResults?.error && onRetry && (
            <button 
              onClick={onRetry}
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              Retry Analysis
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Main component with enhanced state management
export default function EnhancedAnalysisPage() {
  const { analysisResults, agentStatus, parsedData } = useAnalysis()
  const [visibilityStates, setVisibilityStates] = useState({})
  const [expandedStates, setExpandedStates] = useState({})
  const [showRawData, setShowRawData] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const parsedAnalysis = parsedData?.analysis
  const isParserProcessing = agentStatus['parser-agent'] === 'processing'
  const isParserCompleted = agentStatus['parser-agent'] === 'completed'
  const isDataAnalystProcessing = agentStatus['data-analyst'] === 'processing'

  // Calculate analysis progress
  useEffect(() => {
    const totalSteps = Object.keys(agentStatus).length
    const completedSteps = Object.values(agentStatus).filter(status => status === 'completed').length
    const processingSteps = Object.values(agentStatus).filter(status => status === 'processing').length
    
    let progress = (completedSteps / totalSteps) * 100
    if (processingSteps > 0) {
      progress += (processingSteps / totalSteps) * 50 // Add 50% for processing steps
    }
    
    setAnalysisProgress(Math.min(Math.round(progress), 95)) // Cap at 95% until fully complete
  }, [agentStatus])

  const toggleVisibility = useCallback((key) => {
    setVisibilityStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }, [])

  const toggleExpanded = useCallback((key) => {
    setExpandedStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }, [])

  // Enhanced retry function with progress tracking
  const retryAnalysis = async () => {
    console.log('🔄 Retrying analysis generation...')
    setAnalysisProgress(0)
    // Implementation would trigger re-analysis
  }

  // Enhanced export function
  const exportAnalysis = async () => {
    try {
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '2.0',
          source: 'Enhanced Analysis Page'
        },
        personalInfo: parsedAnalysis?.personalInfo,
        experience: parsedAnalysis?.experience,
        skills: parsedAnalysis?.skills,
        skillGaps: parsedAnalysis?.skillGaps,
        careerOpportunities: parsedAnalysis?.careerOpportunities,
        salaryInsights: parsedAnalysis?.salaryInsights,
        education: parsedAnalysis?.education,
        certifications: parsedAnalysis?.certifications,
        projects: parsedAnalysis?.projects,
        achievements: parsedAnalysis?.achievements,
        rawAnalysis: analysisResults
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `career-analysis-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      throw error
    }
  }

  // Loading state with progress
  if (isParserProcessing || isDataAnalystProcessing) {
    return <LoadingState 
      message="AI is analyzing your career data and extracting insights..." 
      progress={analysisProgress}
    />
  }

  // No analysis results
  if (!analysisResults?.dataAnalysis) {
    return (
      <EmptyState 
        icon={BarChart3}
        title="No Analysis Data"
        message="Upload your CV files on the main dashboard to see detailed career analysis"
        action={
          <motion.a 
            href="/dashboard"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Go to Dashboard
          </motion.a>
        }
      />
    )
  }

  // Parser failed or no parsed data
  if (!parsedAnalysis && isParserCompleted) {
    return (
      <EmptyState 
        icon={AlertCircle}
        title="Analysis Processing Failed"
        message="Unable to structure your career data. Please try uploading a different file format."
        action={
          <motion.button 
            onClick={retryAnalysis}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Retry Analysis
          </motion.button>
        }
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Enhanced Header */}
      <div className="text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            Career Data Analysis
          </h1>
          <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto px-4">
            AI-powered insights and comprehensive analysis of your professional journey
          </p>
          <div className="mt-4 sm:mt-6 flex justify-center space-x-4 sm:space-x-8 text-blue-100 text-sm sm:text-base">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">{Object.keys(parsedAnalysis || {}).length}</div>
              <div className="text-xs sm:text-sm">Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">AI</div>
              <div className="text-xs sm:text-sm">Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">Real-time</div>
              <div className="text-xs sm:text-sm">Processing</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Filter Controls */}
      <FilterControls 
        onRetry={retryAnalysis} 
        analysisResults={analysisResults} 
        onExportAnalysis={exportAnalysis}
      />

      {/* Error Banner */}
      {analysisResults?.error && (
        <ErrorBanner 
          error={analysisResults.error}
          details={analysisResults.errorDetails}
          source={analysisResults.source}
          onRetry={retryAnalysis}
        />
      )}

      {/* Analysis Content */}
      <div className="space-y-6 sm:space-y-8">
        
        {/* Personal Information */}
        <PersonalInfoCard personalInfo={parsedAnalysis?.personalInfo} />

        {/* Professional Experience */}
        <ExperienceCard experience={parsedAnalysis?.experience} />

        {/* Skills Analysis */}
        <SkillsCard skills={parsedAnalysis?.skills} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Skill Gaps */}
          <SkillGapsCard skillGaps={parsedAnalysis?.skillGaps} />

          {/* Career Opportunities */}
          <CareerOpportunitiesCard opportunities={parsedAnalysis?.careerOpportunities} />
        </div>

        {/* Salary Insights */}
        <SalaryInsightsCard salaryInsights={parsedAnalysis?.salaryInsights} />

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {(parsedAnalysis?.education && parsedAnalysis.education.length > 0) ? (
            <EnhancedAnalysisCard
              title={`Education (${parsedAnalysis.education.length})`}
              icon={GraduationCap}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              metric={`${parsedAnalysis.education.length} Degrees`}
            >
              <div className="space-y-3 sm:space-y-4">
                {parsedAnalysis.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="p-3 sm:p-4 bg-purple-50 rounded-xl border border-purple-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{edu.degree}</h4>
                    <p className="text-purple-600 font-medium text-sm sm:text-base">{edu.institution}</p>
                    <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 gap-1">
                      {edu.year && <span>{edu.year}</span>}
                      {edu.grade && <span>Grade: {edu.grade}</span>}
                    </div>
                    {edu.relevance && (
                      <p className="text-xs text-gray-500 mt-2 bg-white/60 p-2 rounded break-words">{edu.relevance}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </EnhancedAnalysisCard>
          ) : (
            <MissingDataCard
              title="Education"
              icon={GraduationCap}
              reason="No education data found"
              suggestion="Include education details in your CV"
            />
          )}

          {(parsedAnalysis?.certifications && parsedAnalysis.certifications.length > 0) ? (
            <EnhancedAnalysisCard
              title={`Certifications (${parsedAnalysis.certifications.length})`}
              icon={Award}
              color="bg-gradient-to-r from-orange-500 to-orange-600"
              metric={`${parsedAnalysis.certifications.length} Certs`}
            >
              <div className="space-y-3 sm:space-y-4">
                {parsedAnalysis.certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{cert.name}</h4>
                    <p className="text-orange-600 font-medium text-sm sm:text-base">{cert.issuer}</p>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 gap-1">
                      {cert.year && <span>{cert.year}</span>}
                      <span className={`px-2 py-1 text-xs rounded self-start sm:self-auto ${
                        cert.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {cert.status}
                      </span>
                    </div>
                    {cert.relevance && (
                      <p className="text-xs text-gray-500 mt-2 bg-white/60 p-2 rounded break-words">{cert.relevance}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </EnhancedAnalysisCard>
          ) : (
            <MissingDataCard
              title="Certifications"
              icon={Award}
              reason="No certifications found"
              suggestion="Add professional certifications to enhance your profile"
            />
          )}
        </div>

        {/* Projects & Achievements */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {(parsedAnalysis?.projects && parsedAnalysis.projects.length > 0) ? (
            <EnhancedAnalysisCard
              title={`Projects (${parsedAnalysis.projects.length})`}
              icon={Trophy}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              metric={`${parsedAnalysis.projects.length} Projects`}
            >
              <div className="space-y-3 sm:space-y-4">
                {parsedAnalysis.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{project.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 break-words">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.impact && (
                      <p className="text-xs text-green-600 font-medium bg-green-50 p-2 rounded break-words">
                        Impact: {project.impact}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </EnhancedAnalysisCard>
          ) : (
            <MissingDataCard
              title="Projects"
              icon={Trophy}
              reason="No projects data found"
              suggestion="Include project details to showcase your work"
            />
          )}

          {(parsedAnalysis?.achievements && parsedAnalysis.achievements.length > 0) ? (
            <EnhancedAnalysisCard
              title={`Achievements (${parsedAnalysis.achievements.length})`}
              icon={Award}
              color="bg-gradient-to-r from-yellow-500 to-yellow-600"
              metric={`${parsedAnalysis.achievements.length} Awards`}
            >
              <div className="space-y-3 sm:space-y-4">
                {parsedAnalysis.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="p-3 sm:p-4 bg-yellow-50 rounded-xl border border-yellow-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <p className="text-xs sm:text-sm text-gray-700 mb-2 break-words">{achievement.description}</p>
                    {achievement.quantified && (
                      <p className="text-xs font-medium text-yellow-600 bg-yellow-100 p-2 rounded mb-2 break-words">
                        Metrics: {achievement.quantified}
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 gap-1">
                      {achievement.context && <span className="break-words">{achievement.context}</span>}
                      {achievement.year && <span>{achievement.year}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </EnhancedAnalysisCard>
          ) : (
            <MissingDataCard
              title="Achievements"
              icon={Award}
              reason="No achievements data found"
              suggestion="Add quantifiable achievements to strengthen your profile"
            />
          )}
        </div>

        {/* Enhanced Raw Data Debug Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200"
        >
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                Debug Information & Raw Analysis Data
              </h3>
              <button
                onClick={() => setShowRawData(!showRawData)}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 text-black hover:bg-gray-300 rounded-lg transition-colors text-sm self-start sm:self-auto"
              >
                {showRawData ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                {showRawData ? 'Hide' : 'Show'} Raw Data
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showRawData && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  
                  {/* Agent Status */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Activity className="w-4 h-4 text-blue-500" />
                      Agent Processing Status
                    </h4>
                    <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {Object.entries(agentStatus).map(([agent, status]) => (
                          <div key={agent} className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                              status === 'completed' ? 'bg-green-500' :
                              status === 'failed' ? 'bg-red-500' :
                              status === 'processing' ? 'bg-blue-500 animate-pulse' :
                              'bg-gray-400'
                            }`} />
                            <span className="text-xs sm:text-sm text-gray-700 break-words">{agent}: {status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Processing Progress */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Clock className="w-4 h-4 text-purple-500" />
                      Processing Progress
                    </h4>
                    <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm text-gray-600">Overall Progress</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{analysisProgress}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <motion.div 
                          className="bg-blue-600 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${analysisProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Raw Analysis Data */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Brain className="w-4 h-4 text-purple-500" />
                      Complete Raw Analysis
                    </h4>
                    <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                      <pre className="text-xs text-gray-600 bg-gray-50 p-3 sm:p-4 rounded overflow-auto max-h-64 sm:max-h-96">
                        {JSON.stringify(analysisResults, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Parsed Data */}
                  {parsedAnalysis && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Code className="w-4 h-4 text-green-500" />
                        Structured Career Data
                      </h4>
                      <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <pre className="text-xs text-gray-600 bg-gray-50 p-3 sm:p-4 rounded overflow-auto max-h-64 sm:max-h-96">
                          {JSON.stringify(parsedAnalysis, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}