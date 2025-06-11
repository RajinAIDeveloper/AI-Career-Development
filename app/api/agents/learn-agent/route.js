// app/api/agents/learn-agent/route.js - Thorough Personalized Learning
import { geminiClient } from '../../../../lib/gemini-client'

export async function POST(request) {
  console.log('📚 LEARN AGENT STARTED - Personalized Learning Generation')
  
  try {
    const { parsedData } = await request.json()
    console.log('📥 Received parsed data:', !!parsedData)
    console.log('🔍 Data keys:', parsedData ? Object.keys(parsedData) : 'null')
    
    if (!parsedData) {
      console.error('❌ No parsed data provided')
      return Response.json({ 
        error: 'No career analysis data provided',
        details: 'Parsed career data is required to generate personalized learning content'
      }, { status: 400 })
    }

    // Validate essential data exists
    if (!parsedData.skills && !parsedData.skillGaps && !parsedData.careerOpportunities) {
      console.error('❌ Insufficient data for learning generation')
      return Response.json({
        error: 'Insufficient career data',
        details: 'Skills, gaps, or career opportunities data required for learning recommendations'
      }, { status: 400 })
    }

    console.log('🤖 Preparing thorough learning analysis prompt...')
    const learningPrompt = `You are an Expert Learning Architect and Career Development Specialist. Create a comprehensive, highly personalized learning program based on this specific professional's career analysis.

CAREER ANALYSIS DATA:
Current Role: ${parsedData.experience?.currentRole || 'Not specified'}
Experience Level: ${parsedData.experience?.currentLevel || 'Not specified'} (${parsedData.experience?.totalYears || 0} years)
Industry Position: ${parsedData.industryPosition?.currentTier || 'Not specified'}

CURRENT SKILLS:
Technical Skills: ${JSON.stringify(parsedData.skills?.technical || [])}
Soft Skills: ${JSON.stringify(parsedData.skills?.soft || [])}
Tools: ${JSON.stringify(parsedData.skills?.tools || [])}

IDENTIFIED SKILL GAPS:
${JSON.stringify(parsedData.skillGaps || [])}

CAREER OPPORTUNITIES:
${JSON.stringify(parsedData.careerOpportunities || [])}

DEVELOPMENT AREAS:
${JSON.stringify(parsedData.developmentAreas || [])}

CAREER STAGE: ${parsedData.experience?.careerStage || 'Not specified'}

COMPREHENSIVE LEARNING PROGRAM REQUIREMENTS:

Generate a JSON response with deeply personalized learning content:

{
  "learningStrategy": {
    "primaryGoal": "specific career advancement goal based on their current position",
    "timeframe": "realistic timeline for achieving next career level",
    "focusAreas": ["3-4 most critical areas for their advancement"],
    "learningApproach": "recommended learning methodology for their experience level"
  },
  "learningPath": {
    "totalDuration": "realistic completion time",
    "weeklyCommitment": "sustainable hours per week",
    "modules": [
      {
        "title": "specific module name addressing their exact needs",
        "priority": "Critical|High|Medium",
        "duration": "weeks to complete",
        "difficulty": "Beginner|Intermediate|Advanced",
        "prerequisites": ["specific current skills they have"],
        "objectives": ["specific, measurable learning outcomes"],
        "careerImpact": "direct career benefit for their role progression",
        "lessons": [
          {
            "title": "specific lesson addressing their skill gap",
            "content": "detailed learning content with practical examples relevant to their industry",
            "practicalApplication": "how to apply this in their current/target role",
            "exercises": [
              {
                "type": "hands-on|project|assessment",
                "description": "specific exercise using their domain knowledge",
                "deliverable": "concrete output they'll create",
                "timeEstimate": "realistic completion time",
                "skillsApplied": ["skills they'll practice"]
              }
            ],
            "realWorldProject": {
              "description": "project directly applicable to their career goals",
              "scope": "project boundaries and requirements",
              "technologies": ["specific to their tech stack"],
              "outcome": "measurable result for their portfolio"
            }
          }
        ],
        "capstoneProject": {
          "description": "major project solving problems in their industry",
          "businessValue": "real business impact this project could have",
          "portfolioWorth": "how this enhances their professional portfolio",
          "deliverables": ["specific outputs for their career advancement"],
          "timeEstimate": "realistic project timeline",
          "skillsDemonstrated": ["skills validated through this project"]
        }
      }
    ],
    "milestones": [
      {
        "week": number,
        "achievement": "specific skill milestone for their progression",
        "careerRelevance": "how this milestone advances their career",
        "assessment": "how to measure achievement",
        "nextOpportunity": "immediate application opportunity"
      }
    ]
  },
  "personalizedCourses": [
    {
      "title": "course specifically designed for their advancement needs",
      "provider": "real provider offering this type of training",
      "targetGap": "specific skill gap this addresses from their analysis",
      "careerRelevance": "direct benefit to their career progression",
      "duration": "realistic completion time",
      "level": "appropriate for their current experience",
      "prerequisites": ["skills they already have"],
      "learningOutcomes": ["specific competencies they'll gain"],
      "practicalProjects": ["hands-on projects using their domain"],
      "certificationValue": "professional certification benefits",
      "immediateApplication": "how to use this knowledge in their current role",
      "salaryImpact": "potential salary increase from this skill",
      "marketDemand": "current industry demand for this skill",
      "nextCourses": ["logical progression courses after this"]
    }
  ],
  "skillDevelopmentPlan": {
    "immediateSkills": [
      {
        "skill": "specific skill needed for their next promotion",
        "currentGap": "assessment of their current level vs required",
        "learningPath": "step-by-step approach to master this skill",
        "resources": ["specific, high-quality learning resources"],
        "timeToCompetency": "realistic timeline to professional competency",
        "practiceOpportunities": ["where they can apply this skill"],
        "measurementCriteria": ["how to assess their progress"]
      }
    ],
    "mediumTermSkills": [
      {
        "skill": "skill needed for medium-term career goals",
        "strategicValue": "why this skill is crucial for their career path",
        "prerequisites": ["skills to develop first"],
        "learningSequence": ["ordered learning progression"],
        "industryRelevance": "current and future industry importance"
      }
    ]
  },
  "practicalApplication": {
    "currentRoleEnhancements": [
      {
        "area": "specific improvement area in their current role",
        "skills": ["skills to develop for this improvement"],
        "implementation": "how to apply new skills immediately",
        "measurableOutcome": "specific result they can achieve",
        "timeframe": "when they can expect to see results"
      }
    ],
    "portfolioProjects": [
      {
        "project": "specific project to showcase new skills",
        "businessProblem": "real problem this project solves",
        "technologies": ["relevant to their career path"],
        "complexity": "appropriate for their skill level",
        "timeline": "realistic completion schedule",
        "careerBenefit": "how this project advances their goals"
      }
    ]
  },
  "progressTracking": {
    "weeklyAssessments": [
      {
        "week": number,
        "focus": "specific skill area being developed",
        "assessmentMethod": "how to evaluate progress",
        "successCriteria": "measurable success indicators",
        "adjustmentTriggers": ["when to modify the learning plan"]
      }
    ],
    "careerAlignmentReviews": [
      {
        "milestone": "significant learning achievement",
        "careerProgressCheck": "how this advances their career goals",
        "nextOpportunities": ["doors this opens for them"],
        "skillValidation": "how to demonstrate competency professionally"
      }
    ]
  }
}

CRITICAL REQUIREMENTS:
1. Base ALL recommendations on their specific skill gaps and career opportunities
2. Address their exact experience level and career stage
3. Create learning paths that directly advance their stated career goals
4. Ensure all courses fill critical gaps identified in their analysis
5. Provide realistic timelines based on their current commitments
6. Focus on immediately applicable skills for their industry/role
7. Include specific, measurable outcomes for every learning component
8. Design projects that enhance their professional portfolio
9. Consider their current technical stack and build upon it logically
10. Provide clear career progression mapping for each skill developed

PERSONALIZATION DEPTH:
- Use their exact role title and responsibilities
- Build on their existing skills rather than starting from scratch
- Address their specific industry and market position
- Consider their career stage (early/mid/senior) in difficulty and approach
- Align with their identified career opportunities and target roles
- Factor in their current company type and work environment`

    console.log('🔄 Making Gemini API call for personalized learning generation...')
    let result
    try {
      result = await geminiClient.generateContent(learningPrompt, {
        agentType: 'learn-agent'
      })
      console.log('✅ Gemini API call successful')
    } catch (apiError) {
      console.error('❌ Gemini API call failed:', apiError.message)
      
      return Response.json({
        error: 'Learning content generation failed',
        errorDetails: apiError.message,
        timestamp: Date.now(),
        model: geminiClient.currentModel,
        source: 'api_error'
      }, { status: 500 })
    }

    console.log('📝 Processing learning content response...')
    const responseText = result.response.text()
    console.log('📄 Response length:', responseText.length)
    console.log('🔍 Response preview:', responseText.substring(0, 300))
    
    // Extract and validate JSON
    let learningContent
    try {
      console.log('🔍 Searching for JSON in learning response...')
      
      // Clean and extract JSON with improved handling
      let jsonText = responseText
      
      // Remove markdown code blocks
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*$/g, '')
      
      // Remove comments that break JSON parsing
      jsonText = jsonText.replace(/\/\/.*$/gm, '') // Remove single-line comments
      jsonText = jsonText.replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      
      // Remove any trailing commas that might break JSON
      jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1')
      
      // Find JSON object boundaries
      const startIndex = jsonText.indexOf('{')
      let lastIndex = jsonText.lastIndexOf('}')
      
      // If we can't find proper boundaries, try to reconstruct
      if (startIndex === -1 || lastIndex === -1 || lastIndex <= startIndex) {
        console.warn('⚠️ Could not find valid JSON boundaries, attempting reconstruction...')
        
        // Try to find the main structure and reconstruct
        const lines = jsonText.split('\n')
        let reconstructed = '{\n'
        let braceCount = 0
        let started = false
        
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith('//')) continue
          
          if (trimmed.includes('{')) {
            braceCount += (trimmed.match(/\{/g) || []).length
            started = true
          }
          if (trimmed.includes('}')) {
            braceCount -= (trimmed.match(/\}/g) || []).length
          }
          
          if (started) {
            reconstructed += line + '\n'
          }
          
          if (started && braceCount === 0) break
        }
        
        jsonText = reconstructed
        lastIndex = jsonText.lastIndexOf('}')
      }
      
      if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
        jsonText = jsonText.substring(startIndex, lastIndex + 1)
        console.log('✅ JSON boundaries identified')
        console.log('🔍 Cleaned JSON preview:', jsonText.substring(0, 200) + '...')
        
        // Additional cleaning for common AI response issues
        jsonText = jsonText
          .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
          .replace(/,\s*]/g, ']') // Remove trailing commas before closing brackets
          .replace(/\n\s*\n/g, '\n') // Remove empty lines
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        
        learningContent = JSON.parse(jsonText)
        console.log('✅ Learning content JSON parsed successfully')
        console.log('🔑 Learning content keys:', Object.keys(learningContent))
        
        // Validate essential structure
        const requiredKeys = ['learningStrategy', 'learningPath', 'personalizedCourses']
        const missingKeys = requiredKeys.filter(key => !learningContent[key])
        
        if (missingKeys.length > 0) {
          console.warn('⚠️ Missing required learning keys:', missingKeys)
          return Response.json({
            error: 'Incomplete learning content structure',
            missingKeys,
            errorDetails: 'AI response missing required learning sections',
            timestamp: Date.now(),
            model: geminiClient.currentModel,
            source: 'incomplete_learning_structure'
          }, { status: 422 })
        }
        
        console.log('✅ Learning content validation completed')
        
      } else {
        throw new Error('No valid JSON object found in learning response')
      }
    } catch (parseError) {
      console.error('❌ Learning JSON parsing failed:', parseError.message)
      console.log('🔍 Raw response causing error:', responseText.substring(0, 1000))
      
      // Try one more time with aggressive cleaning
      try {
        console.log('🔄 Attempting aggressive JSON reconstruction...')
        
        // Extract what looks like JSON structure
        const jsonPattern = /\{[\s\S]*\}/
        const match = responseText.match(jsonPattern)
        
        if (match) {
          let cleanJson = match[0]
          
          // Aggressive cleaning
          cleanJson = cleanJson
            .replace(/\/\/.*$/gm, '') // Remove comments
            .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
            .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Quote unquoted keys
            .replace(/:\s*([^",\[\{\s][^,\]\}\n]*)/g, (match, value) => {
              // Quote unquoted string values
              if (!value.match(/^[\d\.\-\+eE]+$/) && !value.match(/^(true|false|null)$/)) {
                return `: "${value.trim()}"`
              }
              return match
            })
          
          learningContent = JSON.parse(cleanJson)
          console.log('✅ Aggressive cleaning successful')
        } else {
          throw new Error('Could not extract JSON pattern')
        }
      } catch (secondParseError) {
        console.error('❌ Aggressive cleaning also failed:', secondParseError.message)
        
        return Response.json({
          error: 'Learning content parsing failed',
          errorDetails: `JSON parsing failed: ${parseError.message}`,
          secondaryError: secondParseError.message,
          rawResponse: responseText.substring(0, 1000),
          timestamp: Date.now(),
          model: geminiClient.currentModel,
          source: 'parse_error'
        }, { status: 422 })
      }
    }

    console.log('🎉 Personalized learning content generated successfully')
    return Response.json({
      ...learningContent,
      timestamp: Date.now(),
      model: geminiClient.currentModel,
      source: 'ai_generated',
      personalizationLevel: 'high',
      dataBasedOn: {
        skillsAnalyzed: parsedData.skills?.technical?.length || 0,
        gapsIdentified: parsedData.skillGaps?.length || 0,
        opportunitiesTargeted: parsedData.careerOpportunities?.length || 0,
        experienceLevel: parsedData.experience?.currentLevel
      }
    })

  } catch (error) {
    console.error('💥 CRITICAL ERROR in learn agent:', error)
    
    return Response.json({
      error: 'Learning agent failed',
      errorDetails: error.message,
      timestamp: Date.now(),
      model: geminiClient.currentModel,
      source: 'agent_error'
    }, { status: 500 })
  }
}