// lib/gemini-client.js - Enhanced version with Settings Context integration
import { GoogleGenerativeAI } from '@google/generative-ai'

class EnhancedGeminiClient {
  constructor() {
    // Load API keys from environment
    this.apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      // process.env.GEMINI_API_KEY_5
    ].filter(Boolean)

    if (this.apiKeys.length === 0) {
      throw new Error('No valid Gemini API keys found in environment variables')
    }

    // Agent-specific key assignments for load distribution
    this.agentKeyMapping = {
      'data-analyst': 0,    // GEMINI_API_KEY (primary analysis)
      'parser-agent': 1,    // GEMINI_API_KEY_2 (dedicated parsing)
      'recommender': 2,     // GEMINI_API_KEY_3 (recommendations)
      'visualizer': 0,      // Load balanced
      'learn-agent': 1,     // Load balanced  
      'test-agent': 2       // Load balanced
    }

    // Key management state
    this.keyUsage = new Map()
    this.keyErrors = new Map()
    this.rateLimitResetTime = new Map()
    this.lastUsed = new Map()
    this.keyHealth = new Map()

    // Performance tracking
    this.keyResponseTimes = new Map()
    this.successRates = new Map()

    // Default model selection - will be overridden by settings
    this.currentModel = 'gemini-2.5-flash'
    this.fallbackModel = 'gemini-2.5-flash'

    // Circuit breaker for failed keys
    this.circuitBreaker = new Map()

    // Settings context integration
    this.settingsCallbacks = new Set()
    this.isSettingsConnected = false

    console.log(`Enhanced Gemini Client initialized with ${this.apiKeys.length} API keys`)
    this.initializeKeyMetrics()

