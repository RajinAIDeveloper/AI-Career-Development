// app/api/agents/recommender/route.js - Debug version with minimal fallbacks
import { geminiClient } from '../../../../lib/gemini-client'

export async function POST(request) {
  console.log('🚀 RECOMMENDER AGENT STARTED')
  
  try {
    const { parsedData } = await request.json()
    console.log('📥 Received parsed data:', !!parsedData)
    console.log('📊 Parsed data keys:', parsedData ? Object.keys(parsedData) : 'null')
    
    if (!parsedData) {
      console.error('❌ No parsed data provided')
      return Response.json({ error: 'No parsed data provided' }, { status: 400 })
    }

    console.log('🤖 Preparing Gemini prompt...')
    const recommendationPrompt = `Based on this comprehensive career data, provide detailed personalized recommendations:

CAREER DATA: ${JSON.stringify(parsedData, null, 2)}

Generate a complete JSON response with ALL sections filled:

{
  "immediateActions": [
    {
      "action": "specific actionable task",
      "priority": "Critical|High|Medium|Low",
      "timeline": "Within 1 week|Within 2 weeks|Within 1 month|Within 3 months",
      "effort": "Low|Medium|High",
      "impact": "detailed expected outcome",
      "steps": ["step 1", "step 2", "step 3"]
    }
  ],
  "skillPriorities": [
    {
      "skill": "skill name",
      "priority": "Critical|High|Medium|Low",
      "marketDemand": "Very High|High|Medium|Low",
      "timeToLearn": "1-2 months|3-6 months|6-12 months",
      "careerImpact": "detailed impact description",
      "resources": ["Coursera", "Udemy", "YouTube", "Books"]
    }
  ],
  "studyPlan": {
    "totalDuration": "6-12 months",
    "weeklyHours": "10-15 hours",
    "phases": [
      {
        "title": "Foundation Phase",
        "duration": "2-3 months",
        "focus": "Core fundamentals",
        "objectives": ["objective 1", "objective 2"],
        "tasks": ["task 1", "task 2"],
        "projects": ["project 1", "project 2"],
        "assessment": "How progress will be measured"
      }
    ]
  },
  "certificationRoadmap": [
    {
      "certification": "certification name",
      "provider": "issuing organization",
      "priority": "Critical|High|Medium|Low",
      "cost": "$100-500|$500-1000|$1000+",
      "duration": "1-2 months|3-6 months",
      "roi": "High|Medium|Low",
      "prerequisites": ["prerequisite 1", "prerequisite 2"]
    }
  ],
  "careerSwitchingPlan": {
    "targetRoles": [
      {
        "role": "target position title",
        "transitionTime": "6-12 months|1-2 years",
        "salaryExpectation": "$X-Y range",
        "experienceNeeded": ["experience type 1", "experience type 2"],
        "skillsToAdd": ["skill 1", "skill 2"],
        "steps": ["step 1", "step 2", "step 3"]
      }
    ],
    "riskAssessment": "detailed risk analysis",
    "marketTiming": "current market conditions"
  },
  "longTermGoals": [
    {
      "goal": "specific long-term career goal",
      "timeline": "2-3 years|3-5 years|5+ years",
      "milestones": ["milestone 1", "milestone 2"],
      "requirements": ["requirement 1", "requirement 2"]
    }
  ],
  "marketPositioning": {
    "uniqueValueProp": "your unique value proposition",
    "targetCompanies": ["company 1", "company 2"],
    "personalBrand": ["brand element 1", "brand element 2"]
  }
}

REQUIREMENTS:
- Fill ALL sections with at least 3-5 realistic items each
- Base recommendations on actual data provided
- Be specific and actionable
- Include realistic timelines and costs
- Focus on current market trends and demands`

    console.log('🔄 Making Gemini API call...')
    let result
    try {
      result = await geminiClient.generateContent(recommendationPrompt, {
        agentType: 'recommender'
      })
      console.log('✅ Gemini API call successful')
    } catch (apiError) {
      console.error('❌ Gemini API call failed:', apiError.message)
      console.error('🔍 API Error details:', apiError)
      
      // Only return course recommendations as fallback, rest will show as missing
      return Response.json({
        error: 'AI generation failed',
        errorDetails: apiError.message,
        courseRecommendations: generateCourseFallback(parsedData),
        source: 'partial_fallback',
        timestamp: Date.now()
      }, { status: 206 }) // Partial content
    }

    console.log('📝 Processing Gemini response...')
    const responseText = result.response.text()
    console.log('📄 Response length:', responseText.length)
    console.log('🔍 Response preview:', responseText.substring(0, 200))
    
    // Extract JSON with detailed logging
    let recommendations
    try {
      console.log('🔍 Searching for JSON in response...')
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        console.log('✅ JSON pattern found')
        console.log('📏 JSON length:', jsonMatch[0].length)
        
        recommendations = JSON.parse(jsonMatch[0])
        console.log('✅ JSON parsed successfully')
        console.log('🔑 Recommendation keys:', Object.keys(recommendations))
        
        // Log each section
        const sections = ['immediateActions', 'skillPriorities', 'studyPlan', 'certificationRoadmap', 'careerSwitchingPlan', 'longTermGoals', 'marketPositioning']
        sections.forEach(section => {
          if (recommendations[section]) {
            console.log(`✅ ${section}: ${Array.isArray(recommendations[section]) ? recommendations[section].length + ' items' : 'present'}`)
          } else {
            console.log(`❌ ${section}: MISSING`)
          }
        })
        
      } else {
        console.error('❌ No JSON pattern found in response')
        console.log('🔍 Full response for debugging:', responseText)
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError.message)
      console.log('🔍 Raw response causing error:', responseText)
      
      // Return only course recommendations as fallback
      return Response.json({
        error: 'JSON parsing failed',
        errorDetails: parseError.message,
        rawResponse: responseText.substring(0, 500), // First 500 chars for debugging
        courseRecommendations: generateCourseFallback(parsedData),
        source: 'parse_error_fallback',
        timestamp: Date.now()
      }, { status: 206 })
    }

    console.log('🎉 Recommendations generated successfully')
    return Response.json({
      ...recommendations,
      timestamp: Date.now(),
      model: geminiClient.currentModel,
      source: 'ai_generated'
    })

  } catch (error) {
    console.error('💥 CRITICAL ERROR in recommender agent:', error)
    console.error('📊 Error stack:', error.stack)
    
    // Handle rate limiting specifically
    if (error.message?.includes('quota') || error.message?.includes('rate')) {
      console.log('⏰ Rate limit detected')
      return Response.json({
        error: 'Rate limit exceeded',
        errorDetails: error.message,
        courseRecommendations: generateCourseFallback(parsedData || {}),
        source: 'rate_limit_fallback',
        retryAfter: 60,
        timestamp: Date.now()
      }, { status: 429 })
    }

    return Response.json({
      error: 'Recommender agent failed',
      errorDetails: error.message,
      courseRecommendations: generateCourseFallback(parsedData || {}),
      source: 'error_fallback',
      timestamp: Date.now()
    }, { status: 500 })
  }
}

