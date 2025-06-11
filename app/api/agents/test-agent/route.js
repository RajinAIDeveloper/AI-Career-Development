// app/api/agents/learn-agent/route.js - Comprehensive Personalized Learning System
import { geminiClient } from '../../../../lib/gemini-client'
import { logger } from '../../../../utils/Logger'

export async function POST(request) {
  logger.agentStart('learn-agent', 'Comprehensive Personalized Learning Generation')
  
  try {
    const { parsedData } = await request.json()
    logger.info('learn-agent', 'Request received', { 
      hasParsedData: !!parsedData, 
      dataKeys: parsedData ? Object.keys(parsedData) : 'null'
    })
    
    if (!parsedData) {
      logger.error('learn-agent', 'No parsed data provided')
      return Response.json({ 
        error: 'No career analysis data provided',
        details: 'Parsed career data is required to generate personalized learning content'
      }, { status: 400 })
    }

    // Validate essential data exists
    if (!parsedData.skills && !parsedData.skillGaps && !parsedData.careerOpportunities) {
      logger.error('learn-agent', 'Insufficient data for learning generation')
      return Response.json({
        error: 'Insufficient career data',
        details: 'Skills, gaps, or career opportunities data required for learning recommendations'
      }, { status: 400 })
    }

    logger.info('learn-agent', 'Preparing comprehensive learning analysis prompt...')
    const learningPrompt = `You are an Expert Learning Architect and Career Development Specialist. Create a comprehensive, highly personalized learning system based on this specific professional's career analysis.

CAREER ANALYSIS DATA:
Current Role: ${parsedData.experience?.currentRole || 'Not specified'}
Experience Level: ${parsedData.experience?.currentLevel || 'Not specified'} (${parsedData.experience?.totalYears || 0} years)
Industry: ${parsedData.experience?.industryFocus || 'Not specified'}
Career Stage: ${parsedData.experience?.careerStage || 'Not specified'}

CURRENT SKILLS:
Technical Skills: ${JSON.stringify(parsedData.skills?.technical || [])}
Soft Skills: ${JSON.stringify(parsedData.skills?.soft || [])}
Tools: ${JSON.stringify(parsedData.skills?.tools || [])}
Languages: ${JSON.stringify(parsedData.skills?.languages || [])}

SKILL GAPS IDENTIFIED:
${JSON.stringify(parsedData.skillGaps || [])}

CAREER OPPORTUNITIES:
${JSON.stringify(parsedData.careerOpportunities || [])}

DEVELOPMENT AREAS:
${JSON.stringify(parsedData.developmentAreas || [])}

EDUCATION BACKGROUND:
${JSON.stringify(parsedData.education || [])}

CERTIFICATIONS:
${JSON.stringify(parsedData.certifications || [])}

PROJECTS EXPERIENCE:
${JSON.stringify(parsedData.projects || [])}

Generate a comprehensive JSON response with deeply personalized learning content:

{
  "learningStrategy": {
    "primaryGoal": "specific career advancement goal based on their opportunities and current position",
    "timeframe": "realistic timeline based on their experience level and target roles",
    "focusAreas": ["3-4 most critical areas from their skill gaps and career opportunities"],
    "learningApproach": "recommended methodology based on their learning style and experience level",
    "careerImpact": "specific career benefits this strategy will deliver",
    "successMetrics": ["measurable outcomes to track progress"]
  },
  "learningPath": {
    "totalDuration": "realistic completion time based on their gaps and schedule",
    "weeklyCommitment": "sustainable hours per week based on their career stage",
    "modules": [
      {
        "title": "specific module name addressing their exact skill gaps",
        "priority": "Critical|High|Medium based on their career opportunities",
        "duration": "weeks to complete this specific module",
        "difficulty": "Beginner|Intermediate|Advanced based on their current level",
        "prerequisites": ["skills they already have that support this module"],
        "objectives": ["specific, measurable learning outcomes for their career"],
        "careerImpact": "direct career benefit for their role progression",
        "skillsTargeted": ["specific skills from their gaps this module addresses"],
        "lessons": [
          {
            "title": "specific lesson addressing their skill gap",
            "content": "detailed learning content with practical examples relevant to their industry and role",
            "practicalApplication": "how to apply this in their current/target role",
            "exercises": [
              {
                "type": "hands-on|project|assessment based on learning style",
                "description": "specific exercise using their domain knowledge and experience",
                "deliverable": "concrete output they'll create for their portfolio",
                "timeEstimate": "realistic completion time",
                "skillsApplied": ["skills they'll practice from their development areas"],
                "careerRelevance": "how this exercise benefits their career goals"
              }
            ],
            "realWorldProject": {
              "description": "project directly applicable to their industry and career goals",
              "scope": "project boundaries relevant to their experience level",
              "technologies": ["tools/technologies from their current stack and gaps"],
              "outcome": "measurable result for their portfolio and career",
              "businessValue": "real business impact this project demonstrates",
              "portfolioImpact": "how this enhances their professional portfolio"
            }
          }
        ],
        "capstoneProject": {
          "description": "major project solving problems in their specific industry",
          "businessValue": "real business impact relevant to their field",
          "portfolioWorth": "professional value for their career advancement",
          "deliverables": ["specific outputs for their career advancement"],
          "timeEstimate": "realistic project timeline based on their schedule",
          "skillsDemonstrated": ["skills validated through this project"],
          "careerPositioning": "how this project positions them for target roles"
        },
        "assessmentCriteria": ["how progress and mastery will be measured"],
        "industryRelevance": "specific relevance to their industry and roles"
      }
    ],
    "milestones": [
      {
        "week": "week number",
        "achievement": "specific skill milestone based on their learning path",
        "careerRelevance": "how this milestone advances their specific career goals",
        "assessment": "how to measure achievement of this milestone",
        "nextOpportunity": "immediate application opportunity in their field",
        "skillsGained": ["specific skills acquired by this milestone"],
        "portfolioAddition": "what gets added to their portfolio"
      }
    ],
    "progressTracking": {
      "weeklyCheckins": ["specific things to assess each week"],
      "monthlyAssessments": ["comprehensive progress evaluations"],
      "portfolioDevelopment": "how portfolio builds throughout the journey",
      "careerReadiness": "indicators of readiness for target opportunities"
    }
  },
  "personalizedCourses": [
    {
      "title": "course specifically designed for their advancement needs",
      "provider": "realistic provider offering this type of training",
      "targetGap": "specific skill gap this addresses from their analysis",
      "careerRelevance": "direct benefit to their career progression and opportunities",
      "duration": "realistic completion time based on course depth",
      "level": "appropriate for their current experience and target level",
      "prerequisites": ["skills they already have from their profile"],
      "learningOutcomes": ["specific competencies they'll gain for their roles"],
      "practicalProjects": ["hands-on projects using their domain knowledge"],
      "certificationValue": "professional certification benefits for their field",
      "immediateApplication": "how to use this knowledge in their current role",
      "salaryImpact": "potential salary increase from this skill in their market",
      "marketDemand": "current industry demand for this skill in their field",
      "nextCourses": ["logical progression courses after this"],
      "industryContext": "how this course applies to their specific industry",
      "careerPositioning": "how this course positions them for opportunities",
      "timeToValue": "how quickly they can apply and benefit from this learning",
      "costBenefit": "ROI analysis for their career investment"
    }
  ],
  "skillDevelopmentPlan": {
    "immediateSkills": [
      {
        "skill": "specific skill needed for their next career step",
        "currentGap": "assessment of their current level vs required",
        "learningPath": "step-by-step approach to master this skill",
        "resources": ["specific, high-quality learning resources for this skill"],
        "timeToCompetency": "realistic timeline to professional competency",
        "practiceOpportunities": ["where they can apply this skill in their context"],
        "measurementCriteria": ["how to assess their progress and competency"],
        "careerImpact": "specific career benefits of mastering this skill",
        "marketValue": "market value of this skill in their industry",
        "applicationContext": "where and how they'll use this skill",
        "prerequisites": ["what they need before starting this skill"],
        "milestones": ["learning milestones for this skill"],
        "certification": "relevant certifications for this skill",
        "portfolioProjects": ["projects to demonstrate this skill"]
      }
    ],
    "mediumTermSkills": [
      {
        "skill": "skill needed for medium-term career goals",
        "strategicValue": "why this skill is crucial for their career path",
        "prerequisites": ["skills to develop first"],
        "learningSequence": ["ordered learning progression"],
        "industryRelevance": "current and future industry importance",
        "timeInvestment": "total time investment required",
        "careerOpportunities": "specific opportunities this skill opens",
        "marketTrends": "how this skill aligns with market trends",
        "competitiveAdvantage": "competitive advantage this skill provides"
      }
    ],
    "longTermSkills": [
      {
        "skill": "skill for long-term career vision",
        "futureValue": "projected future value of this skill",
        "preparationStrategy": "how to prepare for learning this skill",
        "industryEvolution": "how this skill fits industry evolution",
        "leadershipComponent": "leadership aspects of this skill"
      }
    ]
  },
  "practicalApplication": {
    "currentRoleEnhancements": [
      {
        "area": "specific improvement area in their current role",
        "skills": ["skills to develop for this improvement"],
        "implementation": "how to apply new skills immediately in their role",
        "measurableOutcome": "specific result they can achieve",
        "timeframe": "when they can expect to see results",
        "stakeholderImpact": "how this benefits their team/organization",
        "careerBenefit": "how this advancement benefits their career",
        "portfolioEvidence": "how to document this improvement"
      }
    ],
    "portfolioProjects": [
      {
        "project": "specific project to showcase new skills",
        "businessProblem": "real problem this project solves in their industry",
        "technologies": ["relevant to their career path and current stack"],
        "complexity": "appropriate for their skill level and growth",
        "timeline": "realistic completion schedule",
        "careerBenefit": "how this project advances their goals",
        "skillsDemonstrated": ["specific skills this project validates"],
        "industryRelevance": "relevance to their industry and target roles",
        "marketabilityFactor": "how this project enhances their marketability",
        "scalabilityPotential": "potential to expand or enhance this project"
      }
    ],
    "immediateWins": [
      {
        "action": "immediate action they can take to apply learning",
        "timeframe": "how quickly they can implement this",
        "impact": "expected immediate impact",
        "skillReinforcement": "how this reinforces their learning",
        "visibilityBenefit": "how this increases their professional visibility"
      }
    ]
  },
  "studyPlan": {
    "totalDuration": "comprehensive study plan duration",
    "weeklyHours": "recommended weekly time commitment",
    "phases": [
      {
        "title": "Foundation Phase - Core Skills",
        "duration": "realistic phase duration",
        "focus": "primary focus areas for this phase",
        "objectives": ["specific objectives for this phase"],
        "tasks": ["specific learning and practice tasks"],
        "projects": ["projects to complete in this phase"],
        "assessment": "how progress will be measured in this phase",
        "deliverables": ["concrete outputs from this phase"],
        "skillTargets": ["specific skills to master in this phase"],
        "careerMilestone": "career milestone achieved with this phase"
      },
      {
        "title": "Application Phase - Practical Implementation",
        "duration": "realistic phase duration",
        "focus": "application and implementation focus",
        "objectives": ["hands-on application objectives"],
        "tasks": ["practical application tasks"],
        "projects": ["real-world application projects"],
        "assessment": "practical assessment methods",
        "deliverables": ["portfolio-ready deliverables"],
        "skillTargets": ["advanced skills to develop"],
        "careerMilestone": "career advancement milestone"
      },
      {
        "title": "Mastery Phase - Advanced Skills & Leadership",
        "duration": "advanced phase duration",
        "focus": "mastery and leadership development",
        "objectives": ["advanced mastery objectives"],
        "tasks": ["advanced learning and mentoring tasks"],
        "projects": ["complex, leadership-oriented projects"],
        "assessment": "mastery-level assessment",
        "deliverables": ["advanced portfolio pieces"],
        "skillTargets": ["leadership and advanced technical skills"],
        "careerMilestone": "readiness for target opportunities"
      }
    ],
    "weeklyStructure": {
      "mondayFocus": "what to focus on Mondays",
      "tuesdayFocus": "Tuesday learning focus",
      "wednesdayFocus": "Wednesday practical application",
      "thursdayFocus": "Thursday project work",
      "fridayFocus": "Friday review and planning",
      "weekendActivities": "weekend learning and portfolio work"
    },
    "monthlyGoals": [
      {
        "month": "month number",
        "primaryGoal": "main goal for this month",
        "skillFocus": "primary skill development focus",
        "projectMilestone": "project milestone to achieve",
        "careerMetric": "career advancement metric to track"
      }
    ]
  },
  "progressTracking": {
    "dailyActivities": ["daily learning and practice activities"],
    "weeklyAssessments": [
      {
        "week": "week number",
        "focus": "specific skill area being developed",
        "assessmentMethod": "how to evaluate progress",
        "successCriteria": "measurable success indicators",
        "adjustmentTriggers": ["when to modify the learning plan"],
        "portfolioUpdate": "what to add to portfolio this week",
        "careerApplication": "how to apply learning to career immediately"
      }
    ],
    "careerAlignmentReviews": [
      {
        "milestone": "significant learning achievement",
        "careerProgressCheck": "how this advances their career goals",
        "nextOpportunities": ["doors this opens for them"],
        "skillValidation": "how to demonstrate competency professionally",
        "marketReadiness": "readiness for market opportunities",
        "networkingStrategy": "networking activities for this level"
      }
    ],
    "portfolioDevelopment": {
      "portfolioStrategy": "overall portfolio development strategy",
      "projectSequence": "logical sequence of portfolio projects",
      "skillShowcase": "how to showcase different skills effectively",
      "industryAlignment": "how portfolio aligns with industry expectations",
      "differentiationStrategy": "how portfolio differentiates from competitors"
    }
  },
  "learningResources": {
    "primaryPlatforms": ["recommended learning platforms for their needs"],
    "books": ["essential books for their development path"],
    "podcasts": ["relevant podcasts for their industry and growth"],
    "blogs": ["industry blogs and thought leaders to follow"],
    "communities": ["professional communities to join"],
    "conferences": ["conferences and events to attend"],
    "mentorship": ["mentorship opportunities and strategies"],
    "networking": ["networking strategies and events"]
  },
  "careerIntegration": {
    "currentRoleOptimization": "how to optimize current role for learning",
    "transitionStrategy": "strategy for transitioning to target role",
    "networkingPlan": "networking plan to support career goals",
    "personalBranding": "personal branding strategy during learning journey",
    "marketPositioning": "how to position in market while learning",
    "opportunityRecognition": "how to recognize and seize opportunities"
  }
}

CRITICAL REQUIREMENTS:
1. Base ALL recommendations on their specific skill gaps, career opportunities, and current profile
2. Address their exact experience level, industry, and career stage
3. Create learning paths that directly advance their stated career goals
4. Ensure all courses and modules fill critical gaps identified in their analysis
5. Provide realistic timelines based on their current commitments and experience
6. Focus on immediately applicable skills for their industry/role
7. Include specific, measurable outcomes for every learning component
8. Design projects that enhance their professional portfolio
9. Consider their current technical stack and build upon it logically
10. Provide clear career progression mapping for each skill developed

PERSONALIZATION DEPTH:
- Use their exact role title, industry, and responsibilities
- Build on their existing skills rather than starting from scratch
- Address their specific industry context and market position
- Consider their career stage in difficulty and approach selection
- Align with their identified career opportunities and target roles
- Factor in their current work environment and constraints
- Leverage their existing projects and achievements as foundation
- Address their specific geographic and market context

**ZERO GENERATION OF NON-EXISTENT DATA:**
- Only reference skills, gaps, and opportunities that exist in their analysis
- Build learning paths based on actual career data provided
- Don't invent career goals not mentioned in their opportunities
- Use their actual industry, role, and experience level
- Reference only existing skills as prerequisites
- Build on actual projects and achievements in their profile

Return comprehensive JSON with deeply personalized learning system based entirely on their actual career analysis data.`

    logger.info('learn-agent', 'Making Gemini API call for comprehensive learning generation')
    let result
    try {
      result = await geminiClient.generateContent(learningPrompt, {
        agentType: 'learn-agent'
      })
      logger.agentSuccess('learn-agent', 'Gemini API call successful')
    } catch (apiError) {
      logger.agentError('learn-agent', apiError)
      
      return Response.json({
        error: 'Learning content generation failed',
        errorDetails: apiError.message,
        timestamp: Date.now(),
        model: geminiClient.currentModel,
        source: 'api_error'
      }, { status: 500 })
    }

    logger.info('learn-agent', 'Processing comprehensive learning content response')
    const responseText = result.response.text()
    logger.debug('learn-agent', `Response length: ${responseText.length}`)
    logger.debug('learn-agent', `Response preview: ${responseText.substring(0, 300)}`)
    
    // Extract and validate JSON with enhanced cleaning
    let learningContent
    try {
      logger.debug('learn-agent', 'Searching for JSON in learning response')
      
      // Enhanced JSON cleaning for learning content
      let jsonText = responseText
      
      // Remove markdown code blocks
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*$/g, '')
      
      // Remove comments that break JSON parsing
      jsonText = jsonText.replace(/\/\/.*$/gm, '') // Remove single-line comments
      jsonText = jsonText.replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      
      // Remove trailing commas
      jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1')
      
      // Find JSON boundaries
      const startIndex = jsonText.indexOf('{')
      let lastIndex = jsonText.lastIndexOf('}')
      
      // Enhanced boundary detection with brace counting
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
        logger.debug('learn-agent', 'JSON boundaries identified')
        
        // Additional cleaning
        jsonText = jsonText
          .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
          .replace(/,\s*]/g, ']') // Remove trailing commas before closing brackets
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        
        learningContent = JSON.parse(jsonText)
        logger.success('learn-agent', 'Learning content JSON parsed successfully')
        logger.debug('learn-agent', `Learning content keys: ${Object.keys(learningContent)}`)
        
        // Validate essential structure
        const requiredKeys = ['learningStrategy', 'learningPath', 'personalizedCourses', 'skillDevelopmentPlan', 'practicalApplication']
        const missingKeys = requiredKeys.filter(key => !learningContent[key])
        
        if (missingKeys.length > 0) {
          logger.warn('learn-agent', `Missing required learning keys: ${missingKeys}`)
          // Don't fail completely, just warn and continue
        }

        // Validate critical learning components
        if (learningContent.learningPath && Array.isArray(learningContent.learningPath.modules)) {
          learningContent.learningPath.modules.forEach((module, index) => {
            if (!module.lessons || !Array.isArray(module.lessons) || module.lessons.length === 0) {
              logger.warn('learn-agent', `Module ${index} has no valid lessons array`)
            }
          })
        }

        // Ensure study plan exists - integrate into main structure
        if (!learningContent.studyPlan && learningContent.learningPath) {
          learningContent.studyPlan = {
            totalDuration: learningContent.learningPath.totalDuration || "6-12 months",
            weeklyHours: learningContent.learningPath.weeklyCommitment || "10-15 hours",
            phases: [
              {
                title: "Foundation Phase - Core Skills",
                duration: "2-3 months",
                focus: "Building fundamental skills",
                objectives: ["Establish core competencies", "Complete foundational learning"],
                tasks: ["Complete core modules", "Practice fundamental concepts"],
                projects: ["Basic portfolio projects", "Skill demonstration exercises"],
                assessment: "Skill competency evaluations"
              },
              {
                title: "Application Phase - Practical Implementation", 
                duration: "2-3 months",
                focus: "Real-world application",
                objectives: ["Apply skills in practical scenarios", "Build substantial projects"],
                tasks: ["Complete advanced modules", "Work on real projects"],
                projects: ["Portfolio capstone projects", "Industry-relevant applications"],
                assessment: "Project-based evaluations"
              },
              {
                title: "Mastery Phase - Advanced Skills & Leadership",
                duration: "2-3 months",
                focus: "Advanced expertise and leadership",
                objectives: ["Achieve mastery level", "Develop leadership capabilities"],
                tasks: ["Complete advanced specializations", "Mentor others"],
                projects: ["Leadership projects", "Innovation initiatives"],
                assessment: "Mastery demonstrations and peer review"
              }
            ]
          }
        }
        
        logger.success('learn-agent', 'Learning content validation completed')
        
      } else {
        throw new Error('No valid JSON object found in learning response')
      }
    } catch (parseError) {
      logger.error('learn-agent', 'Learning JSON parsing failed', parseError)
      logger.debug('learn-agent', `Raw response causing error: ${responseText.substring(0, 1000)}`)
      
      // Return a comprehensive fallback based on available data
      logger.info('learn-agent', 'Using comprehensive fallback based on parsed data')
      
      const currentRole = parsedData.experience?.currentRole || 'Professional'
      const currentLevel = parsedData.experience?.currentLevel || 'Mid-level'
      const industry = parsedData.experience?.industryFocus || 'Technology'
      const skillGaps = parsedData.skillGaps || []
      const opportunities = parsedData.careerOpportunities || []

      return Response.json({
        learningStrategy: {
          primaryGoal: opportunities.length > 0 ? `Advance to ${opportunities[0].role}` : `Enhance ${currentRole} expertise`,
          timeframe: "12-18 months",
          focusAreas: skillGaps.slice(0, 4).map(gap => gap.gap || gap.skill || 'Professional Development'),
          learningApproach: "Personalized skill-based learning with practical application",
          careerImpact: "Direct advancement toward identified career opportunities",
          successMetrics: ["Skill proficiency improvements", "Portfolio development", "Career readiness"]
        },
        learningPath: {
          totalDuration: "12-18 months",
          weeklyCommitment: "10-15 hours",
          modules: skillGaps.slice(0, 3).map((gap, index) => ({
            title: `${gap.gap || gap.skill || 'Professional Development'} Mastery`,
            priority: gap.importance || 'High',
            duration: gap.timeToLearn || '6-8 weeks',
            difficulty: 'Intermediate',
            prerequisites: [`Current ${currentLevel} expertise`],
            objectives: [`Master ${gap.gap || gap.skill}`, "Apply in real projects", "Build portfolio examples"],
            careerImpact: gap.careerImpact || 'Enhanced professional capabilities',
            skillsTargeted: [gap.gap || gap.skill || 'Professional Development'],
            lessons: [
              {
                title: `Introduction to ${gap.gap || gap.skill}`,
                content: `Comprehensive learning content for ${gap.gap || gap.skill} development`,
                practicalApplication: `Apply ${gap.gap || gap.skill} in ${industry} context`,
                exercises: [
                  {
                    type: "hands-on",
                    description: `Practical exercise for ${gap.gap || gap.skill}`,
                    deliverable: `Portfolio project demonstrating ${gap.gap || gap.skill}`,
                    timeEstimate: "2-3 hours",
                    skillsApplied: [gap.gap || gap.skill || 'Professional Development'],
                    careerRelevance: "Directly applicable to target roles"
                  }
                ],
                realWorldProject: {
                  description: `Real-world project applying ${gap.gap || gap.skill} in ${industry}`,
                  scope: "Practical project demonstrating competency",
                  technologies: [`${gap.gap || gap.skill} tools and frameworks`],
                  outcome: "Portfolio-ready demonstration",
                  businessValue: "Practical business application",
                  portfolioImpact: "Enhanced professional portfolio"
                }
              }
            ],
            capstoneProject: {
              description: `Comprehensive project demonstrating ${gap.gap || gap.skill} mastery`,
              businessValue: `Real business value in ${industry} sector`,
              portfolioWorth: "High-impact portfolio addition",
              deliverables: ["Complete project", "Documentation", "Presentation"],
              timeEstimate: "3-4 weeks",
              skillsDemonstrated: [gap.gap || gap.skill || 'Professional Development'],
              careerPositioning: "Strong positioning for target opportunities"
            }
          })),
          milestones: [
            {
              week: "4",
              achievement: "Complete first module",
              careerRelevance: "Foundation for advanced learning",
              assessment: "Module completion assessment",
              nextOpportunity: "Apply skills in current role",
              skillsGained: [skillGaps[0]?.gap || 'Core Skills'],
              portfolioAddition: "First portfolio project"
            },
            {
              week: "8", 
              achievement: "Complete second module",
              careerRelevance: "Advanced skill development",
              assessment: "Practical project evaluation",
              nextOpportunity: "Enhanced role capabilities",
              skillsGained: [skillGaps[1]?.gap || 'Advanced Skills'],
              portfolioAddition: "Advanced portfolio piece"
            }
          ]
        },
        personalizedCourses: opportunities.slice(0, 2).map(opp => ({
          title: `${opp.role} Preparation Course`,
          provider: "Professional Development Platform",
          targetGap: `Skills needed for ${opp.role}`,
          careerRelevance: `Direct preparation for ${opp.role} opportunities`,
          duration: opp.timeToAchieve || '3-6 months',
          level: 'Intermediate to Advanced',
          prerequisites: opp.requiredSkills || ['Current expertise'],
          learningOutcomes: [`${opp.role} readiness`, "Enhanced competencies", "Portfolio development"],
          practicalProjects: [`${opp.role} simulation projects`],
          certificationValue: "Industry-recognized competency",
          immediateApplication: "Apply in current role preparation",
          salaryImpact: opp.salaryRange || "15-25% increase potential",
          marketDemand: opp.marketDemand || 'High demand',
          industryContext: `${industry} industry application`,
          careerPositioning: `Strong positioning for ${opp.role}`,
          timeToValue: "Immediate application possible"
        })),
        skillDevelopmentPlan: {
          immediateSkills: skillGaps.slice(0, 3).map(gap => ({
            skill: gap.gap || gap.skill || 'Professional Development',
            currentGap: gap.reason || 'Skill enhancement needed',
            learningPath: gap.learningPath || ['Structured learning', 'Practical application', 'Portfolio development'],
            resources: gap.resources || ['Online courses', 'Practical projects', 'Industry resources'],
            timeToCompetency: gap.timeToLearn || '3-6 months',
            practiceOpportunities: [`Current role application`, `Side projects`, `${industry} initiatives`],
            measurementCriteria: ['Skill assessments', 'Project completion', 'Practical application'],
            careerImpact: gap.careerImpact || 'Enhanced professional capabilities',
            marketValue: 'High market value',
            applicationContext: `${industry} industry application`
          }))
        },
        practicalApplication: {
          currentRoleEnhancements: [
            {
              area: `${currentRole} optimization`,
              skills: skillGaps.slice(0, 2).map(gap => gap.gap || gap.skill),
              implementation: "Immediate application in current responsibilities",
              measurableOutcome: "Enhanced role performance and visibility",
              timeframe: "2-3 months",
              stakeholderImpact: "Improved team and organizational value",
              careerBenefit: "Stronger performance and advancement readiness"
            }
          ],
          portfolioProjects: [
            {
              project: `${industry} Enhancement Project`,
              businessProblem: `Common ${industry} challenge requiring new skills`,
              technologies: skillGaps.slice(0, 3).map(gap => gap.gap || gap.skill),
              complexity: `Appropriate for ${currentLevel} advancement`,
              timeline: "6-8 weeks",
              careerBenefit: "Strong portfolio addition for target roles",
              skillsDemonstrated: skillGaps.slice(0, 3).map(gap => gap.gap || gap.skill),
              industryRelevance: `High relevance to ${industry} sector`,
              marketabilityFactor: "Strong market differentiation"
            }
          ]
        },
        studyPlan: {
          totalDuration: "12-18 months",
          weeklyHours: "10-15 hours",
          phases: [
            {
              title: "Foundation Phase - Core Skills",
              duration: "3-4 months",
              focus: "Core skill development",
              objectives: ["Master fundamental concepts", "Build strong foundation"],
              tasks: ["Complete core learning modules", "Practice fundamental skills"],
              projects: ["Foundation portfolio projects"],
              assessment: "Competency demonstrations"
            },
            {
              title: "Application Phase - Practical Implementation",
              duration: "4-5 months", 
              focus: "Real-world application",
              objectives: ["Apply skills practically", "Build substantial projects"],
              tasks: ["Advanced module completion", "Real project work"],
              projects: ["Portfolio capstone projects"],
              assessment: "Project-based evaluations"
            },
            {
              title: "Mastery Phase - Advanced Skills & Leadership",
              duration: "3-4 months",
              focus: "Advanced expertise",
              objectives: ["Achieve mastery", "Prepare for advancement"],
              tasks: ["Advanced specialization", "Leadership development"],
              projects: ["Advanced portfolio pieces"],
              assessment: "Mastery demonstration"
            }
          ]
        },
        error: 'JSON parsing failed, using data-driven fallback content',
        parseError: parseError.message,
        timestamp: Date.now(),
        model: geminiClient.currentModel,
        source: 'data_driven_fallback'
      })
    }

    logger.agentSuccess('learn-agent', 'Comprehensive personalized learning content generated successfully')
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
        experienceLevel: parsedData.experience?.currentLevel,
        industry: parsedData.experience?.industryFocus,
        role: parsedData.experience?.currentRole
      }
    })

  } catch (error) {
    logger.error('learn-agent', 'Critical error in comprehensive learn agent', error)
    
    return Response.json({
      error: 'Learning agent failed',
      errorDetails: error.message,
      timestamp: Date.now(),
      model: geminiClient.currentModel,
      source: 'agent_error'
    }, { status: 500 })
  }
}