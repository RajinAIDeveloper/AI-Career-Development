// app/api/generate-study-plan/route.js
import { geminiClient } from '../../../lib/gemini-client'

const studyPlanCache = new Map()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

const getCacheKey = (skillGaps) => {
  return skillGaps.sort().join('|').toLowerCase()
}

export async function POST(request) {
  let skillGaps = []
  
  try {
    const body = await request.json()
    skillGaps = body.skillGaps || []
    
    if (skillGaps.length === 0) {
      return Response.json({ 
        phases: [],
        totalDuration: "0 weeks",
        estimatedHours: "0 hours per week"
      })
    }

    const cacheKey = getCacheKey(skillGaps)
    const cached = studyPlanCache.get(cacheKey)
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('Returning cached study plan')
      return Response.json({
        ...cached.data,
        cached: true
      })
    }

    const studyPlanPrompt = `Create a detailed study plan for these skill gaps: ${skillGaps.join(', ')}

Generate a comprehensive learning roadmap with:
- 3-4 progressive phases (Foundation → Intermediate → Advanced → Mastery)
- Specific timeline for each phase
- Actionable tasks and milestones
- Study time recommendations
- Assessment points

For each phase, provide:
- Title and focus area
- Duration (weeks)
- Key learning objectives
- Specific tasks to complete
- Projects to build
- Assessment methods

Return structured JSON:
{
  "phases": [
    {
      "title": "Phase name",
      "duration": "X weeks",
      "focus": "What this phase covers",
      "objectives": ["Learning goal 1", "Learning goal 2"],
      "tasks": ["Specific task 1", "Specific task 2"],
      "projects": ["Project to build"],
      "assessment": "How to measure progress"
    }
  ],
  "totalDuration": "X-Y weeks",
  "estimatedHours": "X-Y hours per week",
  "prerequisites": ["Any required background"],
  "learningPath": "Brief description of overall approach"
}

Make it practical and achievable for working professionals.`

    console.log('Generating study plan for skill gaps:', skillGaps)
    
    const result = await geminiClient.generateContent(studyPlanPrompt)
    const responseText = result.response.text()
    
    let studyPlan = parseStudyPlanResponse(responseText, skillGaps)

    let apiUsage = null
    try {
      apiUsage = geminiClient.getUsageStats?.() || null
    } catch (e) {
      console.log('Unable to get API usage stats')
    }

    const responseData = {
      ...studyPlan,
      skillGaps: skillGaps,
      createdAt: new Date().toISOString(),
      ...(apiUsage && { apiUsage })
    }

    studyPlanCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    })

    console.log(`Generated study plan with ${studyPlan.phases.length} phases`)

    return Response.json(responseData)

  } catch (error) {
    console.error('Study plan generation error:', error)
    
    let apiUsage = null
    try {
      apiUsage = geminiClient.getUsageStats?.() || null
    } catch (e) {
      // Ignore
    }
    
    if (error.status === 429) {
      return Response.json({
        phases: generateFallbackStudyPlan(skillGaps).phases,
        totalDuration: "18-26 weeks",
        estimatedHours: "4-6 hours per week",
        error: 'Rate limited - using fallback plan',
        rateLimited: true,
        ...(apiUsage && { apiUsage })
      })
    }
    
    return Response.json({
      phases: generateFallbackStudyPlan(skillGaps).phases,
      totalDuration: "18-26 weeks",
      estimatedHours: "4-6 hours per week",
      error: 'Study plan generation unavailable',
      ...(apiUsage && { apiUsage })
    })
  }
}

function parseStudyPlanResponse(text, skillGaps) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.phases && Array.isArray(parsed.phases)) {
        return {
          phases: parsed.phases.map(phase => ({
            title: phase.title || 'Learning Phase',
            duration: phase.duration || '4-6 weeks',
            focus: phase.focus || 'Skill development',
            objectives: phase.objectives || ['Build foundational knowledge'],
            tasks: phase.tasks || ['Complete relevant courses', 'Practice exercises'],
            projects: phase.projects || ['Build portfolio project'],
            assessment: phase.assessment || 'Self-assessment and project review'
          })),
          totalDuration: parsed.totalDuration || '18-26 weeks',
          estimatedHours: parsed.estimatedHours || '4-6 hours per week',
          prerequisites: parsed.prerequisites || ['None'],
          learningPath: parsed.learningPath || 'Structured progression from basics to advanced'
        }
      }
    }
  } catch (e) {
    console.log('JSON parsing failed, using text parsing')
  }
  
  return parseStudyPlanFromText(text, skillGaps)
}

