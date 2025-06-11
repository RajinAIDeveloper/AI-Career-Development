// app/api/parse-analysis/route.js
import { geminiClient } from '../../../lib/gemini-client'

// Simple in-memory cache
const parseCache = new Map()

const generateCacheKey = (analysisText, parseType) => {
  const hash = analysisText.substring(0, 100) + parseType
  return Buffer.from(hash).toString('base64').substring(0, 20)
}

export async function POST(request) {
  try {
    const { analysisText, parseType } = await request.json()
    
    if (!analysisText) {
      return Response.json({ error: 'No analysis text provided' }, { status: 400 })
    }

    // Check cache first
    const cacheKey = generateCacheKey(analysisText, parseType)
    if (parseCache.has(cacheKey)) {
      console.log('Returning cached parsed data')
      return Response.json({
        ...parseCache.get(cacheKey),
        cached: true
      })
    }

    let prompt = ""

    if (parseType === 'analysis') {
      prompt = `Extract ONLY the information that exists in this text. DO NOT add or invent data:

${analysisText}

Return JSON with ONLY found information:
{
  "experience": {
    "years": "extract if mentioned, otherwise null",
    "level": "extract if clear from context, otherwise null"
  },
  "skills": [extract actual skills mentioned as {"name": "skillname", "category": "guess category", "proficiency": null}],
  "sections": [extract actual sections as {"title": "exact title", "type": "guess type", "items": ["exact text items"]}],
  "metrics": {
    "totalSkills": count of actual skills found,
    "sectionsCount": count of actual sections,
    "growthLevel": "only if clearly stated"
  }
}

CRITICAL: Only extract what exists. Use null for missing data. Don't invent skills or experience.`

    } else if (parseType === 'recommendations') {
      prompt = `Extract ONLY recommendations that exist in this text. DO NOT add or invent:

${analysisText}

Return JSON with ONLY found recommendations:
{
  "skillGaps": [only gaps explicitly mentioned],
  "strengths": [only strengths explicitly stated], 
  "weaknesses": [only weaknesses explicitly stated],
  "priorities": [only priorities explicitly mentioned],
  "courses": [only courses explicitly recommended],
  "certifications": [only certs explicitly recommended],
  "opportunities": [only opportunities explicitly mentioned],
  "categories": [only categories explicitly mentioned]
}

CRITICAL: Extract only what exists. Use empty arrays for missing data.`
    }

    const result = await geminiClient.generateContent(prompt)
    const responseText = result.response.text()

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0])
      
      // Cache the result
      parseCache.set(cacheKey, parsedData)
      
      return Response.json({
        ...parsedData,
        cached: false,
        apiUsage: geminiClient.getUsageStats()
      })
    }

    throw new Error('Invalid JSON response')

  } catch (error) {
    console.error('Parsing error:', error)
    
    // Minimal fallback - only return empty structure
    const fallback = parseType === 'analysis' ? {
      experience: { years: null, level: null },
      skills: [],
      sections: [],
      metrics: { totalSkills: 0, sectionsCount: 0, growthLevel: null }
    } : {
      skillGaps: [],
      strengths: [],
      weaknesses: [],
      priorities: [],
      courses: [],
      certifications: [],
      opportunities: [],
      categories: []
    }
    
    return Response.json({
      ...fallback,
      error: 'Parsing failed',
      apiUsage: geminiClient.getUsageStats()
    })
  }
}