// app/dashboard/visualizations/page.js - Responsive Visualizations
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, ScatterChart, Scatter, ComposedChart, Treemap, FunnelChart, Funnel, LabelList
} from 'recharts'
import { 
  BarChart3, TrendingUp, Target, DollarSign, Award, Users, Brain, 
  Loader, AlertCircle, Star, Calendar, Briefcase, Code, GraduationCap,
  Download, Filter, Eye, EyeOff, Maximize2, RefreshCw, Info, 
  TrendingDown, ArrowUp, ArrowDown, Equal, ChevronRight, Zap,
  Globe, Building, BookOpen, Settings, Share2, XCircle
} from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#a4de6c', '#ffc0cb']
const SKILL_COLORS = {
  'High': '#10b981',
  'Medium': '#f59e0b', 
  'Low': '#ef4444',
  'Critical': '#dc2626',
  'growing': '#10b981',
  'stable': '#f59e0b',
  'declining': '#ef4444'
}

const LoadingState = ({ message }) => (
  <div className="text-center py-12 sm:py-16 px-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 sm:mb-6"
    >
      <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
    </motion.div>
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">AI Visualization Engine</h2>
    <p className="text-gray-500 text-base sm:text-lg">{message}</p>
    <div className="mt-4 sm:mt-6 flex justify-center space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-purple-600 rounded-full"
          animate={{ y: [-10, 0, -10] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </div>
)

const ErrorBanner = ({ error, details, onRetry, source }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-red-800 text-sm sm:text-base">Visualization Generation Failed</h3>
        <p className="text-sm text-red-700 mt-1">{error}</p>
        {details && (
          <details className="mt-2">
            <summary className="text-sm text-red-600 cursor-pointer">Show technical details</summary>
            <pre className="text-xs text-red-600 mt-1 bg-red-100 p-2 rounded overflow-auto">{details}</pre>
          </details>
        )}
        <p className="text-xs text-red-600 mt-1">Source: {source}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-2 text-sm text-red-800 hover:text-red-900 font-medium flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Retry Generation
          </button>
        )}
      </div>
    </div>
  </div>
)

