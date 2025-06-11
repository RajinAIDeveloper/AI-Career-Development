// app/api/agents/parser-agent/route.js - Pure Extraction Only - Zero Hallucination Parser
import { geminiClient } from '../../../../lib/gemini-client'
import { logger } from '../../../../utils/Logger'

export async function POST(request) {
  logger.agentStart('parser-agent', 'Pure Extraction Data Parsing - Zero Hallucination')
  
  try {
    if (!geminiClient.isServiceAvailable()) {
      const waitTime = geminiClient.getTimeUntilNextKeyAvailable()
      logger.warn('parser-agent', `Service temporarily unavailable. Wait time: ${waitTime}ms`)
      
      return Response.json({ 
        error: 'Service temporarily unavailable',
        details: 'All API keys are rate limited or unavailable',
        retryAfter: Math.ceil(waitTime / 1000),
        waitTimeMs: waitTime
      }, { status: 503 })
    }

    const { rawAnalysis } = await request.json()
    logger.info('parser-agent', `Received raw analysis: ${!!rawAnalysis}`)
    
    const analysisText = rawAnalysis.analysis || rawAnalysis
    logger.debug('parser-agent', `Analysis text length: ${analysisText?.length}`)
    
    if (!analysisText || analysisText.length < 200) {
      logger.error('parser-agent', 'Insufficient analysis data for parsing')
      return Response.json({ 
        error: 'Insufficient analysis data provided',
        details: 'Analysis must contain substantial career information for parsing'
      }, { status: 400 })
    }

    logger.info('parser-agent', 'Preparing pure extraction parsing prompt')
    const parsingPrompt = `You are a PRECISE CAREER DATA PARSER that extracts ONLY the information explicitly mentioned or clearly stated in the analysis. Your mission is PURE EXTRACTION with ZERO GENERATION or HALLUCINATION.

ANALYSIS TO PARSE:
${analysisText}

🎯 **PURE EXTRACTION MISSION - ZERO HALLUCINATION**

**CRITICAL RULES:**
1. Extract ONLY information that is explicitly mentioned in the analysis
2. NEVER generate, invent, or hallucinate any information
3. Use null for missing information
4. Use empty arrays [] for missing lists
5. If skill gaps are not explicitly mentioned, return empty array
6. If career opportunities are not explicitly mentioned, return empty array
7. If salary information is not mentioned, use null values
8. ONLY include data that exists in the provided analysis

Extract and structure into this JSON format with ONLY EXISTING DATA:

{
  "personalInfo": {
    "name": "full name if explicitly mentioned or null",
    "contact": "email/phone if explicitly mentioned or null",
    "location": "city, state/country if explicitly mentioned or null", 
    "linkedIn": "LinkedIn URL if explicitly mentioned or null",
    "website": "personal website/portfolio if explicitly mentioned or null",
    "github": "GitHub profile if explicitly mentioned or null",
    "summary": "professional summary/bio if explicitly mentioned or null",
    "professionalBrand": "personal brand statement if explicitly mentioned or null",
    "timezone": "timezone if explicitly mentioned or null",
    "nationality": "nationality if explicitly mentioned or null",
    "workAuthorization": "work authorization if explicitly mentioned or null",
    "availability": "availability if explicitly mentioned or null",
    "remotePreference": "remote work preference if explicitly mentioned or null"
  },
  "experience": {
    "totalYears": "number_only_if_explicitly_calculated_or_mentioned",
    "currentLevel": "level_only_if_explicitly_mentioned",
    "currentRole": "current job title only if explicitly mentioned",
    "currentCompany": "current company only if explicitly mentioned",
    "careerStage": "career stage only if explicitly mentioned",
    "industryFocus": "industry only if explicitly mentioned",
    "workArrangement": "work arrangement only if explicitly mentioned",
    "managementExperience": "management experience only if explicitly mentioned",
    "roles": [
      {
        "title": "job title only if explicitly mentioned",
        "company": "company name only if explicitly mentioned",
        "duration": "time period only if explicitly mentioned",
        "startDate": "start date only if explicitly mentioned",
        "endDate": "end date only if explicitly mentioned",
        "location": "work location only if explicitly mentioned",
        "employmentType": "employment type only if explicitly mentioned",
        "responsibilities": ["only responsibilities explicitly mentioned"],
        "achievements": ["only achievements explicitly mentioned"],
        "technologies": ["only technologies explicitly mentioned"],
        "teamSize": "team size only if explicitly mentioned",
        "reportingStructure": "reporting structure only if explicitly mentioned",
        "impact": "business impact only if explicitly mentioned"
      }
    ]
  },
  "skills": {
    "technical": [
      {
        "name": "skill name only if explicitly mentioned",
        "category": "category only if explicitly mentioned or clearly inferrable",
        "proficiency": "proficiency only if explicitly mentioned", 
        "yearsUsed": "years only if explicitly mentioned",
        "context": "context only if explicitly mentioned",
        "marketDemand": "market demand only if explicitly mentioned",
        "lastUsed": "timeframe only if explicitly mentioned"
      }
    ],
    "soft": [
      {
        "name": "soft skill only if explicitly mentioned",
        "context": "evidence only if explicitly mentioned", 
        "strength": "strength level only if explicitly mentioned"
      }
    ],
    "tools": [
      {
        "name": "tool name only if explicitly mentioned",
        "category": "category only if explicitly mentioned",
        "usage": "context only if explicitly mentioned",
        "proficiency": "proficiency only if explicitly mentioned",
        "yearsUsed": "years only if explicitly mentioned"
      }
    ],
    "languages": [
      {
        "language": "language only if explicitly mentioned",
        "type": "type only if explicitly mentioned",
        "proficiency": "proficiency only if explicitly mentioned"
      }
    ]
  },
  "education": [
    {
      "degree": "degree title only if explicitly mentioned",
      "field": "field only if explicitly mentioned",
      "institution": "institution only if explicitly mentioned", 
      "year": "year only if explicitly mentioned",
      "grade": "grade only if explicitly mentioned",
      "type": "education type only if explicitly mentioned",
      "status": "status only if explicitly mentioned",
      "location": "location only if explicitly mentioned",
      "specializations": ["only specializations explicitly mentioned"],
      "honors": ["only honors explicitly mentioned"]
    }
  ],
  "certifications": [
    {
      "name": "certification name only if explicitly mentioned",
      "issuer": "issuer only if explicitly mentioned",
      "year": "year only if explicitly mentioned",
      "expiryYear": "expiry only if explicitly mentioned",
      "status": "status only if explicitly mentioned",
      "category": "category only if explicitly mentioned",
      "credentialId": "credential ID only if explicitly mentioned",
      "skillsValidated": ["only skills explicitly mentioned"]
    }
  ],
  "projects": [
    {
      "title": "project title only if explicitly mentioned",
      "description": "description only if explicitly mentioned",
      "role": "role only if explicitly mentioned",
      "technologies": ["only technologies explicitly mentioned"],
      "duration": "duration only if explicitly mentioned",
      "impact": "impact only if explicitly mentioned",
      "type": "type only if explicitly mentioned",
      "url": "URL only if explicitly mentioned",
      "teamSize": "team size only if explicitly mentioned",
      "challenges": ["only challenges explicitly mentioned"],
      "outcomes": ["only outcomes explicitly mentioned"],
      "currentStatus": "status only if explicitly mentioned"
    }
  ],
  "achievements": [
    {
      "description": "achievement only if explicitly mentioned",
      "quantified": "metrics only if explicitly mentioned",
      "context": "context only if explicitly mentioned",
      "year": "year only if explicitly mentioned",
      "impact": "impact only if explicitly mentioned",
      "recognition": "recognition only if explicitly mentioned",
      "category": "category only if explicitly mentioned",
      "scope": "scope only if explicitly mentioned"
    }
  ],
  "skillGaps": [
    {
      "gap": "skill gap only if explicitly mentioned in analysis",
      "importance": "importance only if explicitly mentioned",
      "reason": "reason only if explicitly mentioned",
      "timeToLearn": "timeframe only if explicitly mentioned",
      "priority": "priority only if explicitly mentioned",
      "category": "category only if explicitly mentioned",
      "currentLevel": "current level only if explicitly mentioned",
      "targetLevel": "target level only if explicitly mentioned"
    }
  ],
  "careerOpportunities": [
    {
      "role": "opportunity only if explicitly mentioned in analysis",
      "company": "company type only if explicitly mentioned", 
      "requiredSkills": ["only skills explicitly mentioned"],
      "probability": "probability only if explicitly mentioned",
      "timeToAchieve": "timeframe only if explicitly mentioned",
      "salaryRange": "salary only if explicitly mentioned",
      "marketDemand": "demand only if explicitly mentioned",
      "location": "location only if explicitly mentioned",
      "industry": "industry only if explicitly mentioned",
      "transitionDifficulty": "difficulty only if explicitly mentioned",
      "nextSteps": ["only steps explicitly mentioned"]
    }
  ],
  "salaryInsights": {
    "currentEstimate": "estimate only if explicitly mentioned",
    "growthPotential": "growth only if explicitly mentioned",
    "factors": ["only factors explicitly mentioned"],
    "marketComparison": "comparison only if explicitly mentioned",
    "nextLevelSalary": "next level salary only if explicitly mentioned"
  },
  "marketAnalysis": {
    "demandLevel": "demand only if explicitly mentioned",
    "trendingSkills": ["only trending skills explicitly mentioned"],
    "decliningSkills": ["only declining skills explicitly mentioned"],
    "industryGrowth": "growth only if explicitly mentioned",
    "competitionLevel": "competition only if explicitly mentioned",
    "emergingOpportunities": ["only opportunities explicitly mentioned"],
    "automationRisk": "risk only if explicitly mentioned",
    "futureSkills": ["only future skills explicitly mentioned"]
  },
  "strengths": [
    {
      "strength": "strength only if explicitly mentioned",
      "evidence": "evidence only if explicitly mentioned",
      "marketValue": "value only if explicitly mentioned",
      "uniqueness": "uniqueness only if explicitly mentioned"
    }
  ],
  "developmentAreas": [
    {
      "area": "area only if explicitly mentioned",
      "currentLevel": "level only if explicitly mentioned",
      "targetLevel": "target only if explicitly mentioned",
      "importance": "importance only if explicitly mentioned",
      "timeline": "timeline only if explicitly mentioned"
    }
  ],
  "industryPosition": {
    "currentTier": "tier only if explicitly mentioned",
    "competitiveAdvantages": ["only advantages explicitly mentioned"],
    "brandStrength": "brand strength only if explicitly mentioned",
    "marketRecognition": "recognition only if explicitly mentioned"
  },
  "careerRisks": [
    {
      "risk": "risk only if explicitly mentioned",
      "probability": "probability only if explicitly mentioned",
      "impact": "impact only if explicitly mentioned",
      "mitigation": "mitigation only if explicitly mentioned"
    }
  ]
}

**ABSOLUTE ZERO HALLUCINATION REQUIREMENTS:**

✅ **ONLY EXTRACT** - Never generate, create, or invent information
✅ **USE NULL** - For any missing single values
✅ **USE EMPTY ARRAYS []** - For any missing lists
✅ **NO INTELLIGENT DEFAULTS** - No fallback data generation
✅ **NO ASSUMPTIONS** - Don't assume information not explicitly stated
✅ **EXACT QUOTES** - Use exact wording from analysis when possible
✅ **CLEAR EVIDENCE** - Only include information with clear textual evidence

**FORBIDDEN ACTIONS:**
❌ DO NOT generate skill gaps if none are mentioned
❌ DO NOT create career opportunities if none are stated
❌ DO NOT estimate salaries if not provided
❌ DO NOT infer market conditions if not mentioned
❌ DO NOT create achievements if not explicitly stated
❌ DO NOT generate project details if not provided
❌ DO NOT create education entries if not mentioned
❌ DO NOT invent certifications if not stated

**VALIDATION CHECKLIST:**
- Every piece of data has clear textual evidence in the analysis
- No generated or assumed information included
- All missing data properly marked as null or empty arrays
- Exact extraction with no embellishment or interpretation

Return ONLY the pure extraction JSON object with no additional text, comments, or formatting. Include only information that is explicitly present in the provided analysis.`

    logger.info('parser-agent', 'Making Gemini API call for pure extraction parsing')
    let result
    try {
      result = await geminiClient.generateContent(parsingPrompt, {
        agentType: 'parser-agent'
      })
      logger.agentSuccess('parser-agent', 'Gemini API call successful for pure extraction')
    } catch (apiError) {
      logger.agentError('parser-agent', apiError)
      
      if (apiError.status === 429) {
        return Response.json({
          error: 'Rate limit exceeded',
          errorDetails: 'API rate limit reached. Please try again later.',
          retryAfter: 60,
          timestamp: Date.now(),
          model: geminiClient.currentModel,
          source: 'rate_limit_error'
        }, { status: 429 })
      }
      
      return Response.json({
        error: 'AI parsing failed',
        errorDetails: apiError.message,
        timestamp: Date.now(),
        model: geminiClient.currentModel,
        source: 'api_error'
      }, { status: 500 })
    }

    logger.info('parser-agent', 'Processing pure extraction response')
    const responseText = result.response.text()
    logger.debug('parser-agent', `Response length: ${responseText.length}`)
    
    // Pure JSON extraction without fallbacks
    let parsedData
    try {
      logger.debug('parser-agent', 'Starting pure JSON extraction...')
      
      let jsonText = responseText
        .replace(/```json\s*/g, '').replace(/```javascript\s*/g, '').replace(/```\s*$/g, '')
        .replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/,(\s*[}\]])/g, '$1')
      
      // Find JSON boundaries
      const startIndex = jsonText.indexOf('{')
      let lastIndex = -1
      
      if (startIndex !== -1) {
        let braceCount = 0
        for (let i = startIndex; i < jsonText.length; i++) {
          if (jsonText[i] === '{') braceCount++
          else if (jsonText[i] === '}') {
            braceCount--
            if (braceCount === 0) {
              lastIndex = i
              break
            }
          }
        }
      }
      
      if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
        jsonText = jsonText.substring(startIndex, lastIndex + 1)
          .replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim()
        
        parsedData = JSON.parse(jsonText)
        logger.success('parser-agent', 'Pure extraction JSON parsed successfully')
        
        // Ensure empty arrays/nulls for missing data - NO GENERATION
        const ensureEmptyStructure = (obj, key, defaultValue) => {
          if (!obj.hasOwnProperty(key) || obj[key] === undefined) {
            obj[key] = defaultValue
          }
        }
        
        // Only ensure basic structure exists, but keep it empty if no data
        if (!parsedData.personalInfo) parsedData.personalInfo = {}
        if (!parsedData.experience) parsedData.experience = { roles: [] }
        if (!parsedData.skills) parsedData.skills = { technical: [], soft: [], tools: [], languages: [] }
        
        ensureEmptyStructure(parsedData, 'education', [])
        ensureEmptyStructure(parsedData, 'certifications', [])
        ensureEmptyStructure(parsedData, 'projects', [])
        ensureEmptyStructure(parsedData, 'achievements', [])
        ensureEmptyStructure(parsedData, 'skillGaps', [])
        ensureEmptyStructure(parsedData, 'careerOpportunities', [])
        ensureEmptyStructure(parsedData, 'strengths', [])
        ensureEmptyStructure(parsedData, 'developmentAreas', [])
        ensureEmptyStructure(parsedData, 'careerRisks', [])
        
        if (!parsedData.salaryInsights) {
          parsedData.salaryInsights = {
            currentEstimate: null,
            growthPotential: null,
            factors: [],
            marketComparison: null,
            nextLevelSalary: null
          }
        }
        
        if (!parsedData.marketAnalysis) {
          parsedData.marketAnalysis = {
            demandLevel: null,
            trendingSkills: [],
            decliningSkills: [],
            industryGrowth: null,
            competitionLevel: null,
            emergingOpportunities: [],
            automationRisk: null,
            futureSkills: []
          }
        }
        
        if (!parsedData.industryPosition) {
          parsedData.industryPosition = {
            currentTier: null,
            competitiveAdvantages: [],
            brandStrength: null,
            marketRecognition: null
          }
        }
        
        // Log extraction results
        logger.info('parser-agent', `Pure extraction results:`)
        logger.info('parser-agent', `- Personal info fields: ${Object.keys(parsedData.personalInfo || {}).filter(k => parsedData.personalInfo[k] !== null).length}`)
        logger.info('parser-agent', `- Experience roles: ${parsedData.experience?.roles?.length || 0}`)
        logger.info('parser-agent', `- Technical skills: ${parsedData.skills?.technical?.length || 0}`)
        logger.info('parser-agent', `- Education entries: ${parsedData.education?.length || 0}`)
        logger.info('parser-agent', `- Certifications: ${parsedData.certifications?.length || 0}`)
        logger.info('parser-agent', `- Projects: ${parsedData.projects?.length || 0}`)
        logger.info('parser-agent', `- Achievements: ${parsedData.achievements?.length || 0}`)
        logger.info('parser-agent', `- Skill gaps: ${parsedData.skillGaps?.length || 0}`)
        logger.info('parser-agent', `- Career opportunities: ${parsedData.careerOpportunities?.length || 0}`)
        
      } else {
        throw new Error('No valid JSON boundaries found in response')
      }
    } catch (parseError) {
      logger.error('parser-agent', 'Pure extraction JSON parsing failed', parseError)
      
      // Return minimal structure with all empty/null values - NO GENERATION
      return Response.json({
        personalInfo: {},
        experience: { roles: [] },
        skills: { technical: [], soft: [], tools: [], languages: [] },
        education: [],
        certifications: [],
        projects: [],
        achievements: [],
        skillGaps: [],
        careerOpportunities: [],
        salaryInsights: {
          currentEstimate: null,
          growthPotential: null,
          factors: [],
          marketComparison: null,
          nextLevelSalary: null
        },
        marketAnalysis: {
          demandLevel: null,
          trendingSkills: [],
          decliningSkills: [],
          industryGrowth: null,
          competitionLevel: null,
          emergingOpportunities: [],
          automationRisk: null,
          futureSkills: []
        },
        strengths: [],
        developmentAreas: [],
        industryPosition: {
          currentTier: null,
          competitiveAdvantages: [],
          brandStrength: null,
          marketRecognition: null
        },
        careerRisks: [],
        error: 'JSON parsing failed - returning empty structure',
        parseError: parseError.message,
        timestamp: Date.now(),
        model: geminiClient.currentModel,
        source: 'parse_error_minimal'
      })
    }

    logger.agentSuccess('parser-agent', 'Pure extraction data parsing completed')
    return Response.json({
      ...parsedData,
      timestamp: Date.now(),
      model: geminiClient.currentModel,
      source: 'ai_generated',
      extractionType: 'pure_extraction',
      confidence: 'high',
      extractionResults: {
        personalInfoExtracted: Object.keys(parsedData.personalInfo || {}).filter(k => parsedData.personalInfo[k] !== null).length > 0,
        experienceExtracted: parsedData.experience?.roles?.length > 0,
        skillsExtracted: (parsedData.skills?.technical?.length || 0) > 0,
        educationExtracted: parsedData.education?.length > 0,
        certificationsExtracted: parsedData.certifications?.length > 0,
        projectsExtracted: parsedData.projects?.length > 0,
        achievementsExtracted: parsedData.achievements?.length > 0,
        skillGapsExtracted: parsedData.skillGaps?.length > 0,
        careerOpportunitiesExtracted: parsedData.careerOpportunities?.length > 0,
        salaryInsightsExtracted: !!parsedData.salaryInsights?.currentEstimate,
        marketAnalysisExtracted: !!parsedData.marketAnalysis?.demandLevel
      }
    })

  } catch (error) {
    logger.agentError('parser-agent', error)
    
    return Response.json({
      error: 'Pure extraction parser agent failed',
      errorDetails: error.message,
      timestamp: Date.now(),
      model: geminiClient.currentModel,
      source: 'agent_error'
    }, { status: 500 })
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}