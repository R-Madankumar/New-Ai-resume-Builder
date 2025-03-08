import React from 'react';
import { motion } from 'framer-motion';
import { useResumeContext } from '../context/ResumeContext';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';

interface FormNavigationProps {
  onSave?: () => void;
  disableNext?: boolean;
  hideNext?: boolean;
  hidePrev?: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  onSave,
  disableNext = false,
  hideNext = false,
  hidePrev = false,
}) => {
  const { nextStep, prevStep, currentStep } = useResumeContext();

  const handleNext = () => {
    if (onSave) {
      onSave();
    }
    nextStep();
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
      {!hidePrev && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outlined"
            onClick={prevStep}
            startIcon={<ArrowBackIcon />}
          >
            Previous
          </Button>
        </motion.div>
      )}
      
      <Box sx={{ flex: 1 }} />
      
      {!hideNext && (
        <motion.div whileHover={!disableNext ? { scale: 1.05 } : {}} whileTap={!disableNext ? { scale: 0.95 } : {}}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={disableNext}
            endIcon={currentStep === 'preview' ? <DownloadIcon /> : <ArrowForwardIcon />}
          >
            {currentStep === 'preview' ? 'Download PDF' : 'Next'}
          </Button>
        </motion.div>
      )}
    </Box>
  );
};

export default FormNavigation; 