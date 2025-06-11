// app/api/get-skill-courses/route.js
import { geminiClient } from '../../../lib/gemini-client'

const courseCache = new Map()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

const getCacheKey = (skillGaps) => {
  return skillGaps.sort().join('|').toLowerCase()
}

export async function POST(request) {
  let skillGaps = []
  
  try {
    const body = await request.json()
    skillGaps = body.skillGaps || []
    
    if (skillGaps.length === 0) {
      return Response.json({ courses: [] })
    }

    // Check cache first
    const cacheKey = getCacheKey(skillGaps)
    const cached = courseCache.get(cacheKey)
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('Returning cached courses')
      return Response.json({
        ...cached.data,
        cached: true
      })
    }

    const skillList = skillGaps.map((skill, index) => `${index + 1}. ${skill}`).join('\n')

    const searchPrompt = `Find SPECIFIC online courses for these skill gaps:
${skillGaps.join(', ')}

Use Google Search to find EXACT courses currently available. For each skill gap, find 2-3 specific courses that directly address the skill.

Requirements:
- Find actual course titles from real platforms, not generic searches
- Verify courses exist and are currently available in 2024-2025
- Include direct URLs to course pages (not search results)
- Analyze career impact and advancement opportunities for each course
- Prioritize courses from reputable platforms

For each course found, provide detailed information in JSON format with these fields:
title, provider, url, duration, level, rating, price, skillArea, careerImpact, keyOutcomes, prerequisites, instructorCredentials

Search these platforms thoroughly:
- coursera.org (specializations, professional certificates, university courses)
- udemy.com (practical, hands-on courses)
- edx.org (university-level courses, MicroMasters)
- pluralsight.com (technology-focused learning paths)
- linkedin.com/learning (professional development)
- udacity.com (nanodegrees, career-focused programs)
- acloudguru.com (cloud computing specialization)

For each skill gap identified:
${skillList}

Find courses that specifically target these gaps and provide measurable career advancement. Ensure all URLs are direct course links, not search pages.

Return comprehensive JSON with all courses found, organized by skill area.`

    console.log('Comprehensive course search for skill gaps:', skillGaps)
    
    const result = await geminiClient.generateContent(searchPrompt, {
      tools: [{
        googleSearchRetrieval: {
          dynamicRetrievalConfig: {
            mode: "MODE_DYNAMIC",
            dynamicThreshold: 0.3
          }
        }
      }]
    })
    
    const responseText = result.response.text()
    let courses = parseCoursesFromResponse(responseText, skillGaps)
    
    // Filter out invalid courses
    courses = courses.filter(course => 
      course.title && 
      course.url && 
      course.url !== '#' &&
      !course.title.toLowerCase().includes('search') &&
      !course.title.toLowerCase().includes('find') &&
      !course.url.includes('/search') &&
      (course.url.includes('/course') || 
       course.url.includes('/learn') || 
       course.url.includes('/specialization') ||
       course.url.includes('/nanodegree') ||
       course.url.includes('/professional-certificate') ||
       course.url.includes('/class'))
    )

    // Get API usage stats safely
    let apiUsage = null
    try {
      apiUsage = geminiClient.getUsageStats?.() || null
    } catch (e) {
      console.log('Unable to get API usage stats')
    }

    const responseData = {
      courses: courses,
      searchQuery: skillGaps.join(', '),
      totalFound: courses.length,
      skillGapsAddressed: skillGaps.length,
      ...(apiUsage && { apiUsage })
    }

    // Cache the results
    courseCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    })

    console.log(`Found ${courses.length} specific courses for ${skillGaps.length} skill gaps`)

    return Response.json(responseData)

  } catch (error) {
    console.error('Course search error:', error)
    
    // Get API usage stats safely for error response
    let apiUsage = null
    try {
      apiUsage = geminiClient.getUsageStats?.() || null
    } catch (e) {
      // Ignore if unable to get stats
    }
    
    if (error.status === 429) {
      return Response.json({
        courses: [],
        error: 'Rate limited - please try again later',
        rateLimited: true,
        ...(apiUsage && { apiUsage })
      })
    }
    
    return Response.json({
      courses: [],
      error: 'Course search temporarily unavailable',
      ...(apiUsage && { apiUsage })
    })
  }
}

