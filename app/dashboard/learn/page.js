// app/dashboard/learn/page.js - Personalized Learning with Real Data (Responsive)
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Play, CheckCircle, Clock, Target, Award, Code, 
  FileText, ExternalLink, ChevronDown, ChevronRight, Loader,
  AlertCircle, Brain, Star, Calendar, Users, Lightbulb,
  ArrowRight, Download, Share, Bookmark, Zap, Sparkles,
  TrendingUp, Trophy, Briefcase, GraduationCap, Settings,
  BarChart3, MapPin, DollarSign, Shield, Menu, X, RefreshCw,
  Upload
} from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext'

const LoadingState = ({ message }) => (
  <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 sm:mb-6"
    >
      <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
    </motion.div>
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">AI Learning Engine</h2>
    <p className="text-gray-500 text-base sm:text-lg px-2">{message}</p>
    <div className="mt-4 sm:mt-6 flex justify-center space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-green-600 rounded-full"
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
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-6 sm:mb-8 flex items-center justify-center">
      <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">{title}</h2>
    <p className="text-gray-600 max-w-lg mx-auto text-base sm:text-lg mb-6 sm:mb-8 px-4">{message}</p>
    {action}
  </motion.div>
)

const LearningStrategyCard = ({ strategy }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-200 mb-6 sm:mb-8"
  >
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
      <div className="p-2 sm:p-3 bg-blue-600 rounded-lg sm:rounded-xl self-start">
        <Target className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
      </div>
      <div className="flex-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Learning Strategy</h2>
        <p className="text-blue-600 font-medium text-sm sm:text-base">Personalized career advancement plan</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <Trophy className="w-4 h-4 text-blue-600" />
            Primary Goal
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">{strategy.primaryGoal}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4 text-blue-600" />
            Timeline
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">{strategy.timeframe}</p>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <Target className="w-4 h-4 text-blue-600" />
            Focus Areas
          </h3>
          <div className="space-y-2">
            {strategy.focusAreas?.map((area, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-xs sm:text-sm">{area}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <Brain className="w-4 h-4 text-blue-600" />
            Learning Approach
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">{strategy.learningApproach}</p>
        </div>
      </div>
    </div>

    {strategy.careerImpact && (
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Expected Career Impact</h3>
        <p className="text-green-700 text-sm sm:text-base">{strategy.careerImpact}</p>
      </div>
    )}
  </motion.div>
)

const LearningPathOverview = ({ learningPath }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white mb-6 sm:mb-8"
  >
    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
      Your Personalized Learning Journey
    </h2>
    
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
        <div className="text-2xl sm:text-3xl font-bold">{learningPath.modules?.length || 0}</div>
        <div className="text-green-100 text-sm sm:text-base">Custom Modules</div>
      </div>
      <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
        <div className="text-xl sm:text-2xl font-bold">{learningPath.totalDuration}</div>
        <div className="text-green-100 text-sm sm:text-base">Total Duration</div>
      </div>
      <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
        <div className="text-xl sm:text-2xl font-bold">{learningPath.weeklyCommitment}</div>
        <div className="text-green-100 text-sm sm:text-base">Weekly Commitment</div>
      </div>
    </div>

    {learningPath.milestones && learningPath.milestones.length > 0 && (
      <div>
        <h3 className="font-semibold mb-3 text-sm sm:text-base">Career Milestones</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {learningPath.milestones.slice(0, 6).map((milestone, index) => (
            <div key={index} className="bg-white/20 backdrop-blur rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-white/30 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  {milestone.week}
                </span>
                <span className="font-medium text-xs sm:text-sm">{milestone.achievement}</span>
              </div>
              <p className="text-xs text-green-100 ml-7 sm:ml-8">{milestone.careerRelevance}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </motion.div>
)

const ModuleCard = ({ module, index, onStartModule, isCompleted = false }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const priorityColors = {
    'Critical': 'from-red-500 to-red-600',
    'High': 'from-orange-500 to-orange-600',
    'Medium': 'from-blue-500 to-blue-600'
  }

  const priorityBadgeColors = {
    'Critical': 'bg-red-100 text-red-700',
    'High': 'bg-orange-100 text-orange-700',
    'Medium': 'bg-blue-100 text-blue-700'
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-lg sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 ${
        isCompleted ? 'ring-2 ring-green-200' : ''
      }`}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${
        isCompleted ? 'from-green-500 to-green-600' : priorityColors[module.priority] || 'from-gray-500 to-gray-600'
      } p-4 sm:p-6 text-white`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
              {isCompleted ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold truncate">{module.title}</h3>
              <p className="text-white/90 text-xs sm:text-sm">{module.careerImpact}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            {isCompleted ? (
              <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                ✓ Completed
              </span>
            ) : (
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${priorityBadgeColors[module.priority]}`}>
                {module.priority} Priority
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="bg-white/20 rounded-lg p-2 sm:p-3">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mb-1" />
            <div className="font-medium">{module.duration}</div>
            <div className="text-white/80 text-xs">Duration</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2 sm:p-3">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 mb-1" />
            <div className="font-medium">{module.difficulty}</div>
            <div className="text-white/80 text-xs">Level</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2 sm:p-3">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mb-1" />
            <div className="font-medium">{module.lessons?.length || 0}</div>
            <div className="text-white/80 text-xs">Lessons</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2 sm:p-3">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mb-1" />
            <div className="font-medium">{module.objectives?.length || 0}</div>
            <div className="text-white/80 text-xs">Objectives</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Prerequisites */}
        {module.prerequisites && module.prerequisites.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Prerequisites (You Have These)
            </h4>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {module.prerequisites.map((prereq, i) => (
                <span key={i} className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs sm:text-sm rounded-full">
                  ✓ {prereq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills Targeted */}
        {module.skillsTargeted && module.skillsTargeted.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <Star className="w-4 h-4 text-yellow-500" />
              Skills You'll Master
            </h4>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {module.skillsTargeted.map((skill, i) => (
                <span key={i} className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 text-xs sm:text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        {module.objectives && module.objectives.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <Target className="w-4 h-4 text-blue-500" />
              What You'll Achieve
            </h4>
            <div className="space-y-2">
              {module.objectives.map((objective, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-xs sm:text-sm">{objective}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {isCompleted ? (
            <button
              onClick={() => onStartModule(module)}
              className="flex-1 bg-green-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <BookOpen className="w-4 h-4" />
              Review Module
            </button>
          ) : (
            <button
              onClick={() => onStartModule(module)}
              className="flex-1 bg-blue-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Play className="w-4 h-4" />
              Start Module
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center sm:w-auto"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200"
            >
              {/* Lessons Preview */}
              {module.lessons && module.lessons.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Lesson Overview</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {module.lessons.slice(0, 3).map((lesson, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                          <h5 className="font-medium text-gray-900 text-sm sm:text-base">{lesson.title}</h5>
                          <span className="text-xs text-gray-500 self-start sm:self-center">{lesson.exercises?.length || 0} exercises</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{lesson.practicalApplication}</p>
                        {lesson.realWorldProject && (
                          <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
                            <strong>Project:</strong> {lesson.realWorldProject.description}
                          </div>
                        )}
                      </div>
                    ))}
                    {module.lessons.length > 3 && (
                      <p className="text-xs sm:text-sm text-gray-500 text-center">
                        +{module.lessons.length - 3} more lessons
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Capstone Project */}
              {module.capstoneProject && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <Award className="w-4 h-4 text-purple-600" />
                    Capstone Project
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm mb-3">{module.capstoneProject.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Business Value:</span>
                      <p className="text-gray-600">{module.capstoneProject.businessValue}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Portfolio Impact:</span>
                      <p className="text-gray-600">{module.capstoneProject.portfolioWorth}</p>
                    </div>
                  </div>

                  {module.capstoneProject.deliverables && (
                    <div className="mt-3">
                      <span className="font-medium text-gray-900 text-xs sm:text-sm">Deliverables:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {module.capstoneProject.deliverables.map((deliverable, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const CourseInterface = ({ module, onExit, onComplete }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const [showExercise, setShowExercise] = useState(false)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseComplete, setExerciseComplete] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentLesson = module.lessons?.[currentLessonIndex]
  const totalLessons = module.lessons?.length || 0
  const progress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0

  const handleCompleteLesson = () => {
    const newCompleted = new Set(completedLessons)
    newCompleted.add(currentLessonIndex)
    setCompletedLessons(newCompleted)
    
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    } else {
      onComplete(module)
    }
    setSidebarOpen(false)
  }

  const handleStartExercise = (exerciseIndex) => {
    setCurrentExerciseIndex(exerciseIndex)
    setShowExercise(true)
    setExerciseComplete(false)
  }

  const handleCompleteExercise = () => {
    setExerciseComplete(true)
    setTimeout(() => {
      setShowExercise(false)
      setExerciseComplete(false)
    }, 2000)
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">No lessons available</h2>
          <button onClick={onExit} className="mt-4 text-blue-600 hover:text-blue-700 text-sm sm:text-base">
            Return to Learning Path
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={onExit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform rotate-180" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{module.title}</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  Lesson {currentLessonIndex + 1} of {totalLessons}: {currentLesson.title}
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {Math.round(progress)}% Complete
              </div>
              <div className="w-24 sm:w-32 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Mobile Progress Bar */}
          <div className="sm:hidden mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Modal */}
      <AnimatePresence>
        {showExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            >
              {currentLesson.exercises && currentLesson.exercises[currentExerciseIndex] && (
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Hands-On Exercise</h2>
                    <button
                      onClick={() => setShowExercise(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {!exerciseComplete ? (
                    <div>
                      <div className="mb-4">
                        <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 text-xs sm:text-sm rounded-full font-medium">
                          {currentLesson.exercises[currentExerciseIndex].type}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                        {currentLesson.exercises[currentExerciseIndex].description}
                      </h3>
                      
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">What you'll create:</h4>
                        <p className="text-gray-700 text-xs sm:text-sm">
                          {currentLesson.exercises[currentExerciseIndex].deliverable}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-6">
                        <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Skills you'll practice:</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {currentLesson.exercises[currentExerciseIndex].skillsApplied?.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <span className="text-xs sm:text-sm text-gray-500">
                          Estimated time: {currentLesson.exercises[currentExerciseIndex].timeEstimate}
                        </span>
                        <button
                          onClick={handleCompleteExercise}
                          className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                        >
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Exercise Complete!</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Great job! You've successfully completed this exercise.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Lessons</h3>
              <div className="space-y-2">
                {module.lessons?.map((lesson, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentLessonIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentLessonIndex 
                        ? 'bg-blue-600 text-white' 
                        : completedLessons.has(index)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {completedLessons.has(index) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : index === currentLessonIndex ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                      )}
                      <span className="text-sm font-medium">{lesson.title}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Module Progress */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              {/* Lesson Header */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{currentLesson.title}</h2>
                <p className="text-blue-600 font-medium text-sm sm:text-base">{currentLesson.practicalApplication}</p>
              </div>

              {/* Lesson Content */}
              <div className="prose prose-sm sm:prose-lg max-w-none mb-6 sm:mb-8">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm sm:text-base">
                    {currentLesson.content}
                  </div>
                </div>
              </div>

              {/* Real World Project */}
              {currentLesson.realWorldProject && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg sm:rounded-xl border border-purple-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    Real-World Project
                  </h3>
                  <p className="text-gray-700 mb-4 text-xs sm:text-sm">{currentLesson.realWorldProject.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div className="bg-white p-3 rounded-lg">
                      <span className="font-medium text-gray-900 text-xs sm:text-sm">Scope:</span>
                      <p className="text-gray-600 text-xs sm:text-sm">{currentLesson.realWorldProject.scope}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <span className="font-medium text-gray-900 text-xs sm:text-sm">Expected Outcome:</span>
                      <p className="text-gray-600 text-xs sm:text-sm">{currentLesson.realWorldProject.outcome}</p>
                    </div>
                  </div>

                  {currentLesson.realWorldProject.technologies && (
                    <div className="mb-4">
                      <span className="font-medium text-gray-900 text-xs sm:text-sm">Technologies:</span>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                        {currentLesson.realWorldProject.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Exercises */}
              {currentLesson.exercises && currentLesson.exercises.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    Practice Exercises
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {currentLesson.exercises.map((exercise, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">Exercise {index + 1}</h4>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            {exercise.type}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">{exercise.description}</p>
                        <button
                          onClick={() => handleStartExercise(index)}
                          className="w-full bg-green-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
                        >
                          Start Exercise
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lesson Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 border-t border-gray-200 gap-3">
                <button
                  onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                  disabled={currentLessonIndex === 0}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  <ArrowRight className="w-4 h-4 transform rotate-180" />
                  Previous
                </button>
                
                <span className="text-xs sm:text-sm text-gray-600 order-first sm:order-none">
                  Lesson {currentLessonIndex + 1} of {totalLessons}
                </span>

                {currentLessonIndex === totalLessons - 1 ? (
                  <button
                    onClick={handleCompleteLesson}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                  >
                    <Trophy className="w-4 h-4" />
                    Complete Module
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteLesson}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PersonalizedCourseCard = ({ course, index, onEnrollCourse }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{course.title}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium self-start">
                Fills Your Gap
              </span>
            </div>
            <p className="text-blue-600 text-xs sm:text-sm font-medium mb-2">{course.provider}</p>
            <p className="text-gray-600 text-xs sm:text-sm mb-3">{course.careerRelevance}</p>
          </div>
        </div>

        {/* Target Gap */}
        <div className="mb-3 sm:mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-medium text-red-800 text-xs sm:text-sm mb-1">Addresses Your Skill Gap:</h4>
          <p className="text-red-700 text-xs sm:text-sm">{course.targetGap}</p>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{course.level}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{course.salaryImpact}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{course.marketDemand}</span>
          </div>
        </div>

        {/* Prerequisites */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <h4 className="font-medium text-gray-900 text-xs sm:text-sm mb-2">Prerequisites (You Have):</h4>
            <div className="flex flex-wrap gap-1">
              {course.prerequisites.map((prereq, i) => (
                <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  ✓ {prereq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Learning Outcomes */}
        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <h4 className="font-medium text-gray-900 text-xs sm:text-sm mb-2">You'll Learn:</h4>
            <div className="space-y-1">
              {course.learningOutcomes.slice(0, 3).map((outcome, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Zap className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-xs">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Immediate Application */}
        {course.immediateApplication && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 text-xs sm:text-sm mb-1">Immediate Application:</h4>
            <p className="text-green-700 text-xs sm:text-sm">{course.immediateApplication}</p>
          </div>
        )}

        <button
          onClick={() => onEnrollCourse(course)}
          className="w-full bg-blue-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Play className="w-4 h-4" />
          Start This Course
        </button>
      </div>
    </motion.div>
  )
}

const SkillDevelopmentPlan = ({ skillPlan }) => {
  if (!skillPlan) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200"
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-purple-600">
        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
        Your Skill Development Roadmap
      </h3>

      {/* Immediate Skills */}
      {skillPlan.immediateSkills && skillPlan.immediateSkills.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Zap className="w-4 h-4 text-red-500" />
            Immediate Priority Skills
          </h4>
          <div className="space-y-3 sm:space-y-4">
            {skillPlan.immediateSkills.map((skill, index) => (
              <div key={index} className="p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                  <h5 className="font-medium text-gray-900 text-sm sm:text-base">{skill.skill}</h5>
                  <span className="text-xs sm:text-sm text-red-600 font-medium self-start">{skill.timeToCompetency}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">{skill.currentGap}</p>
                <p className="text-xs sm:text-sm text-red-700 font-medium">{Array.isArray(skill.learningPath) ? skill.learningPath.join(' → ') : skill.learningPath}</p>
                {skill.careerImpact && (
                  <p className="text-xs text-green-700 mt-2 bg-green-50 p-2 rounded">
                    <strong>Career Impact:</strong> {skill.careerImpact}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medium Term Skills */}
      {skillPlan.mediumTermSkills && skillPlan.mediumTermSkills.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Target className="w-4 h-4 text-blue-500" />
            Medium-Term Strategic Skills
          </h4>
          <div className="space-y-3">
            {skillPlan.mediumTermSkills.map((skill, index) => (
              <div key={index} className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{skill.skill}</h5>
                <p className="text-xs sm:text-sm text-blue-700 mb-2">{skill.strategicValue}</p>
                <p className="text-xs sm:text-sm text-gray-600">{skill.industryRelevance}</p>
                {skill.careerOpportunities && (
                  <p className="text-xs text-purple-700 mt-2 bg-purple-50 p-2 rounded">
                    <strong>Opens:</strong> {Array.isArray(skill.careerOpportunities) ? skill.careerOpportunities.join(', ') : skill.careerOpportunities}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Long Term Skills */}
      {skillPlan.longTermSkills && skillPlan.longTermSkills.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Long-Term Strategic Skills
          </h4>
          <div className="space-y-3">
            {skillPlan.longTermSkills.map((skill, index) => (
              <div key={index} className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{skill.skill}</h5>
                <p className="text-xs sm:text-sm text-green-700 mb-2">{skill.futureValue}</p>
                <p className="text-xs sm:text-sm text-gray-600">{skill.industryEvolution}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

const PracticalApplicationCard = ({ practicalApplication }) => {
  if (!practicalApplication) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200"
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-orange-600">
        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
        Apply Your Learning Immediately
      </h3>

      {/* Current Role Enhancements */}
      {practicalApplication.currentRoleEnhancements && (
        <div className="mb-4 sm:mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Enhance Your Current Role</h4>
          <div className="space-y-3">
            {practicalApplication.currentRoleEnhancements.map((enhancement, index) => (
              <div key={index} className="p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{enhancement.area}</h5>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">{enhancement.implementation}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-2">
                  <span className="text-orange-700 font-medium">Expected: {enhancement.measurableOutcome}</span>
                  <span className="text-gray-500">{enhancement.timeframe}</span>
                </div>
                {enhancement.careerBenefit && (
                  <p className="text-xs text-blue-700 mt-2 bg-blue-50 p-2 rounded">
                    <strong>Career Benefit:</strong> {enhancement.careerBenefit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Projects */}
      {practicalApplication.portfolioProjects && (
        <div className="mb-4 sm:mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Portfolio Building Projects</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {practicalApplication.portfolioProjects.map((project, index) => (
              <div key={index} className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{project.project}</h5>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">{project.businessProblem}</p>
                <div className="text-xs text-blue-700 mb-1">
                  <strong>Career Benefit:</strong> {project.careerBenefit}
                </div>
                <div className="text-xs text-gray-500">Timeline: {project.timeline}</div>
                {project.skillsDemonstrated && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Skills Demonstrated:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.skillsDemonstrated.map((skill, i) => (
                        <span key={i} className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immediate Wins */}
      {practicalApplication.immediateWins && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Quick Wins</h4>
          <div className="space-y-2">
            {practicalApplication.immediateWins.map((win, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                  <h5 className="font-medium text-gray-900 text-sm">{win.action}</h5>
                  <span className="text-xs text-green-600 self-start">{win.timeframe}</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{win.impact}</p>
                {win.visibilityBenefit && (
                  <p className="text-xs text-purple-700">
                    <strong>Visibility:</strong> {win.visibilityBenefit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function PersonalizedLearnPage() {
  const { analysisResults, agentStatus, isProcessing } = useAnalysis()
  const [activeModule, setActiveModule] = useState(null)
  const [showCourseInterface, setShowCourseInterface] = useState(false)
  const [completedModules, setCompletedModules] = useState(new Set())

  // Get learning content from analysis results
  const learningContent = analysisResults?.learningContent

  // Check if learning agent is processing or completed
  const isLearningProcessing = agentStatus['learn-agent'] === 'processing'
  const isLearningCompleted = agentStatus['learn-agent'] === 'completed'
  const hasAnalysisData = !!analysisResults?.dataAnalysis

  const handleStartModule = (module) => {
    setActiveModule(module)
    setShowCourseInterface(true)
  }

  const handleExitCourse = () => {
    setShowCourseInterface(false)
    setActiveModule(null)
  }

  const handleCompleteModule = (module) => {
    const newCompleted = new Set(completedModules)
    newCompleted.add(module.title)
    setCompletedModules(newCompleted)
    setShowCourseInterface(false)
    setActiveModule(null)
    
    alert(`🎉 Congratulations! You've completed "${module.title}"!\n\nYour career development progress has been updated.`)
  }

  const handleEnrollCourse = (course) => {
    alert(`Redirecting to ${course.provider} for course: ${course.title}`)
  }

  // Show course interface when module is active
  if (showCourseInterface && activeModule) {
    return (
      <CourseInterface
        module={activeModule}
        onExit={handleExitCourse}
        onComplete={handleCompleteModule}
      />
    )
  }

  // Show loading while processing
  if (isLearningProcessing) {
    return <LoadingState message="Generating your personalized learning journey..." />
  }

  // Show empty state if no analysis data
  if (!hasAnalysisData) {
    return (
      <EmptyState 
        icon={Upload}
        title="No Career Data Available"
        message="Upload your CV files and complete the analysis to get personalized learning recommendations tailored to your career goals."
        action={
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Upload Your CV
          </button>
        }
      />
    )
  }

  // Show error state if learning generation failed
  if (isLearningCompleted && !learningContent) {
    return (
      <EmptyState 
        icon={AlertCircle}
        title="Learning Generation Failed"
        message="Unable to generate personalized learning content. Please try re-uploading your files or check if your career analysis is complete."
        action={
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        }
      />
    )
  }

  // Show empty learning state if still processing but no content yet
  if (!learningContent) {
    return (
      <EmptyState 
        icon={Brain}
        title="Learning System Ready"
        message="Your learning recommendations are being generated based on your career analysis. This usually takes a few moments."
        action={
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Generating recommendations...</span>
          </div>
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
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">
            Your Personalized Learning Path
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto px-4">
            AI-generated learning journey tailored to your career goals, skill gaps, and advancement opportunities
          </p>
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-blue-100">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">{learningContent?.personalizedCourses?.length || 0}</div>
              <div className="text-xs sm:text-sm">Custom Courses</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">{learningContent?.learningPath?.modules?.length || 0}</div>
              <div className="text-xs sm:text-sm">Learning Modules</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">100%</div>
              <div className="text-xs sm:text-sm">Personalized</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="px-4 sm:px-0">
        {/* Learning Strategy */}
        {learningContent?.learningStrategy && (
          <LearningStrategyCard strategy={learningContent.learningStrategy} />
        )}

        {/* Learning Path Overview */}
        {learningContent?.learningPath && (
          <LearningPathOverview learningPath={learningContent.learningPath} />
        )}

        {/* Learning Modules */}
        {learningContent?.learningPath?.modules && learningContent.learningPath.modules.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Your Custom Learning Modules
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {learningContent.learningPath.modules.map((module, index) => (
                <ModuleCard
                  key={index}
                  module={module}
                  index={index}
                  onStartModule={handleStartModule}
                  isCompleted={completedModules.has(module.title)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Personalized Courses */}
        {learningContent?.personalizedCourses && learningContent.personalizedCourses.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              Courses That Fill Your Gaps
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {learningContent.personalizedCourses.map((course, index) => (
                <PersonalizedCourseCard
                  key={index}
                  course={course}
                  index={index}
                  onEnrollCourse={handleEnrollCourse}
                />
              ))}
            </div>
          </div>
        )}

        {/* Skill Development Plan */}
        {learningContent?.skillDevelopmentPlan && (
          <SkillDevelopmentPlan skillPlan={learningContent.skillDevelopmentPlan} />
        )}

        {/* Practical Application */}
        {learningContent?.practicalApplication && (
          <PracticalApplicationCard practicalApplication={learningContent.practicalApplication} />
        )}
      </div>
    </motion.div>
  )
}