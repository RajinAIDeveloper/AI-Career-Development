// hooks/useGeminiClient.js - Easy access to Gemini client with settings integration
import { useEffect, useState, useCallback } from 'react'
import { useSettings } from '../app/dashboard/context/SettingsContext'
import { logger } from '../utils/Logger'

export const useGeminiClient = () => {
  const { settings, getGeminiClientStatus } = useSettings()
  const [clientStatus, setClientStatus] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Update client status when settings change
  useEffect(() => {
    const updateStatus = () => {
      try {
        const status = getGeminiClientStatus()
        setClientStatus(status)
      } catch (error) {
        logger.error('GeminiHook', 'Failed to update client status', error)
      }
    }

    updateStatus()
    
    // Update every 30 seconds to keep status fresh
    const interval = setInterval(updateStatus, 30000)
    return () => clearInterval(interval)
  }, [settings.geminiModel, getGeminiClientStatus])

  // Generate content with current settings
  const generateContent = useCallback(async (prompt, options = {}) => {
    if (typeof window === 'undefined' || !window.geminiClient) {
      throw new Error('Gemini client not available')
    }

    setIsGenerating(true)
    logger.info('GeminiHook', 'Starting content generation', {
      model: settings.geminiModel,
      agentType: options.agentType
    })

    try {
      const result = await window.geminiClient.generateContent(prompt, {
        ...options,
        // Ensure we're using the current model from settings
        modelConfig: {
          ...options.modelConfig
        }
      })

      logger.success('GeminiHook', 'Content generation completed', {
        model: settings.geminiModel,
        agentType: options.agentType
      })

      return result
    } catch (error) {
      logger.error('GeminiHook', 'Content generation failed', {
        error: error.message,
        model: settings.geminiModel,
        agentType: options.agentType
      })
      throw error
    } finally {
      setIsGenerating(false)
    }
  }, [settings.geminiModel])

  // Get current model information
  const getCurrentModel = useCallback(() => {
    return {
      id: settings.geminiModel,
      name: settings.geminiModel?.replace('gemini-', '').replace('-', ' ').toUpperCase() || 'Unknown',
      isAvailable: clientStatus?.connected || false
    }
  }, [settings.geminiModel, clientStatus])

  // Check if service is available
  const isServiceAvailable = useCallback(() => {
    return clientStatus?.connected && 
           clientStatus?.systemHealth?.availableKeys > 0
  }, [clientStatus])

  // Get usage statistics
  const getUsageStats = useCallback(() => {
    if (typeof window !== 'undefined' && window.geminiClient) {
      return window.geminiClient.getDetailedUsageStats()
    }
    return null
  }, [])

  return {
    // Status
    clientStatus,
    isGenerating,
    isServiceAvailable: isServiceAvailable(),
    
    // Current model info
    currentModel: getCurrentModel(),
    
    // Methods
    generateContent,
    getUsageStats,
    
    // Direct client access (for advanced usage)
    client: typeof window !== 'undefined' ? window.geminiClient : null
  }
}

// Agent-specific hooks for different use cases
export const useDataAnalysisAgent = () => {
  const geminiClient = useGeminiClient()
  
  const analyzeData = useCallback(async (data, analysisType = 'general') => {
    const prompt = `Analyze the following data and provide insights:
    
Analysis Type: ${analysisType}
Data: ${JSON.stringify(data, null, 2)}

Please provide:
1. Key insights and patterns
2. Statistical analysis
3. Recommendations
4. Potential issues or concerns

Format the response in a clear, structured manner.`

    return await geminiClient.generateContent(prompt, {
      agentType: 'data-analyst',
      modelConfig: {
        temperature: 0.3, // Lower temperature for more analytical responses
        maxOutputTokens: 4096
      }
    })
  }, [geminiClient])

  return {
    ...geminiClient,
    analyzeData
  }
}

export const useRecommendationAgent = () => {
  const geminiClient = useGeminiClient()
  
  const generateRecommendations = useCallback(async (userProfile, context = '') => {
    const prompt = `Based on the user profile and context, generate personalized career recommendations:

User Profile: ${JSON.stringify(userProfile, null, 2)}
Context: ${context}

Please provide:
1. Career path recommendations
2. Skill development suggestions
3. Learning resources
4. Next steps and timeline
5. Potential challenges and how to overcome them

Make recommendations specific, actionable, and tailored to the user's background.`

    return await geminiClient.generateContent(prompt, {
      agentType: 'recommender',
      modelConfig: {
        temperature: 0.7, // Balanced creativity and consistency
        maxOutputTokens: 6144
      }
    })
  }, [geminiClient])

  return {
    ...geminiClient,
    generateRecommendations
  }
}

export const useLearningAgent = () => {
  const geminiClient = useGeminiClient()
  
  const createLearningPath = useCallback(async (skills, goals, timeframe = '6 months') => {
    const prompt = `Create a comprehensive learning path for the following:

Target Skills: ${skills.join(', ')}
Goals: ${goals}
Timeframe: ${timeframe}

Please provide:
1. Learning path structure with phases
2. Recommended courses and resources
3. Practical projects and exercises
4. Milestones and checkpoints
5. Assessment methods
6. Time allocation for each phase

Make the path progressive, practical, and achievable within the given timeframe.`

    return await geminiClient.generateContent(prompt, {
      agentType: 'learn-agent',
      modelConfig: {
        temperature: 0.5,
        maxOutputTokens: 8192
      }
    })
  }, [geminiClient])

  return {
    ...geminiClient,
    createLearningPath
  }
}

// Example usage in components:
/*
import { useGeminiClient, useDataAnalysisAgent } from '../hooks/useGeminiClient'

function MyComponent() {
  const { isServiceAvailable, currentModel } = useGeminiClient()
  const { analyzeData, isGenerating } = useDataAnalysisAgent()
  
  const handleAnalysis = async () => {
    if (!isServiceAvailable) {
      alert('AI service is not available')
      return
    }
    
    try {
      const result = await analyzeData(myData, 'career-analysis')
      console.log('Analysis result:', result)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }
  
  return (
    <div>
      <p>Current Model: {currentModel.name}</p>
      <p>Service Available: {isServiceAvailable ? 'Yes' : 'No'}</p>
      <button onClick={handleAnalysis} disabled={isGenerating}>
        {isGenerating ? 'Analyzing...' : 'Analyze Data'}
      </button>
    </div>
  )
}
*/