function parseCoursesFromResponse(text, skillGaps) {
  const courses = []
  
  // Try JSON parsing first
  try {
    const jsonMatch = text.match(/\{[\s\S]*"courses"[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.courses && Array.isArray(parsed.courses)) {
        return parsed.courses.map(course => validateAndFormatCourse(course, skillGaps))
      }
    }
  } catch (e) {
    console.log('JSON parsing failed, using text parsing fallback')
  }
  
  // Fallback to text parsing
  return parseCoursesFromText(text, skillGaps)
}

function parseCoursesFromText(text, skillGaps) {
  const courses = []
  const lines = text.split('\n')
  let currentCourse = {}
  
  lines.forEach(line => {
    const cleanLine = line.trim()
    
    // Detect course title
    if (cleanLine.match(/^[\d\*\-]?\s*[A-Z].*(?:Course|Training|Certification|Specialization|Program|Nanodegree)/i) ||
        cleanLine.match(/^[\d\*\-]?\s*[A-Z][^:]*(?:with|for|in|of)\s+[A-Z]/)) {
      
      if (currentCourse.title) {
        courses.push(validateAndFormatCourse(currentCourse, skillGaps))
      }
      
      currentCourse = {
        title: cleanLine.replace(/^[\d\*\-\s]+/, '').replace(/["']/g, ''),
        skillArea: getMatchingSkill(cleanLine, skillGaps)
      }
    }
    
    // Extract other fields
    const urlMatch = cleanLine.match(/(https?:\/\/[^\s\)]+)/)
    if (urlMatch) currentCourse.url = urlMatch[1]
    
    if (cleanLine.match(/Provider:|Platform:/i)) {
      currentCourse.provider = cleanLine.split(/Provider:|Platform:/i)[1]?.trim()
    }
    
    if (cleanLine.match(/Duration:|Length:/i)) {
      currentCourse.duration = cleanLine.split(/Duration:|Length:/i)[1]?.trim()
    }
    
    if (cleanLine.match(/Rating:/i)) {
      currentCourse.rating = cleanLine.split(/Rating:/i)[1]?.trim()
    }
    
    if (cleanLine.match(/Career Impact:|Impact:/i)) {
      currentCourse.careerImpact = cleanLine.split(/Career Impact:|Impact:/i)[1]?.trim()
    }
    
    if (cleanLine.match(/Level:/i)) {
      currentCourse.level = cleanLine.split(/Level:/i)[1]?.trim()
    }
    
    // Infer provider from URL if not specified
    if (currentCourse.url && !currentCourse.provider) {
      currentCourse.provider = inferProviderFromUrl(currentCourse.url)
    }
  })
  
  // Add the last course
  if (currentCourse.title) {
    courses.push(validateAndFormatCourse(currentCourse, skillGaps))
  }
  
  return courses
}

function validateAndFormatCourse(course, skillGaps) {
  return {
    title: course.title || 'Course Available',
    provider: course.provider || 'Online Platform',
    url: course.url || '#',
    duration: course.duration || 'Self-paced',
    level: course.level || 'All levels',
    rating: course.rating || 'Not specified',
    price: course.price || 'Varies',
    skillArea: course.skillArea || getMatchingSkill(course.title || '', skillGaps),
    careerImpact: course.careerImpact || 'Enhances professional skills and career advancement opportunities',
    keyOutcomes: course.keyOutcomes || ['Practical skills development', 'Industry-relevant knowledge'],
    prerequisites: course.prerequisites || 'None specified',
    instructorCredentials: course.instructorCredentials || 'Industry expert'
  }
}

function inferProviderFromUrl(url) {
  if (url.includes('coursera')) return 'Coursera'
  if (url.includes('udemy')) return 'Udemy'
  if (url.includes('edx')) return 'edX'
  if (url.includes('pluralsight')) return 'Pluralsight'
  if (url.includes('linkedin')) return 'LinkedIn Learning'
  if (url.includes('udacity')) return 'Udacity'
  if (url.includes('acloudguru')) return 'A Cloud Guru'
  return 'Online Platform'
}

function getMatchingSkill(text, skillGaps) {
  const textLower = text.toLowerCase()
  for (const skill of skillGaps) {
    if (textLower.includes(skill.toLowerCase())) {
      return skill
    }
  }
  return skillGaps[0] || 'General'
}