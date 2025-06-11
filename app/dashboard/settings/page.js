// app/dashboard/settings/page.js
'use client'
import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, RefreshCw, AlertTriangle, CheckCircle, 
  Zap, Database, Brain, Monitor, Code, Sparkles, Loader2
} from 'lucide-react';

// Safe import with error boundary
let useSettings;
try {
  useSettings = require('../context/SettingsContext').useSettings;
} catch (error) {
  console.error('Failed to import SettingsContext:', error);
  // Fallback hook
  useSettings = () => ({
    settings: { debugMode: false, geminiModel: 'gemini-2.5-flash' },
    updateSettings: () => {},
    updateGeminiModel: () => {},
    isLoading: false,
    error: null
  });
}

const SettingsPage = () => {
  // Wrap useSettings in try-catch
  let contextData;
  try {
    contextData = useSettings();
  } catch (error) {
    console.error('Settings context error:', error);
    // Fallback data
    contextData = {
      settings: { debugMode: false, geminiModel: 'gemini-2.5-flash' },
      updateSettings: () => {},
      updateGeminiModel: () => {},
      isLoading: false,
      error: 'Failed to load settings context'
    };
  }
  
  const { settings, updateSettings, updateGeminiModel, isLoading: contextLoading, error: contextError } = contextData;
  
  // Initialize with default values and update from context when available
  const [debugMode, setDebugMode] = useState(false);
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const geminiModels = [
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      description: 'Latest fast model with enhanced capabilities',
      speed: 'Very Fast',
      cost: 'Low',
      recommended: true
    },
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      description: 'Most advanced model for complex reasoning',
      speed: 'Medium',
      cost: 'High',
      recommended: false
    },
    {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      description: 'Second generation fast processing',
      speed: 'Fast',
      cost: 'Low',
      recommended: false
    },
    {
      id: 'gemini-2.0-pro',
      name: 'Gemini 2.0 Pro',
      description: 'Enhanced reasoning and analysis capabilities',
      speed: 'Medium',
      cost: 'Medium',
      recommended: false
    },
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      description: 'Fast and efficient for most tasks',
      speed: 'Fast',
      cost: 'Low',
      recommended: false
    },
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      description: 'Advanced reasoning and complex analysis',
      speed: 'Medium',
      cost: 'Medium',
      recommended: false
    },
    {
      id: 'gemini-1.0-pro',
      name: 'Gemini 1.0 Pro',
      description: 'Stable version for production',
      speed: 'Medium',
      cost: 'Medium',
      recommended: false
    }
  ];

  // Sync with context settings when they become available
  useEffect(() => {
    if (settings && typeof settings.debugMode !== 'undefined') {
      setDebugMode(settings.debugMode);
      setGeminiModel(settings.geminiModel || 'gemini-2.5-flash');
      setIsInitialized(true);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update context and Gemini client with error handling
      if (updateSettings && updateGeminiModel) {
        updateSettings({ debugMode, geminiModel });
        updateGeminiModel(geminiModel);
      } else {
        throw new Error('Settings functions not available');
      }
      
      setIsSaved(true);
      
      // Reset saved indicator after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    setDebugMode(false);
    setGeminiModel('gemini-2.5-flash');
  };

  // Show error state if there's a critical context error
  if (contextError && contextError.includes('context')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Settings Unavailable</h2>
          <p className="text-gray-600">
            There was an error loading the settings. Please refresh the page or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading spinner if context is still loading
  if (contextLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Show non-critical error notification
  const showErrorNotification = contextError && !contextError.includes('context');

  return (
    <div className="space-y-6">
      {/* Error Notification */}
      {showErrorNotification && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Settings Error</p>
              <p className="text-red-700 text-sm">{contextError}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-gray-600">Configure your AI Career Development platform</p>
      </div>

      {/* Settings Cards */}
      <div className="grid gap-6 max-w-4xl mx-auto">
        
        {/* Environment Mode */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              debugMode ? 'bg-orange-100' : 'bg-green-100'
            }`}>
              {debugMode ? 
                <Code className="w-5 h-5 text-orange-600" /> : 
                <Monitor className="w-5 h-5 text-green-600" />
              }
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Environment Mode</h3>
              <p className="text-sm text-gray-600">Toggle between debug and production environments</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${debugMode ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                <div>
                  <p className="font-medium text-gray-900">
                    {debugMode ? 'Debug Mode' : 'Production Mode'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {debugMode ? 'Detailed logging and error messages' : 'Optimized performance and stability'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setDebugMode(!debugMode)}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
                  debugMode ? 'bg-orange-500' : 'bg-green-500'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    debugMode ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {debugMode && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <p className="text-sm text-orange-700">
                  Debug mode is active. This may impact performance and expose sensitive information.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Gemini Model Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Model Selection</h3>
              <p className="text-sm text-gray-600">Choose your preferred Gemini model for analysis</p>
            </div>
          </div>

          <div className="space-y-3">
            {geminiModels.map((model) => (
              <div
                key={model.id}
                onClick={() => setGeminiModel(model.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-102 active:scale-98 ${
                  geminiModel === model.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{model.name}</h4>
                      {model.recommended && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-gray-600">Speed: {model.speed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Database className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-gray-600">Cost: {model.cost}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    geminiModel === model.id
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {geminiModel === model.id && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${
              isSaved
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isSaved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isLoading ? 'Saving...' : isSaved ? 'Saved!' : 'Save Settings'}
          </button>

          <button
            onClick={resetToDefaults}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>

        {/* Current Configuration Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Current Configuration
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Environment</p>
              <p className={`text-lg font-bold ${debugMode ? 'text-orange-600' : 'text-green-600'}`}>
                {debugMode ? 'Debug' : 'Production'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">AI Model</p>
              <p className="text-lg font-bold text-purple-600">
                {geminiModels.find(m => m.id === geminiModel)?.name || geminiModel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;