// Minimal course fallback only
function generateCourseFallback(parsedData) {
  console.log('📚 Generating course fallback recommendations')
  
  const skills = parsedData?.skills?.technical || []
  const experience = parsedData?.experience || {}
  
  console.log('🎯 Detected skills for course recommendations:', skills.length)
  
  const baseCourses = [
    {
      title: "AWS Cloud Practitioner Essentials",
      provider: "Coursera",
      skill: "Cloud Computing",
      level: "beginner",
      duration: "4-6 weeks",
      cost: "Free with audit",
      rating: "4.6/5"
    },
    {
      title: "Python for Data Science and AI",
      provider: "Coursera", 
      skill: "Data Analysis",
      level: "intermediate",
      duration: "6-8 weeks",
      cost: "$49/month",
      rating: "4.5/5"
    },
    {
      title: "Complete DevOps Bootcamp",
      provider: "Udemy",
      skill: "DevOps",
      level: "intermediate", 
      duration: "8-10 weeks",
      cost: "$50-100",
      rating: "4.4/5"
    },
    {
      title: "Machine Learning Specialization",
      provider: "Coursera",
      skill: "Machine Learning",
      level: "intermediate",
      duration: "3-4 months", 
      cost: "$49/month",
      rating: "4.8/5"
    },
    {
      title: "Project Management Fundamentals",
      provider: "edX",
      skill: "Project Management",
      level: "beginner",
      duration: "4-6 weeks",
      cost: "Free with certificate option",
      rating: "4.3/5"
    }
  ]
  
  console.log('📋 Generated', baseCourses.length, 'fallback courses')
  return baseCourses
}