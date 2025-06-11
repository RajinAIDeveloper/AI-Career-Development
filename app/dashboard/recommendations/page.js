// app/dashboard/recommendations/page.js - Responsive Recommendations
'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Target, BookOpen, Award, TrendingUp, Users, Clock, DollarSign,
  ArrowRight, CheckCircle, AlertCircle, Loader, Calendar, Star,
  BarChart3, Briefcase, Code, GraduationCap, ExternalLink,
  RefreshCw, MapPin, Building, Zap, ArrowUp
} from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext'

const LoadingState = ({ message }) => (
  <div className="text-center py-8 sm:py-12 px-4">
    <Loader className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4 text-purple-600 animate-spin" />
    <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">AI Recommendation Engine</h2>
    <p className="text-gray-500 text-sm sm:text-base">{message}</p>
  </div>
)

const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="text-center py-12 sm:py-20 px-4">
    <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
      <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
    </div>
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">{title}</h2>
    <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">{message}</p>
    {action}
  </div>
)

const StudyPlanCard = ({ studyPlan }) => {
  const [expandedPhase, setExpandedPhase] = useState(null)

  if (!studyPlan || !studyPlan.phases) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-purple-400"
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-purple-600">
        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
        Personalized Study Plan
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">{studyPlan.phases?.length || 0}</div>
          <div className="text-sm text-purple-700">Learning Phases</div>
        </div>
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
          <div className="text-base sm:text-lg font-bold text-blue-600">{studyPlan.totalDuration || 'TBD'}</div>
          <div className="text-sm text-blue-700">Total Duration</div>
        </div>
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
          <div className="text-base sm:text-lg font-bold text-green-600">{studyPlan.weeklyHours || 'TBD'}</div>
          <div className="text-sm text-green-700">Weekly Commitment</div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {studyPlan.phases.map((phase, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setExpandedPhase(expandedPhase === index ? null : index)}
              className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{phase.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{phase.duration} • {phase.focus}</p>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transform transition-transform flex-shrink-0 ${
                  expandedPhase === index ? 'rotate-90' : ''
                }`} />
              </div>
            </button>
            
            {expandedPhase === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-3 sm:px-4 pb-3 sm:pb-4"
              >
                {phase.objectives && (
                  <div className="mb-3">
                    <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Objectives:</h5>
                    <ul className="space-y-1">
                      {phase.objectives.map((obj, i) => (
                        <li key={i} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                          <Target className="w-3 h-3 mt-1 text-purple-500 flex-shrink-0" />
                          <span className="flex-1">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {phase.tasks && (
                  <div className="mb-3">
                    <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Key Tasks:</h5>
                    <ul className="space-y-1">
                      {phase.tasks.map((task, i) => (
                        <li key={i} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 mt-1 text-green-500 flex-shrink-0" />
                          <span className="flex-1">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {phase.projects && (
                  <div className="mb-3">
                    <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Projects:</h5>
                    <ul className="space-y-1">
                      {phase.projects.map((project, i) => (
                        <li key={i} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                          <Code className="w-3 h-3 mt-1 text-blue-500 flex-shrink-0" />
                          <span className="flex-1">{project}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {phase.assessment && (
                  <div className="bg-gray-50 p-3 rounded">
                    <h5 className="font-medium text-gray-900 mb-1 text-sm">Assessment:</h5>
                    <p className="text-xs sm:text-sm text-gray-600">{phase.assessment}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const SkillPrioritiesCard = ({ skillPriorities }) => {
  if (!skillPriorities || skillPriorities.length === 0) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-400"
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-blue-600">
        <Star className="w-5 h-5 sm:w-6 sm:h-6" />
        Skill Development Priorities
      </h3>
      
      <div className="space-y-3">
        {skillPriorities.map((skill, index) => (
          <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{skill.skill}</h4>
              <span className={`px-2 py-1 text-xs rounded self-start ${
                skill.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                skill.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                skill.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {skill.priority}
              </span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-gray-500">Market Demand:</span>
                <p className="font-medium text-gray-900 truncate">{skill.marketDemand}</p>
              </div>
              <div>
                <span className="text-gray-500">Learning Time:</span>
                <p className="font-medium text-gray-900 truncate">{skill.timeToLearn}</p>
              </div>
              <div>
                <span className="text-gray-500">Career Impact:</span>
                <p className="font-medium text-gray-900 truncate">{skill.careerImpact}</p>
              </div>
              <div>
                <span className="text-gray-500">Priority:</span>
                <p className="font-medium text-gray-900 truncate">{skill.priority}</p>
              </div>
            </div>

            {skill.resources && skill.resources.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-500 text-xs sm:text-sm">Learning Resources:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.resources.map((resource, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const CertificationRoadmapCard = ({ certificationRoadmap }) => {
  if (!certificationRoadmap || certificationRoadmap.length === 0) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-yellow-400"
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-yellow-600">
        <Award className="w-5 h-5 sm:w-6 sm:h-6" />
        Certification Roadmap
      </h3>

      <div className="space-y-3 sm:space-y-4">
        {certificationRoadmap.map((cert, index) => (
          <div key={index} className="p-3 sm:p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{cert.certification}</h4>
                <p className="text-yellow-600 font-medium text-sm">{cert.provider}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded self-start ${
                cert.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                cert.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {cert.priority}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm mb-3">
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-gray-500 flex-shrink-0" />
                <span className='text-gray-500 truncate'>{cert.cost}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                <span className='text-gray-500 truncate'>{cert.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-gray-500 flex-shrink-0" />
                <span className='text-gray-500 truncate'>ROI: {cert.roi}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-gray-500 flex-shrink-0" />
                <span className='text-gray-500 truncate'>{cert.priority} Priority</span>
              </div>
            </div>

            {cert.prerequisites && cert.prerequisites.length > 0 && (
              <div>
                <span className="text-gray-500 text-xs sm:text-sm">Prerequisites:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {cert.prerequisites.map((prereq, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const CareerSwitchingCard = ({ careerSwitchingPlan }) => {
  if (!careerSwitchingPlan) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-400"
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-green-600">
        <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
        Career Switching Opportunities
      </h3>

      {careerSwitchingPlan.targetRoles && careerSwitchingPlan.targetRoles.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Target Roles</h4>
          <div className="space-y-3 sm:space-y-4">
            {careerSwitchingPlan.targetRoles.map((role, index) => (
              <div key={index} className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                  <h5 className="font-semibold text-gray-900 text-sm sm:text-base">{role.role}</h5>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded self-start">
                    {role.salaryExpectation}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500">Transition Time:</span>
                    <p className="font-medium text-gray-900">{role.transitionTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Experience Needed:</span>
                    <p className="font-medium text-gray-900">{role.experienceNeeded?.join(', ')}</p>
                  </div>
                </div>

                {role.skillsToAdd && role.skillsToAdd.length > 0 && (
                  <div className="mb-3">
                    <span className="text-gray-500 text-xs sm:text-sm">Skills to Add:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {role.skillsToAdd.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {role.steps && role.steps.length > 0 && (
                  <div>
                    <span className="text-gray-500 text-xs sm:text-sm">Action Plan:</span>
                    <ul className="mt-1 space-y-1">
                      {role.steps.map((step, i) => (
                        <li key={i} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-4 h-4 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="flex-1">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {careerSwitchingPlan.riskAssessment && (
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <h5 className="font-medium text-gray-900 mb-1 text-sm">Risk Assessment</h5>
            <p className="text-xs sm:text-sm text-gray-600">{careerSwitchingPlan.riskAssessment}</p>
          </div>
        )}

        {careerSwitchingPlan.marketTiming && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-medium text-gray-900 mb-1 text-sm">Market Timing</h5>
            <p className="text-xs sm:text-sm text-gray-600">{careerSwitchingPlan.marketTiming}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const CourseRecommendationsCard = ({ courseRecommendations }) => {
  if (!courseRecommendations || courseRecommendations.length === 0) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-indigo-400"
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-indigo-600">
        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
        Recommended Courses
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {courseRecommendations.map((course, index) => (
          <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
              <h4 className="font-medium text-gray-900 text-sm">{course.title}</h4>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded self-start">
                {course.skill}
              </span>
            </div>

            <p className="text-indigo-600 text-sm mb-2">{course.provider}</p>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
              <div>Level: {course.level}</div>
              <div>Duration: {course.duration}</div>
              {course.rating && <div>Rating: {course.rating}</div>}
              {course.cost && <div>Cost: {course.cost}</div>}
            </div>

            <button className="w-full bg-indigo-600 text-white py-2 px-3 rounded text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              <ExternalLink className="w-3 h-3" />
              View Course
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const ImmediateActionsCard = ({ immediateActions }) => {
  if (!immediateActions || immediateActions.length === 0) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-red-400"
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-red-600">
        <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
        Immediate Action Items
      </h3>

      <div className="space-y-3">
        {immediateActions.map((action, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">{action.action}</h4>
              <span className={`px-2 py-1 text-xs rounded self-start ${
                action.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                action.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {action.priority}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
              <div>
                <span className="text-gray-500">Timeline:</span>
                <p className="font-medium">{action.timeline}</p>
              </div>
              <div>
                <span className="text-gray-500">Effort:</span>
                <p className="font-medium">{action.effort}</p>
              </div>
              <div>
                <span className="text-gray-500">Impact:</span>
                <p className="font-medium">{action.impact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function RecommendationsPage() {
  const { analysisResults, agentStatus } = useAnalysis()
  
  const recommendations = analysisResults?.recommendations
  const isRecommenderProcessing = agentStatus['recommender'] === 'processing'
  const isRecommenderCompleted = agentStatus['recommender'] === 'completed'

  if (isRecommenderProcessing) {
    return <LoadingState message="Generating personalized career recommendations..." />
  }

  if (!analysisResults?.dataAnalysis) {
    return (
      <EmptyState 
        icon={Target}
        title="No Career Data Available"
        message="Upload your CV files and complete the analysis to get personalized recommendations"
        action={
                  <motion.a 
                    href="/dashboard"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center pt-5 px-4 py-8 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                  >
                    <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Go to Dashboard
                  </motion.a>
                }
      />
    )
  }

  if (!recommendations && isRecommenderCompleted) {
    return (
      <EmptyState 
        icon={AlertCircle}
        title="Recommendations Generation Failed"
        message="Unable to generate recommendations. Please try re-uploading your files."
        action={
          <motion.a 
            href="/dashboard"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-8 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Go to Dashboard
          </motion.a>
        }
      />
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 -mx-3 sm:-mx-4 lg:-mx-6 xl:-mx-8 -mt-3 sm:-mt-4 lg:-mt-6 xl:-mt-8 px-3 sm:px-4 lg:px-6 xl:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 text-white">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
            AI-Powered Career Recommendations
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base">
            Personalized growth strategies, learning paths, and career switching opportunities
          </p>
        </motion.div>
      </div>

      {/* Study Plan */}
      {recommendations?.studyPlan && (
        <StudyPlanCard studyPlan={recommendations.studyPlan} />
      )}

      {/* Skill Priorities */}
      {recommendations?.skillPriorities && (
        <SkillPrioritiesCard skillPriorities={recommendations.skillPriorities} />
      )}

      {/* Career Switching */}
      {recommendations?.careerSwitchingPlan && (
        <CareerSwitchingCard careerSwitchingPlan={recommendations.careerSwitchingPlan} />
      )}

      {/* Certification Roadmap */}
      {recommendations?.certificationRoadmap && (
        <CertificationRoadmapCard certificationRoadmap={recommendations.certificationRoadmap} />
      )}

      {/* Course Recommendations */}
      {recommendations?.courseRecommendations && (
        <CourseRecommendationsCard courseRecommendations={recommendations.courseRecommendations} />
      )}

      {/* Immediate Actions */}
      {recommendations?.immediateActions && (
        <ImmediateActionsCard immediateActions={recommendations.immediateActions} />
      )}

      {/* Market Positioning & Long-term Goals */}
      {(recommendations?.marketPositioning || recommendations?.longTermGoals) && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
        >
          {recommendations.marketPositioning && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-teal-400">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-teal-600">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                Market Positioning
              </h3>
              
              {recommendations.marketPositioning.uniqueValueProp && (
                <div className="mb-4 p-3 bg-teal-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1 text-sm">Unique Value Proposition</h4>
                  <p className="text-xs sm:text-sm text-gray-700">{recommendations.marketPositioning.uniqueValueProp}</p>
                </div>
              )}

              {recommendations.marketPositioning.targetCompanies && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Target Companies</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendations.marketPositioning.targetCompanies.map((company, i) => (
                      <span key={i} className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.marketPositioning.personalBrand && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Personal Brand Elements</h4>
                  <ul className="space-y-1">
                    {recommendations.marketPositioning.personalBrand.map((element, i) => (
                      <li key={i} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                        <Star className="w-3 h-3 mt-1 text-teal-500 flex-shrink-0" />
                        <span className="flex-1">{element}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {recommendations.longTermGoals && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-amber-400">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-amber-600">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                Long-term Goals
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                {recommendations.longTermGoals.map((goal, index) => (
                  <div key={index} className="p-3 bg-amber-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">{goal.goal}</h4>
                    <p className="text-xs sm:text-sm text-amber-600 mb-2">Timeline: {goal.timeline}</p>
                    
                    {goal.milestones && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">Milestones:</span>
                        <ul className="mt-1 space-y-1">
                          {goal.milestones.map((milestone, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                              <CheckCircle className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />
                              <span className="flex-1">{milestone}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {goal.requirements && (
                      <div>
                        <span className="text-xs text-gray-500">Requirements:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {goal.requirements.map((req, i) => (
                            <span key={i} className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}