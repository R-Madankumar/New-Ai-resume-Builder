import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Divider, 
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useResumeContext } from '../context/ResumeContext';
import FormNavigation from '../components/FormNavigation';
import ModernPreview from '../templates/previews/ModernPreview';
import MinimalPreview from '../templates/previews/MinimalPreview';
import CreativePreview from '../templates/previews/CreativePreview';
import ProfessionalPreview from '../templates/previews/ProfessionalPreview';
import { GEMINI_API_KEY, GEMINI_API_URL } from '../config';
import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType,
  BorderStyle,
  Packer
} from 'docx';
import { saveAs } from 'file-saver';

// Import other templates when available
// import MinimalTemplate from '../templates/MinimalTemplate';
// import CreativeTemplate from '../templates/CreativeTemplate';
// import ProfessionalTemplate from '../templates/ProfessionalTemplate';

const ResumePreview: React.FC = () => {
  const { 
    resumeData, 
    updatePersonalInfo, 
    updateExperience, 
    updateProject,
    setTemplate
  } = useResumeContext();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'print'>('preview');
  const [isAIEnhanced, setIsAIEnhanced] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(resumeData.template);
  const [autoGenerateOnLoad, setAutoGenerateOnLoad] = useState(true);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState<null | HTMLElement>(null);
  const downloadMenuOpen = Boolean(downloadAnchorEl);

  // Update currentTemplate when resumeData.template changes
  useEffect(() => {
    setCurrentTemplate(resumeData.template);
    console.log(`Current template in preview: ${resumeData.template}`);
  }, [resumeData.template]);

  // Auto-generate AI content when the component loads
  useEffect(() => {
    if (autoGenerateOnLoad && !isAIEnhanced) {
      console.log("Auto-generating AI content on load");
      setAutoGenerateOnLoad(false);
      
      const timer = setTimeout(() => {
        enhanceWithAI();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerateOnLoad, isAIEnhanced]);

  const handleTemplateChange = (
    event: React.MouseEvent<HTMLElement>,
    newTemplate: 'modern' | 'minimal' | 'creative' | 'professional',
  ) => {
    if (newTemplate !== null) {
      setCurrentTemplate(newTemplate);
      setTemplate(newTemplate);
      console.log(`Template changed to: ${newTemplate}`);
    }
  };

  const enhanceWithAI = async () => {
    if (!resumeData) return;
    
    try {
      setIsGenerating(true);
      
      // Create template-specific guidance for the AI
      const templateGuidance = resumeData.template === 'modern' ? 
        'Create a clean, professional resume with concise bullet points, clear section headings, and a focus on recent achievements. Use action verbs and quantifiable results.' : 
      resumeData.template === 'minimal' ? 
        'Create an elegant, streamlined resume with very concise content. Focus on essential information only, eliminate unnecessary words, and use simple, direct language.' : 
      resumeData.template === 'creative' ? 
        'Create a dynamic, engaging resume with colorful language and unique descriptions. Highlight creative achievements, use industry-specific terminology, and showcase personality.' : 
        'Create a traditional, corporate-friendly resume with formal language, detailed descriptions, and emphasis on career progression. Use industry-standard terminology.';
      
      console.log(`Enhancing resume with AI for template: ${resumeData.template}`);
      
      const prompt = `As an expert resume writer with 15+ years of experience, please enhance this resume content to be more professional, impactful, and well-structured. 

IMPORTANT FORMATTING INSTRUCTIONS:
1. DO NOT use any special characters like asterisks (*), hashes (#), or bullet points (•) in your response
2. Use clear, professional language with proper capitalization and punctuation
3. Format work achievements as complete, professional sentences
4. Ensure all content is properly structured and easy to read
5. Avoid any markdown or formatting symbols

TEMPLATE STYLE: This resume uses the "${resumeData.template}" template style. ${templateGuidance}

PERSONAL INFORMATION:
- Name: ${resumeData.personalInfo.fullName}
- Email: ${resumeData.personalInfo.email}
- Phone: ${resumeData.personalInfo.phone}
- Address: ${resumeData.personalInfo.address}
- LinkedIn: ${resumeData.personalInfo.linkedin || 'Not provided'}
- Website: ${resumeData.personalInfo.website || 'Not provided'}
- Current Summary: ${resumeData.personalInfo.summary || 'Not provided'}

WORK EXPERIENCE:
${resumeData.experiences.map((exp, index) => `
Experience ${index + 1}:
- Position: ${exp.position}
- Company: ${exp.company}
- Location: ${exp.location || 'Not specified'}
- Duration: ${exp.startDate} to ${exp.current ? 'Present' : exp.endDate}
- Description: ${exp.description}
- Achievements: ${exp.achievements.join('; ')}
`).join('\n')}

EDUCATION:
${resumeData.education.map((edu, index) => `
Education ${index + 1}:
- Degree: ${edu.degree}
- Field: ${edu.field}
- Institution: ${edu.institution}
- Location: ${edu.location || 'Not specified'}
- Duration: ${edu.startDate} to ${edu.current ? 'Present' : edu.endDate}
${edu.gpa ? `- GPA: ${edu.gpa}` : ''}
${edu.achievements && edu.achievements.length > 0 ? `- Achievements: ${edu.achievements.join('; ')}` : ''}
`).join('\n')}

SKILLS:
${resumeData.skills.map(skill => `- ${skill.name} (Level: ${skill.level})`).join('\n')}

PROJECTS:
${resumeData.projects.map((proj, index) => `
Project ${index + 1}:
- Name: ${proj.name}
- Description: ${proj.description}
- Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
${proj.url ? `- URL: ${proj.url}` : ''}
${proj.startDate ? `- Duration: ${proj.startDate} to ${proj.current ? 'Present' : proj.endDate || 'Not specified'}` : ''}
`).join('\n')}

Please provide the following in your response, tailored specifically to the ${resumeData.template} style:
1. A ${resumeData.template === 'minimal' ? 'very concise' : resumeData.template === 'creative' ? 'dynamic and engaging' : resumeData.template === 'professional' ? 'formal and detailed' : 'clear and impactful'} professional summary (3-4 sentences maximum)
2. ${resumeData.template === 'minimal' ? 'Streamlined' : resumeData.template === 'creative' ? 'Distinctive' : resumeData.template === 'professional' ? 'Comprehensive' : 'Effective'} descriptions for each work experience (use complete sentences, no bullet points)
3. ${resumeData.template === 'minimal' ? 'Brief' : resumeData.template === 'creative' ? 'Innovative' : resumeData.template === 'professional' ? 'Detailed' : 'Clear'} project descriptions (use complete sentences, no bullet points)
4. A better organization of skills (grouped by category if possible)

Format your response EXACTLY as follows with no additional symbols or formatting:

SUMMARY: [enhanced summary]

EXPERIENCE 1: [improved description for experience 1]
EXPERIENCE 2: [improved description for experience 2]
...

PROJECT 1: [enhanced description for project 1]
PROJECT 2: [enhanced description for project 2]
...

SKILLS: [reorganized skills with levels]`;

      console.log("Sending AI enhancement request for template:", resumeData.template);
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate enhanced resume');
      }

      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const enhancedContent = data.candidates[0].content.parts[0].text;
        console.log("Received AI response:", enhancedContent.substring(0, 200) + "...");
        
        try {
          // Create a deep copy of the resume data to avoid reference issues
          const updatedResumeData = JSON.parse(JSON.stringify(resumeData));
          
          // Extract the summary
          const summaryMatch = enhancedContent.match(/SUMMARY:\s*([\s\S]*?)(?=\n\n|$)/);
          if (summaryMatch && summaryMatch[1]) {
            updatedResumeData.personalInfo.summary = summaryMatch[1].trim();
            console.log("Updated summary:", updatedResumeData.personalInfo.summary);
          }
          
          // Extract experience descriptions
          const experienceRegex = /EXPERIENCE\s+(\d+):\s*([\s\S]*?)(?=\n\nEXPERIENCE|\n\nPROJECT|\n\nSKILLS|$)/g;
          let expMatch: RegExpExecArray | null;
          while ((expMatch = experienceRegex.exec(enhancedContent)) !== null) {
            const index = parseInt(expMatch[1]) - 1;
            if (index >= 0 && index < updatedResumeData.experiences.length) {
              const description = expMatch[2].trim();
              
              // Process the description to extract achievements if they exist
              const achievementsSplit = description.split(/Achievements:|Key accomplishments:|Notable achievements:/i);
              
              if (achievementsSplit.length > 1) {
                // Main description is the first part
                updatedResumeData.experiences[index].description = achievementsSplit[0].trim();
                
                // Achievements are in the second part
                const achievementsText = achievementsSplit[1].trim();
                const achievementsList = achievementsText
                  .split(/\.\s+(?=[A-Z])/)
                  .map(item => item.trim())
                  .filter(item => item.length > 0)
                  .map(item => item.endsWith('.') ? item : item + '.');
                
                if (achievementsList.length > 0) {
                  updatedResumeData.experiences[index].achievements = achievementsList;
                }
              } else {
                updatedResumeData.experiences[index].description = description;
              }
              
              console.log(`Updated experience ${index + 1} description`);
            }
          }
          
          // Extract project descriptions
          const projectRegex = /PROJECT\s+(\d+):\s*([\s\S]*?)(?=\n\nPROJECT|\n\nSKILLS|$)/g;
          let projMatch: RegExpExecArray | null;
          while ((projMatch = projectRegex.exec(enhancedContent)) !== null) {
            const index = parseInt(projMatch[1]) - 1;
            if (index >= 0 && index < updatedResumeData.projects.length) {
              const description = projMatch[2].trim();
              updatedResumeData.projects[index].description = description;
              console.log(`Updated project ${index + 1} description`);
            }
          }
          
          // Extract skills
          const skillsMatch = enhancedContent.match(/SKILLS:\s*([\s\S]*?)(?=$)/);
          if (skillsMatch && skillsMatch[1]) {
            const skillsText = skillsMatch[1].trim();
            console.log("Found skills section:", skillsText.substring(0, 100) + "...");
            
            // Try to extract skill categories if they exist
            const skillCategories = skillsText.split(/\n(?=[A-Z][a-zA-Z\s]+:)/);
            
            if (skillCategories.length > 1) {
              // Skills are organized by category
              const processedSkills = [];
              
              for (const categoryBlock of skillCategories) {
                const categoryMatch = categoryBlock.match(/^([A-Za-z\s]+):(.*)/s);
                if (categoryMatch) {
                  const category = categoryMatch[1].trim();
                  const skillsInCategory = categoryMatch[2].trim()
                    .split(/,|\n/)
                    // This error occurs because TypeScript requires explicit type annotations for function parameters
                    // when strict type checking is enabled. We specify string type for the parameter 's'
                    .map((s: string) => s.trim())
                    .filter((s: string) => s.length > 0);
                  
                  for (const skillText of skillsInCategory) {
                    // Try to extract level if it exists
                    const levelMatch = skillText.match(/(.*?)\s*\((Advanced|Intermediate|Beginner|Expert|Proficient|Basic)\)/i);
                    if (levelMatch) {
                      processedSkills.push({
                        name: levelMatch[1].trim(),
                        level: levelMatch[2].trim(),
                        category: category
                      });
                    } else {
                      processedSkills.push({
                        name: skillText,
                        level: "Proficient",
                        category: category
                      });
                    }
                  }
                }
              }
              
              if (processedSkills.length > 0) {
                // Preserve IDs from original skills where possible
                for (let i = 0; i < processedSkills.length; i++) {
                  if (i < updatedResumeData.skills.length) {
                    processedSkills[i] = { ...processedSkills[i], id: updatedResumeData.skills[i].id };
                  }
                }
                updatedResumeData.skills = processedSkills;
              }
            } else {
              // Skills are in a flat list
              const skillsList = skillsText
                .split(/,|\n/)
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 0);
              
              const processedSkills = [];
              
              for (const skillText of skillsList) {
                // Try to extract level if it exists
                const levelMatch = skillText.match(/(.*?)\s*\((Advanced|Intermediate|Beginner|Expert|Proficient|Basic)\)/i);
                if (levelMatch) {
                  processedSkills.push({
                    name: levelMatch[1].trim(),
                    level: levelMatch[2].trim()
                  });
                } else {
                  processedSkills.push({
                    name: skillText,
                    level: "Proficient"
                  });
                }
              }
              
              if (processedSkills.length > 0) {
                // Preserve IDs from original skills where possible
                for (let i = 0; i < processedSkills.length; i++) {
                  if (i < updatedResumeData.skills.length) {
                    processedSkills[i] = { ...processedSkills[i], id: updatedResumeData.skills[i].id };
                  }
                }
                updatedResumeData.skills = processedSkills;
              }
            }
          }
          
          // Update the resume data all at once
          console.log("Updating resume data with AI enhancements");
          
          // Update personal info
          updatePersonalInfo(updatedResumeData.personalInfo);
          
          // Update each experience
          for (let i = 0; i < updatedResumeData.experiences.length; i++) {
            if (i < resumeData.experiences.length) {
              const originalExp = resumeData.experiences[i];
              const updatedExp = updatedResumeData.experiences[i];
              if (originalExp.id) {
                updateExperience(originalExp.id, updatedExp);
              }
            }
          }
          
          // Update each project
          for (let i = 0; i < updatedResumeData.projects.length; i++) {
            if (i < resumeData.projects.length) {
              const originalProj = resumeData.projects[i];
              const updatedProj = updatedResumeData.projects[i];
              if (originalProj.id) {
                updateProject(originalProj.id, updatedProj);
              }
            }
          }
          
          // Set the AI enhanced flag
          setIsAIEnhanced(true);
          setShowSuccess(true);
          console.log("AI enhancement complete");
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          setShowError(true);
        }
      } else {
        console.error('Invalid AI response format:', data);
        setShowError(true);
      }
    } catch (error) {
      console.error('Error enhancing resume:', error);
      setShowError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const downloadPDF = async () => {
    handleDownloadClose();
    if (!resumeRef.current) return;

    try {
      setIsGenerating(true);
      
      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      // Clone the current template for PDF generation
      const templateContent = resumeRef.current.cloneNode(true) as HTMLElement;
      
      // Set styles for proper PDF rendering
      templateContent.style.height = 'auto';
      templateContent.style.overflow = 'visible';
      
      // Find all Paper elements and remove their max-height
      const paperElements = templateContent.querySelectorAll('[class*="MuiPaper-root"]');
      paperElements.forEach((element) => {
        const paper = element as HTMLElement;
        paper.style.height = 'auto';
        paper.style.maxHeight = 'none';
        paper.style.overflow = 'visible';
      });
      
      // Find all Box elements and remove their max-height
      const boxElements = templateContent.querySelectorAll('[class*="MuiBox-root"]');
      boxElements.forEach((element) => {
        const box = element as HTMLElement;
        box.style.height = 'auto';
        box.style.maxHeight = 'none';
        box.style.overflow = 'visible';
      });
      
      // Remove any template headers or footers for the PDF
      const headers = templateContent.querySelectorAll('.preview-header');
      headers.forEach(header => header.remove());
      
      // Append the modified template to the temporary container
      tempContainer.appendChild(templateContent);

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          scrollY: 0,
          scrollX: 0,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };

      await html2pdf().set(opt).from(templateContent).save();
      
      // Show success message
      setShowSuccess(true);
      
      // Clean up
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setShowError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDOCX = async () => {
    handleDownloadClose();
    try {
      setIsGenerating(true);
      
      // Check if resumeRef exists
      if (!resumeRef.current) {
        setShowError(true);
        setIsGenerating(false);
        return;
      }
      
      // Create a temporary container for HTML content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      // Clone the current template for HTML content
      const templateContent = resumeRef.current.cloneNode(true) as HTMLElement;
      
      // Set styles for proper rendering
      templateContent.style.height = 'auto';
      templateContent.style.overflow = 'visible';
      
      // Find all Paper elements and remove their max-height
      const paperElements = templateContent.querySelectorAll('[class*="MuiPaper-root"]');
      paperElements.forEach((element) => {
        const paper = element as HTMLElement;
        paper.style.height = 'auto';
        paper.style.maxHeight = 'none';
        paper.style.overflow = 'visible';
      });
      
      // Find all Box elements and remove their max-height
      const boxElements = templateContent.querySelectorAll('[class*="MuiBox-root"]');
      boxElements.forEach((element) => {
        const box = element as HTMLElement;
        box.style.height = 'auto';
        box.style.maxHeight = 'none';
        box.style.overflow = 'visible';
      });
      
      // Remove any template headers or footers
      const headers = templateContent.querySelectorAll('.preview-header');
      headers.forEach(header => header.remove());
      
      // Append the modified template to the temporary container
      tempContainer.appendChild(templateContent);
      
      // Get the HTML content
      const htmlContent = tempContainer.innerHTML;
      
      // Create a Blob with the HTML content
      const blob = new Blob([`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              h1, h2, h3 { margin-top: 20px; }
              p { margin: 10px 0; }
              .container { max-width: 8.5in; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="container">
              ${htmlContent}
            </div>
          </body>
        </html>
      `], { type: 'text/html' });
      
      // Save the HTML file (which can be opened in Word)
      saveAs(blob, `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.html`);
      
      // Show success message
      setShowSuccess(true);
      
      // Clean up
      document.body.removeChild(tempContainer);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating DOCX:', error);
      setShowError(true);
      setIsGenerating(false);
    }
  };

  const printResume = () => {
    if (!resumeRef.current) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setShowError(true);
      return;
    }
    
    // Get the HTML content
    const content = resumeRef.current.innerHTML;
    
    // Write to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>${resumeData.personalInfo.fullName} - Resume</title>
          <style>
            body { font-family: 'Arial', sans-serif; }
            @media print {
              body { margin: 0; padding: 0; }
              @page { size: letter portrait; margin: 0.5in; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Print after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleShareResume = () => {
    // This would typically integrate with a sharing service
    // For now, we'll just show a success message
    setShowSuccess(true);
  };

  const renderTemplate = () => {
    const previewProps = {
      resumeData,
      isAIEnhanced,
      viewMode
    };

    switch (currentTemplate) {
      case 'modern':
        return <ModernPreview {...previewProps} />;
      case 'minimal':
        return <MinimalPreview {...previewProps} />;
      case 'creative':
        return <CreativePreview {...previewProps} />;
      case 'professional':
        return <ProfessionalPreview {...previewProps} />;
      default:
        return <ModernPreview {...previewProps} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Resume Preview
            {isAIEnhanced && (
              <Box 
                component="span" 
                sx={{ 
                  ml: 2, 
                  px: 1, 
                  py: 0.5, 
                  bgcolor: 'secondary.main', 
                  color: 'secondary.contrastText',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <AutoFixHighIcon fontSize="small" />
                AI Enhanced
              </Box>
            )}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Enhance with AI">
              <Button
                variant="contained"
                color="secondary"
                onClick={enhanceWithAI}
                disabled={isGenerating}
                startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
              >
                {isGenerating ? 'Enhancing...' : isAIEnhanced ? 'Regenerate with AI' : 'Enhance with AI'}
              </Button>
            </Tooltip>

            <Tooltip title="Download Options">
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadClick}
                disabled={isGenerating}
                endIcon={<ArrowDropDownIcon />}
                startIcon={isGenerating ? <CircularProgress size={20} /> : <DownloadIcon />}
              >
                {isGenerating ? 'Generating...' : 'Download'}
              </Button>
            </Tooltip>
            <Menu
              anchorEl={downloadAnchorEl}
              open={downloadMenuOpen}
              onClose={handleDownloadClose}
            >
              <MenuItem onClick={downloadPDF}>
                <PictureAsPdfIcon fontSize="small" sx={{ mr: 1 }} />
                PDF Format
              </MenuItem>
              <MenuItem onClick={downloadDOCX}>
                <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                HTML Format (Word Compatible)
              </MenuItem>
            </Menu>
            
            {/* <Tooltip title="Print Resume">
              <IconButton color="primary" onClick={printResume}>
                <PrintIcon />
              </IconButton>
            </Tooltip> */}
            
            {/* <Tooltip title="Share Resume">
              <IconButton color="primary" onClick={handleShareResume}>
                <ShareIcon />
              </IconButton>
            </Tooltip> */}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Tabs 
            value={viewMode} 
            onChange={(_, newValue) => setViewMode(newValue)}
          >
            <Tab 
              value="preview" 
              label="Preview" 
              icon={<VisibilityIcon fontSize="small" />} 
              iconPosition="start"
            />
            {/* <Tab 
              value="print" 
              label="Print View" 
              icon={<PrintIcon fontSize="small" />} 
              iconPosition="start"
            /> */}
          </Tabs>
          
          <ToggleButtonGroup
            value={currentTemplate}
            exclusive
            onChange={handleTemplateChange}
            aria-label="template selection"
            size="small"
          >
            <ToggleButton value="modern" aria-label="modern template">
              <ViewModuleIcon sx={{ mr: 1, fontSize: '1rem' }} />
              Modern
            </ToggleButton>
            <ToggleButton value="professional" aria-label="professional template">
              <ViewModuleIcon sx={{ mr: 1, fontSize: '1rem' }} />
              Professional
            </ToggleButton>
            <ToggleButton value="minimal" aria-label="minimal template">
              <ViewModuleIcon sx={{ mr: 1, fontSize: '1rem' }} />
              Minimal
            </ToggleButton>
            <ToggleButton value="creative" aria-label="creative template">
              <ViewModuleIcon sx={{ mr: 1, fontSize: '1rem' }} />
              Creative
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <Box 
          ref={resumeRef} 
          sx={{ 
            height: 'calc(100vh - 300px)', 
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {renderTemplate()}
        </Box>
      </Box>
      
      <FormNavigation hidePrev={false} hideNext={true} />
      
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={3000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          {isGenerating ? 'Generating...' : isAIEnhanced ? 'Resume enhanced with AI!' : 'Operation completed successfully!'}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={showError} 
        autoHideDuration={5000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          Failed to complete operation. Please try again.
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default ResumePreview; 