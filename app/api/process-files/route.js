// app/api/process-files/route.js - Updated for sequential processing
import mammoth from 'mammoth'
import { geminiClient } from '../../../lib/gemini-client'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const files = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('file_'))
      .map(([, file]) => file)

    if (files.length === 0) {
      return Response.json({ error: 'No files uploaded' }, { status: 400 })
    }

    let combinedContent = ""
    let processingLog = []
    
    // Enhanced file processing with better error handling
    for (const file of files) {
      try {
        const buffer = await file.arrayBuffer()
        processingLog.push(`📄 Processing ${file.name} (${file.type})`)
        
        if (file.name.endsWith('.pdf')) {
          const base64Data = Buffer.from(buffer).toString('base64')
          
          const visionPrompt = `Extract ALL career information from this PDF CV/resume:

EXTRACT COMPREHENSIVE DETAILS:
- Personal Information (name, contact details, location)
- Professional Summary and Objective
- Work Experience (companies, roles, dates, responsibilities, achievements)
- Technical Skills (programming languages, frameworks, tools, technologies)
- Education (degrees, institutions, dates, GPA if mentioned)
- Projects (titles, descriptions, technologies used, outcomes)
- Certifications and Professional Development
- Awards and Recognition
- Publications or Patents
- Professional Associations and Memberships

Provide detailed, structured text extraction with specific examples and quantifiable achievements.`

          try {
            // Enhanced retry mechanism for PDF processing
            let pdfResult = null
            for (let attempt = 0; attempt < 3; attempt++) {
              try {
                if (attempt > 0) {
                  await new Promise(resolve => setTimeout(resolve, 2000 * attempt))
                }
                pdfResult = await geminiClient.generateContent([
                  visionPrompt,
                  { inlineData: { data: base64Data, mimeType: 'application/pdf' } }
                ], { agentType: 'data-analyst' })
                break
              } catch (retryError) {
                if (attempt === 2) throw retryError
                console.log(`PDF processing attempt ${attempt + 1} failed, retrying...`)
              }
            }
            
            if (pdfResult) {
              const extractedText = pdfResult.response.text()
              if (extractedText && extractedText.length > 50) {
                combinedContent += `\n\n=== ${file.name} ===\n${extractedText}`
                processingLog.push(`✅ PDF extracted (${extractedText.length} characters)`)
              } else {
                processingLog.push(`⚠️ PDF minimal content extracted`)
                combinedContent += `\n\n=== ${file.name} ===\nPDF processed with limited content.`
              }
            }
          } catch (pdfError) {
            console.error('PDF processing failed:', pdfError)
            processingLog.push(`❌ PDF processing failed: ${pdfError.message}`)
            combinedContent += `\n\n=== ${file.name} ===\nPDF processing failed. Please try uploading as .docx or .txt format.`
          }
          
        } else if (file.name.endsWith('.docx')) {
          try {
            const result = await mammoth.extractRawText({ buffer })
            if (result.value && result.value.length > 20) {
              combinedContent += `\n\n=== ${file.name} ===\n${result.value}`
              processingLog.push(`✅ DOCX extracted (${result.value.length} characters)`)
            } else {
              processingLog.push(`⚠️ DOCX contained minimal text`)
            }
          } catch (docxError) {
            processingLog.push(`❌ DOCX error: ${docxError.message}`)
          }
          
        } else if (file.type?.includes('text') || file.name.match(/\.(txt|csv)$/)) {
          try {
            const text = new TextDecoder().decode(buffer)
            if (text && text.length > 10) {
              combinedContent += `\n\n=== ${file.name} ===\n${text.substring(0, 5000)}`
              processingLog.push(`✅ Text file processed (${text.length} characters)`)
            }
          } catch (textError) {
            processingLog.push(`❌ Text file error: ${textError.message}`)
          }
        } else {
          processingLog.push(`⚠️ Unsupported file type: ${file.type}`)
        }
        
        // Small delay between files to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (fileError) {
        console.error(`Error processing ${file.name}:`, fileError)
        processingLog.push(`❌ ${file.name}: ${fileError.message}`)
      }
    }

    // Validate extracted content
    if (!combinedContent.trim() || combinedContent.length < 100) {
      console.error('Insufficient content extracted:', combinedContent.substring(0, 200))
      return Response.json({ 
        error: 'Content extraction failed',
        details: 'Unable to extract meaningful career data from uploaded files. Please ensure files contain readable text and try different formats.',
        processingLog
      }, { status: 400 })
    }

    console.log(`Content extraction completed: ${combinedContent.length} characters`)
    processingLog.push(`🎯 Total content extracted: ${combinedContent.length} characters`)
    processingLog.push(`📋 Ready for sequential AI agent processing`)

    // Return the extracted content ready for sequential agent processing
    return Response.json({
      extractedContent: combinedContent,
      contentLength: combinedContent.length,
      filesProcessed: files.length,
      processingLog,
      ready: true,
      timestamp: Date.now(),
      // Content preview for validation
      contentPreview: combinedContent.substring(0, 500) + '...'
    })

  } catch (error) {
    console.error('File processing error:', error)
    return Response.json({ 
      error: 'File processing failed',
      details: error.message,
      timestamp: Date.now()
    }, { status: 500 })
  }
}