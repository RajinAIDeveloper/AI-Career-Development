// app/api/analyze-prompt/route.js
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ 
        analysis: "Demo: This appears to be a request to learn web design. Key areas include HTML/CSS, JavaScript, UI/UX principles, and responsive design. Recommended starting with fundamentals before advancing to frameworks."
      })
    }

    const { prompt } = await request.json()
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const analysisPrompt = `Analyze this learning request: "${prompt}"
    
    Identify:
    1. Primary learning goal
    2. Skill level indicators  
    3. Domain/field
    4. Learning preferences
    5. Career objectives`

    const result = await model.generateContent(analysisPrompt)
    
    return Response.json({
      analysis: result.response.text()
    })

  } catch (error) {
    console.error('Prompt analysis error:', error)
    return Response.json({ 
      analysis: "Demo analysis: Learning goal identified with structured approach recommended."
    })
  }
}