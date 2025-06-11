// app/api/agents/visualizer/route.js - Fixed version with robust JSON parsing
import { geminiClient } from '../../../../lib/gemini-client'

export async function POST(request) {
  console.log('📊 VISUALIZER AGENT STARTED')
  
  try {
    const { rawAnalysis, parsedData } = await request.json()
    console.log('📥 Received data:', { 
      hasRawAnalysis: !!rawAnalysis, 
      hasParsedData: !!parsedData,
      rawAnalysisLength: rawAnalysis?.analysis?.length || rawAnalysis?.length,
      parsedDataKeys: parsedData ? Object.keys(parsedData) : 'null'
    })
    
    if (!rawAnalysis || !parsedData) {
      console.error('❌ Missing required data for visualization')
      return Response.json({ error: 'Missing analysis data' }, { status: 400 })
    }

    console.log('🤖 Preparing visualization prompt...')
    const visualizationPrompt = `Generate comprehensive visualization data and insights from career analysis:

RAW ANALYSIS: ${rawAnalysis.analysis || rawAnalysis}
PARSED DATA: ${JSON.stringify(parsedData, null, 2)}

Create detailed visualization-ready data in JSON format:
{
  "skillsRadar": {
    "data": [
      {"skill": "JavaScript", "current": 85, "market": 75, "target": 90},
      {"skill": "Python", "current": 70, "market": 80, "target": 85},
      {"skill": "React", "current": 80, "market": 70, "target": 90}
    ],
    "insights": ["You excel in JavaScript compared to market average", "Python skills need improvement"],
    "recommendations": ["Focus on Python frameworks", "Advance React skills to expert level"]
  },
  "careerTimeline": {
    "data": [
      {"year": "2020", "level": 3, "salary": 65, "role": "Junior Developer"},
      {"year": "2021", "level": 4, "salary": 75, "role": "Developer"},
      {"year": "2022", "level": 5, "salary": 85, "role": "Senior Developer"}
    ],
    "insights": ["Steady career progression observed", "Salary growth aligns with market"],
    "projections": ["Continue current trajectory for leadership roles", "Target 15% annual growth"]
  },
  "skillGapMatrix": {
    "data": [
      {"skill": "Cloud Computing", "current": 40, "required": 80, "priority": "High"},
      {"skill": "DevOps", "current": 30, "required": 70, "priority": "Medium"}
    ],
    "insights": ["Major gaps in cloud technologies", "DevOps skills becoming critical"],
    "recommendations": ["Prioritize AWS certification", "Start with Docker and Kubernetes"]
  },
  "marketComparison": {
    "data": [
      {"category": "Technical Skills", "user": 75, "market": 70},
      {"category": "Experience", "user": 80, "market": 75},
      {"category": "Education", "user": 85, "market": 80}
    ],
    "insights": ["Above market average in all categories", "Strong competitive position"],
    "recommendations": ["Maintain technical edge", "Consider leadership development"]
  },
  "salaryProjection": {
    "data": [
      {"year": "2024", "conservative": 90, "optimistic": 100, "target": 95},
      {"year": "2025", "conservative": 95, "optimistic": 110, "target": 105}
    ],
    "insights": ["Good growth potential identified", "Market conditions favorable"],
    "recommendations": ["Negotiate based on market data", "Target mid-range projections"]
  },
  "certificationROI": {
    "data": [
      {"cert": "AWS Architect", "cost": 300, "timeInvestment": 120, "salaryImpact": 15},
      {"cert": "Google Cloud", "cost": 200, "timeInvestment": 80, "salaryImpact": 12}
    ],
    "insights": ["AWS certification offers highest ROI", "Time investment varies significantly"],
    "recommendations": ["Prioritize AWS certification", "Plan 6-month timeline"]
  },
  "industryTrends": {
    "data": [
      {"skill": "AI/ML", "demand": "growing", "adoption": 85},
      {"skill": "Blockchain", "demand": "stable", "adoption": 45},
      {"skill": "IoT", "demand": "declining", "adoption": 30}
    ],
    "insights": ["AI/ML dominates future demand", "Blockchain stabilizing", "IoT declining"],
    "recommendations": ["Invest in AI/ML skills", "Monitor blockchain developments"]
  }
}

REQUIREMENTS:
- Generate realistic data based on actual career information provided
- Include 5-10 data points per visualization
- Provide actionable insights for each chart
- Use percentage scores (0-100) for skill assessments
- Include specific recommendations for improvement
- Return ONLY valid JSON without any comments or explanations`

    console.log('🔄 Making Gemini API call for visualizations...')
    let result
    try {
      result = await geminiClient.generateContent(visualizationPrompt, {
        agentType: 'visualizer'
      })
      console.log('✅ Gemini API call successful for visualizations')
    } catch (apiError) {
      console.error('❌ Gemini API call failed:', apiError.message)
      console.error('🔍 API Error details:', apiError)
      
      // Return error with empty visualizations
      return Response.json({
        error: 'AI visualization generation failed',
        errorDetails: apiError.message,
        source: 'api_error',
        timestamp: Date.now(),
        fallback: generateBasicVisualizationFallback(parsedData)
      }, { status: 206 })
    }

    console.log('📝 Processing visualization response...')
    const responseText = result.response.text()
    console.log('📄 Response length:', responseText.length)
    console.log('🔍 Response preview:', responseText.substring(0, 200))
    
    // Enhanced JSON extraction with robust cleaning
    let visualizations
    try {
      console.log('🔍 Searching for JSON in visualization response...')
      
      // Enhanced JSON cleaning - remove all comments and formatting issues
      let jsonText = responseText
      
      // Remove markdown code blocks
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*$/g, '')
      jsonText = jsonText.replace(/```javascript\s*/g, '').replace(/```\s*$/g, '')
      jsonText = jsonText.replace(/```\s*/g, '').replace(/```\s*$/g, '')
      
      // Remove all types of comments that break JSON parsing
      jsonText = jsonText.replace(/\/\/.*$/gm, '') // Remove single-line comments
      jsonText = jsonText.replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      jsonText = jsonText.replace(/#.*$/gm, '') // Remove hash comments
      
      // Remove trailing commas that break JSON
      jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1')
      
      // Remove any text before first { and after last }
      const startIndex = jsonText.indexOf('{')
      const lastIndex = jsonText.lastIndexOf('}')
      
      if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
        jsonText = jsonText.substring(startIndex, lastIndex + 1)
        console.log('✅ JSON boundaries identified')
        
        // Additional aggressive cleaning
        jsonText = jsonText
          .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
          .replace(/,\s*]/g, ']') // Remove trailing commas before closing brackets
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
          .replace(/\n\s*\n/g, '\n') // Remove empty lines
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim()
        
        // Fix common JSON formatting issues
        jsonText = jsonText
          .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Quote unquoted keys
          .replace(/:\s*([^",\[\{\s][^,\]\}\n]*?)(\s*[,\]\}])/g, (match, value, ending) => {
            // Quote unquoted string values, but not numbers, booleans, or null
            if (!value.match(/^[\d\.\-\+eE]+$/) && !value.match(/^(true|false|null)$/)) {
              return `: "${value.trim()}"${ending}`
            }
            return match
          })
        
        console.log('🧹 Cleaned JSON preview:', jsonText.substring(0, 300) + '...')
        
        visualizations = JSON.parse(jsonText)
        console.log('✅ Visualization JSON parsed successfully')
        console.log('🔑 Visualization keys:', Object.keys(visualizations))
        
        // Validate and log each visualization section
        const sections = ['skillsRadar', 'careerTimeline', 'skillGapMatrix', 'marketComparison', 'salaryProjection', 'certificationROI', 'industryTrends']
        sections.forEach(section => {
          if (visualizations[section]) {
            const data = visualizations[section].data
            console.log(`✅ ${section}: ${Array.isArray(data) ? data.length + ' items' : 'present'}`)
          } else {
            console.log(`❌ ${section}: MISSING`)
          }
        })
        
      } else {
        console.error('❌ No JSON boundaries found in visualization response')
        throw new Error('No valid JSON object found in visualization response')
      }
    } catch (parseError) {
      console.error('❌ Visualization JSON parsing failed:', parseError.message)
      console.log('🔍 Raw response causing error:', responseText.substring(0, 1000))
      
      // Try one more aggressive reconstruction attempt
      try {
        console.log('🔄 Attempting emergency JSON reconstruction...')
        
        // Extract just the data structures we need
        const skillsMatch = responseText.match(/"skillsRadar"\s*:\s*\{[^}]*"data"\s*:\s*\[[^\]]*\]/i)
        const timelineMatch = responseText.match(/"careerTimeline"\s*:\s*\{[^}]*"data"\s*:\s*\[[^\]]*\]/i)
        
        if (skillsMatch || timelineMatch) {
          // Create minimal working visualization
          visualizations = {
            skillsRadar: {
              data: [],
              insights: ["Visualization parsing encountered issues"],
              recommendations: ["Please regenerate visualizations"]
            },
            careerTimeline: {
              data: [],
              insights: ["Timeline data needs regeneration"],
              projections: ["Please try again for detailed timeline"]
            },
            error: 'Partial visualization data recovered',
            source: 'emergency_reconstruction'
          }
          console.log('🚑 Emergency reconstruction partially successful')
        } else {
          throw new Error('Complete parsing failure')
        }
      } catch (emergencyError) {
        console.error('❌ Emergency reconstruction also failed:', emergencyError.message)
        
        // Return error with basic fallback
        return Response.json({
          error: 'Visualization JSON parsing failed',
          errorDetails: parseError.message,
          rawResponse: responseText.substring(0, 500),
          source: 'parse_error',
          timestamp: Date.now(),
          fallback: generateBasicVisualizationFallback(parsedData)
        }, { status: 206 })
      }
    }

    console.log('🎉 Visualizations generated successfully')
    return Response.json({
      ...visualizations,
      timestamp: Date.now(),
      model: geminiClient.currentModel,
      source: 'ai_generated'
    })

  } catch (error) {
    console.error('💥 CRITICAL ERROR in visualizer agent:', error)
    console.error('📊 Error stack:', error.stack)
    
    // Handle rate limiting
    if (error.message?.includes('quota') || error.message?.includes('rate')) {
      console.log('⏰ Rate limit detected in visualizer')
      return Response.json({
        error: 'Rate limit exceeded',
        errorDetails: error.message,
        source: 'rate_limit_error',
        timestamp: Date.now(),
        fallback: generateBasicVisualizationFallback(parsedData || {})
      }, { status: 429 })
    }

    return Response.json({
      error: 'Visualizer agent failed',
      errorDetails: error.message,
      source: 'agent_error',
      timestamp: Date.now(),
      fallback: generateBasicVisualizationFallback(parsedData || {})
    }, { status: 500 })
  }
}

