import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Grid, Box } from '@mui/material';
import FormField from '../components/FormField';
import FormNavigation from '../components/FormNavigation';
import { useResumeContext } from '../context/ResumeContext';
import { PersonalInfo } from '../types';

const PersonalInfoForm: React.FC = () => {
  const { resumeData, updatePersonalInfo, enhanceWithAI } = useResumeContext();
  const [formData, setFormData] = useState<PersonalInfo>(resumeData.personalInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updatePersonalInfo(formData);
  };

  const handleEnhanceSummary = async (text: string) => {
    if (!text.trim()) return;
    
    try {
      const enhancedText = await enhanceWithAI(text, 'summary');
      setFormData(prev => ({
        ...prev,
        summary: enhancedText,
      }));
    } catch (error) {
      console.error('Error enhancing summary:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Personal Information
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            required
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormField
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (123) 456-7890"
            required
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="City, State, Country"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormField
            label="LinkedIn"
            name="linkedin"
            value={formData.linkedin || ''}
            onChange={handleChange}
            placeholder="linkedin.com/in/johndoe"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormField
            label="Website"
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
            placeholder="johndoe.com"
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <FormField
          label="Professional Summary"
          name="summary"
          type="textarea"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Write a brief summary of your professional background and key strengths..."
          enhanceWithAI={handleEnhanceSummary}
          helperText="Click the + button to enhance your summary with AI"
        />
      </Box>
      
      <FormNavigation 
        onSave={handleSave} 
        disableNext={!formData.fullName || !formData.email || !formData.phone}
        hidePrev
      />
    </motion.div>
  );
};

export default PersonalInfoForm; 