// app/dashboard/context/AnalysisContext.js
'use client'
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { logger } from '../../../utils/Logger'

const AnalysisContext = createContext(undefined)

export const useAnalysis = () => {
  const context = useContext(AnalysisContext)
  if (context === undefined) {
    throw new Error('useAnalysis must be used within AnalysisProvider')
  }
  return context
}

const INITIAL_AGENT_STATUS = {
  'data-analyst': 'pending',
  'parser-agent': 'pending', 
  'recommender': 'pending',
  'visualizer': 'pending',
  'learn-agent': 'pending',
  'test-agent': 'pending'
}

const INITIAL_PARSED_DATA = {
  analysis: null,
  recommendations: null,
  cacheKeys: {
    analysis: null,
    recommendations: null
  }
}

export const AnalysisProvider = ({ children }) => {
  const [analysisResults, setAnalysisResults] = useState(null)
  const [agentStatus, setAgentStatus] = useState(INITIAL_AGENT_STATUS)
  const [currentAgent, setCurrentAgent] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState(INITIAL_PARSED_DATA)

  // Memoized localStorage operations
  const saveToLocalStorage = useCallback(async (key, data) => {
    if (typeof window === 'undefined') return
    
    try {
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(data))
        logger.debug('AnalysisContext', `Data saved to localStorage: ${key}`)
      }, 0)
    } catch (error) {
      logger.error('AnalysisContext', `Error saving to localStorage: ${key}`, error)
    }
  }, [])

  const loadFromLocalStorage = useCallback((key) => {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      logger.error('AnalysisContext', `Error loading from localStorage: ${key}`, error)
      return null
    }
  }, [])

  // Content hash generation for caching
  const generateCacheKey = useCallback((text) => {
    if (!text) return null
    
    let hash = 0
    const str = text.trim().toLowerCase()
    
    for (let i = 0; i < Math.min(str.length, 500); i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    
    const key = `${hash}_${str.length}_${str.substring(0, 50).replace(/\s/g, '')}`
    return key
  }, [])

  // Load initial data from localStorage
  useEffect(() => {
    const loadInitialData = async () => {
      logger.componentMount('AnalysisProvider')
      
      try {
        const [storedResults, storedStatus, storedParsed] = await Promise.all([
          loadFromLocalStorage('analysisResults'),
          loadFromLocalStorage('agentStatus'), 
          loadFromLocalStorage('parsedData')
        ])
        
        if (storedResults) {
          setAnalysisResults(storedResults)
          logger.info('AnalysisContext', 'Analysis results loaded from cache')
        }
        
        if (storedStatus) {
          setAgentStatus(prev => ({ ...prev, ...storedStatus }))
          logger.info('AnalysisContext', 'Agent status loaded from cache')
        }
        
        if (storedParsed) {
          setParsedData(prev => ({ ...prev, ...storedParsed }))
          logger.info('AnalysisContext', 'Parsed data loaded from cache')
        }
        
      } catch (error) {
        logger.error('AnalysisContext', 'Error loading cached data', error)
      }
    }

    loadInitialData()

    return () => {
      logger.componentUnmount('AnalysisProvider')
    }
  }, [loadFromLocalStorage])

  // Sequential agent processing
  const processAgents = useCallback(async (fileContent) => {
    if (!fileContent || fileContent.length < 100) {
      logger.error('AnalysisContext', 'Insufficient file content for processing')
      return
    }

    setIsProcessing(true)
    logger.startPerformance('fullAgentPipeline')

    try {
      // Reset all statuses
      setAgentStatus(INITIAL_AGENT_STATUS)
      setParsedData(INITIAL_PARSED_DATA)

      let currentResults = {
        dataAnalysis: null,
        recommendations: null,
        summary: null,
        visualizations: null,
        learningContent: null,
        testContent: null
      }

      // Step 1: Data Analyst (Critical - must succeed)
      logger.agentStart('data-analyst', 'CV Analysis')
      setCurrentAgent('data-analyst')
      setAgentStatus(prev => ({ ...prev, 'data-analyst': 'processing' }))

      const dataAnalysisResponse = await fetch('/api/agents/data-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fileContent })
      })

      if (!dataAnalysisResponse.ok) {
        throw new Error('Data Analyst failed - pipeline cannot continue')
      }

      const dataAnalysis = await dataAnalysisResponse.json()
      currentResults.dataAnalysis = dataAnalysis.analysis || dataAnalysis

      setAnalysisResults({ ...currentResults })
      setAgentStatus(prev => ({ ...prev, 'data-analyst': 'completed' }))
      logger.agentSuccess('data-analyst', 'CV Analysis')
      await saveToLocalStorage('analysisResults', currentResults)

      // Step 2: Parser Agent (Critical - must succeed)
      logger.agentStart('parser-agent', 'Data Parsing')
      setCurrentAgent('parser-agent')
      setAgentStatus(prev => ({ ...prev, 'parser-agent': 'processing' }))

      const parserResponse = await fetch('/api/agents/parser-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawAnalysis: dataAnalysis })
      })

      if (!parserResponse.ok) {
        throw new Error('Parser Agent failed - pipeline cannot continue')
      }

      const parsedResult = await parserResponse.json()
      
      const newParsedData = {
        analysis: parsedResult,
        recommendations: null,
        cacheKeys: {
          analysis: generateCacheKey(dataAnalysis.analysis || dataAnalysis),
          recommendations: null
        }
      }

      setParsedData(newParsedData)
      setAgentStatus(prev => ({ ...prev, 'parser-agent': 'completed' }))
      logger.agentSuccess('parser-agent', 'Data Parsing')
      await saveToLocalStorage('parsedData', newParsedData)

      // Step 3: Recommender Agent (Optional - can fail)
      logger.agentStart('recommender', 'Recommendations Generation')
      setCurrentAgent('recommender')
      setAgentStatus(prev => ({ ...prev, 'recommender': 'processing' }))

      try {
        const recommenderResponse = await fetch('/api/agents/recommender', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parsedData: parsedResult })
        })

        if (!recommenderResponse.ok) {
          const errorData = await recommenderResponse.json().catch(() => ({}))
          if (recommenderResponse.status === 429 || errorData.error?.includes('rate limited')) {
            logger.warn('AnalysisContext', 'Recommender rate limited, continuing pipeline')
            setAgentStatus(prev => ({ ...prev, 'recommender': 'failed' }))
            currentResults.recommendations = { error: 'Rate limited - please try again later' }
          } else {
            throw new Error('Recommender Agent failed')
          }
        } else {
          const recommendations = await recommenderResponse.json()
          currentResults.recommendations = recommendations
          setAgentStatus(prev => ({ ...prev, 'recommender': 'completed' }))
          logger.agentSuccess('recommender', 'Recommendations Generation')
        }
      } catch (error) {
        logger.agentError('recommender', error)
        setAgentStatus(prev => ({ ...prev, 'recommender': 'failed' }))
        currentResults.recommendations = { error: 'Agent failed', details: error.message }
      }

      setAnalysisResults({ ...currentResults })
      await saveToLocalStorage('analysisResults', currentResults)

      // Step 4: Visualizer Agent (Optional - can fail)
      logger.agentStart('visualizer', 'Data Visualization')
      setCurrentAgent('visualizer')
      setAgentStatus(prev => ({ ...prev, 'visualizer': 'processing' }))

      try {
        const visualizerResponse = await fetch('/api/agents/visualizer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawAnalysis: dataAnalysis, parsedData: parsedResult })
        })

        if (visualizerResponse.ok) {
          const visualizations = await visualizerResponse.json()
          currentResults.visualizations = visualizations
          setAgentStatus(prev => ({ ...prev, 'visualizer': 'completed' }))
          logger.agentSuccess('visualizer', 'Data Visualization')
        } else {
          throw new Error('Visualizer Agent failed')
        }
      } catch (error) {
        logger.agentError('visualizer', error)
        setAgentStatus(prev => ({ ...prev, 'visualizer': 'failed' }))
        currentResults.visualizations = { error: 'Agent failed', details: error.message }
      }

      setAnalysisResults({ ...currentResults })
      await saveToLocalStorage('analysisResults', currentResults)

      // Step 5: Learning Agent (Optional - can fail)
      logger.agentStart('learn-agent', 'Learning Content Generation')
      setCurrentAgent('learn-agent')
      setAgentStatus(prev => ({ ...prev, 'learn-agent': 'processing' }))

      try {
        const learningResponse = await fetch('/api/agents/learn-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parsedData: parsedResult })
        })

        if (learningResponse.ok) {
          const learningContent = await learningResponse.json()
          currentResults.learningContent = learningContent
          setAgentStatus(prev => ({ ...prev, 'learn-agent': 'completed' }))
          logger.agentSuccess('learn-agent', 'Learning Content Generation')
        } else {
          throw new Error('Learning Agent failed')
        }
      } catch (error) {
        logger.agentError('learn-agent', error)
        setAgentStatus(prev => ({ ...prev, 'learn-agent': 'failed' }))
        currentResults.learningContent = { error: 'Agent failed', details: error.message }
      }

      setAnalysisResults({ ...currentResults })
      await saveToLocalStorage('analysisResults', currentResults)

      // Step 6: Test Agent (Optional - can fail)
      logger.agentStart('test-agent', 'Test Content Generation')
      setCurrentAgent('test-agent')
      setAgentStatus(prev => ({ ...prev, 'test-agent': 'processing' }))

      try {
        const testResponse = await fetch('/api/agents/test-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parsedData: parsedResult })
        })

        if (testResponse.ok) {
          const testContent = await testResponse.json()
          currentResults.testContent = testContent
          setAgentStatus(prev => ({ ...prev, 'test-agent': 'completed' }))
          logger.agentSuccess('test-agent', 'Test Content Generation')
        } else {
          throw new Error('Test Agent failed')
        }
      } catch (error) {
        logger.agentError('test-agent', error)
        setAgentStatus(prev => ({ ...prev, 'test-agent': 'failed' }))
        currentResults.testContent = { error: 'Agent failed', details: error.message }
      }

      setAnalysisResults({ ...currentResults })
      await saveToLocalStorage('analysisResults', currentResults)

      // Save final status after all agents complete
      setAgentStatus(currentStatus => {
        saveToLocalStorage('agentStatus', currentStatus)
        return currentStatus
      })
      
      logger.success('AnalysisContext', 'Agent pipeline completed')

    } catch (error) {
      logger.error('AnalysisContext', 'Critical agent pipeline failure', error)
      setAgentStatus(prev => ({ 
        ...prev, 
        [currentAgent]: 'failed' 
      }))
      throw error
    } finally {
      setCurrentAgent(null)
      setIsProcessing(false)
      logger.endPerformance('fullAgentPipeline')
    }
  }, [generateCacheKey, saveToLocalStorage])

  const updateAnalysisResults = useCallback((data) => {
    logger.stateChange('AnalysisResults', analysisResults, data)
    setAnalysisResults(data)
    saveToLocalStorage('analysisResults', data)
  }, [analysisResults, saveToLocalStorage])

  const updateAgentStatus = useCallback((agentId, status) => {
    logger.info('AnalysisContext', `Agent status update: ${agentId} -> ${status}`)
    
    setAgentStatus(prev => {
      const newStatus = { ...prev, [agentId]: status }
      saveToLocalStorage('agentStatus', newStatus)
      return newStatus
    })
  }, [saveToLocalStorage])

  const resetAgentStatus = useCallback(() => {
    logger.info('AnalysisContext', 'Resetting all agent statuses')
    setAgentStatus(INITIAL_AGENT_STATUS)
    setCurrentAgent(null)
    setParsedData(INITIAL_PARSED_DATA)
    
    Promise.all([
      saveToLocalStorage('agentStatus', INITIAL_AGENT_STATUS),
      localStorage.removeItem('parsedData')
    ])
  }, [saveToLocalStorage])

  const clearAnalysisResults = useCallback(() => {
    logger.info('AnalysisContext', 'Clearing all analysis data')
    setAnalysisResults(null)
    setParsedData(INITIAL_PARSED_DATA)
    setAgentStatus(INITIAL_AGENT_STATUS)
    setCurrentAgent(null)
    
    ['analysisResults', 'agentStatus', 'parsedData'].forEach(key => {
      localStorage.removeItem(key)
    })
  }, [])

  // Check if parsing is needed
  const needsParsing = useCallback((analysisText, parseType) => {
    if (!analysisText || !parseType) return false
    
    const existingData = parsedData[parseType]
    const cacheKey = generateCacheKey(analysisText)
    const storedCacheKey = parsedData.cacheKeys?.[parseType]
    
    return !existingData || cacheKey !== storedCacheKey
  }, [parsedData, generateCacheKey])

  const parseAnalysisData = useCallback(async (analysisText, parseType) => {
    if (!needsParsing(analysisText, parseType)) {
      return parsedData[parseType]
    }
    
    try {
      const response = await fetch('/api/parse-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisText, parseType })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const parsedResult = await response.json()
      
      if (parsedResult && !parsedResult.error) {
        const cacheKey = generateCacheKey(analysisText)
        const newParsedData = { 
          ...parsedData, 
          [parseType]: parsedResult,
          cacheKeys: { ...parsedData.cacheKeys, [parseType]: cacheKey }
        }
        setParsedData(newParsedData)
        saveToLocalStorage('parsedData', newParsedData)
        return parsedResult
      }
    } catch (error) {
      logger.error('AnalysisContext', `Parse failed for ${parseType}`, error)
    }
    return null
  }, [needsParsing, parsedData, generateCacheKey, saveToLocalStorage])

  // Memoized values
  const memoizedAnalysisResults = useMemo(() => analysisResults, [analysisResults])
  const memoizedParsedData = useMemo(() => parsedData, [parsedData])
  const memoizedAgentStatus = useMemo(() => agentStatus, [agentStatus])

  const value = useMemo(() => ({
    analysisResults: memoizedAnalysisResults,
    setAnalysisResults: updateAnalysisResults,
    agentStatus: memoizedAgentStatus,
    updateAgentStatus,
    resetAgentStatus,
    currentAgent,
    setCurrentAgent,
    isProcessing,
    setIsProcessing,
    clearAnalysisResults,
    parsedData: memoizedParsedData,
    parseAnalysisData,
    needsParsing,
    processAgents
  }), [
    memoizedAnalysisResults,
    updateAnalysisResults,
    memoizedAgentStatus,
    updateAgentStatus,
    resetAgentStatus,
    currentAgent,
    isProcessing,
    clearAnalysisResults,
    memoizedParsedData,
    parseAnalysisData,
    needsParsing,
    processAgents
  ])

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  )
}