// Enhanced fallback visualization data
function generateBasicVisualizationFallback(parsedData) {
  console.log('📊 Generating enhanced visualization fallback')
  
  const skills = parsedData?.skills?.technical || []
  const experience = parsedData?.experience || {}
  const skillGaps = parsedData?.skillGaps || []
  
  console.log('🎯 Using data for fallback:', { 
    skillsCount: skills.length, 
    hasExperience: !!experience.currentRole,
    gapsCount: skillGaps.length 
  })
  
  // Generate skill radar data from actual skills
  const skillRadarData = skills.slice(0, 6).map(skill => {
    const skillName = skill.name || skill
    const proficiency = skill.proficiency || 'Intermediate'
    
    // Map proficiency to numbers
    const proficiencyMap = {
      'Beginner': 40,
      'Intermediate': 65,
      'Advanced': 85,
      'Expert': 95
    }
    
    const current = proficiencyMap[proficiency] || 65
    const market = Math.max(50, current - 10 + Math.random() * 20)
    const target = Math.min(100, current + 10 + Math.random() * 15)
    
    return {
      skill: skillName,
      current: Math.round(current),
      market: Math.round(market),
      target: Math.round(target)
    }
  })
  
  // If we have no skills, use generic ones
  if (skillRadarData.length === 0) {
    skillRadarData.push(
      { skill: 'Technical Skills', current: 70, market: 65, target: 85 },
      { skill: 'Problem Solving', current: 75, market: 70, target: 90 },
      { skill: 'Communication', current: 60, market: 75, target: 85 }
    )
  }
  
  return {
    skillsRadar: {
      data: skillRadarData,
      insights: [
        'Visualization generated from your CV data',
        skillGaps.length > 0 ? `${skillGaps.length} skill gaps identified for improvement` : 'Skills assessment completed',
        'Complete CV analysis provides more detailed insights'
      ],
      recommendations: [
        'Upload complete CV for personalized insights',
        skillGaps.length > 0 ? 'Focus on addressing identified skill gaps' : 'Continue developing existing skills',
        'Consider industry certifications for advancement'
      ]
    },
    careerTimeline: {
      data: [
        { 
          year: '2022', 
          level: experience.currentLevel === 'Senior' ? 5 : experience.currentLevel === 'Junior' ? 3 : 4, 
          salary: 70, 
          role: 'Professional' 
        },
        { 
          year: '2023', 
          level: experience.currentLevel === 'Senior' ? 6 : experience.currentLevel === 'Junior' ? 4 : 5, 
          salary: 80, 
          role: 'Senior Professional' 
        },
        { 
          year: '2024', 
          level: experience.currentLevel === 'Senior' ? 7 : experience.currentLevel === 'Junior' ? 5 : 6, 
          salary: 90, 
          role: experience.currentRole || 'Lead Professional' 
        }
      ],
      insights: [
        'Career progression based on available data',
        experience.totalYears ? `${experience.totalYears} years of experience detected` : 'Experience timeline estimated',
        'Upload complete CV for accurate timeline'
      ],
      projections: [
        'Continue current growth trajectory',
        'Target 10-15% annual advancement',
        'Focus on skill development for promotion'
      ]
    },
    skillGapMatrix: {
      data: skillGaps.slice(0, 5).map(gap => ({
        skill: gap.gap || gap.skill || 'Skill Development',
        current: 40,
        required: 80,
        priority: gap.importance || gap.priority || 'Medium'
      })),
      insights: [
        skillGaps.length > 0 ? `${skillGaps.length} critical skill gaps identified` : 'No major skill gaps detected',
        'Skills analysis based on industry requirements',
        'Personalized gap analysis available with complete CV'
      ],
      recommendations: [
        'Prioritize high-impact skill development',
        'Consider online courses and certifications',
        'Practice skills through real projects'
      ]
    },
    marketComparison: {
      data: [
        { category: 'Technical Skills', user: 75, market: 70 },
        { category: 'Experience', user: experience.totalYears ? Math.min(90, 60 + (experience.totalYears * 5)) : 70, market: 75 },
        { category: 'Education', user: 80, market: 75 }
      ],
      insights: [
        'Competitive position assessment',
        'Above average in most categories',
        'Strong foundation for career growth'
      ],
      recommendations: [
        'Maintain competitive edge',
        'Continue professional development',
        'Build industry network'
      ]
    },
    fallbackNote: 'Generated from available CV data. Upload complete analysis for detailed insights.',
    timestamp: Date.now(),
    source: 'enhanced_fallback'
  }
}