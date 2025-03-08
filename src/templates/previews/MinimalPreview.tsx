import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MinimalTemplate from '../MinimalTemplate';
import { ResumeData } from '../../types';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface MinimalPreviewProps {
  resumeData: ResumeData;
  isAIEnhanced: boolean;
  viewMode: 'preview' | 'print';
}

const MinimalPreview: React.FC<MinimalPreviewProps> = ({ resumeData, isAIEnhanced, viewMode }) => {
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
          border: '1px solid #e0e0e0',
          borderRadius: '2px',
          overflow: 'hidden'
        }}
      >
        {/* Minimal Template Preview Header */}
        {viewMode === 'preview' && (
          <Box 
            className="preview-header"
            sx={{ 
              bgcolor: '#fafafa',
              p: 1,
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="subtitle2" fontWeight="light" letterSpacing={1} sx={{ color: '#616161' }}>
              Minimal Template
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
          <MinimalTemplate data={resumeData} />
        </Box>
      </Box>
    </Paper>
  );
};

export default MinimalPreview; 