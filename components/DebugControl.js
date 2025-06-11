// components/DebugControl.js - Debug mode toggle component
'use client'
import { useState, useEffect } from 'react'
import { logger } from '../utils/Logger'
import { 
  Bug, 
  Download, 
  Activity, 
  Server, 
  BarChart3, 
  Settings,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react'

export default function DebugControl() {
  const [debugMode, setDebugMode] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [systemStats, setSystemStats] = useState(null)
  const [sessionStats, setSessionStats] = useState(null)

  useEffect(() => {
    // Initialize debug mode state
    setDebugMode(logger.debugMode)
    
    // Update stats if debug mode is on
    if (logger.debugMode) {
      updateStats()
    }
  }, [])

  const toggleDebugMode = () => {
    const newMode = !debugMode
    setDebugMode(newMode)
    logger.updateDebugMode(newMode)
    
    if (newMode) {
      updateStats()
    }
    
    logger.userAction(`Debug mode ${newMode ? 'enabled' : 'disabled'}`)
  }

  const updateStats = () => {
    if (typeof window !== 'undefined' && window.geminiClient) {
      try {
        setSystemStats(window.geminiClient.getDetailedUsageStats())
      } catch (error) {
        console.warn('Could not get system stats:', error)
      }
    }
    
    try {
      setSessionStats(logger.getSessionStats())
    } catch (error) {
      console.warn('Could not get session stats:', error)
    }
  }

  const exportLogs = () => {
    logger.exportLogs()
    logger.userAction('Exported debug logs')
  }

  const clearLogs = () => {
    logger.flush()
    setSessionStats(logger.getSessionStats())
    logger.userAction('Cleared debug logs')
  }

  const performHealthCheck = async () => {
    logger.userAction('Starting health check')
    try {
      if (window.geminiClient && window.geminiClient.performHealthCheck) {
        await window.geminiClient.performHealthCheck()
        updateStats()
        logger.success('DebugControl', 'Health check completed')
      } else {
        logger.warn('DebugControl', 'Health check not available')
      }
    } catch (error) {
      logger.error('DebugControl', 'Health check failed', error)
    }
  }

  // Don't render in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && !debugMode) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main debug toggle button */}
      <button
        onClick={toggleDebugMode}
        className={`mb-2 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          debugMode 
            ? 'bg-orange-500 text-white hover:bg-orange-600' 
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
        title={debugMode ? 'Disable Debug Mode' : 'Enable Debug Mode'}
      >
        <Bug className="w-5 h-5" />
      </button>

      {/* Debug panel */}
      {debugMode && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bug className="w-5 h-5 text-orange-500" />
              Debug Panel
            </h3>
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-gray-500 hover:text-gray-700"
              title={showStats ? 'Hide Stats' : 'Show Stats'}
            >
              {showStats ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={updateStats}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            <button
              onClick={exportLogs}
              className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            <button
              onClick={clearLogs}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm"
            >
              <Settings className="w-4 h-4" />
              Clear
            </button>
            
            <button
              onClick={performHealthCheck}
              className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
            >
              <Activity className="w-4 h-4" />
              Health
            </button>
          </div>

          {/* Statistics display */}
          {showStats && (
            <div className="space-y-4">
              {/* Session Statistics */}
              {sessionStats && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Session Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Total Logs:</span>
                      <span className="ml-1 font-medium">{sessionStats.totalLogs}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-1 font-medium">
                        {Math.round(sessionStats.sessionDuration / 1000)}s
                      </span>
                    </div>
                  </div>
                  
                  {/* Log levels breakdown */}
                  <div className="mt-2">
                    <div className="text-xs text-gray-600 mb-1">By Level:</div>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      {Object.entries(sessionStats.logsByLevel).map(([level, count]) => (
                        <div key={level} className="flex justify-between">
                          <span className="capitalize">{level}:</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* System Health */}
              {systemStats && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    System Health
                  </h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        systemStats.systemHealth.status === 'operational' 
                          ? 'text-green-600' 
                          : 'text-yellow-600'
                      }`}>
                        {systemStats.systemHealth.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Keys:</span>
                      <span className="font-medium">
                        {systemStats.systemHealth.availableKeys}/{systemStats.totalKeys}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium text-xs">{systemStats.currentModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Health:</span>
                      <span className="font-medium">
                        {Math.round(systemStats.systemHealth.averageHealth)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Memory Usage */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">Memory</h4>
                <button
                  onClick={() => logger.memoryUsage()}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Log Memory Usage
                </button>
              </div>
            </div>
          )}

          {/* Console hint */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 Open browser console for detailed logs
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Access: <code className="bg-gray-100 px-1 rounded">window.logger</code>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for easy debug mode checking
export function useDebugMode() {
  const [debugMode, setDebugMode] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDebugMode(logger.debugMode)
      
      // Listen for debug mode changes
      const checkDebugMode = () => setDebugMode(logger.debugMode)
      const interval = setInterval(checkDebugMode, 1000)
      
      return () => clearInterval(interval)
    }
  }, [])

  return debugMode
}