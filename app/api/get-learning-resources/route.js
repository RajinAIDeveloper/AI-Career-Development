// app/api/get-learning-resources/route.js
import { geminiClient } from '../../../lib/gemini-client'

export async function POST(request) {
  try {
    const { analysisData } = await request.json()

    const prompt = `Based on this career analysis, find specific online courses with direct links:

${analysisData}

Search for and provide:
1. Skill gaps mentioned in the analysis
2. 5-8 specific online courses from Coursera, Udemy, edX, Pluralsight with:
   - Exact course title
   - Provider platform
   - Direct course URL
   - Course duration
   - Skill level
   - Rating if available

3. 3-5 free resources (YouTube, documentation, tutorials)
4. Industry certifications with exam links

Format as JSON with real, current links. Ensure URLs are working and courses are available.`

    console.log('Learning resources search using load-balanced API keys')
    const result = await geminiClient.generateContent(prompt, {
      tools: [{
        googleSearchRetrieval: {
          dynamicRetrievalConfig: {
            mode: "MODE_DYNAMIC",
            dynamicThreshold: 0.7
          }
        }
      }]
    })
    
    const response = result.response.text()
    const learningResources = parseResourcesResponse(response)
    
    return Response.json({
      ...learningResources,
      apiUsage: geminiClient.getUsageStats()
    })

  } catch (error) {
    console.error('Learning resources error:', error)
    return Response.json({
      courses: [],
      freeResources: [],
      certifications: [],
      error: "Unable to fetch learning resources at this time",
      apiUsage: geminiClient.getUsageStats()
    }, { status: 200 })
  }
}

function parseResourcesResponse(text) {
  const courses = []
  const freeResources = []
  const certifications = []
  
  // Extract course information
  const courseRegex = /(?:Course|Training):\s*(.+?)(?:Provider|Platform):\s*(.+?)(?:URL|Link):\s*(https?:\/\/[^\s]+)/gi
  let match
  while ((match = courseRegex.exec(text)) !== null) {
    courses.push({
      title: match[1].trim(),
      provider: match[2].trim(),
      url: match[3].trim(),
      duration: "Self-paced",
      level: "All levels",
      rating: "4.5+"
    })
  }
  
  // Extract URLs for backup
  const urlRegex = /https?:\/\/(?:www\.)?(coursera|udemy|edx|pluralsight|acloudguru)\.(?:com|org)\/[^\s]+/gi
  const urls = text.match(urlRegex) || []
  
  return {
    courses,
    freeResources,
    certifications
  }
}