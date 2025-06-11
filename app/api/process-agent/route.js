// app/api/process-agent/route.js
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ 
        error: 'Gemini API key not configured' 
      }, { status: 500 })
    }

    const { agentId } = await request.json()
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const mockContent = "Professional with 5+ years experience in software development, strong technical skills in JavaScript, Python, React. Led 3 major projects."

    let prompt = ""
    
    switch(agentId) {
      case 'data-analyst':
        prompt = `Analyze career data: ${mockContent}. Extract key metrics and experience details.`
        break
      case 'recommender':
        prompt = `Provide career recommendations for: ${mockContent}. Focus on skill development and growth opportunities.`
        break
      case 'summarizer':
        prompt = `Summarize career profile: ${mockContent}. Highlight strengths, weaknesses, and potential.`
        break
      case 'visualizer':
        prompt = `Identify visualization opportunities for: ${mockContent}. Suggest charts and data representations.`
        break
      case 'test-agent':
        prompt = `Create assessment topics for: ${mockContent}. Identify knowledge gaps and testing areas.`
        break
      case 'learn-agent':
        prompt = `Design learning path for: ${mockContent}. Create structured skill development plan.`
        break
      default:
        return Response.json({ error: 'Unknown agent type' }, { status: 400 })
    }

    const result = await model.generateContent(prompt)
    return Response.json(result.response.text().trim())

  } catch (error) {
    console.error('Agent processing error:', error)
    const demoResponses = {
      'data-analyst': 'Data Analysis: 5+ years software development experience. Key skills: JavaScript, Python, React. Leadership in 3 projects.',
      'recommender': 'Recommendations: Pursue cloud certifications (AWS/Azure), develop management skills, join tech leadership communities.',
      'summarizer': 'Summary: Strong technical professional with leadership potential. Focus areas: cloud technologies, team management.',
      'visualizer': 'Visualization: Skills matrix, career timeline, performance metrics dashboard suitable for charts.',
      'test-agent': 'Test Topics: Cloud architecture, advanced JavaScript, project management, leadership scenarios.',
      'learn-agent': 'Learning Path: Phase 1: Advanced JavaScript (2 weeks), Phase 2: Cloud certification (1 month), Phase 3: Leadership (3 weeks).'
    }
    
    return Response.json(demoResponses[agentId] || 'Analysis completed with demo data.')
  }
}