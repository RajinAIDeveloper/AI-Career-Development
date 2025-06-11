// app/api/get-recommendations/route.js
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { analysis } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const searchPrompt = `As a Recommendation Agent with Google Grounding capabilities, based on this analysis:
    ${analysis.analysis}
    
    Search for and provide:
    1. Top 5 current online courses with actual URLs from platforms like Coursera, Udemy, edX, Pluralsight
    2. Free resources and tutorials
    3. Industry certifications
    4. Books and documentation
    5. Do's and Don'ts for this learning path
    6. Study plan recommendations
    
    Ensure all course links are real and current. Use Google Grounding to verify information.`

    const result = await model.generateContent(searchPrompt)
    const responseText = result.response.text()
    
    // Parse the response to extract structured data
    const courses = extractCourses(responseText)
    const dosAndDonts = extractDosAndDonts(responseText)

    return Response.json({
      courses,
      dosAndDonts,
      fullResponse: responseText
    })

  } catch (error) {
    console.error('Recommendations error:', error)
    return Response.json({ error: 'Recommendations failed' }, { status: 500 })
  }
}

function extractCourses(text) {
  // Simple extraction logic - in production, use more sophisticated parsing
  const courses = []
  const lines = text.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.includes('http') && (line.includes('coursera') || line.includes('udemy') || line.includes('edx'))) {
      courses.push({
        title: lines[i-1] || 'Course',
        description: lines[i+1] || 'Professional course',
        provider: line.includes('coursera') ? 'Coursera' : line.includes('udemy') ? 'Udemy' : 'edX',
        link: line.match(/https?:\/\/[^\s]+/)?.[0]
      })
    }
  }
  
  return courses.slice(0, 5) // Limit to 5 courses
}

function extractDosAndDonts(text) {
  return {
    dos: [
      "Start with fundamentals",
      "Practice regularly",
      "Join communities",
      "Build projects"
    ],
    donts: [
      "Skip the basics",
      "Learn in isolation",
      "Avoid hands-on practice",
      "Rush through concepts"
    ]
  }
}