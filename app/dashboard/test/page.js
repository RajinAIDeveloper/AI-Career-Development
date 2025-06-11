// app/dashboard/test/page.js - Performance Optimized Version
'use client'
import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TestTube, CheckCircle, XCircle, Award, Clock, RotateCcw, 
  Target, AlertCircle, BookOpen, Users, Briefcase, Brain,
  Star, Play, Pause, ChevronRight, FileText, Loader,
  TrendingUp, Code, MessageSquare, Lightbulb, Trophy,
  Zap, Plus, BarChart3, Calendar, ArrowRight, RefreshCw,
  Sparkles, Shield, Activity, Download, Share
} from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext'
import { logger } from '../../../utils/Logger'

// Memoized LoadingState component
const LoadingState = memo(({ message }) => {
  const loadingAnimation = useMemo(() => ({
    animate: { rotate: 360 },
    transition: { duration: 2, repeat: Infinity, ease: "linear" }
  }), [])

  const dotAnimation = useMemo(() => (i) => ({
    animate: { y: [-8, 0, -8] },
    transition: { duration: 1.5, repeat: Infinity, delay: i * 0.2 }
  }), [])

  return (
    <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
      <motion.div
        {...loadingAnimation}
        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-4 sm:mb-6"
      >
        <Brain className="w-full h-full text-blue-600" />
      </motion.div>
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">AI Assessment Engine</h2>
      <p className="text-gray-500 text-sm sm:text-base lg:text-lg px-2">{message}</p>
      <div className="mt-4 sm:mt-6 flex justify-center space-x-1 sm:space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full"
            {...dotAnimation(i)}
          />
        ))}
      </div>
    </div>
  )
})