function parseStudyPlanFromText(text, skillGaps) {
  const phases = []
  const lines = text.split('\n')
  let currentPhase = {}
  
  lines.forEach(line => {
    const cleanLine = line.trim()
    
    if (cleanLine.match(/Phase \d+|Step \d+|Stage \d+/i) || 
        cleanLine.match(/Foundation|Intermediate|Advanced|Mastery/i)) {
      
      if (currentPhase.title) {
        phases.push(currentPhase)
      }
      
      currentPhase = {
        title: cleanLine,
        tasks: [],
        objectives: []
      }
    }
    
    if (cleanLine.match(/Duration:|Timeline:/i)) {
      currentPhase.duration = cleanLine.split(/Duration:|Timeline:/i)[1]?.trim()
    }
    
    if (cleanLine.match(/Focus:|Objectives?:/i)) {
      currentPhase.focus = cleanLine.split(/Focus:|Objectives?:/i)[1]?.trim()
    }
    
    if (cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
      const task = cleanLine.replace(/^[-•]\s*/, '')
      if (task.length > 5) {
        currentPhase.tasks = currentPhase.tasks || []
        currentPhase.tasks.push(task)
      }
    }
  })
  
  if (currentPhase.title) {
    phases.push(currentPhase)
  }
  
  if (phases.length === 0) {
    return generateFallbackStudyPlan(skillGaps)
  }
  
  return {
    phases: phases.map(phase => ({
      title: phase.title || 'Learning Phase',
      duration: phase.duration || '4-6 weeks',
      focus: phase.focus || 'Skill development',
      objectives: phase.objectives || ['Build knowledge'],
      tasks: phase.tasks || ['Study and practice'],
      projects: ['Apply skills in project'],
      assessment: 'Progress review'
    })),
    totalDuration: `${phases.length * 4}-${phases.length * 6} weeks`,
    estimatedHours: '4-6 hours per week',
    prerequisites: ['Basic understanding of fundamentals'],
    learningPath: 'Progressive skill building'
  }
}

function generateFallbackStudyPlan(skillGaps) {
  return {
    phases: [
      {
        title: "Foundation Phase",
        duration: "4-6 weeks",
        focus: "Core concepts and fundamentals",
        objectives: ["Understand basic concepts", "Set up learning environment"],
        tasks: [
          "Complete beginner-level courses in identified skill gaps",
          "Set up development environment and tools", 
          "Practice basic exercises daily (1-2 hours)",
          "Join relevant communities and forums"
        ],
        projects: ["Build simple practice projects"],
        assessment: "Complete foundational exercises"
      },
      {
        title: "Practical Application",
        duration: "6-8 weeks",
        focus: "Hands-on projects and real-world application", 
        objectives: ["Apply learned concepts", "Build portfolio"],
        tasks: [
          "Build 2-3 small projects using new skills",
          "Contribute to open-source projects",
          "Seek mentorship or code reviews",
          "Document learning progress and portfolio"
        ],
        projects: ["Complete 2-3 portfolio projects"],
        assessment: "Project reviews and peer feedback"
      },
      {
        title: "Advanced Mastery",
        duration: "8-12 weeks",
        focus: "Advanced concepts and specialization",
        objectives: ["Master advanced topics", "Lead projects"],
        tasks: [
          "Take advanced courses and certifications",
          "Lead a significant project using new skills", 
          "Teach or mentor others in basic concepts",
          "Stay updated with latest trends and best practices"
        ],
        projects: ["Lead complex project or team"],
        assessment: "Professional project completion"
      }
    ],
    totalDuration: "18-26 weeks",
    estimatedHours: "4-6 hours per week",
    prerequisites: ["Basic computer skills", "Time commitment"],
    learningPath: "Structured progression from fundamentals to mastery"
  }
}