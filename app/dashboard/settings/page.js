// app/dashboard/settings/page.js
'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Save, RefreshCw, AlertTriangle, CheckCircle, 
  Zap, Database, Brain, Monitor, Code, Sparkles
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SettingsPage = () => {
  const { settings, updateSettings, updateGeminiModel } = useSettings();
  const [debugMode, setDebugMode] = useState(settings.debugMode);
  const [geminiModel, setGeminiModel] = useState(settings.geminiModel);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

  // Sync with context settings
  useEffect(() => {
    setDebugMode(settings.debugMode);
    setGeminiModel(settings.geminiModel);
  }, [settings]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update context and Gemini client
    updateSettings({ debugMode, geminiModel });
    updateGeminiModel(geminiModel);
    
    setIsLoading(false);
    setIsSaved(true);
    
    // Reset saved indicator after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  const resetToDefaults = () => {
    setDebugMode(false);
    setGeminiModel('gemini-2.5-flash');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </motion.div>
        <p className="text-gray-600">Configure your AI Career Development platform</p>
      </div>

      {/* Settings Cards */}
      <div className="grid gap-6 max-w-4xl mx-auto">
        
        {/* Environment Mode */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
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
              
              <motion.button
                onClick={() => setDebugMode(!debugMode)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                  debugMode ? 'bg-orange-500' : 'bg-green-500'
                }`}
              >
                <motion.div
                  layout
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: debugMode ? 32 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            {debugMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <p className="text-sm text-orange-700">
                  Debug mode is active. This may impact performance and expose sensitive information.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Gemini Model Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
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
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGeminiModel(model.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
          <motion.button
            onClick={handleSaveSettings}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isSaved
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isSaved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isLoading ? 'Saving...' : isSaved ? 'Saved!' : 'Save Settings'}
          </motion.button>

          <motion.button
            onClick={resetToDefaults}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </motion.button>
        </motion.div>

        {/* Current Configuration Display */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
        >
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
                {geminiModels.find(m => m.id === geminiModel)?.name}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;