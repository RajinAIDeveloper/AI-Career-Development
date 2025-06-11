// app/dashboard/context/SettingsContext.js
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { logger } from '../../../utils/Logger'

const SettingsContext = createContext(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    debugMode: false,
    geminiModel: 'gemini-2.5-flash'
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Setup global functions for Gemini client integration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Global function for Gemini client to get current model
      window.__getGeminiModelFromSettings = () => {
        return settings.geminiModel
      }
      
      // Cleanup function
      return () => {
        if (window.__getGeminiModelFromSettings) {
          delete window.__getGeminiModelFromSettings
        }
      }
    }
  }, [settings.geminiModel])

  useEffect(() => {
    logger.componentMount('SettingsProvider')
    
    const initializeSettings = () => {
      if (typeof window !== 'undefined') {
        try {
          const savedDebugMode = localStorage.getItem('debugMode')
          const savedGeminiModel = localStorage.getItem('geminiModel')
          
          const newSettings = {
            debugMode: savedDebugMode === 'true',
            geminiModel: savedGeminiModel || 'gemini-2.5-flash'
          }
          
          setSettings(newSettings)
          logger.updateDebugMode(newSettings.debugMode)
          logger.info('Settings', 'Settings loaded from localStorage', newSettings)
          
          // Initialize Gemini client if available
          if (window.geminiClient) {
            window.geminiClient.updateModel(newSettings.geminiModel)
            logger.success('Settings', 'Gemini client initialized', { model: newSettings.geminiModel })
          }
          
        } catch (error) {
          logger.error('Settings', 'Error loading settings', error)
          setError('Failed to load settings from localStorage')
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    initializeSettings()

    return () => {
      logger.componentUnmount('SettingsProvider')
    }
  }, [])

  const updateSettings = (newSettings) => {
    logger.startPerformance('updateSettings')
    
    try {
      setSettings(prev => {
        const updated = { ...prev, ...newSettings }
        
        logger.stateChange('Settings', prev, updated)
        
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('debugMode', updated.debugMode.toString())
            localStorage.setItem('geminiModel', updated.geminiModel)
            logger.success('Settings', 'Settings saved to localStorage', updated)
          } catch (error) {
            logger.error('Settings', 'Error saving settings', error)
            throw error
          }
        }
        
        // Update logger debug mode
        if (prev.debugMode !== updated.debugMode) {
          logger.updateDebugMode(updated.debugMode)
        }
        
        logger.endPerformance('updateSettings')
        return updated
      })
      
      setError(null) // Clear any previous errors
    } catch (error) {
      logger.error('Settings', 'Failed to update settings', error)
      setError('Failed to save settings')
    }
  }

  const updateGeminiModel = (modelId) => {
    logger.info('Settings', 'Updating Gemini model', { modelId })
    
    try {
      // Update settings first
      updateSettings({ geminiModel: modelId })
      
      // Update Gemini client through multiple methods to ensure sync
      if (typeof window !== 'undefined') {
        // Method 1: Direct client update
        if (window.geminiClient) {
          window.geminiClient.updateModel(modelId)
          logger.success('Settings', 'Gemini client model updated via direct call', { modelId })
        }
        
        // Method 2: Global update function
        if (window.__updateGeminiModel) {
          const result = window.__updateGeminiModel(modelId)
          logger.info('Settings', 'Gemini client sync result', { modelId, synced: result })
        }
        
        // Method 3: Trigger storage event for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'geminiModel',
          newValue: modelId,
          oldValue: settings.geminiModel,
          storageArea: localStorage,
          url: window.location.href
        }))
      }
      
    } catch (error) {
      logger.error('Settings', 'Failed to update Gemini model', error)
      setError('Failed to update Gemini model')
    }
  }

  const toggleDebugMode = () => {
    const newDebugMode = !settings.debugMode
    logger.userAction('Toggle Debug Mode', { from: settings.debugMode, to: newDebugMode })
    updateSettings({ debugMode: newDebugMode })
  }

  const resetSettings = () => {
    logger.info('Settings', 'Resetting settings to defaults')
    
    const defaultSettings = {
      debugMode: false,
      geminiModel: 'gemini-2.5-flash'
    }
    
    updateSettings(defaultSettings)
    
    // Update Gemini client with default model
    updateGeminiModel(defaultSettings.geminiModel)
  }

  // Get available Gemini models
  const getAvailableModels = () => {
    return [
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Fast and efficient (Recommended)' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Advanced reasoning and analysis' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Previous generation fast model' },
      { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', description: 'Previous generation pro model' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Legacy fast model' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Legacy pro model' },
      { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', description: 'Original pro model' }
    ]
  }

  // Get Gemini client status
  const getGeminiClientStatus = () => {
    if (typeof window !== 'undefined' && window.geminiClient) {
      try {
        const stats = window.geminiClient.getDetailedUsageStats()
        return {
          connected: true,
          currentModel: stats.currentModel,
          isSettingsConnected: stats.isSettingsConnected,
          systemHealth: stats.systemHealth,
          keyMetrics: stats.keyMetrics
        }
      } catch (error) {
        logger.error('Settings', 'Failed to get Gemini client status', error)
        return { connected: false, error: error.message }
      }
    }
    return { connected: false, error: 'Gemini client not available' }
  }

  // Perform Gemini client health check
  const performGeminiHealthCheck = async () => {
    if (typeof window !== 'undefined' && window.geminiClient) {
      try {
        logger.info('Settings', 'Starting Gemini health check')
        const results = await window.geminiClient.performHealthCheck()
        logger.success('Settings', 'Gemini health check completed', results)
        return results
      } catch (error) {
        logger.error('Settings', 'Gemini health check failed', error)
        throw error
      }
    }
    throw new Error('Gemini client not available')
  }

  // Export debug logs with Gemini stats
  const exportDebugLogs = () => {
    try {
      const geminiStatus = getGeminiClientStatus()
      const exportData = {
        timestamp: new Date().toISOString(),
        settings: settings,
        geminiClient: geminiStatus,
        logs: typeof window !== 'undefined' && window.logger ? window.logger.getSessionStats() : null
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-career-debug-logs-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      
      logger.success('Settings', 'Debug logs exported successfully')
    } catch (error) {
      logger.error('Settings', 'Failed to export debug logs', error)
      setError('Failed to export debug logs')
    }
  }

  const value = {
    settings,
    updateSettings,
    updateGeminiModel,
    toggleDebugMode,
    resetSettings,
    isLoading,
    error,
    clearError: () => setError(null),
    // New methods
    getAvailableModels,
    getGeminiClientStatus,
    performGeminiHealthCheck,
    exportDebugLogs
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}