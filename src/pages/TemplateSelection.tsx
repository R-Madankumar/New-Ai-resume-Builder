import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useResumeContext } from '../context/ResumeContext';
import { GEMINI_API_KEY, GEMINI_API_URL } from '../config';

// Template options with local images
const templates = [
  { 
    id: 'modern', 
    name: 'Modern', 
    description: 'Clean layout with a sidebar for contact information',
    image: '/images/templates/modern-template.svg',
    color: '#3B82F6'
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    description: 'Simple, elegant design focused on content',
    image: '/images/templates/minimal-template.svg',
    color: '#10B981'
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    description: 'Bold layout that stands out from the crowd',
    image: '/images/templates/creative-template.svg',
    color: '#8B5CF6'
  },
  { 
    id: 'professional', 
    name: 'Professional', 
    description: 'Traditional layout for corporate environments',
    image: '/images/templates/professional-template.svg',
    color: '#F59E0B'
  }
];

const TemplateSelection: React.FC = () => {
  const { resumeData, setTemplate, nextStep, updatePersonalInfo } = useResumeContext();
  const [selectedTemplate, setSelectedTemplate] = useState(resumeData.template);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTemplate = event.target.value;
    setSelectedTemplate(newTemplate);
    
    // Immediately update the template in the context
    // This ensures the template is visible in the preview section right away
    setTemplate(newTemplate);
    console.log(`Template immediately updated to: ${newTemplate}`);
  };

  const generateResumePreview = async () => {
    try {
      setIsLoading(true);
      
      // Create a comprehensive prompt for the Gemini API that includes template-specific styling guidance
      const prompt = `As an AI resume expert, enhance the following resume data into a professional format that specifically matches a ${selectedTemplate} style resume.

${selectedTemplate === 'modern' ? 
  'For the Modern template: Create a clean, professional resume with concise bullet points, clear section headings, and a focus on recent achievements. Use action verbs and quantifiable results. Keep descriptions brief but impactful.' : 
selectedTemplate === 'minimal' ? 
  'For the Minimal template: Create an elegant, streamlined resume with very concise content. Focus on essential information only, eliminate unnecessary words, and use simple, direct language. Prioritize white space and readability.' : 
selectedTemplate === 'creative' ? 
  'For the Creative template: Create a dynamic, engaging resume with colorful language and unique descriptions. Highlight creative achievements, use industry-specific terminology, and showcase personality while maintaining professionalism.' : 
  'For the Professional template: Create a traditional, corporate-friendly resume with formal language, detailed descriptions, and emphasis on career progression. Use industry-standard terminology and focus on leadership and business impact.'}

Personal Info:
- Name: ${resumeData.personalInfo.fullName}
- Email: ${resumeData.personalInfo.email}
- Phone: ${resumeData.personalInfo.phone}
- Address: ${resumeData.personalInfo.address}
- LinkedIn: ${resumeData.personalInfo.linkedin || 'Not provided'}
- Website: ${resumeData.personalInfo.website || 'Not provided'}
- Current Summary: ${resumeData.personalInfo.summary || 'Not provided'}

Work Experience:
${resumeData.experiences.map((exp, index) => `
Experience ${index + 1}:
- Position: ${exp.position}
- Company: ${exp.company}
- Duration: ${exp.startDate} to ${exp.current ? 'Present' : exp.endDate}
- Description: ${exp.description}
- Achievements: ${exp.achievements.join(', ')}
`).join('\n')}

Education:
${resumeData.education.map((edu, index) => `
Education ${index + 1}:
- Degree: ${edu.degree}
- Field: ${edu.field}
- Institution: ${edu.institution}
- Duration: ${edu.startDate} to ${edu.current ? 'Present' : edu.endDate}
${edu.gpa ? `- GPA: ${edu.gpa}` : ''}
`).join('\n')}

Skills:
${resumeData.skills.map(skill => `- ${skill.name} (Level: ${skill.level})`).join('\n')}

Projects:
${resumeData.projects.map((proj, index) => `
Project ${index + 1}:
- Name: ${proj.name}
- Description: ${proj.description}
- Technologies: ${proj.technologies.join(', ')}
`).join('\n')}

Please provide the following in your response, tailored specifically to the ${selectedTemplate} style:
1. A ${selectedTemplate === 'minimal' ? 'very concise' : selectedTemplate === 'creative' ? 'dynamic and engaging' : selectedTemplate === 'professional' ? 'formal and detailed' : 'clear and impactful'} professional summary (${selectedTemplate === 'minimal' ? '2-3' : '3-4'} sentences)
2. ${selectedTemplate === 'minimal' ? 'Streamlined' : selectedTemplate === 'creative' ? 'Distinctive' : selectedTemplate === 'professional' ? 'Comprehensive' : 'Effective'} descriptions for each work experience (focus on ${selectedTemplate === 'minimal' ? 'key achievements only' : selectedTemplate === 'creative' ? 'unique contributions and creative problem-solving' : selectedTemplate === 'professional' ? 'leadership, responsibility, and business impact' : 'quantifiable results and core competencies'})
3. ${selectedTemplate === 'minimal' ? 'Brief' : selectedTemplate === 'creative' ? 'Innovative' : selectedTemplate === 'professional' ? 'Detailed' : 'Clear'} project descriptions
4. A better organization of skills ${selectedTemplate === 'minimal' ? 'with only the most essential ones' : selectedTemplate === 'creative' ? 'highlighting unique abilities' : selectedTemplate === 'professional' ? 'categorized by domain expertise' : 'grouped by proficiency'}

Format your response as follows:
SUMMARY: [enhanced summary]

EXPERIENCE 1: [improved description for experience 1]
EXPERIENCE 2: [improved description for experience 2]
...

PROJECT 1: [enhanced description for project 1]
PROJECT 2: [enhanced description for project 2]
...

SKILLS: [reorganized skills with levels]`;
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const enhancedContent = data.candidates[0].content.parts[0].text;
        
        // Parse the enhanced content and update the resume data
        const sections = enhancedContent.split('\n\n');
        let enhancedResumeData = { ...resumeData };
        
        sections.forEach((section: string) => {
          if (section.startsWith('Personal Summary:')) {
            enhancedResumeData.personalInfo.summary = section.replace('Personal Summary:', '').trim();
          }
          // Add more section parsing as needed
        });
        
        return enhancedResumeData;
      }
      
      throw new Error('Unexpected API response format');
    } catch (error) {
      console.error('Error generating resume preview:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Template is already set in handleTemplateChange, but we'll ensure it's set here too
      setTemplate(selectedTemplate);
      console.log(`Template confirmed as: ${selectedTemplate}`);
      
      // Only attempt to enhance the resume if the API key is valid
      if (GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY") {
        // Generate AI content specifically for the selected template
        const enhancedResumeData = await generateResumePreview();
        
        // Make sure the template is preserved in the enhanced data
        if (enhancedResumeData) {
          enhancedResumeData.template = selectedTemplate;
          
          // Update all resume sections with enhanced content
          updatePersonalInfo(enhancedResumeData.personalInfo);
          
          // Update other sections as needed (this would be expanded in a full implementation)
          console.log(`Enhanced resume data generated for ${selectedTemplate} template`);
        }
      }
      
      setSuccess(true);
      
      // Move to the next step after a short delay to show success state
      setTimeout(() => {
        nextStep();
      }, 1000);
    } catch (err) {
      setError('Failed to generate enhanced resume. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Choose a Template
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: '700px' }}>
        Select a template that best represents your professional style.
      </Typography>
      
      <Divider sx={{ mb: 4 }} />
      
      <Box sx={{ mb: 4 }}>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            aria-label="template"
            name="template"
            value={selectedTemplate}
            onChange={handleTemplateChange}
          >
            <Grid container spacing={3}>
              {templates.map((template) => (
                <Grid item xs={12} sm={6} md={3} key={template.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      transform: selectedTemplate === template.id ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: selectedTemplate === template.id ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                      border: selectedTemplate === template.id ? '2px solid' : '1px solid',
                      borderColor: selectedTemplate === template.id ? template.color : 'divider',
                      borderRadius: 2,
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }
                    }}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    {selectedTemplate === template.id && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 12, 
                          right: 12, 
                          zIndex: 1,
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <CheckCircleIcon 
                          sx={{ 
                            color: template.color,
                            fontSize: 22
                          }} 
                        />
                      </Box>
                    )}
                    
                    <CardMedia
                      component="img"
                      height="220"
                      image={template.image}
                      alt={template.name}
                      sx={{ 
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                    
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <FormControlLabel
                        value={template.id}
                        control={
                          <Radio 
                            sx={{ 
                              '&.Mui-checked': {
                                color: template.color,
                              }
                            }} 
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle1" fontWeight="500">
                              {template.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                              {template.description}
                            </Typography>
                          </Box>
                        }
                        sx={{ margin: 0 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>
        
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleContinue}
            disabled={isLoading}
            sx={{ 
              minWidth: 220,
              borderRadius: 2,
              textTransform: 'none',
              py: 1.5,
              fontSize: '1rem'
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Generating Preview...
              </>
            ) : (
              `Continue with ${templates.find(t => t.id === selectedTemplate)?.name}`
            )}
          </Button>
        </Box>
      </Box>

      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar 
        open={success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Template selected and preview generated successfully!
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default TemplateSelection; 