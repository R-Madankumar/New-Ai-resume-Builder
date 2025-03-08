import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CreativeTemplate from '../CreativeTemplate';
import { ResumeData } from '../../types';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface CreativePreviewProps {
  resumeData: ResumeData;
  isAIEnhanced: boolean;
  viewMode: 'preview' | 'print';
}

const CreativePreview: React.FC<CreativePreviewProps> = ({ resumeData, isAIEnhanced, viewMode }) => {
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
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'linear-gradient(to right, #f3e5f5 0%, #f3e5f5 30%, white 30%, white 100%)'
        }}
      >
        {/* Creative Template Preview Header */}
        {viewMode === 'preview' && (
          <Box 
            className="preview-header"
            sx={{ 
              bgcolor: '#9c27b0',
              p: 1,
              borderBottom: '1px solid #ba68c8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'white' }}>
              Creative Template
            </Typography>
            
            {isAIEnhanced && (
              <Box 
                sx={{ 
                  bgcolor: '#f3e5f5',
                  color: '#9c27b0',
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.3,
                  fontWeight: 'bold'
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
          <CreativeTemplate data={resumeData} />
        </Box>
      </Box>
    </Paper>
  );
};

export default CreativePreview; 