    // Load model from localStorage if available (browser only)
    if (typeof window !== 'undefined') {
      this.initializeBrowserSettings()
    }
  }

  initializeBrowserSettings() {
    const savedModel = localStorage.getItem('geminiModel')
    if (savedModel) {
      this.currentModel = savedModel
      console.log(`Loaded model from localStorage: ${savedModel}`)
    }

    // Set up settings context integration
    this.setupSettingsIntegration()
  }

  setupSettingsIntegration() {
    // Check for settings context availability periodically
    if (typeof window !== 'undefined') {
      const checkSettingsContext = () => {
        // Try to access the settings context through a global callback
        if (window.__getGeminiModelFromSettings) {
          const modelFromSettings = window.__getGeminiModelFromSettings()
          if (modelFromSettings && modelFromSettings !== this.currentModel) {
            this.updateModel(modelFromSettings)
            console.log(`Model synced from settings context: ${modelFromSettings}`)
          }
          this.isSettingsConnected = true
        }
      }

      // Check immediately and then periodically
      checkSettingsContext()
      this.settingsCheckInterval = setInterval(checkSettingsContext, 1000)

      // Listen for storage changes
      window.addEventListener('storage', (e) => {
        if (e.key === 'geminiModel' && e.newValue) {
          this.updateModel(e.newValue)
          console.log(`Model updated from storage event: ${e.newValue}`)
        }
      })
    }
  }

  // Method to be called by settings context to sync model
  syncModelFromSettings(modelId) {
    if (modelId && modelId !== this.currentModel) {
      this.updateModel(modelId)
      console.log(`Model synced from settings: ${modelId}`)
      return true
    }
    return false
  }

  // Get current model with settings context fallback
  getCurrentModel() {
    // Try to get from settings context first
    if (typeof window !== 'undefined' && window.__getGeminiModelFromSettings) {
      const settingsModel = window.__getGeminiModelFromSettings()
      if (settingsModel && settingsModel !== this.currentModel) {
        this.currentModel = settingsModel
      }
    }
    
    return this.currentModel || this.fallbackModel
  }

  initializeKeyMetrics() {
    this.apiKeys.forEach((key, index) => {
      this.keyUsage.set(key, 0)
      this.keyErrors.set(key, 0)
      this.keyHealth.set(key, 100) // Start with 100% health
      this.keyResponseTimes.set(key, [])
      this.successRates.set(key, 100)
      this.circuitBreaker.set(key, { isOpen: false, failureCount: 0, lastFailure: null })
    })
  }

  updateModel(modelId) {
    const previousModel = this.currentModel
    this.currentModel = modelId
    console.log(`Gemini model updated: ${previousModel} → ${modelId}`)
    
    // Save to localStorage if available
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('geminiModel', modelId)
      } catch (error) {
        console.warn('Failed to save model to localStorage:', error)
      }
    }

    // Notify any registered callbacks
    this.settingsCallbacks.forEach(callback => {
      try {
        callback(modelId, previousModel)
      } catch (error) {
        console.warn('Error in settings callback:', error)
      }
    })
  }

  // Register callback for model changes
  onModelChange(callback) {
    this.settingsCallbacks.add(callback)
    return () => this.settingsCallbacks.delete(callback)
  }

  getModelConfig(options = {}) {
    const currentModel = this.getCurrentModel()
    
    const modelConfigs = {
      'gemini-2.5-flash': {
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      },
      'gemini-2.5-pro': {
        model: "gemini-1.5-pro",
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      },
      'gemini-2.0-flash': {
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      },
      'gemini-2.0-pro': {
        model: "gemini-1.5-pro",
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      },
      'gemini-1.5-flash': {
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      },
      'gemini-1.5-pro': {
        model: "gemini-1.5-pro",
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      },
      'gemini-1.0-pro': {
        model: "gemini-1.5-pro",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      }
    }

    const config = modelConfigs[currentModel] || modelConfigs['gemini-2.5-flash']
    return {
      ...config,
      ...options.modelConfig
    }
  }

  // Intelligent key selection based on agent type and key health
  selectOptimalKey(agentType = null) {
    const now = Date.now()
    
    // Remove expired rate limits
    for (const [key, resetTime] of this.rateLimitResetTime.entries()) {
      if (now > resetTime) {
        this.rateLimitResetTime.delete(key)
        // Reset circuit breaker if rate limit expired
        const breaker = this.circuitBreaker.get(key)
        if (breaker.isOpen && (now - breaker.lastFailure) > 300000) { // 5 minutes
          breaker.isOpen = false
          breaker.failureCount = 0
        }
      }
    }

    // Filter available keys (not rate limited, not circuit broken)
    const availableKeys = this.apiKeys.filter((key, index) => {
      const isRateLimited = this.rateLimitResetTime.has(key)
      const circuitOpen = this.circuitBreaker.get(key)?.isOpen
      return !isRateLimited && !circuitOpen
    })

    if (availableKeys.length === 0) {
      // Fallback: use least recently rate limited key
      const sortedByReset = Array.from(this.rateLimitResetTime.entries())
        .sort(([,a], [,b]) => a - b)
      return sortedByReset.length > 0 ? sortedByReset[0][0] : this.apiKeys[0]
    }

    // Agent-specific key selection with fallback
    if (agentType && this.agentKeyMapping[agentType] !== undefined) {
      const preferredKeyIndex = this.agentKeyMapping[agentType]
      const preferredKey = this.apiKeys[preferredKeyIndex]
      
      if (preferredKey && availableKeys.includes(preferredKey)) {
        console.log(`Using preferred key for agent: ${agentType}`)
        return preferredKey
      }
    }

    // Intelligent load balancing based on key health and performance
    const keyScores = availableKeys.map(key => {
      const health = this.keyHealth.get(key) || 100
      const usage = this.keyUsage.get(key) || 0
      const avgResponseTime = this.getAverageResponseTime(key)
      const successRate = this.successRates.get(key) || 100
      
      // Score: higher is better
      // Factors: health (40%), success rate (30%), inverse usage (20%), response time (10%)
      const score = (health * 0.4) + (successRate * 0.3) + ((100 - usage) * 0.2) + ((1000 - avgResponseTime) / 1000 * 10)
      
      return { key, score }
    })

    // Select highest scoring key
    keyScores.sort((a, b) => b.score - a.score)
    const selectedKey = keyScores[0].key

    console.log(`Selected optimal key with score: ${keyScores[0].score.toFixed(2)}`)
    return selectedKey
  }

  getAverageResponseTime(key) {
    const times = this.keyResponseTimes.get(key) || []
    if (times.length === 0) return 500 // Default 500ms
    return times.reduce((sum, time) => sum + time, 0) / times.length
  }

  updateKeyMetrics(key, responseTime, success) {
    // Update usage
    this.keyUsage.set(key, (this.keyUsage.get(key) || 0) + 1)
    this.lastUsed.set(key, Date.now())

    // Update response times (keep last 10)
    const times = this.keyResponseTimes.get(key) || []
    times.push(responseTime)
    if (times.length > 10) times.shift()
    this.keyResponseTimes.set(key, times)

    // Update success rate (rolling window of last 20 requests)
    const currentRate = this.successRates.get(key) || 100
    const newRate = success ? 
      Math.min(100, currentRate + 2) : 
      Math.max(0, currentRate - 10)
    this.successRates.set(key, newRate)

    // Update health score
    const health = this.keyHealth.get(key) || 100
    const newHealth = success ? 
      Math.min(100, health + 1) : 
      Math.max(0, health - 5)
    this.keyHealth.set(key, newHealth)

    // Circuit breaker logic
    const breaker = this.circuitBreaker.get(key)
    if (!success) {
      breaker.failureCount++
      breaker.lastFailure = Date.now()
      
      // Open circuit after 3 consecutive failures
      if (breaker.failureCount >= 3) {
        breaker.isOpen = true
        console.log(`Circuit breaker opened for key: ${key.substring(0, 10)}...`)
      }
    } else {
      breaker.failureCount = 0
    }
  }

  markKeyAsRateLimited(key, duration = 60000) {
    const resetTime = Date.now() + duration
    this.rateLimitResetTime.set(key, resetTime)
    
    const errors = this.keyErrors.get(key) || 0
    this.keyErrors.set(key, errors + 1)
    
    // Severely penalize health for rate limiting
    this.keyHealth.set(key, Math.max(0, (this.keyHealth.get(key) || 100) - 20))
    
    console.log(`Key rate limited until ${new Date(resetTime).toISOString()}`)
  }

  async generateContent(prompt, options = {}) {
    const startTime = Date.now()
    let lastError = null
    const maxRetries = Math.min(this.apiKeys.length, 4)
    const agentType = options.agentType || null
    const currentModel = this.getCurrentModel()

    console.log(`Generating content with model: ${currentModel}`)

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      let selectedKey = null
      
      try {
        selectedKey = this.selectOptimalKey(agentType)
        const genAI = new GoogleGenerativeAI(selectedKey)
        
        const modelConfig = this.getModelConfig(options)

        // Handle tools (Google Search, etc.)
        if (options.tools) {
          const modelWithTools = genAI.getGenerativeModel({
            ...modelConfig,
            tools: options.tools
          })
          
          const result = await modelWithTools.generateContent(prompt)
          const responseTime = Date.now() - startTime
          
          this.updateKeyMetrics(selectedKey, responseTime, true)
          console.log(`API call succeeded (${responseTime}ms) with ${currentModel} on attempt ${attempt + 1}`)
          return result
        }

        // Standard generation
        const model = genAI.getGenerativeModel(modelConfig)
        const result = await model.generateContent(prompt)
        const responseTime = Date.now() - startTime
        
        this.updateKeyMetrics(selectedKey, responseTime, true)
        console.log(`API call succeeded (${responseTime}ms) with ${currentModel} on attempt ${attempt + 1}`)
        return result

      } catch (error) {
        lastError = error
        const responseTime = Date.now() - startTime
        
        if (selectedKey) {
          this.updateKeyMetrics(selectedKey, responseTime, false)
        }
        
        console.log(`Attempt ${attempt + 1} failed with ${currentModel}: ${error.message}`)

        if (error.status === 429) {
          if (selectedKey) {
            this.markKeyAsRateLimited(selectedKey, 90000) // 90 seconds
          }
          
          if (attempt < maxRetries - 1) {
            // Exponential backoff for rate limits
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
        } else if (error.status >= 500) {
          // Server error - try next key immediately
          console.log('Server error, trying next key...')
          continue
        } else if (error.status === 400) {
          // Bad request - don't retry
          throw error
        } else {
          // Other errors - brief delay and retry
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            continue
          }
        }
      }
    }

    // All retries failed
    if (lastError?.status === 429) {
      throw new Error(`All API keys are rate limited. Please wait before making more requests. Last error: ${lastError.message}`)
    } else {
      throw lastError || new Error('All API attempts failed')
    }
  }

  // Health check for all keys
  async performHealthCheck() {
    console.log('Performing API key health check...')
    const healthPromises = this.apiKeys.map(async (key, index) => {
      try {
        const genAI = new GoogleGenerativeAI(key)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        
        const startTime = Date.now()
        await model.generateContent("Hello")
        const responseTime = Date.now() - startTime
        
        this.updateKeyMetrics(key, responseTime, true)
        return { keyIndex: index, healthy: true, responseTime }
      } catch (error) {
        this.updateKeyMetrics(key, 5000, false)
        if (error.status === 429) {
          this.markKeyAsRateLimited(key)
        }
        return { keyIndex: index, healthy: false, error: error.message }
      }
    })

    const results = await Promise.allSettled(healthPromises)
    console.log('Health check completed:', results)
    return results
  }

  getDetailedUsageStats() {
    const currentModel = this.getCurrentModel()
    
    const stats = {
      totalKeys: this.apiKeys.length,
      currentModel: currentModel,
      isSettingsConnected: this.isSettingsConnected,
      keyMetrics: [],
      systemHealth: this.getSystemHealth()
    }

    this.apiKeys.forEach((key, index) => {
      const keyPrefix = key.substring(0, 10) + '...'
      stats.keyMetrics.push({
        keyIndex: index,
        keyPrefix,
        usage: this.keyUsage.get(key) || 0,
        errors: this.keyErrors.get(key) || 0,
        health: this.keyHealth.get(key) || 100,
        avgResponseTime: this.getAverageResponseTime(key),
        successRate: this.successRates.get(key) || 100,
        isRateLimited: this.rateLimitResetTime.has(key),
        circuitOpen: this.circuitBreaker.get(key)?.isOpen || false,
        lastUsed: this.lastUsed.get(key)
      })
    })

    return stats
  }

  getSystemHealth() {
    const availableKeys = this.apiKeys.filter((key, index) => {
      const isRateLimited = this.rateLimitResetTime.has(key)
      const circuitOpen = this.circuitBreaker.get(key)?.isOpen
      return !isRateLimited && !circuitOpen
    }).length

    const avgHealth = Array.from(this.keyHealth.values())
      .reduce((sum, health) => sum + health, 0) / this.apiKeys.length

    return {
      availableKeys,
      totalKeys: this.apiKeys.length,
      availabilityPercentage: (availableKeys / this.apiKeys.length) * 100,
      averageHealth: avgHealth,
      status: availableKeys > 0 ? 'operational' : 'degraded'
    }
  }

  // Backward compatibility
  getUsageStats() {
    return this.getDetailedUsageStats()
  }

  isServiceAvailable() {
    const systemHealth = this.getSystemHealth()
    return systemHealth.availableKeys > 0
  }

  getTimeUntilNextKeyAvailable() {
    const now = Date.now()
    const resetTimes = Array.from(this.rateLimitResetTime.values())
    
    if (resetTimes.length === 0) return 0
    
    const nextResetTime = Math.min(...resetTimes.filter(time => time > now))
    return Math.max(0, nextResetTime - now)
  }

  // Reset all metrics (useful for testing)
  resetMetrics() {
    this.initializeKeyMetrics()
    this.rateLimitResetTime.clear()
    console.log('All metrics reset')
  }

  // Cleanup method
  destroy() {
    if (this.settingsCheckInterval) {
      clearInterval(this.settingsCheckInterval)
    }
    this.settingsCallbacks.clear()
  }
}

// Create singleton instance
export const geminiClient = new EnhancedGeminiClient()

// Make it globally available for settings updates (browser only)
if (typeof window !== 'undefined') {
  window.geminiClient = geminiClient
  
  // Set up global function for settings context integration
  window.__updateGeminiModel = (modelId) => {
    return geminiClient.syncModelFromSettings(modelId)
  }
}

// Health check on initialization (optional, can be enabled for monitoring)
// geminiClient.performHealthCheck().catch(console.error)