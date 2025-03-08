import React from 'react';
import { motion } from 'framer-motion';
import { useResumeContext } from '../context/ResumeContext';
import { FormStep } from '../types';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  AppBar,
  useTheme
} from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentStep, goToStep } = useResumeContext();
  const theme = useTheme();

  const steps: { id: FormStep; label: string }[] = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'template', label: 'Template' },
    { id: 'preview', label: 'Preview' },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: FormStep) => {
    goToStep(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box component="header" sx={{ mb: 4, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            AI-Powered Resume Builder
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="subtitle1" color="text.secondary">
            Create a professional resume with AI assistance
          </Typography>
        </motion.div>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          mb: 4, 
          overflow: 'hidden',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3
        }}
      >
        <AppBar position="static" color="transparent" elevation={0}>
          <Tabs
            value={currentStep}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: 'auto',
                px: 2,
                py: 1.5,
              },
            }}
          >
            {steps.map((step, index) => (
              <Tab 
                key={step.id} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        display: { xs: 'none', sm: 'flex' },
                        mr: 1,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: currentStep === step.id ? theme.palette.primary.main : 'rgba(0,0,0,0.1)',
                        color: currentStep === step.id ? 'white' : 'text.secondary',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                      }}
                    >
                      {index + 1}
                    </Box>
                    {step.label}
                  </Box>
                } 
                value={step.id} 
              />
            ))}
          </Tabs>
        </AppBar>
        
        <Box sx={{ p: 3 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            key={currentStep}
          >
            {children}
          </motion.div>
        </Box>
      </Paper>

      <Box component="footer" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default Layout; 