// Memoized EmptyState component
const EmptyState = memo(({ icon: Icon, title, message, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12 sm:py-16 lg:py-20 px-4"
  >
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-6 sm:mb-8 flex items-center justify-center">
      <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />
    </div>
    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">{title}</h2>
    <p className="text-gray-600 max-w-lg mx-auto text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 px-4">{message}</p>
    {action}
  </motion.div>
))

// Memoized AssessmentOverview component
const AssessmentOverview = memo(({ overview, onStartAssessment }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-200 mb-6 sm:mb-8"
  >
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3 mb-4 sm:mb-6">
      <div className="p-2 sm:p-3 bg-blue-600 rounded-lg sm:rounded-xl self-start">
        <TestTube className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
      </div>
      <div className="flex-1">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Personalized Skills Assessment</h2>
        <p className="text-blue-600 font-medium text-sm sm:text-base">Tailored to your career profile and goals</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
      <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
          <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
          Assessment Focus
        </h3>
        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{overview.assessmentFocus}</p>
      </div>
      <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
          <Award className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
          Career Relevance
        </h3>
        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{overview.careerRelevance}</p>
      </div>
    </div>

    <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100 mb-4 sm:mb-6">
      <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
        Skills Being Assessed
      </h3>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {overview.targetedSkills?.map((skill, index) => (
          <span key={index} className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm rounded-full font-medium">
            {skill}
          </span>
        ))}
      </div>
    </div>

    <button
      onClick={onStartAssessment}
      className="w-full bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg"
    >
      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
      Start Personalized Assessment
    </button>
  </motion.div>
))

// Memoized MCQQuestion component
const MCQQuestion = memo(({ question, questionIndex, totalQuestions, selectedAnswer, onAnswerSelect, showResult, timeLeft }) => {
  const isCorrect = useMemo(() => selectedAnswer === question.correctAnswer, [selectedAnswer, question.correctAnswer])

  const getOptionClassName = useCallback((optionIndex) => {
    let baseClass = "w-full p-3 sm:p-4 text-left rounded-lg border transition-all cursor-pointer text-sm sm:text-base"
    
    if (!showResult) {
      return `${baseClass} ${selectedAnswer === optionIndex 
        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' 
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`
    }
    
    if (optionIndex === question.correctAnswer) {
      return `${baseClass} border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200`
    }
    if (optionIndex === selectedAnswer && !isCorrect) {
      return `${baseClass} border-red-500 bg-red-50 text-red-700 ring-2 ring-red-200`
    }
    return `${baseClass} border-gray-200 bg-gray-50 text-gray-500`
  }, [showResult, selectedAnswer, question.correctAnswer, isCorrect])

  const formattedTime = useMemo(() => {
    if (timeLeft === null) return null
    return `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
  }, [timeLeft])

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-sm sm:text-base">
            {questionIndex + 1}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Question {questionIndex + 1} of {totalQuestions}
            </h3>
            {question.skillLevel && (
              <p className="text-xs sm:text-sm text-gray-500">
                Skill Level: {question.skillLevel}
              </p>
            )}
          </div>
        </div>
        
        {timeLeft !== null && (
          <div className="flex items-center gap-2 text-xs sm:text-sm bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
            <span className={`font-medium ${timeLeft < 30 ? 'text-red-600' : 'text-gray-600'}`}>
              {formattedTime}
            </span>
          </div>
        )}
      </div>

      <div className="mb-4 sm:mb-6">
        <h4 className="text-lg sm:text-xl font-medium text-gray-900 leading-relaxed mb-3 sm:mb-4">
          {question.question}
        </h4>
        {question.careerContext && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
              <strong>Career Context:</strong> {question.careerContext}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {question.options?.map((option, optionIndex) => (
          <button
            key={optionIndex}
            onClick={() => !showResult && onAnswerSelect(optionIndex)}
            className={getOptionClassName(optionIndex)}
            disabled={showResult}
          >
            <div className="flex items-start gap-2 sm:gap-3 text-black">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-medium mt-0.5">
                {String.fromCharCode(65 + optionIndex)}
              </span>
              <span className="text-xs sm:text-sm leading-relaxed flex-1">{option}</span>
              {showResult && optionIndex === question.correctAnswer && (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 ml-auto flex-shrink-0" />
              )}
              {showResult && optionIndex === selectedAnswer && !isCorrect && (
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 ml-auto flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <div className={`p-3 sm:p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h4 className={`font-medium mb-2 flex items-center gap-2 text-sm sm:text-base ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {question.explanation}
                </p>
              </div>

              <div className="mt-3 sm:mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {question.commonMistakes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h5 className="font-medium text-yellow-800 text-xs sm:text-sm mb-1">Common Mistakes</h5>
                    <ul className="text-yellow-700 text-xs space-y-1">
                      {question.commonMistakes.map((mistake, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-yellow-500 flex-shrink-0">•</span>
                          <span className="leading-relaxed">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {question.furtherReading && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <h5 className="font-medium text-indigo-800 text-xs sm:text-sm mb-1">Further Reading</h5>
                    <ul className="text-indigo-700 text-xs space-y-1">
                      {question.furtherReading.map((resource, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <BookOpen className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

// Memoized AssessmentResults component
const AssessmentResults = memo(({ results, onRetakeTest, onGenerateMore, onViewLearning }) => {
  const { score, total, answers, performanceAnalysis, gapAnalysis, recommendations } = results
  const percentage = useMemo(() => Math.round((score / total) * 100), [score, total])
  
  const performance = useMemo(() => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100', desc: 'Outstanding performance!' }
    if (percentage >= 70) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100', desc: 'Strong understanding with minor gaps' }
    if (percentage >= 50) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100', desc: 'Basic knowledge, improvement needed' }
    return { level: 'Needs Work', color: 'text-red-600', bg: 'bg-red-100', desc: 'Significant gaps require attention' }
  }, [percentage])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 sm:space-y-8"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        <div className="mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
          <p className="text-gray-600 text-sm sm:text-base">Your personalized performance analysis</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{score}/{total}</div>
            <div className="text-gray-600 text-xs sm:text-sm">Questions Correct</div>
          </div>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{percentage}%</div>
            <div className="text-gray-600 text-xs sm:text-sm">Overall Score</div>
          </div>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
            <div className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 ${performance.color}`}>{performance.level}</div>
            <div className="text-gray-600 text-xs sm:text-sm">{performance.desc}</div>
          </div>
        </div>
      </div>

      {performanceAnalysis && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Performance Analysis
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4" />
                  Strengths Confirmed
                </h4>
                <ul className="text-green-700 text-xs sm:text-sm space-y-1">
                  {performanceAnalysis.strengths?.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Star className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <AlertCircle className="w-4 h-4" />
                  Areas for Improvement
                </h4>
                <ul className="text-red-700 text-xs sm:text-sm space-y-1">
                  {performanceAnalysis.weaknesses?.map((weakness, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Target className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {gapAnalysis && gapAnalysis.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            Skill Gap Analysis
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            {gapAnalysis.map((gap, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{gap.skill}</h4>
                  <span className={`px-2 sm:px-3 py-1 text-xs rounded-full font-medium self-start ${
                    gap.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                    gap.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {gap.priority} Priority
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed">{gap.description}</p>
                <p className="text-blue-600 text-xs sm:text-sm font-medium leading-relaxed">{gap.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <button
          onClick={onRetakeTest}
          className="bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          Retake Assessment
        </button>
        
        <button
          onClick={onGenerateMore}
          className="bg-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Generate More Tests
        </button>
        
        <button
          onClick={onViewLearning}
          className="bg-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          View Learning Path
        </button>
      </div>
    </motion.div>
  )
})

// Memoized DailyPracticeCard component
const DailyPracticeCard = memo(({ onStartPractice, practiceStats }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200"
  >
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-2 sm:p-3 bg-green-600 rounded-lg sm:rounded-xl">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Daily Practice</h3>
          <p className="text-green-600 font-medium text-xs sm:text-sm">Keep your skills sharp</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{practiceStats?.streak || 0}</div>
        <div className="text-xs sm:text-sm text-green-700">Day Streak</div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="bg-white p-2.5 sm:p-3 rounded-lg">
        <div className="text-base sm:text-lg font-bold text-gray-900">{practiceStats?.questionsToday || 0}</div>
        <div className="text-xs sm:text-sm text-gray-600">Questions Today</div>
      </div>
      <div className="bg-white p-2.5 sm:p-3 rounded-lg">
        <div className="text-base sm:text-lg font-bold text-gray-900">{practiceStats?.avgScore || 0}%</div>
        <div className="text-xs sm:text-sm text-gray-600">Avg Score</div>
      </div>
    </div>

    <button
      onClick={onStartPractice}
      className="w-full bg-green-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
    >
      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
      Start Daily Practice
    </button>
  </motion.div>
))

// Memoized QuickActionButton component
const QuickActionButton = memo(({ icon: Icon, title, description, color, onClick }) => (
  <button
    onClick={onClick}
    className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
  >
    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color} flex-shrink-0`} />
      <span className="font-medium text-gray-900 text-sm sm:text-base">{title}</span>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{description}</p>
  </button>
))

// Main component
export default function EnhancedTestPage() {
  const { analysisResults, agentStatus, parsedData } = useAnalysis()
  const [testContent, setTestContent] = useState(null)
  const [isGeneratingTest, setIsGeneratingTest] = useState(false)
  const [activeTest, setActiveTest] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)

  // Memoized practice stats
  const practiceStats = useMemo(() => ({
    streak: 7,
    questionsToday: 12,
    avgScore: 78
  }), [])

  // Memoized derived values
  const isTestProcessing = useMemo(() => agentStatus?.['test-agent'] === 'processing', [agentStatus])
  const hasAnalysisData = useMemo(() => !!parsedData?.analysis, [parsedData])

  // Component mount logging
  useEffect(() => {
    logger.componentMount('EnhancedTestPage')
    return () => {
      logger.componentUnmount('EnhancedTestPage')
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Optimized timer effect
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    if (timeLeft > 0 && activeTest && !showResult) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && !showResult) {
      handleNextQuestion()
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [timeLeft, activeTest, showResult])

  // Memoized API call function
  const generateTest = useCallback(async (testType = 'comprehensive', difficulty = 'mixed') => {
    if (!parsedData?.analysis) {
      logger.error('TestPage', 'No parsed data available for test generation')
      setError('No analysis data available. Please complete CV analysis first.')
      return
    }

    logger.info('TestPage', `Generating test: ${testType} (${difficulty})`)
    setIsGeneratingTest(true)
    setError(null)

    try {
      const response = await fetch('/api/agents/test-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          parsedData: parsedData.analysis,
          testType,
          difficulty
        })
      })

      if (response.ok) {
        const newTestContent = await response.json()
        
        if (!newTestContent.assessmentOverview && !newTestContent.skillValidationTests) {
          throw new Error('Invalid test content structure received')
        }
        
        setTestContent(newTestContent)
        logger.success('TestPage', `Test content generated: ${Object.keys(newTestContent)}`)
        
        if (newTestContent.error) {
          logger.warn('TestPage', `API warning: ${newTestContent.error}`)
        }
        
      } else {
        const errorData = await response.json().catch(() => ({}))
        
        if (response.status === 503) {
          setError(`Service temporarily unavailable. Please wait ${errorData.retryAfter || 60} seconds and try again.`)
        } else if (response.status === 429) {
          setError('Rate limit exceeded. Please wait a moment and try again.')
        } else {
          setError(errorData.details || `Server error: ${response.status}`)
        }
        
        logger.error('TestPage', `Test generation failed: ${response.status}`, errorData)
      }
    } catch (error) {
      logger.error('TestPage', 'Test generation error', error)
      setError(`Failed to generate test: ${error.message}`)
    } finally {
      setIsGeneratingTest(false)
    }
  }, [parsedData])

  const startAssessment = useCallback((test) => {
    if (!test || !test.questions || test.questions.length === 0) {
      logger.error('TestPage', 'Invalid test data provided to startAssessment', { test })
      setError('Invalid test data. Please generate a new test.')
      return
    }
    
    logger.info('TestPage', `Starting assessment: ${test.skillArea || 'General'} (${test.questions.length} questions)`)
    
    setActiveTest(test)
    setCurrentQuestionIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowResult(false)
    setTestResults(null)
    setError(null)
    
    if (test.timeLimit) {
      const timeInSeconds = parseInt(test.timeLimit) * 60
      setTimeLeft(timeInSeconds)
      logger.debug('TestPage', `Timer set to ${timeInSeconds} seconds`)
    }
  }, [])

  const handleAnswerSelect = useCallback((answerIndex) => {
    setSelectedAnswer(answerIndex)
  }, [])

  const handleNextQuestion = useCallback(() => {
    if (!activeTest || !activeTest.questions) return
    
    const currentQuestion = activeTest.questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    
    const newAnswer = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      question: currentQuestion
    }

    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)
    setShowResult(true)

    setTimeout(() => {
      if (currentQuestionIndex + 1 < activeTest.questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        completeTest(newAnswers)
      }
    }, 2000)
  }, [activeTest, currentQuestionIndex, selectedAnswer, answers])

  const completeTest = useCallback((finalAnswers) => {
    const score = finalAnswers.filter(a => a.isCorrect).length
    const total = finalAnswers.length
    
    const performanceAnalysis = {
      strengths: finalAnswers
        .filter(a => a.isCorrect)
        .map(a => a.question.skillLevel || 'General Knowledge')
        .filter((value, index, self) => self.indexOf(value) === index)
        .slice(0, 3),
      weaknesses: finalAnswers
        .filter(a => !a.isCorrect)
        .map(a => a.question.skillLevel || 'General Knowledge')
        .filter((value, index, self) => self.indexOf(value) === index)
        .slice(0, 3)
    }

    const gapAnalysis = finalAnswers
      .filter(a => !a.isCorrect)
      .map(a => ({
        skill: a.question.skillLevel || 'General Knowledge',
        priority: 'High',
        description: `Missed question about ${a.question.skillLevel || 'this topic'}`,
        recommendation: `Focus on improving ${a.question.skillLevel || 'this area'} through targeted practice`
      }))
      .slice(0, 3)

    setTestResults({
      score,
      total,
      answers: finalAnswers,
      performanceAnalysis,
      gapAnalysis,
      recommendations: ['Practice daily', 'Focus on weak areas', 'Take advanced courses']
    })
    setActiveTest(null)
  }, [])

  const handleRetakeTest = useCallback(() => {
    setTestResults(null)
    if (testContent?.skillValidationTests?.length > 0) {
      startAssessment(testContent.skillValidationTests[0])
    }
  }, [testContent, startAssessment])

  const handleGenerateMore = useCallback(() => {
    generateTest('daily_practice', 'mixed')
  }, [generateTest])

  const handleViewLearning = useCallback(() => {
    window.location.href = '/dashboard/learn'
  }, [])

  const handleStartPractice = useCallback(() => {
    generateTest('daily_practice', 'beginner')
  }, [generateTest])

  // Memoized quick action configurations
  const quickActions = useMemo(() => [
    {
      icon: Shield,
      title: 'Skill Validation',
      description: 'Test your claimed technical skills',
      color: 'text-blue-600',
      onClick: () => generateTest('skill_validation', 'intermediate')
    },
    {
      icon: Target,
      title: 'Gap Assessment',
      description: 'Identify knowledge gaps',
      color: 'text-orange-600',
      onClick: () => generateTest('gap_assessment', 'mixed')
    },
    {
      icon: Users,
      title: 'Interview Prep',
      description: 'Practice interview questions',
      color: 'text-purple-600',
      onClick: () => generateTest('interview_prep', 'advanced')
    },
    {
      icon: Activity,
      title: 'Quick Practice',
      description: '5-minute skill refresher',
      color: 'text-green-600',
      onClick: () => generateTest('daily_practice', 'beginner')
    }
  ], [generateTest])

  // Loading state
  if (isTestProcessing || isGeneratingTest) {
    return <LoadingState message={isGeneratingTest ? "Generating personalized assessment questions..." : "Creating skill validation tests and practice exercises..."} />
  }

  // Error state
  if (error) {
    return (
      <EmptyState 
        icon={AlertCircle}
        title="Something went wrong"
        message={error}
        action={
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={() => setError(null)}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
            >
              Try Again
            </button>
            <p className="text-xs sm:text-sm text-gray-500 px-4">
              If the problem persists, please refresh the page or contact support.
            </p>
          </div>
        }
      />
    )
  }

  // No analysis data available
  if (!hasAnalysisData) {
    return (
      <EmptyState 
        icon={TestTube}
        title="Upload Your CV to Get Started"
        message="Upload your CV files and complete the analysis to get personalized skill assessments and daily practice questions."
        action={
          <motion.a 
            href="/dashboard"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Go to Dashboard
          </motion.a>
        }
      />
    )
  }

  // Show test results
  if (testResults) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 sm:space-y-6"
      >
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Assessment Results</h1>
          <p className="text-gray-600 text-sm sm:text-base">Your performance analysis and improvement recommendations</p>
        </div>
        
        <AssessmentResults
          results={testResults}
          onRetakeTest={handleRetakeTest}
          onGenerateMore={handleGenerateMore}
          onViewLearning={handleViewLearning}
        />
      </motion.div>
    )
  }

  // Show active test
  if (activeTest) {
    const currentQuestion = activeTest.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / activeTest.questions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Skills Assessment</h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {activeTest.questions.length}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-xs sm:text-sm text-gray-600">
                  {Math.round(progress)}% Complete
                </div>
                <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <MCQQuestion
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={activeTest.questions.length}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showResult={showResult}
            timeLeft={timeLeft}
          />

          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null || showResult}
              className="bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 text-sm sm:text-base"
            >
              {currentQuestionIndex === activeTest.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main test dashboard
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 sm:space-y-8"
    >
      <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            Personalized Skills Assessment
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-blue-100 max-w-3xl mx-auto px-2">
            AI-generated assessments tailored to your career profile, skill gaps, and advancement goals
          </p>
          <div className="mt-4 sm:mt-6 flex justify-center space-x-4 sm:space-x-8 text-blue-100">
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">Daily</div>
              <div className="text-xs sm:text-sm">Practice</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">100%</div>
              <div className="text-xs sm:text-sm">Personalized</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">AI</div>
              <div className="text-xs sm:text-sm">Generated</div>
            </div>
          </div>
        </motion.div>
      </div>

      {!testContent && (
        <div className="text-center px-4">
          <button
            onClick={() => generateTest()}
            disabled={isGeneratingTest}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold text-sm sm:text-base lg:text-lg flex items-center gap-2 sm:gap-3 mx-auto"
          >
            {isGeneratingTest ? (
              <>
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Generating Assessment...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 sm:w-5 sm:h-5" />
                Generate Personalized Assessment
              </>
            )}
          </button>
        </div>
      )}

      {testContent?.assessmentOverview && (
        <AssessmentOverview
          overview={testContent.assessmentOverview}
          onStartAssessment={() => {
            if (testContent.skillValidationTests?.length > 0) {
              startAssessment(testContent.skillValidationTests[0])
            }
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <DailyPracticeCard
            onStartPractice={handleStartPractice}
            practiceStats={practiceStats}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {quickActions.map((action, index) => (
                <QuickActionButton key={index} {...action} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}