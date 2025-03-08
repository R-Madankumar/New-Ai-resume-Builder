import React from 'react';
import { useResumeContext } from '../context/ResumeContext';
import Layout from '../components/Layout';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ProjectsForm from './ProjectsForm';
import CertificatesForm from './CertificatesForm';
import TemplateSelection from './TemplateSelection';
import ResumePreview from './ResumePreview';
import { Box, Typography } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

const MainPage: React.FC = () => {
  const { currentStep } = useResumeContext();

  // Render the appropriate component based on the current step
  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'certificates':
        return <CertificatesForm />;
      case 'template':
        return <TemplateSelection />;
      case 'preview':
        return <ResumePreview />;
      default:
        // Placeholder for any future steps
        return (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <ConstructionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Coming Soon
            </Typography>
            <Typography color="text.secondary">
              This section ({currentStep}) is under development. Please check back later.
            </Typography>
          </Box>
        );
    }
  };

  return <Layout>{renderStep()}</Layout>;
};

export default MainPage; 