const EmptyState = ({ icon: Icon, title, message, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12 sm:py-20 px-4"
  >
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 flex items-center justify-center">
      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{title}</h2>
    <p className="text-gray-600 max-w-lg mx-auto text-base sm:text-lg mb-6 sm:mb-8">{message}</p>
    {action}
  </motion.div>
)

const EnhancedVisualizationCard = ({ 
  title, 
  children, 
  insights, 
  recommendations, 
  icon: Icon, 
  color,
  isExpanded = false,
  onToggleExpand,
  isVisible = true,
  onToggleVisibility,
  metric,
  trend
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ y: 20, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: isVisible ? 1 : 0.5,
        scale: isVisible ? 1 : 0.98
      }}
      whileHover={{ scale: isVisible ? 1.01 : 0.98 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${
        isVisible ? 'hover:shadow-xl' : 'opacity-50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className={`p-4 sm:p-6 ${color} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
              <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white truncate">{title}</h3>
              {metric && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/90 text-base sm:text-lg font-semibold">{metric}</span>
                  {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      trend.direction === 'up' ? 'bg-green-500/20 text-green-100' :
                      trend.direction === 'down' ? 'bg-red-500/20 text-red-100' :
                      'bg-gray-500/20 text-gray-100'
                    }`}>
                      {trend.direction === 'up' ? <ArrowUp className="w-3 h-3" /> :
                       trend.direction === 'down' ? <ArrowDown className="w-3 h-3" /> :
                       <Equal className="w-3 h-3" />}
                      {trend.value}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={onToggleVisibility}
              className="p-1.5 sm:p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {isVisible ? <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> : <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
            <button
              onClick={onToggleExpand}
              className="p-1.5 sm:p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className={`p-4 sm:p-6 ${isExpanded ? 'min-h-[300px] sm:min-h-[400px] lg:min-h-[600px]' : 'min-h-[250px] sm:min-h-[400px]'}`}>
              {children}
            </div>

            {/* Insights and Recommendations */}
            {(insights?.length > 0 || recommendations?.length > 0) && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {insights && insights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        AI Insights
                      </h4>
                      <ul className="space-y-2">
                        {insights.map((insight, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-xs sm:text-sm text-gray-700 flex items-start gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="flex-1">{insight}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendations && recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {recommendations.map((rec, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-xs sm:text-sm text-green-700 flex items-start gap-3 p-2 sm:p-3 bg-green-50 rounded-lg"
                          >
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="flex-1">{rec}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const EnhancedSkillsRadar = ({ data, insights, recommendations }) => {
  if (!data || data.length === 0) return null

  return (
    <div className="h-64 sm:h-80 lg:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12, fill: '#374151' }}
            className="font-medium"
          />
          <PolarRadiusAxis 
            angle={0} 
            domain={[0, 100]} 
            tick={{ fontSize: window.innerWidth < 640 ? 8 : 10, fill: '#6b7280' }}
            tickCount={6}
          />
          <Radar
            name="Current Level"
            dataKey="current"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={window.innerWidth < 640 ? 2 : 3}
            dot={{ r: window.innerWidth < 640 ? 3 : 4, fill: '#3b82f6' }}
          />
          <Radar
            name="Market Average"
            dataKey="market"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Radar
            name="Target Level"
            dataKey="target"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="10 5"
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px', fontSize: window.innerWidth < 640 ? '12px' : '14px' }}
            iconType="circle"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: window.innerWidth < 640 ? '12px' : '14px'
            }}
            labelStyle={{ color: '#f3f4f6', fontWeight: 'bold' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

const EnhancedCareerTimeline = ({ data, insights, projections }) => {
  if (!data || data.length === 0) return null

  return (
    <div className="h-64 sm:h-80 lg:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12, fill: '#374151' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            yAxisId="left" 
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12, fill: '#374151' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12, fill: '#374151' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              fontSize: window.innerWidth < 640 ? '12px' : '14px'
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: window.innerWidth < 640 ? '12px' : '14px' }} />
          
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="salary"
            fill="#10b981"
            fillOpacity={0.2}
            stroke="#10b981"
            strokeWidth={2}
            name="Salary (K)"
          />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="level"
            stroke="#3b82f6"
            strokeWidth={window.innerWidth < 640 ? 3 : 4}
            name="Career Level"
            dot={{ r: window.innerWidth < 640 ? 4 : 6, fill: '#3b82f6', strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: window.innerWidth < 640 ? 6 : 8, fill: '#1d4ed8' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const EnhancedSkillGapMatrix = ({ data, insights, recommendations }) => {
  if (!data || data.length === 0) return null

  return (
    <div className="h-64 sm:h-80 lg:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="current" 
            name="Current Level"
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12, fill: '#374151' }}
            domain={[0, 100]}
            label={{ 
              value: 'Current Skill Level (%)', 
              position: 'insideBottom', 
              offset: -10,
              style: { fontSize: window.innerWidth < 640 ? '10px' : '12px' }
            }}
          />
          <YAxis 
            dataKey="required" 
            name="Required Level"
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12, fill: '#374151' }}
            domain={[0, 100]}
            label={{ 
              value: 'Required Level (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: window.innerWidth < 640 ? '10px' : '12px' }
            }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white p-3 sm:p-4 border border-gray-200 rounded-xl shadow-lg">
                    <p className="font-semibold text-gray-900 text-sm sm:text-lg">{data.skill}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs sm:text-sm text-gray-600">Current: <span className="font-medium">{data.current}%</span></p>
                      <p className="text-xs sm:text-sm text-gray-600">Required: <span className="font-medium">{data.required}%</span></p>
                      <p className="text-xs sm:text-sm text-gray-600">Gap: <span className="font-medium text-red-600">{data.required - data.current}%</span></p>
                      <p className={`text-xs sm:text-sm font-medium ${
                        data.priority === 'Critical' ? 'text-red-600' :
                        data.priority === 'High' ? 'text-orange-600' :
                        data.priority === 'Medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        {data.priority} Priority
                      </p>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Scatter 
            dataKey="required" 
            fill={(entry) => SKILL_COLORS[entry.priority] || '#8884d8'}
            name="Skills"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

const EnhancedMarketComparison = ({ data, insights, recommendations }) => {
  if (!data || data.length === 0) return null

  return (
    <div className="h-64 sm:h-80 lg:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="horizontal" 
          margin={{ 
            left: window.innerWidth < 640 ? 60 : 80, 
            right: 30, 
            top: 20, 
            bottom: 20 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12, fill: '#374151' }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            dataKey="category" 
            type="category" 
            tick={{ fontSize: window.innerWidth < 640 ? 8 : 12, fill: '#374151' }} 
            width={window.innerWidth < 640 ? 60 : 80}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              fontSize: window.innerWidth < 640 ? '12px' : '14px'
            }}
            formatter={(value, name) => [`${value}%`, name]}
          />
          <Legend wrapperStyle={{ fontSize: window.innerWidth < 640 ? '12px' : '14px' }} />
          <Bar 
            dataKey="user" 
            fill="#3b82f6" 
            name="Your Profile" 
            radius={[0, 4, 4, 0]}
            minPointSize={5}
          />
          <Bar 
            dataKey="market" 
            fill="#10b981" 
            name="Market Average" 
            radius={[0, 4, 4, 0]}
            minPointSize={5}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const EnhancedSalaryProjection = ({ data, insights, recommendations }) => {
  if (!data || data.length === 0) return null

  return (
    <div className="h-64 sm:h-80 lg:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="conservativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="optimisticGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12, fill: '#374151' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12, fill: '#374151' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              fontSize: window.innerWidth < 640 ? '12px' : '14px'
            }}
            formatter={(value) => [`$${value}k`, '']}
          />
          <Legend wrapperStyle={{ fontSize: window.innerWidth < 640 ? '12px' : '14px' }} />
          
          <Area
            type="monotone"
            dataKey="conservative"
            stroke="#3b82f6"
            fill="url(#conservativeGradient)"
            strokeWidth={2}
            name="Conservative"
          />
          
          <Area
            type="monotone"
            dataKey="optimistic"
            stroke="#10b981"
            fill="url(#optimisticGradient)"
            strokeWidth={2}
            name="Optimistic"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const AdvancedMetricsOverview = ({ visualizations }) => {
  if (!visualizations) return null

  const metrics = [
    {
      title: "Skills Analyzed",
      value: visualizations.skillsRadar?.data?.length || 0,
      icon: Code,
      color: "from-blue-500 to-blue-600",
      description: "Technical & soft skills evaluated"
    },
    {
      title: "Career Trajectory",
      value: `${visualizations.careerTimeline?.data?.length || 0} years`,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      description: "Professional growth timeline"
    },
    {
      title: "Skill Gaps",
      value: visualizations.skillGapMatrix?.data?.length || 0,
      icon: Target,
      color: "from-orange-500 to-orange-600",
      description: "Areas needing improvement"
    },
    {
      title: "Market Position",
      value: visualizations.marketComparison?.data?.length || 0,
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      description: "Competitive benchmarking"
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5`} />
          <div className="relative p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
              <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${metric.color} text-white self-start`}>
                <metric.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="text-left sm:text-right">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs sm:text-sm text-gray-500">{metric.title}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">{metric.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const FilterControls = ({ filters, onFilterChange, visualizations, onRetry }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          Visualization Controls
        </h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 text-gray-900" />
            <span className="hidden sm:inline text-gray-900">Export</span>
          </button>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          {visualizations?.error && onRetry && (
            <button 
              onClick={onRetry}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Retry</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
            value={filters.timePeriod}
            onChange={(e) => onFilterChange('timePeriod', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="recent">Last 2 Years</option>
            <option value="current">Current Year</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skill Category</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
            value={filters.skillCategory}
            onChange={(e) => onFilterChange('skillCategory', e.target.value)}
          >
            <option value="all">All Skills</option>
            <option value="technical">Technical</option>
            <option value="soft">Soft Skills</option>
            <option value="leadership">Leadership</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>
    </motion.div>
  )
}

export default function EnhancedVisualizationsPage() {
  const { analysisResults, agentStatus, parsedData } = useAnalysis()
  const [visibilityStates, setVisibilityStates] = useState({})
  const [expandedStates, setExpandedStates] = useState({})
  const [showRawData, setShowRawData] = useState(false)
  const [filters, setFilters] = useState({
    timePeriod: 'all',
    skillCategory: 'all',
    priority: 'all'
  })
  
  const visualizations = analysisResults?.visualizations
  const isVisualizerProcessing = agentStatus['visualizer'] === 'processing'
  const isVisualizerCompleted = agentStatus['visualizer'] === 'completed'
  const isVisualizerFailed = agentStatus['visualizer'] === 'failed'

  const toggleVisibility = (key) => {
    setVisibilityStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const toggleExpanded = (key) => {
    setExpandedStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const retryVisualizations = async () => {
    console.log('🔄 Retrying visualization generation...')
    
    if (analysisResults?.dataAnalysis && parsedData?.analysis) {
      try {
        const response = await fetch('/api/agents/visualizer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            rawAnalysis: analysisResults.dataAnalysis,
            parsedData: parsedData.analysis 
          })
        })
        
        if (response.ok) {
          const newVisualizations = await response.json()
          const updatedResults = {
            ...analysisResults,
            visualizations: newVisualizations
          }
          localStorage.setItem('analysisResults', JSON.stringify(updatedResults))
          window.location.reload()
        }
      } catch (error) {
        console.error('💥 Retry error:', error)
      }
    }
  }

  if (isVisualizerProcessing) {
    return <LoadingState message="Generating interactive visualizations and insights..." />
  }

  if (!analysisResults?.dataAnalysis && !parsedData?.analysis) {
    return (
      <EmptyState 
        icon={BarChart3}
        title="No Data Available"
        message="Upload your CV files and complete the analysis to see interactive visualizations"
        action={
          <motion.a 
            href="/dashboard"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Go to Dashboard
          </motion.a>
        }
      />
    )
  }

  if (!visualizations && isVisualizerCompleted) {
    return (
      <EmptyState 
        icon={AlertCircle}
        title="Visualization Generation Failed"
        message="Unable to generate visualizations. The AI encountered an issue processing your data."
        action={
          <motion.button 
            onClick={retryVisualizations}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Retry Generation
          </motion.button>
        }
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Enhanced Header */}
      <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 -mx-3 sm:-mx-4 lg:-mx-6 xl:-mx-8 -mt-3 sm:-mt-4 lg:-mt-6 xl:-mt-8 px-3 sm:px-4 lg:px-6 xl:px-8 pt-12 sm:pt-16 pb-8 sm:pb-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Career Data Visualizations
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            Interactive insights and visual analytics powered by AI to understand your career trajectory
          </p>
          <div className="mt-4 sm:mt-6 flex justify-center space-x-4 sm:space-x-8 text-blue-100">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">{Object.keys(visualizations || {}).length}</div>
              <div className="text-sm">Visualizations</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">AI</div>
              <div className="text-sm">Powered</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">Real-time</div>
              <div className="text-sm">Insights</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Advanced Metrics Overview */}
      <AdvancedMetricsOverview visualizations={visualizations} />

      {/* Filter Controls */}
      <FilterControls 
        filters={filters} 
        onFilterChange={handleFilterChange}
        visualizations={visualizations}
        onRetry={retryVisualizations}
      />

      {/* Error Banner */}
      {visualizations?.error && (
        <ErrorBanner 
          error={visualizations.error}
          details={visualizations.errorDetails}
          source={visualizations.source}
          onRetry={retryVisualizations}
        />
      )}

      {/* Visualizations Grid */}
      <div className="space-y-6 sm:space-y-8">
        
        {/* Skills Assessment Radar */}
        {visualizations?.skillsRadar && (
          <EnhancedVisualizationCard
            title="Skills Assessment Radar"
            icon={Target}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            insights={visualizations.skillsRadar.insights}
            recommendations={visualizations.skillsRadar.recommendations}
            isVisible={visibilityStates['skillsRadar'] !== false}
            onToggleVisibility={() => toggleVisibility('skillsRadar')}
            isExpanded={expandedStates['skillsRadar']}
            onToggleExpand={() => toggleExpanded('skillsRadar')}
            metric="Skills Analyzed"
            trend={{ direction: 'up', value: '+15%' }}
          >
            <EnhancedSkillsRadar 
              data={visualizations.skillsRadar.data}
              insights={visualizations.skillsRadar.insights}
              recommendations={visualizations.skillsRadar.recommendations}
            />
          </EnhancedVisualizationCard>
        )}

        {/* Career Timeline and Market Comparison */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {visualizations?.careerTimeline && (
            <EnhancedVisualizationCard
              title="Career Progression"
              icon={TrendingUp}
              color="bg-gradient-to-r from-green-500 to-green-600"
              insights={visualizations.careerTimeline.insights}
              recommendations={visualizations.careerTimeline.projections}
              isVisible={visibilityStates['careerTimeline'] !== false}
              onToggleVisibility={() => toggleVisibility('careerTimeline')}
              isExpanded={expandedStates['careerTimeline']}
              onToggleExpand={() => toggleExpanded('careerTimeline')}
              metric="Growth Rate"
              trend={{ direction: 'up', value: '12%' }}
            >
              <EnhancedCareerTimeline 
                data={visualizations.careerTimeline.data}
                insights={visualizations.careerTimeline.insights}
                projections={visualizations.careerTimeline.projections}
              />
            </EnhancedVisualizationCard>
          )}

          {visualizations?.marketComparison && (
            <EnhancedVisualizationCard
              title="Market Position"
              icon={Users}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              insights={visualizations.marketComparison.insights}
              recommendations={visualizations.marketComparison.recommendations}
              isVisible={visibilityStates['marketComparison'] !== false}
              onToggleVisibility={() => toggleVisibility('marketComparison')}
              isExpanded={expandedStates['marketComparison']}
              onToggleExpand={() => toggleExpanded('marketComparison')}
              metric="Above Average"
              trend={{ direction: 'up', value: '8%' }}
            >
              <EnhancedMarketComparison 
                data={visualizations.marketComparison.data}
                insights={visualizations.marketComparison.insights}
                recommendations={visualizations.marketComparison.recommendations}
              />
            </EnhancedVisualizationCard>
          )}
        </div>

        {/* Skill Gap Matrix */}
        {visualizations?.skillGapMatrix && (
          <EnhancedVisualizationCard
            title="Skill Gap Analysis"
            icon={Target}
            color="bg-gradient-to-r from-orange-500 to-red-500"
            insights={visualizations.skillGapMatrix.insights}
            recommendations={visualizations.skillGapMatrix.recommendations}
            isVisible={visibilityStates['skillGapMatrix'] !== false}
            onToggleVisibility={() => toggleVisibility('skillGapMatrix')}
            isExpanded={expandedStates['skillGapMatrix']}
            onToggleExpand={() => toggleExpanded('skillGapMatrix')}
            metric="Gaps Identified"
            trend={{ direction: 'down', value: '3' }}
          >
            <EnhancedSkillGapMatrix 
              data={visualizations.skillGapMatrix.data}
              insights={visualizations.skillGapMatrix.insights}
              recommendations={visualizations.skillGapMatrix.recommendations}
            />
          </EnhancedVisualizationCard>
        )}

        {/* Salary Projection */}
        {visualizations?.salaryProjection && (
          <EnhancedVisualizationCard
            title="Salary Growth Projection"
            icon={DollarSign}
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
            insights={visualizations.salaryProjection.insights}
            recommendations={visualizations.salaryProjection.recommendations}
            isVisible={visibilityStates['salaryProjection'] !== false}
            onToggleVisibility={() => toggleVisibility('salaryProjection')}
            isExpanded={expandedStates['salaryProjection']}
            onToggleExpand={() => toggleExpanded('salaryProjection')}
            metric="Growth Potential"
            trend={{ direction: 'up', value: '25%' }}
          >
            <EnhancedSalaryProjection 
              data={visualizations.salaryProjection.data}
              insights={visualizations.salaryProjection.insights}
              recommendations={visualizations.salaryProjection.recommendations}
            />
          </EnhancedVisualizationCard>
        )}

      </div>

      {/* AI Insights Summary */}
      {visualizations && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-200"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-blue-900">
            <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            AI-Generated Visual Insights Summary
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Skills Assessment</h4>
              </div>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Your skill profile demonstrates strong technical capabilities with strategic opportunities 
                for growth in emerging technologies and leadership competencies.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-green-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Career Progression</h4>
              </div>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Consistent upward trajectory with accelerated advancement potential through 
                strategic skill development and certification acquisition.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-purple-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Market Position</h4>
              </div>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Strong competitive positioning with opportunities to differentiate through 
                specialized expertise and thought leadership in your domain.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}