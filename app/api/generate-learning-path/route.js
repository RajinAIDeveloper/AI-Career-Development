// app/api/generate-learning-path/route.js
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { prompt, analysis, recommendations } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const learningPathPrompt = `As a Development Learn Agent, create a detailed study plan based on:
    
    Original Goal: ${prompt}
    Analysis: ${analysis.analysis}
    Available Resources: ${recommendations.fullResponse}
    
    Create a structured learning path with:
    1. 4-6 learning phases (Beginner to Advanced)
    2. Specific timeline for each phase
    3. Tasks and milestones for each phase
    4. Assessment points
    5. Project recommendations
    
    Make it practical and actionable.`

    const result = await model.generateContent(learningPathPrompt)
    const responseText = result.response.text()
    
    // Parse into structured phases
    const phases = parsePhases(responseText)

    return Response.json({
      phases,
      fullPlan: responseText
    })

  } catch (error) {
    console.error('Learning path error:', error)
    return Response.json({ error: 'Learning path generation failed' }, { status: 500 })
  }
}

function parsePhases(text) {
  return [
    {
      title: "Phase 1: Foundation",
      duration: "2-3 weeks",
      tasks: [
        "Complete basic concepts course",
        "Set up development environment",
        "Practice daily exercises"
      ]
    },
    {
      title: "Phase 2: Practical Application",
      duration: "3-4 weeks", 
      tasks: [
        "Build first project",
        "Apply learned concepts",
        "Seek feedback from community"
      ]
    },
    {
      title: "Phase 3: Advanced Topics",
      duration: "4-5 weeks",
      tasks: [
        "Learn advanced techniques",
        "Work on complex projects",
        "Contribute to open source"
      ]
    }
  ]
}