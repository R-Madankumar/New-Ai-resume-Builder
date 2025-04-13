import React from 'react';
import { 
  TextField, 
  FormControl, 
  FormHelperText,
  IconButton,
  Box,
  InputAdornment,
  styled,
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Custom styled TextField with improved typography
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.9rem',
  },
  '& .MuiInputLabel-root': {
    fontFamily: theme.typography.fontFamily,
    fontWeight: 500,
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
  }
}));

// Custom styled date input
const DateTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.9rem',
    padding: '16.5px 14px',
    cursor: 'pointer',
    color: theme.palette.text.primary,
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiOutlinedInput-input[type="date"]::-webkit-calendar-picker-indicator': {
    display: 'none',
  },
  '& .MuiInputAdornment-root': {
    cursor: 'pointer',
    color: theme.palette.primary.main,
  }
}));

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  enhanceWithAI?: (text: string) => Promise<void>;
  helperText?: string;
  minDate?: string;
  maxDate?: string;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  min,
  max,
  enhanceWithAI,
  helperText,
  minDate,
  maxDate,
  error,
}) => {
  // Create a ref for the date input
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  // Function to handle calendar icon click
  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.click();
    }
  };

  // Format date for display if needed
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth variant="outlined">
        {type === 'textarea' ? (
          <StyledTextField
            id={name}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            multiline
            rows={4}
            variant="outlined"
            InputProps={{
              endAdornment: enhanceWithAI && (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => enhanceWithAI(value.toString())}
                    title="Enhance with AI"
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  >
                    <AddCircleOutlineIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={helperText}
            fullWidth
          />
        ) : type === 'date' ? (
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 0.5, 
                fontWeight: 500, 
                display: 'flex', 
                alignItems: 'center' 
              }}
            >
              {label} {required && <span style={{ color: '#f44336', marginLeft: 2 }}>*</span>}
            </Typography>
            <DateTextField
              inputRef={dateInputRef}
              type="date"
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              variant="outlined"
              fullWidth
              error={!!error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" onClick={handleCalendarClick}>
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            />
            {(error || helperText) && (
              <FormHelperText sx={{ mt: 0.5, ml: 1.5 }}>
                {error || helperText}
              </FormHelperText>
            )}
          </Box>
        ) : (
          <StyledTextField
            type={type}
            id={name}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            inputProps={{ min, max }}
            variant="outlined"
            helperText={helperText}
            fullWidth
          />
        )}
      </FormControl>
      {enhanceWithAI && type === 'textarea' && !helperText && (
        <FormHelperText sx={{ mt: 0.5, ml: 1.5 }}>
          Click the + button to enhance with AI
        </FormHelperText>
      )}
    </Box>
  );
};

export default FormField;