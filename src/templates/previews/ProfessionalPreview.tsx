import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ProfessionalTemplate from '../ProfessionalTemplate';
import { ResumeData } from '../../types';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface ProfessionalPreviewProps {
  resumeData: ResumeData;
  isAIEnhanced: boolean;
  viewMode: 'preview' | 'print';
}

const ProfessionalPreview: React.FC<ProfessionalPreviewProps> = ({ resumeData, isAIEnhanced, viewMode }) => {
  return (
    <Paper 
      elevation={viewMode === 'preview' ? 3 : 0}
      sx={{ 
        p: viewMode === 'preview' ? 2 : 0,
        backgroundColor: viewMode === 'preview' ? 'background.paper' : 'transparent',
        height: '100%',
        width: '100%',
        maxWidth: '8.5in',
        overflow: 'auto',
        border: viewMode === 'print' ? '1px dashed #ccc' : 'none',
      }}
    >
      <Box 
        sx={{
          width: '100%',
          margin: '0 auto',
          backgroundColor: 'white',
          boxShadow: viewMode === 'preview' ? '0 0 10px rgba(0,0,0,0.1)' : 'none',
          position: 'relative',
          borderLeft: '8px solid #1a237e', // Professional template accent color
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        {/* Professional Template Preview Header */}
        {viewMode === 'preview' && (
          <Box 
            className="preview-header"
            sx={{ 
              bgcolor: '#e8eaf6',
              p: 1,
              borderBottom: '1px solid #c5cae9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1a237e' }}>
              Professional Template
            </Typography>
            
            {isAIEnhanced && (
              <Box 
                sx={{ 
                  bgcolor: 'secondary.main',
                  color: 'white',
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.3
                }}
              >
                <AutoFixHighIcon sx={{ fontSize: '0.7rem' }} />
                AI Enhanced
              </Box>
            )}
          </Box>
        )}
        
        <Box sx={{ 
          '& svg': { 
            width: '16px', 
            height: '16px' 
          },
          '& .linkedin-icon, & .github-icon': {
            width: '16px',
            height: '16px'
          }
        }}>
          <ProfessionalTemplate data={resumeData} />
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfessionalPreview; 