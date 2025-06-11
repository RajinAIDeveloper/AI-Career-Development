// app/api/agents/data-analyst/route.js - Ultra-Enhanced comprehensive extraction for all career data
import { geminiClient } from '../../../../lib/gemini-client'
import { logger } from '../../../../utils/Logger'

export async function POST(request) {
  logger.agentStart('data-analyst', 'Ultra-Enhanced CV Analysis - Maximum Data Extraction')
  
  try {
    if (!geminiClient.isServiceAvailable()) {
      const waitTime = geminiClient.getTimeUntilNextKeyAvailable()
      logger.warn('data-analyst', `Service temporarily unavailable. Wait time: ${waitTime}ms`)
      
      return Response.json({ 
        error: 'Service temporarily unavailable',
        details: 'All API keys are rate limited or unavailable',
        retryAfter: Math.ceil(waitTime / 1000),
        waitTimeMs: waitTime
      }, { status: 503 })
    }

    const { content } = await request.json()
    logger.info('data-analyst', `Received content length: ${content?.length}`)
    
    if (!content || content.length < 100) {
      logger.error('data-analyst', 'Insufficient content for analysis')
      return Response.json({ 
        error: 'Insufficient content provided', 
        details: 'Content must be at least 100 characters for meaningful analysis'
      }, { status: 400 })
    }

    logger.info('data-analyst', 'Preparing ultra-enhanced analysis prompt')
    const analysisPrompt = `You are the ULTIMATE CAREER INTELLIGENCE ANALYST with MAXIMUM EXTRACTION CAPABILITIES for ALL INDUSTRIES AND PROFESSIONS. Your mission is to conduct the most COMPREHENSIVE, EXHAUSTIVE, and INTELLIGENT analysis possible, extracting EVERY piece of career information from professionals across ALL fields including:

**🏥 Healthcare** (Doctors, Nurses, Therapists, Medical Staff, Healthcare Administration)
**💼 Business & Finance** (Accountants, Analysts, Bankers, Consultants, Managers, Executives)
**⚖️ Legal** (Lawyers, Paralegals, Legal Assistants, Judges, Compliance Officers)
**🎓 Education** (Teachers, Professors, Administrators, Trainers, Curriculum Developers)
**📈 Sales & Marketing** (Sales Representatives, Marketing Managers, Business Development)
**🏭 Manufacturing & Operations** (Engineers, Operators, Quality Managers, Safety Officers)
**🎨 Creative & Design** (Graphic Designers, Writers, Artists, Content Creators, Media)
**🔧 Skilled Trades** (Electricians, Plumbers, Mechanics, Construction, Technicians)
**🏛️ Government & Public Service** (Civil Servants, Policy Makers, Public Safety, Military)
**❤️ Non-Profit & Social Services** (Social Workers, Program Managers, Community Leaders)
**🛍️ Retail & Hospitality** (Managers, Customer Service, Food Service, Tourism)
**🚚 Transportation & Logistics** (Drivers, Logistics Coordinators, Supply Chain Managers)
**And ANY other profession or industry**

CAREER CONTENT TO ANALYZE:
${content.substring(0, 25000)}

🎯 **ULTRA-ENHANCED EXTRACTION MISSION**

Apply MULTIPLE DETECTION STRATEGIES for each category:
1. **EXPLICIT DETECTION** - Find direct mentions
2. **PATTERN MATCHING** - Use keyword patterns and context clues  
3. **CONTEXTUAL INFERENCE** - Infer from surrounding text and context
4. **CROSS-REFERENCING** - Connect information across sections
5. **TIMELINE RECONSTRUCTION** - Build chronological understanding

⚠️ **CRITICAL RULE: ONLY EXTRACT EXISTING DATA**
- NEVER invent, generate, or hallucinate information
- ONLY provide data that is explicitly mentioned or clearly inferred from context
- If information is not present, clearly state "Not mentioned" or "Not found"
- Do not create fictional achievements, roles, or skills
- Base all skill gaps and opportunities ONLY on actual data present

📋 **PERSONAL INFORMATION - ULTRA-AGGRESSIVE DETECTION**

🔍 **SCAN ENTIRE CONTENT FOR THESE PATTERNS:**

**Name Detection (Check EVERYWHERE):**
- Headers, signatures, email addresses, "About me" sections
- "Name:", "I am", "My name is", "Called", "Known as", social profiles
- Email prefixes before @, LinkedIn URLs, GitHub usernames
- Document metadata, author fields, contact sections
- Introductions, bio sections, personal statements

**Contact Information (EXHAUSTIVE SEARCH):**
- Emails: ALL email formats including personal, work, academic, social
- Phones: International formats, mobile, work, home numbers with/without country codes
- Social profiles: LinkedIn (linkedin.com/in/, /profile), GitHub (github.com/), Twitter, Instagram professional
- Websites: Personal domains, portfolios, blogs, "my website", "check out my", "visit my"
- Physical addresses: Full addresses, cities, states, countries, zip codes

**Professional Identity (COMPREHENSIVE SCAN):**
- Professional titles in signatures, headers, or bio sections
- Personal branding statements, taglines, mission statements
- Career objectives, professional goals, value propositions
- Professional memberships, affiliations, industry associations
- Timezone mentions, availability statements, location preferences

**Advanced Personal Detection:**
- Languages spoken with proficiency levels
- Nationality, citizenship, work authorization status
- Professional headshot descriptions or photo credits
- Personal interests that relate to professional development
- Volunteer work, community involvement, board positions

💼 **PROFESSIONAL EXPERIENCE - ULTRA-COMPREHENSIVE EXTRACTION**

🔍 **AGGRESSIVE JOB TITLE DETECTION:**
- **Direct patterns:** "Job Title:", "Position:", "Role:", "Current position:", "Working as"
- **Header patterns:** Titles in bold, followed by company names, dates, or locations
- **Contextual patterns:** "worked as", "served as", "responsible for", "my role was", "currently"
- **Progression patterns:** "promoted to", "advanced to", "transitioned to", "moved up to"
- **Contract/Freelance:** "consultant", "freelancer", "contractor", "part-time", "temporary"
- **Leadership indicators:** "led", "managed", "supervised", "directed", "headed", "oversaw"
- **Informal mentions:** Job titles mentioned in project descriptions, achievements, or stories

🔍 **EXHAUSTIVE COMPANY DETECTION:**
- **Direct patterns:** "Company:", "Employer:", "Organization:", "at [Company]", "with [Company]"
- **Work context:** "worked at", "employed by", "joined", "team at", "based at"
- **Project context:** "for [Client]", "with [Company]", mentions in project descriptions
- **Location context:** Company names with city/country locations
- **Industry context:** Company names with industry descriptors
- **Acquisition/merger mentions:** "formerly known as", "acquired by", "merged with"

🔍 **COMPREHENSIVE DATE/DURATION EXTRACTION:**
- **Standard formats:** "2020-2023", "Jan 2020 - Present", "2020 to 2023", "2020-current"
- **Contextual duration:** "for 3 years", "since 2020", "until last month", "currently working"
- **Relative timeframes:** "last job", "previous role", "before that", "afterwards", "then"
- **Academic context:** "Class of 2020", "graduated in", "summer internship 2019"
- **Seasonal work:** "summer 2020", "winter internship", "semester project"
- **Career gaps:** Unexplained time periods, career breaks, sabbaticals

🔍 **DETAILED RESPONSIBILITY EXTRACTION:**
- **Action verbs:** "managed", "developed", "led", "created", "implemented", "designed", "built"
- **Technical work:** "programmed", "coded", "architected", "deployed", "maintained", "troubleshot"
- **Business functions:** "analyzed", "researched", "coordinated", "planned", "executed"
- **People management:** "hired", "trained", "mentored", "supervised", "coached"
- **Project management:** "delivered", "launched", "coordinated", "planned", "executed"

🔍 **ACHIEVEMENT & IMPACT DETECTION:**
- **Quantified results:** ANY numbers with context (%, $, time, team size, users, performance)
- **Performance indicators:** "increased", "reduced", "improved", "achieved", "delivered", "exceeded"
- **Recognition:** "awarded", "recognized", "promoted", "selected", "chosen"
- **Business impact:** Revenue, cost savings, efficiency gains, customer satisfaction
- **Technical achievements:** System performance, uptime, security improvements
- **Team achievements:** Team growth, retention, development, culture improvements

🔍 **EMPLOYMENT DETAILS EXTRACTION:**
- **Employment type:** Full-time, part-time, contract, freelance, internship, volunteer
- **Work arrangement:** Remote, hybrid, on-site, flexible, travel requirements
- **Reporting structure:** Manager names, team structure, reporting hierarchy
- **Team size:** Number of direct reports, team size, cross-functional teams
- **Budget responsibility:** Budget size, P&L responsibility, resource management
- **Geographic scope:** Local, national, international, multi-site responsibilities

⏰ **CAREER TIMELINE RECONSTRUCTION**

🔍 **CHRONOLOGICAL ANALYSIS:**
- Build complete career timeline from earliest to current
- Identify career gaps and transitions
- Calculate total experience and progression rate
- Map skill development over time
- Track salary/role progression patterns
- Identify career pivot points and reasoning

🔍 **TIMELINE INDICATORS:**
- Education graduation dates as starting reference
- First job indicators: "entry level", "junior", "graduate program"
- Career progression: "promoted after", "next role", "advanced to"
- Industry changes: "switched to", "moved into", "career change"
- Geographic moves: relocated for work, remote transitions

💻 **SKILLS & EXPERTISE - UNIVERSAL INDUSTRY CLUSTERING**

🔍 **COMPREHENSIVE PROFESSIONAL SKILLS EXTRACTION:**

**Technical & Domain-Specific Skills (ALL INDUSTRIES):**
- **IT/Software:** Programming languages, frameworks, databases, cloud platforms, DevOps tools
- **Healthcare:** Medical procedures, diagnostic tools, treatment protocols, medical software, patient care systems
- **Finance:** Financial analysis, accounting software, trading platforms, risk management tools, regulatory compliance
- **Legal:** Legal research, case management systems, contract drafting, litigation support, regulatory knowledge
- **Engineering:** CAD software, project management tools, industry standards, safety protocols, technical specifications
- **Education:** Curriculum development, learning management systems, assessment tools, educational technology
- **Sales/Marketing:** CRM systems, marketing automation, social media platforms, analytics tools, lead generation
- **Design/Creative:** Design software, creative tools, production equipment, artistic techniques, digital media
- **Manufacturing:** Production systems, quality control, lean manufacturing, supply chain management, safety standards
- **Healthcare Administration:** Healthcare systems, insurance processing, medical coding, compliance protocols

**Industry-Specific Tools & Platforms (COMPREHENSIVE SCAN):**
- **Business Software:** ERP systems (SAP, Oracle), CRM (Salesforce, HubSpot), project management (Asana, Monday)
- **Financial Tools:** QuickBooks, Excel, Bloomberg, Reuters, financial modeling software, trading platforms
- **Healthcare Systems:** EMR/EHR systems, medical imaging software, laboratory information systems
- **Legal Software:** Case management systems, legal research databases, document management, e-discovery tools
- **Design Tools:** Adobe Creative Suite, AutoCAD, SolidWorks, Sketch, Figma, 3D modeling software
- **Educational Platforms:** Learning management systems, virtual classroom tools, assessment software
- **Manufacturing Systems:** MES, PLM, quality management systems, inventory management
- **Communication Tools:** Microsoft Office, Google Workspace, Zoom, Teams, Slack, presentation software

**Professional Certifications (ALL INDUSTRIES):**
- **Healthcare:** Medical licenses, nursing certifications, specialized medical training, CPR/BLS
- **Finance:** CPA, CFA, FRM, Series licenses, insurance certifications, tax preparation credentials
- **Legal:** Bar admissions, legal specializations, paralegal certifications, continuing legal education
- **Education:** Teaching licenses, administrative credentials, curriculum certifications, educational technology
- **Project Management:** PMP, PRINCE2, Agile, Scrum, Six Sigma, Lean certifications
- **Safety & Compliance:** OSHA, ISO certifications, industry safety training, regulatory compliance
- **Sales/Marketing:** Google Ads, HubSpot, Salesforce certifications, digital marketing credentials
- **Technical Trades:** Professional licenses, apprenticeship completions, trade certifications
- **Real Estate:** Real estate licenses, property management, appraisal certifications

🔍 **UNIVERSAL SKILL PROFICIENCY INDICATORS:**
- **Experience levels:** "X years of experience", "seasoned professional", "expert in", "specialized in"
- **Performance indicators:** "top performer", "subject matter expert", "recognized specialist", "certified professional"
- **Leadership evidence:** "led", "managed", "supervised", "coordinated", "directed", "oversaw"
- **Training/mentoring:** "trained", "mentored", "coached", "developed", "taught", "instructed"
- **Achievement context:** Awards, recognition, promotions, performance ratings, client feedback

🔍 **COMPREHENSIVE SOFT SKILLS DETECTION (ALL FIELDS):**
- **Leadership & Management:** Team leadership, people management, strategic planning, decision making
- **Communication:** Written communication, verbal presentation, client relations, public speaking, negotiation
- **Problem-Solving:** Analytical thinking, troubleshooting, critical analysis, creative solutions, process improvement
- **Collaboration:** Teamwork, cross-functional coordination, stakeholder management, conflict resolution
- **Adaptability:** Change management, learning agility, flexibility, resilience, innovation
- **Customer Service:** Client relations, customer satisfaction, service excellence, relationship building
- **Organizational:** Time management, prioritization, multitasking, attention to detail, quality focus
- **Industry-Specific:** Regulatory compliance, ethical standards, professional judgment, industry knowledge

🎓 **EDUCATION - ULTRA-COMPREHENSIVE SCANNING**

🔍 **FORMAL EDUCATION MEGA-PATTERNS:**
**University/College Degree Indicators:**
- "Bachelor", "Master", "PhD", "Doctorate", "Associate", "Diploma", "Certificate"
- Abbreviations: "BS", "BA", "MS", "MA", "MBA", "MSc", "BSc", "BE", "BTech", "MTech", "JD", "MD"
- International: "Licence", "Diplôme", "Laurea", "Grad Dip", "Post Grad"

**HIGH SCHOOL & SECONDARY EDUCATION PATTERNS:**
- **British System:** "O Level", "A Level", "GCSE", "AS Level", "A2 Level", "International Baccalaureate", "IB"
- **South Asian Systems:** "HSC" (Higher Secondary Certificate), "SSC" (Secondary School Certificate), "Matriculation", "Intermediate"
- **US/Canadian:** "High School Diploma", "GED", "SAT", "ACT", "AP" (Advanced Placement)
- **International:** "IGCSE", "Cambridge A Level", "Edexcel", "International A Level"
- **Other Systems:** "Baccalauréat", "Abitur", "Matura", "VCE", "ATAR", "12th Grade", "Class 12"
- **Vocational:** "Technical Diploma", "Trade Certificate", "Vocational Training", "BTEC"

**Institution Indicators:**
- "University", "College", "Institute", "School", "Academy", "Polytechnic", "Seminary"
- "High School", "Secondary School", "Grammar School", "Prep School", "College Prep"
- International: "Université", "Universidad", "Università", "Universität", "Lycée", "Gymnasium"
- Specific types: "Community College", "Technical College", "Art School", "Business School"

**Context Clues:**
- Academic years: "freshman", "sophomore", "junior", "senior", "first year"
- Academic terms: "semester", "quarter", "term", "academic year", "school year"
- Graduation: "graduated", "alumnus", "alumni", "class of", "cohort", "batch"
- Academic performance: "GPA", "CGPA", "magna cum laude", "summa cum laude", "dean's list"

🔍 **ONLINE & ALTERNATIVE EDUCATION:**
- MOOCs: "Coursera", "edX", "Udacity", "FutureLearn", "Khan Academy", "MasterClass"
- Coding bootcamps: "Lambda School", "General Assembly", "Flatiron", "coding bootcamp"
- Professional platforms: "Pluralsight", "LinkedIn Learning", "Udemy", "Skillshare"
- Company training: "internal training", "corporate university", "professional development"

🔍 **SELF-DIRECTED LEARNING:**
- "Self-taught", "autodidact", "independent study", "learned through"
- "Online tutorials", "YouTube", "documentation", "open source contributions"
- Reading lists, book mentions, technical blogs followed

📜 **CERTIFICATIONS - EXHAUSTIVE DETECTION**

🔍 **CLOUD PLATFORM CERTIFICATIONS:**
**AWS:** Solutions Architect, DevOps Engineer, SysOps Administrator, Cloud Practitioner, Security Specialty, Big Data, Machine Learning, Advanced Networking, Database Specialty
**Google Cloud:** Cloud Engineer, Cloud Architect, Data Engineer, Cloud Developer, Security Engineer, ML Engineer, Network Engineer
**Microsoft Azure:** Fundamentals, Administrator, Architect, DevOps Engineer, Security Engineer, Data Engineer, AI Engineer, Developer Associate

🔍 **TECHNICAL CERTIFICATIONS:**
**Security:** CISSP, CISA, CISM, CEH, OSCP, Security+, Network+, CySA+, GCIH, GSEC
**Networking:** CCNA, CCNP, CCIE, Network+, JNCIA, JNCIP, F5 Certified
**Programming:** Oracle Certified Java, Microsoft Certified Developer, Python Institute, JavaScript certifications
**Database:** Oracle DBA, Microsoft SQL Server, MongoDB, MySQL, PostgreSQL, Cassandra
**Project Management:** PMP, PRINCE2, Scrum Master, SAFe, Agile, ITIL, Six Sigma

🔍 **INDUSTRY-SPECIFIC CERTIFICATIONS:**
**Finance:** CFA, FRM, CPA, ACCA, CIA, CAIA, Series 7/63, CFP
**Healthcare:** Medical licenses, nursing certifications, healthcare IT
**Marketing:** Google Ads, Facebook Blueprint, HubSpot, Salesforce Marketing Cloud
**Data Science:** Tableau Certified, Power BI, SAS Certified, R/Python data science certificates

🔍 **CERTIFICATION CONTEXT DETECTION:**
- Validity periods: "valid until", "expires", "renewed"
- In progress: "studying for", "preparing for", "scheduled to take"
- Planned: "planning to get", "next certification goal"

🚀 **PROJECTS - COMPREHENSIVE CATEGORIZATION**

🔍 **PROJECT TYPE DETECTION:**
**Professional Projects:**
- System implementations, migrations, integrations
- Product development, feature releases
- Process improvements, automation initiatives
- Client deliverables, consulting projects

**Personal Projects:**
- Side projects, hobby applications
- Open source contributions, GitHub repos
- Personal websites, blogs, portfolios
- Learning projects, tutorials followed

**Academic Projects:**
- Capstone projects, thesis work, research
- Group projects, team assignments
- Competition entries, hackathons
- Academic publications, papers

🔍 **PROJECT DETAIL EXTRACTION:**
- Technologies used, architecture decisions
- Team size, role, responsibilities
- Duration, timeline, milestones
- Challenges overcome, solutions implemented
- Quantified outcomes, user metrics
- Recognition, awards, media coverage

🏆 **ACHIEVEMENTS - ADVANCED QUANTIFICATION**

🔍 **ACHIEVEMENT DETECTION PATTERNS:**
**Performance Metrics:**
- Revenue: "increased sales by", "generated $X", "grew revenue"
- Efficiency: "reduced time by", "improved performance", "optimized"
- Growth: "user growth", "team expansion", "market share"
- Cost savings: "saved $X", "reduced costs", "budget optimization"

**Recognition Patterns:**
- Awards: "employee of", "top performer", "excellence award"
- Rankings: "top 5%", "ranked #1", "highest rated"
- Media: "featured in", "interviewed by", "published in"
- Speaking: "keynote", "conference speaker", "panel discussion"

**Leadership Achievements:**
- Team building: "hired", "built team", "scaled organization"
- Mentorship: "mentored", "coached", "developed talent"
- Innovation: "first to implement", "pioneered", "introduced"

🔍 **SKILL GAPS - UNIVERSAL EVIDENCE-BASED ANALYSIS**

⚠️ **ONLY identify gaps that are:**
- Explicitly mentioned in the content ("need to learn", "lacking experience in", "want to improve", "seeking to develop")
- Clearly implied by context (outdated methods in their field, missing modern standards for their industry)
- Evident from career trajectory (ready for advancement but missing level-appropriate skills)

**DO NOT generate fictional gaps**. Only analyze based on:

**Explicitly Mentioned Gaps (ALL INDUSTRIES):**
- Direct statements about lacking skills or knowledge
- Professional development goals or training plans mentioned  
- Skills they're currently studying, planning to learn, or seeking to improve
- Certification goals or continuing education plans stated

**Context-Based Gaps (ONLY if clearly evident across industries):**
- **Healthcare:** Missing modern medical technologies, updated treatment protocols, new compliance requirements
- **Finance:** Outdated financial software, missing regulatory knowledge, new accounting standards
- **Legal:** Missing current legal technology, updated regulations, specialized practice areas
- **Education:** Missing modern teaching technology, updated curriculum standards, new assessment methods
- **Sales/Marketing:** Missing digital marketing tools, outdated CRM systems, new sales methodologies
- **Manufacturing:** Missing modern production technology, updated safety standards, new quality systems
- **General Business:** Missing modern business software, updated industry standards, new best practices

**Career Progression Gaps (ONLY if progression pattern is clear):**
- **Leadership Development:** Management skills for senior individual contributors across any field
- **Strategic Thinking:** High-level planning skills for those ready for executive roles
- **Industry Expertise:** Deeper domain knowledge for specialization in their field
- **Communication Skills:** Presentation/public speaking for client-facing or leadership roles
- **Business Acumen:** Financial understanding for those moving into business leadership
- **Regulatory Knowledge:** Compliance expertise for regulated industries
- **Technology Adoption:** Digital literacy for traditional industries undergoing transformation

**Universal Professional Development Areas (ONLY if supported by evidence):**
- **Cross-functional collaboration** skills if working in siloed environment
- **Project management** capabilities if handling multiple initiatives
- **Data analysis** skills if working with metrics and reporting
- **Change management** expertise if in environments undergoing transformation
- **Stakeholder management** skills if working with diverse groups
- **Cultural competency** if working in diverse or global environments

🎯 **CAREER OPPORTUNITIES - UNIVERSAL EVIDENCE-BASED SUGGESTIONS**

⚠️ **ONLY suggest opportunities that are:**
- Explicitly mentioned as career goals, interests, or aspirations
- Natural progressions based on their actual experience, skills, and industry
- Clearly supported by their existing background, achievements, and demonstrated capabilities

**DO NOT generate fictional opportunities**. Only suggest based on:

**Explicitly Mentioned Interests (ALL INDUSTRIES):**
- Career goals, aspirations, or interests directly stated in the content
- Industries, roles, or career paths they've expressed interest in pursuing
- Next steps, future plans, or career objectives they've mentioned
- Professional development goals or advancement plans stated

**Natural Progressions by Industry (ONLY if clear progression path exists):**

**Healthcare Progressions:**
- Clinical advancement (Staff → Senior → Lead → Supervisor → Manager)
- Specialization paths (General practice → Specialty → Sub-specialty)
- Administrative roles (Clinical → Clinical Coordinator → Department Manager → Director)
- Education/Training roles (Practitioner → Preceptor → Educator → Academic Leader)

**Business & Finance Progressions:**
- Management track (Analyst → Senior Analyst → Manager → Director → VP)
- Specialization paths (General → Specialist → Subject Matter Expert → Consultant)
- Strategic roles (Operational → Strategic Planning → Business Development → Executive)
- Cross-functional moves (Finance → Operations → General Management)

**Legal Progressions:**
- Practice advancement (Associate → Senior Associate → Partner → Managing Partner)
- Specialization paths (General practice → Specialized practice areas)
- In-house opportunities (Law firm → Corporate counsel → General counsel)
- Judicial/Government paths (Private practice → Government → Judicial roles)

**Education Progressions:**
- Academic advancement (Teacher → Lead Teacher → Department Head → Principal → Superintendent)
- Specialization paths (General education → Special education → Curriculum specialist)
- Administrative roles (Classroom → Coordination → Administration → Leadership)
- Higher education (K-12 → Community College → University → Academic leadership)

**Sales & Marketing Progressions:**
- Sales advancement (Rep → Senior Rep → Manager → Director → VP Sales)
- Marketing specialization (General → Digital → Strategic → CMO track)
- Account management (Individual accounts → Key accounts → Strategic accounts)
- Business development (Sales → Business development → Strategic partnerships)

**Manufacturing & Operations Progressions:**
- Operations advancement (Operator → Supervisor → Manager → Plant Manager → VP Operations)
- Technical specialization (General → Process engineer → Senior engineer → Technical director)
- Quality/Safety roles (Production → Quality → Compliance → Safety director)
- Supply chain progression (Operations → Logistics → Supply chain management)

**Technology & Engineering Progressions:**
- Technical advancement (Engineer → Senior → Lead → Principal → Chief architect)
- Management track (Individual contributor → Team lead → Manager → Director)
- Product roles (Engineering → Product management → Product strategy)
- Consulting paths (Employee → Senior consultant → Partner → Independent practice)

**Lateral Opportunities (ONLY if skills clearly transfer):**
- Similar roles in different industries where their specific skills directly apply
- Cross-functional positions that leverage their demonstrated experience
- Geographic opportunities if they've indicated mobility or remote work interest
- Sector transitions (Private → Public, For-profit → Non-profit) if expressed interest

**Industry-Specific Emerging Roles (ONLY if their background supports transition):**
- Digital transformation roles for those with both domain and technology experience
- Compliance/Risk roles for those with regulatory experience in their field
- Training/Development roles for those with expertise and teaching/mentoring experience
- Consulting opportunities for those with deep domain expertise and client experience
- Strategic roles for those with business acumen and industry knowledge

**Entrepreneurial/Independent Opportunities (ONLY if evidence supports):**
- Consulting practice if they have deep expertise and client relationships
- Business ownership if they have business management experience
- Freelance/Contract work if they have portable skills and independent work experience
- Partnership opportunities if they have business development or relationship experience

**Geographic/Remote Opportunities (ONLY if supported by their profile):**
- Remote work opportunities if they have demonstrated remote work capabilities
- International opportunities if they have global experience or language skills
- Regional opportunities if they have multi-location or travel experience
- Relocation opportunities if they've indicated flexibility or have relevant experience

💰 **SALARY INSIGHTS - UNIVERSAL EVIDENCE-BASED ANALYSIS**

⚠️ **ONLY provide salary insights when:**
- Salary/compensation information is explicitly mentioned in the content
- Role levels, experience, and industry context are clearly documented
- Geographic location and organization type context is available from the content

**Current Market Value Analysis (INDUSTRY-UNIVERSAL):**
- Base analysis only on documented experience level, location, industry, and role type from content
- Reference actual roles, companies, achievements, and certifications mentioned
- Consider industry-specific factors: Healthcare (public vs private), Education (public vs private), Legal (firm size), Finance (institution type), Manufacturing (company size), Non-profit (sector)
- ONLY estimate if sufficient context exists (role + years + location + industry + organization type)

**Growth Projections (EVIDENCE-BASED ONLY):**
- Base projections only on documented career progression patterns shown in content
- Reference actual skill development, advancement history, and achievement trajectory
- Consider industry-specific advancement timelines and salary growth patterns
- ONLY project if clear trajectory and advancement pattern exists in their history

**Industry-Specific Compensation Factors (ONLY when supported by content):**

**Healthcare Compensation Considerations:**
- License types and certifications mentioned, specialty areas, practice settings
- Public vs private sector experience, academic affiliations, research involvement
- Geographic variations in healthcare compensation, rural vs urban practice

**Education Compensation Factors:**
- Education level and certifications, subject matter expertise, administrative experience
- Public vs private institution experience, geographic location, union considerations
- Additional income from tutoring, consulting, or summer work mentioned

**Legal Compensation Variables:**
- Bar admissions, practice areas, firm size, client types, specializations mentioned
- Geographic market, public vs private sector, in-house vs firm experience
- Business development capabilities, client relationships, partnership track

**Finance & Business Compensation Elements:**
- Certifications (CPA, CFA, etc.), industry sectors, company sizes, role complexity
- Geographic financial centers, public vs private sector, regulatory environment
- Performance metrics, client relationships, business development contribution

**Sales & Marketing Compensation Components:**
- Industry experience, account types, territory size, product complexity
- Commission structures, quota achievement history, account growth documented
- Geographic markets, company size, B2B vs B2C experience shown

**Manufacturing & Operations Compensation Factors:**
- Industry sector, company size, union environment, safety record
- Technical certifications, process improvement contributions, cost savings achieved
- Geographic location, plant size, automation level, regulatory environment

**Optimization Strategies (ONLY based on actual profile elements):**
- Suggest strategies only based on actual gaps identified and skills demonstrated
- Reference specific certifications, experience, or achievements they have documented
- Consider geographic arbitrage only if mobility is indicated or discussed
- ONLY recommend what's clearly supported by their actual background and stated goals

**Compensation Benchmarking (CONSERVATIVE APPROACH):**
- Compare only to similar roles in same industry, experience level, and geographic area
- Consider organization size, sector (public/private/non-profit), and market conditions
- Factor in documented certifications, specializations, and demonstrated performance
- Account for regional cost of living and industry compensation norms

**DO NOT:**
- Invent salary figures without sufficient context from multiple data points
- Create fictional compensation scenarios or speculative market predictions
- Generate market insights without actual supporting data from their profile
- Assume compensation details not explicitly supported by their documented experience

**EXTRACTION QUALITY ASSURANCE:**

For each section, provide:
- **Confidence Level** (High/Medium/Low) for each extracted item
- **Evidence Source** (direct quote, contextual inference, or intelligent generation)
- **Cross-references** between sections to validate consistency
- **Completeness Score** (1-10) for each major category
- **Data Quality Indicators** for reliability assessment

**ANALYSIS OUTPUT STRUCTURE:**

Organize the comprehensive analysis into clear sections:

1. **EXECUTIVE SUMMARY** - Key findings and overall assessment
2. **PERSONAL PROFILE** - Complete identity and contact information
3. **CAREER TIMELINE** - Chronological career progression analysis
4. **PROFESSIONAL EXPERIENCE** - Detailed role analysis and achievements
5. **SKILLS ECOSYSTEM** - Complete technical and soft skills inventory
6. **EDUCATION & LEARNING** - Formal and informal education analysis
7. **CERTIFICATIONS & CREDENTIALS** - Professional development tracking
8. **PROJECT PORTFOLIO** - Comprehensive project analysis and impact
9. **ACHIEVEMENT CATALOG** - Quantified accomplishments and recognition
10. **SKILL DEVELOPMENT ROADMAP** - Critical gaps and development priorities
11. **CAREER OPPORTUNITY MATRIX** - Strategic career options and pathways
12. **COMPENSATION INTELLIGENCE** - Salary insights and optimization strategies
13. **MARKET POSITIONING** - Industry standing and competitive advantages
14. **STRATEGIC RECOMMENDATIONS** - Actionable next steps and priorities

**ULTRA-ENHANCED EXTRACTION METHODOLOGY:**

🔍 **MULTI-PASS DETECTION STRATEGY:**

**Pass 1 - Explicit Content Scan:**
- Scan headers, subheaders, bullet points, and structured sections
- Extract information from tables, lists, and formatted content
- Identify clearly labeled sections (Contact, Experience, Skills, Education, etc.)
- Extract dates, numbers, company names, technologies mentioned

**Pass 2 - Contextual Deep Dive:**
- Analyze paragraphs and narrative content for embedded information
- Look for implied skills, experiences, and achievements in stories
- Extract information from project descriptions and problem-solving examples
- Identify soft skills and leadership examples from context

**Pass 3 - Cross-Reference Validation:**
- Connect information across different sections for completeness
- Validate dates and timelines for consistency
- Cross-reference skills mentioned in different contexts
- Ensure no duplicate or contradictory information

**Pass 4 - Pattern Matching Sweep:**
- Use advanced pattern recognition for missed information
- Look for alternative formats and informal mentions
- Catch information in signatures, footers, or metadata
- Find skills and experience mentioned in achievement descriptions

**Pass 5 - Final Completeness Check:**
- Ensure all sections have been thoroughly analyzed
- Verify that no obvious information has been missed
- Check for information in unconventional locations
- Confirm extraction quality and completeness

🎯 **EXTRACTION QUALITY ASSURANCE:**

**Thoroughness Checklist:**
- ✅ Scanned entire document for personal information
- ✅ Extracted ALL job titles, companies, and employment dates
- ✅ Found ALL skills, technologies, and tools mentioned
- ✅ Identified ALL education levels from high school to advanced degrees
- ✅ Located ALL certifications, licenses, and credentials
- ✅ Documented ALL projects (professional, personal, academic)
- ✅ Captured ALL achievements and quantified results
- ✅ Identified ALL explicit skill gaps and learning goals mentioned
- ✅ Found ALL career interests and aspirations stated
- ✅ Extracted ALL salary/compensation information if mentioned

**Evidence-Based Analysis:**
- Mark each piece of information with confidence level (High/Medium/Low)
- Provide direct quotes or context for extracted information
- Clearly distinguish between explicit mentions and contextual inferences
- Note when information is incomplete or requires clarification
- Highlight any inconsistencies or contradictions found

**Completeness Validation:**
- Calculate extraction percentage for each major category
- Identify any obvious gaps where information might exist but wasn't found
- Note areas where more information would be valuable but isn't available
- Ensure comprehensive coverage without creating fictional content

**FINAL QUALITY STANDARDS:**
- ✅ Extract EVERY piece of existing information with maximum accuracy
- ✅ Provide evidence-based analysis using only actual content
- ✅ Maintain highest detection standards from version 1 accuracy
- ✅ Include specific examples and direct quotes for validation
- ✅ Cross-validate all information for internal consistency
- ✅ Generate insights ONLY when clearly supported by actual data
- ✅ Clearly state "Not mentioned" for any missing information categories
- ✅ Ensure zero hallucination while maintaining maximum detection thoroughness

**⚠️ ULTIMATE UNIVERSAL EXTRACTION GUARANTEE:**
This analysis will work for professionals from ANY industry or field - from healthcare workers to teachers, from lawyers to mechanics, from artists to accountants. It will be MORE THOROUGH than any previous version in finding existing data while maintaining ZERO HALLUCINATION. Every piece of information that exists in the content WILL be found and extracted regardless of the professional field. If information doesn't exist, it will be clearly noted as "Not mentioned" rather than invented.

Conduct the most aggressive, thorough, and accurate career analysis possible across ALL INDUSTRIES AND PROFESSIONS using ONLY the information that actually exists in the content - miss NOTHING that's there, add NOTHING that isn't, work for EVERY profession.`

    logger.info('data-analyst', 'Making Gemini API call for ultra-enhanced analysis')
    let result
    try {
      result = await geminiClient.generateContent(analysisPrompt, {
        agentType: 'data-analyst'
      })
      logger.agentSuccess('data-analyst', 'Gemini API call successful')
    } catch (apiError) {
      logger.agentError('data-analyst', apiError)
      
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
        error: 'AI analysis failed',
        errorDetails: apiError.message,
        timestamp: Date.now(),
        contentLength: content.length,
        model: geminiClient.currentModel,
        source: 'api_error'
      }, { status: 500 })
    }

    logger.info('data-analyst', 'Processing ultra-enhanced analysis response')
    const analysis = result.response.text()
    logger.debug('data-analyst', `Analysis length: ${analysis.length}`)

    if (!analysis || analysis.length < 500) {
      logger.warn('data-analyst', 'Analysis seems incomplete or too short')
      return Response.json({
        error: 'Analysis incomplete',
        warning: 'AI analysis was too brief or incomplete',
        originalAnalysis: analysis,
        timestamp: Date.now(),
        contentLength: content.length,
        model: geminiClient.currentModel,
        source: 'incomplete_analysis'
      }, { status: 422 })
    }

    // Universal industry validation checks
    const validationChecks = {
      // Personal Information
      hasPersonalInfo: /personal|contact|name|email|phone|location|linkedin|profile|about|bio/i.test(analysis),
      hasContactDetails: /email|phone|linkedin|github|website|contact|reach|connect/i.test(analysis),
      
      // Professional Experience (Universal)
      hasExperience: /experience|role|position|job|company|work|employment|career|professional|practice/i.test(analysis),
      hasJobTitles: /title|position|role|worked as|served as|current|previous|employed|practitioner/i.test(analysis),
      hasCompanies: /company|organization|employer|firm|corporation|hospital|school|practice|agency|institution/i.test(analysis),
      hasEmploymentDates: /\d{4}|year|month|present|current|since|until|from|to|duration/i.test(analysis),
      hasResponsibilities: /responsible|manage|provide|deliver|teach|treat|serve|coordinate|oversee|handle/i.test(analysis),
      
      // Career Timeline
      hasCareerTimeline: /timeline|chronological|progression|transition|years|duration|career path/i.test(analysis),
      hasCareerProgression: /promoted|advanced|grew|progressed|transitioned|moved|next role|senior/i.test(analysis),
      
      // Skills & Expertise (Universal)
      hasSkills: /skill|expertise|knowledge|proficiency|competency|ability|capability|experience in/i.test(analysis),
      hasTechnicalSkills: /technical|software|system|equipment|tools|technology|specialized|professional/i.test(analysis),
      hasSoftSkills: /leadership|communication|collaboration|problem.solving|teamwork|management|interpersonal/i.test(analysis),
      hasToolsAndPlatforms: /platform|software|system|equipment|tools|technology|applications|instruments/i.test(analysis),
      hasIndustryKnowledge: /industry|sector|field|domain|specialty|practice area|specialization/i.test(analysis),
      
      // Education (All Levels)
      hasEducation: /education|degree|university|college|school|bachelor|master|phd|graduated|academic|training/i.test(analysis),
      hasHighSchoolEducation: /high school|secondary|o.level|a.level|hsc|ssc|gcse|diploma|class 12|graduation/i.test(analysis),
      hasHigherEducation: /university|college|bachelor|master|phd|degree|graduation|academic|undergraduate|graduate/i.test(analysis),
      hasOnlineLearning: /online|coursera|udemy|edx|bootcamp|certification|training|course|continuing education/i.test(analysis),
      hasProfessionalDevelopment: /professional development|continuing education|training|workshop|seminar|conference/i.test(analysis),
      
      // Certifications & Credentials (Universal)
      hasCertifications: /certification|certified|certificate|licensed|credential|accredited|qualified|registered/i.test(analysis),
      hasLicenses: /license|licensed|registration|permit|authorization|credentials|professional status/i.test(analysis),
      hasProfessionalCredentials: /professional|board certified|specialty|fellowship|designation|member/i.test(analysis),
      hasIndustrySpecificCerts: /industry|specialty|professional|trade|technical|clinical|legal|financial/i.test(analysis),
      
      // Projects & Initiatives (Universal)
      hasProjects: /project|initiative|program|portfolio|implementation|development|improvement|campaign/i.test(analysis),
      hasPersonalProjects: /personal|individual|independent|volunteer|community|side|hobby/i.test(analysis),
      hasProfessionalProjects: /work|professional|client|business|organizational|institutional|clinical|legal/i.test(analysis),
      hasProjectDetails: /scope|outcome|result|impact|team|timeline|budget|success|achievement/i.test(analysis),
      hasInitiatives: /initiative|program|improvement|implementation|development|innovation|transformation/i.test(analysis),
      
      // Achievements (Universal)
      hasAchievements: /achievement|award|recognition|accomplishment|success|performance|impact|result|outcome/i.test(analysis),
      hasQuantifiedAchievements: /\d+[\%\$]|increased|improved|reduced|grew|saved|generated|by \d+|percent/i.test(analysis),
      hasRecognition: /award|recognition|honor|featured|selected|chosen|top|best|excellence|outstanding/i.test(analysis),
      hasLeadershipAchievements: /led|managed|mentored|coached|built team|team lead|leadership|supervision/i.test(analysis),
      hasIndustryAchievements: /industry|professional|clinical|academic|business|sector|field|domain/i.test(analysis),
      
      // Career Development (Universal)
      hasSkillGaps: /gap|missing|lack|need|require|improve|development|learning|weakness|want to learn/i.test(analysis),
      hasCareerGoals: /goal|aspir|aim|want|plan|next|future|career objective|looking for|seeking/i.test(analysis),
      hasCareerOpportunities: /opportunity|career|role|position|advancement|progression|next|future|transition/i.test(analysis),
      hasLearningPlans: /learning|study|training|course|certification|development|skill building|education/i.test(analysis),
      
      // Market & Industry Context
      hasSalaryInsights: /salary|compensation|market|value|income|earning|pay|benefits|total|package/i.test(analysis),
      hasMarketAnalysis: /market|industry|demand|trend|competition|positioning|benchmark|landscape|sector/i.test(analysis),
      hasIndustryContext: /industry|sector|domain|field|market|business|professional|practice|specialty/i.test(analysis),
      
      // Strategic Information
      hasRecommendations: /recommend|suggest|advice|next step|action|strategy|plan|priority|should|consider/i.test(analysis),
      hasStrengths: /strength|strong|excel|good at|proficient|skilled|expertise|advantage|asset/i.test(analysis),
      hasDevelopmentAreas: /improve|develop|enhance|strengthen|work on|focus on|growth area|opportunity/i.test(analysis),
      
      // Quality & Coverage Indicators
      hasSpecificExamples: /example|instance|case|specifically|particular|such as|including|demonstrated/i.test(analysis),
      hasQuantifiedData: /\d+[\%\$]|increased|improved|reduced|grew|saved|generated|number|metric|percent/i.test(analysis),
      hasTimeframes: /\d{4}|year|month|since|until|duration|timeline|period|timeframe|experience/i.test(analysis),
      hasDetailedAnalysis: analysis.length > 2000 && /detailed|comprehensive|thorough|extensive|in-depth/i.test(analysis),
      hasUniversalApplicability: /industry|field|sector|professional|domain|specialty|practice|business/i.test(analysis)
    }

    // Calculate completeness score
    const completenessScore = Object.values(validationChecks).filter(Boolean).length
    const totalChecks = Object.keys(validationChecks).length
    const completenessPercentage = (completenessScore / totalChecks * 100).toFixed(1)

    logger.info('data-analyst', `Ultra-enhanced validation results: ${completenessScore}/${totalChecks} (${completenessPercentage}%)`)
    logger.info('data-analyst', `Validation breakdown: ${JSON.stringify(validationChecks)}`)

    logger.agentSuccess('data-analyst', 'Ultra-enhanced comprehensive analysis completed successfully')
    return Response.json({
      analysis,
      timestamp: Date.now(),
      contentLength: content.length,
      model: geminiClient.currentModel,
      source: 'ai_generated',
      confidence: 'high',
      comprehensive: true,
      extractionFocus: [
        'personalInfo', 'contactDetails', 'experience', 'jobTitles', 'companies', 'employmentDates', 
        'responsibilities', 'careerTimeline', 'careerProgression', 'skills', 'technicalSkills', 
        'domainExpertise', 'softSkills', 'toolsAndPlatforms', 'industryKnowledge', 'education', 
        'highSchoolEducation', 'higherEducation', 'onlineLearning', 'professionalDevelopment',
        'certifications', 'licenses', 'professionalCredentials', 'industrySpecificCerts',
        'projects', 'personalProjects', 'professionalProjects', 'projectDetails', 'initiatives',
        'achievements', 'quantifiedAchievements', 'recognition', 'leadershipAchievements', 
        'industryAchievements', 'skillGaps', 'careerGoals', 'careerOpportunities', 
        'learningPlans', 'salaryInsights', 'marketAnalysis', 'industryContext',
        'recommendations', 'strengths', 'developmentAreas', 'universalApplicability'
      ],
      validationChecks,
      completenessScore: {
        score: completenessScore,
        total: totalChecks,
        percentage: parseFloat(completenessPercentage)
      },
      enhancementLevel: 'ultra-enhanced-universal',
      detectionStrategies: [
        'explicit_detection', 'pattern_matching', 'contextual_inference', 'cross_referencing', 
        'timeline_reconstruction', 'multi_pass_scanning', 'comprehensive_validation', 
        'evidence_based_extraction', 'thoroughness_verification', 'universal_industry_coverage',
        'multi_domain_expertise', 'cross_sector_analysis'
      ]
    })

  } catch (error) {
    logger.agentError('data-analyst', error)
    
    return Response.json({
      error: 'Ultra-enhanced data analyst agent failed',
      errorDetails: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
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