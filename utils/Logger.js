// utils/Logger.js - Enhanced logging utility
class Logger {
  constructor() {
    this.debugMode = false
    this.sessionLogs = []
    this.performanceMarks = new Map()
    
    // Load debug mode from localStorage
    if (typeof window !== 'undefined') {
      this.debugMode = localStorage.getItem('debugMode') === 'true'
    }
  }

  updateDebugMode(enabled) {
    this.debugMode = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('debugMode', enabled.toString())
    }
    
    if (enabled) {
      console.log('%c🐛 DEBUG MODE ENABLED', 'color: orange; font-size: 16px; font-weight: bold')
      console.log('%c📊 Full app context logging active', 'color: blue; font-size: 12px')
      this.logAppContext()
    } else {
      console.clear()
      console.log('%c✅ PRODUCTION MODE ACTIVE', 'color: green; font-size: 14px; font-weight: bold')
    }
  }

  log(level, component, message, data = null) {
    if (!this.debugMode && level !== 'error') return

    const timestamp = new Date().toISOString()
    const logEntry = { timestamp, level, component, message, data }
    
    if (this.debugMode) {
      this.sessionLogs.push(logEntry)
    }

    const styles = {
      error: 'color: red; font-weight: bold',
      warn: 'color: orange; font-weight: bold', 
      info: 'color: blue',
      debug: 'color: gray',
      success: 'color: green; font-weight: bold'
    }

    const prefix = {
      error: '❌',
      warn: '⚠️',
      info: 'ℹ️',
      debug: '🔍',
      success: '✅'
    }

    if (this.debugMode || level === 'error') {
      console.group(`%c${prefix[level]} [${component}] ${message}`, styles[level])
      if (data) {
        console.log('Data:', data)
      }
      console.log('Timestamp:', timestamp)
      if (this.debugMode) {
        console.log('Stack trace:', new Error().stack)
      }
      console.groupEnd()
    }
  }

  // Performance monitoring
  startPerformance(label) {
    if (!this.debugMode) return
    const mark = `${label}-start`
    performance.mark(mark)
    this.performanceMarks.set(label, Date.now())
    this.log('debug', 'Performance', `Started timing: ${label}`)
  }

  endPerformance(label) {
    if (!this.debugMode) return
    const startTime = this.performanceMarks.get(label)
    if (startTime) {
      const duration = Date.now() - startTime
      this.log('info', 'Performance', `${label} completed in ${duration}ms`)
      this.performanceMarks.delete(label)
    }
  }

  // Log entire app context
  logAppContext() {
    if (!this.debugMode) return

    console.group('%c📱 APP CONTEXT SNAPSHOT', 'color: purple; font-size: 14px; font-weight: bold')
    
    // Environment info
    console.log('🌍 Environment:', {
      userAgent: navigator.userAgent,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })

    // Local storage
    console.log('💾 Local Storage:', this.getLocalStorageSnapshot())

    // Memory usage (if available)
    if (performance.memory) {
      console.log('🧠 Memory Usage:', {
        used: `${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB`,
        total: `${Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)}MB`,
        limit: `${Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)}MB`
      })
    }

    // Network status
    console.log('🌐 Network:', {
      online: navigator.onLine,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : 'Not available'
    })

    console.groupEnd()
  }

  getLocalStorageSnapshot() {
    const snapshot = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      try {
        snapshot[key] = JSON.parse(localStorage.getItem(key))
      } catch {
        snapshot[key] = localStorage.getItem(key)
      }
    }
    return snapshot
  }

  // Export logs for debugging
  exportLogs() {
    if (!this.debugMode) return

    const exportData = {
      sessionLogs: this.sessionLogs,
      appContext: this.getLocalStorageSnapshot(),
      timestamp: new Date().toISOString(),
      performance: Object.fromEntries(this.performanceMarks)
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `debug-logs-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Specific logging methods
  error(component, message, error = null) {
    this.log('error', component, message, error)
  }

  warn(component, message, data = null) {
    this.log('warn', component, message, data)
  }

  info(component, message, data = null) {
    this.log('info', component, message, data)
  }

  debug(component, message, data = null) {
    this.log('debug', component, message, data)
  }

  success(component, message, data = null) {
    this.log('success', component, message, data)
  }

  // User action logging
  userAction(action, data = null) {
    this.log('info', 'UserAction', `👤 ${action}`, data)
  }

  // Agent pipeline logging
  agentStart(agentName, data = null) {
    this.log('info', 'Agent', `🚀 Starting ${agentName}`, data)
    this.startPerformance(`agent_${agentName}`)
  }

  agentComplete(agentName, data = null) {
    this.log('success', 'Agent', `✅ Completed ${agentName}`, data)
    this.endPerformance(`agent_${agentName}`)
  }

  agentSuccess(agentName, data = null) {
    this.log('success', 'Agent', `✅ Success ${agentName}`, data)
    this.endPerformance(`agent_${agentName}`)
  }

  agentError(agentName, error) {
    this.log('error', 'Agent', `❌ Failed ${agentName}`, error)
    this.endPerformance(`agent_${agentName}`)
  }

  // Component lifecycle logging
  componentMount(componentName, props = null) {
    this.info('Lifecycle', `🚀 ${componentName} mounted`, props)
  }

  componentUnmount(componentName) {
    this.info('Lifecycle', `💀 ${componentName} unmounted`)
  }

  stateChange(component, oldState, newState) {
    this.debug('State', `🔄 ${component} state changed`, { old: oldState, new: newState })
  }

  // API logging
  apiCall(method, url, payload = null) {
    this.info('API', `📡 ${method} ${url}`, payload)
  }

  apiResponse(url, response, duration = null) {
    this.success('API', `✅ Response from ${url}`, { response, duration })
  }

  apiError(url, error) {
    this.error('API', `❌ Error from ${url}`, error)
  }

  // Memory and resource logging
  memoryUsage() {
    if (this.debugMode && typeof window !== 'undefined' && window.performance && window.performance.memory) {
      const memory = window.performance.memory
      this.debug('Memory', 'Memory usage', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`
      })
    }
  }

  // Batch logging for related operations
  group(label, callback) {
    if (this.debugMode) {
      console.group(label)
      try {
        callback()
      } finally {
        console.groupEnd()
      }
    } else {
      callback()
    }
  }

  // Custom formatting for complex objects
  table(data, label = null) {
    if (this.debugMode) {
      if (label) console.log(label)
      console.table(data)
    }
  }

  // Flush logs (useful for testing)
  flush() {
    this.sessionLogs = []
    this.performanceMarks.clear()
    this.info('Logger', 'Logger state cleared')
  }

  // Get current session statistics
  getSessionStats() {
    if (!this.debugMode) return null

    const stats = {
      totalLogs: this.sessionLogs.length,
      logsByLevel: {},
      logsByComponent: {},
      activePerformanceMarks: this.performanceMarks.size,
      sessionDuration: this.sessionLogs.length > 0 ? 
        Date.now() - new Date(this.sessionLogs[0].timestamp).getTime() : 0
    }

    // Count by level and component
    this.sessionLogs.forEach(log => {
      stats.logsByLevel[log.level] = (stats.logsByLevel[log.level] || 0) + 1
      stats.logsByComponent[log.component] = (stats.logsByComponent[log.component] || 0) + 1
    })

    return stats
  }
}

// Create singleton instance
export const logger = new Logger()

// Make it available globally in development
if (typeof window !== 'undefined') {
  window.logger = logger
  
  // Auto-enable debug mode in development
  if (process.env.NODE_ENV === 'development') {
    logger.updateDebugMode(true)
  }
}

export default logger