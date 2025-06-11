// app/dashboard/page.js - Responsive Main Dashboard
'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, FileText, Brain, BarChart3, BookOpen, TestTube, Target, 
  CheckCircle, AlertCircle, Loader, Clock, Users, Building, 
  ArrowRight, Play, Pause, RotateCcw, Download, Activity
} from 'lucide-react'
import { useAnalysis } from './context/AnalysisContext'
import { logger } from '../../utils/Logger'

export default function DashboardPage() {
  const { 
    analysisResults, 
    agentStatus, 
    currentAgent, 
    isProcessing, 
    processAgents,
    clearAnalysisResults,
    resetAgentStatus
  } = useAnalysis()
  
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [processingLog, setProcessingLog] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    logger.componentMount('DashboardPage')
    return () => logger.componentUnmount('DashboardPage')
  }, [])

  const handleFileUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return

    setUploadStatus('uploading')
    setProcessingLog(['📁 Starting file upload...'])

    try {
      const formData = new FormData()
      Array.from(files).forEach((file, index) => {
        formData.append(`file_${index}`, file)
        logger.info('Dashboard', `File ${index + 1}: ${file.name} (${file.size} bytes)`)
      })

      logger.userAction('File Upload Started', { 
        fileCount: files.length,
        fileNames: Array.from(files).map(f => f.name),
        totalSize: Array.from(files).reduce((sum, f) => sum + f.size, 0)
      })

      const uploadResponse = await fetch('/api/process-files', {
        method: 'POST',
        body: formData
      })

      const uploadResult = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'File upload failed')
      }

      logger.success('Dashboard', 'File upload completed successfully')
      setProcessingLog(prev => [...prev, ...uploadResult.processingLog])

      if (uploadResult.ready && uploadResult.extractedContent) {
        setUploadStatus('processing')
        setProcessingLog(prev => [...prev, '🧠 Starting AI agent pipeline...'])

        logger.startPerformance('agent_pipeline')
        
        await processAgents(uploadResult.extractedContent)

        logger.endPerformance('agent_pipeline')
        setUploadStatus('completed')
        setProcessingLog(prev => [...prev, '✅ All agents completed successfully!'])
        
        logger.userAction('Agent Pipeline Completed', {
          completedAgents: Object.values(agentStatus).filter(s => s === 'completed').length
        })
      } else {
        throw new Error('Content extraction failed')
      }

    } catch (error) {
      logger.error('Dashboard', 'Upload failed', error)
      setUploadStatus('error')
      setProcessingLog(prev => [...prev, `❌ Error: ${error.message}`])
      
      logger.userAction('Upload Failed', { error: error.message })
    }
  }, [processAgents, agentStatus])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const files = e.dataTransfer.files
    logger.userAction('Files Dropped', { fileCount: files.length })
    handleFileUpload(files)
  }, [handleFileUpload])

  const handleInputChange = useCallback((e) => {
    const files = e.target.files
    logger.userAction('Files Selected via Input', { fileCount: files.length })
    handleFileUpload(files)
  }, [handleFileUpload])

  const handleClearResults = () => {
    logger.userAction('Clear Results Clicked')
    clearAnalysisResults()
    setUploadStatus(null)
    setProcessingLog([])
  }

  const getAgentStatusIcon = (agentId) => {
    const status = agentStatus[agentId]
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
      case 'processing': return <Loader className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-spin" />
      case 'failed': return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
      case 'pending': return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
      default: return <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full" />
    }
  }

  const getAgentStatusColor = (agentId) => {
    const status = agentStatus[agentId]
    const isActive = currentAgent === agentId
    
    if (isActive && status === 'processing') return 'border-blue-500 bg-blue-50'
    
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-50'
      case 'processing': return 'border-blue-500 bg-blue-50'
      case 'failed': return 'border-red-500 bg-red-50'
      case 'pending': return 'border-gray-300 bg-gray-50'
      default: return 'border-gray-300 bg-white'
    }
  }

  const getAgentStatusText = (agentId) => {
    const status = agentStatus[agentId]
    const isActive = currentAgent === agentId
    
    if (isActive && status === 'processing') return 'Processing...'
    
    switch (status) {
      case 'completed': return 'Completed'
      case 'processing': return 'Processing'
      case 'failed': return 'Failed'
      case 'pending': return 'Pending'
      default: return 'Waiting'
    }
  }

  const agentInfo = [
    { 
      id: 'data-analyst', 
      name: 'Data Analyst AI', 
      description: 'Analyzing CV content and extracting insights',
      icon: Brain,
      order: 1
    },
    { 
      id: 'parser-agent', 
      name: 'Response Parser AI', 
      description: 'Structuring data and identifying patterns',
      icon: FileText,
      order: 2
    },
    { 
      id: 'recommender', 
      name: 'Recommender AI', 
      description: 'Generating career recommendations',
      icon: Target,
      order: 3
    },
    { 
      id: 'visualizer', 
      name: 'Visualizer AI', 
      description: 'Creating data visualizations',
      icon: BarChart3,
      order: 4
    },
    { 
      id: 'learn-agent', 
      name: 'Learning Path AI', 
      description: 'Building personalized learning content',
      icon: BookOpen,
      order: 5
    },
    { 
      id: 'test-agent', 
      name: 'Skills Tester AI', 
      description: 'Generating assessments and tests',
      icon: TestTube,
      order: 6
    }
  ]

  const completedAgents = Object.values(agentStatus).filter(s => s === 'completed').length
  const totalAgents = agentInfo.length
  const progressPercentage = totalAgents > 0 ? (completedAgents / totalAgents) * 100 : 0

  const hasResults = analysisResults?.dataAnalysis || analysisResults?.recommendations

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            AI Career Development Platform
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Upload your CV and let our 6-agent AI system analyze your career sequentially, 
            providing personalized insights and growth strategies.
          </p>
        </motion.div>

        {/* File Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <div
            className={`border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center transition-all ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={(e) => { 
              e.preventDefault(); 
              setDragActive(true);
              logger.debug('Dashboard', 'Drag enter detected');
            }}
            onDragLeave={(e) => { 
              e.preventDefault(); 
              setDragActive(false);
              logger.debug('Dashboard', 'Drag leave detected');
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              Upload Your Career Files
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4 px-2">
              Drag & drop your CV, resume, or performance review files here
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleInputChange}
              className="hidden"
            />
            <button
              onClick={() => {
                logger.userAction('Choose Files Button Clicked')
                fileInputRef.current?.click()
              }}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 cursor-pointer inline-block transition-colors text-sm sm:text-base"
            >
              Choose Files
            </button>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Supports PDF, DOCX, and TXT files
            </p>
          </div>
        </motion.div>

        {/* Sequential Agent Processing Status */}
        {(uploadStatus || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 sm:mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-black">
                {isProcessing ? (
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-500" />
                ) : (
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                )}
                Sequential AI Agent Pipeline
              </h3>
              
              {/* Processing Log */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 max-h-24 sm:max-h-32 overflow-y-auto">
                {processingLog.map((log, index) => (
                  <div key={index} className="text-xs sm:text-sm text-gray-700 mb-1">
                    {log}
                  </div>
                ))}
              </div>

              {/* Sequential Agent Status */}
              <div className="space-y-2 sm:space-y-3">
                {agentInfo.map((agent, index) => {
                  const isActive = currentAgent === agent.id
                  const status = agentStatus[agent.id] || 'pending'
                  const isCompleted = status === 'completed'
                  const isFailed = status === 'failed'
                  const isProcessing = status === 'processing' || isActive
                  const isPending = status === 'pending'

                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${getAgentStatusColor(agent.id)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                          <div className="relative flex-shrink-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center border-2">
                              <agent.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                            </div>
                            <div className="absolute -top-1 -right-1">
                              {getAgentStatusIcon(agent.id)}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                              <span className="truncate">
                                {agent.order}. {agent.name}
                              </span>
                              {isActive && isProcessing && (
                                <span className="text-blue-600 text-xs sm:text-sm font-normal animate-pulse hidden sm:inline">
                                  (Processing...)
                                </span>
                              )}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{agent.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs sm:text-sm font-medium ${
                            isCompleted ? 'text-green-600' :
                            isFailed ? 'text-red-600' :
                            isProcessing ? 'text-blue-600' :
                            'text-gray-500'
                          }`}>
                            {getAgentStatusText(agent.id)}
                          </span>
                        </div>
                      </div>

                      {/* Progress indicator for current agent */}
                      {isActive && isProcessing && (
                        <div className="mt-3">
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Overall Progress */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">Overall Progress</span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {completedAgents} / {totalAgents} Completed ({Math.round(progressPercentage)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Navigation */}
        {hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                Analysis Complete - Explore Your Results
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <a
                  href="/dashboard/analysis"
                  onClick={() => logger.userAction('Navigate to Analysis')}
                  className="p-3 sm:p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Career Analysis</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    View AI-parsed skills, experience, and career insights
                  </p>
                  <div className="text-blue-600 text-xs sm:text-sm group-hover:underline flex items-center gap-1">
                    Explore Analysis <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </a>

                <a
                  href="/dashboard/recommendations"
                  onClick={() => logger.userAction('Navigate to Recommendations')}
                  className="p-3 sm:p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Recommendations</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    Personalized growth plans and career switching options
                  </p>
                  <div className="text-green-600 text-xs sm:text-sm group-hover:underline flex items-center gap-1">
                    View Recommendations <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </a>

                <a
                  href="/dashboard/visualizations"
                  onClick={() => logger.userAction('Navigate to Visualizations')}
                  className="p-3 sm:p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Visualizations</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    Interactive charts and career progression insights
                  </p>
                  <div className="text-purple-600 text-xs sm:text-sm group-hover:underline flex items-center gap-1">
                    See Visualizations <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </a>

                <a
                  href="/dashboard/learn"
                  onClick={() => logger.userAction('Navigate to Learning')}
                  className="p-3 sm:p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Learning Path</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    AI-generated courses and skill development modules
                  </p>
                  <div className="text-orange-600 text-xs sm:text-sm group-hover:underline flex items-center gap-1">
                    Start Learning <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </a>

                <a
                  href="/dashboard/test"
                  onClick={() => logger.userAction('Navigate to Testing')}
                  className="p-3 sm:p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TestTube className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Skills Testing</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    Validate your skills and identify knowledge gaps
                  </p>
                  <div className="text-red-600 text-xs sm:text-sm group-hover:underline flex items-center gap-1">
                    Take Tests <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </a>

                <button
                  onClick={handleClearResults}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Start Over</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    Clear data and upload new files
                  </p>
                  <div className="text-gray-600 text-xs sm:text-sm group-hover:underline flex items-center gap-1">
                    New Analysis <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Getting Started Guide */}
        {!hasResults && !uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">
              How The Sequential AI Pipeline Works
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">1. Upload Files</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Upload your CV, resume, or performance reviews in PDF, DOCX, or TXT format
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">2. Sequential Processing</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  6 AI agents process your data sequentially: Analyst → Parser → Recommender → Visualizer → Learning → Testing
                </p>
              </div>

              <div className="text-center md:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">3. Get Comprehensive Insights</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Receive personalized recommendations, learning paths, assessments, and growth strategies
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">🚀 What Makes This Special</h4>
              <ul className="text-blue-800 text-xs sm:text-sm space-y-1">
                <li>• <strong>Sequential Processing:</strong> Each agent builds on the previous one's work</li>
                <li>• <strong>No Hardcoded Data:</strong> Everything is dynamically generated by AI</li>
                <li>• <strong>Smart Caching:</strong> Results are cached to avoid reprocessing</li>
                <li>• <strong>Real Course Search:</strong> Finds actual courses from Coursera, Udemy, edX</li>
                <li>• <strong>Career Switching Analysis:</strong> Identifies alternative career paths</li>
                <li>• <strong>Visual Progress Tracking:</strong> See exactly which agent is working</li>
                <li>• <strong>Enhanced Debug System:</strong> Complete logging and monitoring</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}