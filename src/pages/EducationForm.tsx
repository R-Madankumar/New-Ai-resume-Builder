import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Typography, 
  Grid, 
  Box, 
  Card, 
  CardContent, 
  IconButton, 
  Button, 
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import FormField from '../components/FormField';
import FormNavigation from '../components/FormNavigation';
import { useResumeContext } from '../context/ResumeContext';
import { Education } from '../types';
import { generateId } from '../utils/helpers';

const EducationForm: React.FC = () => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResumeContext();
  const [educationList, setEducationList] = useState<Education[]>(resumeData.education);
  
  // State for the form
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Education>({
    id: '',
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: ''
  });

  const resetForm = () => {
    setFormData({
      id: '',
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      current: checked,
      endDate: checked ? '' : prev.endDate
    }));
  };

  const handleSubmit = () => {
    if (editingId) {
      updateEducation(editingId, formData);
      
      // Update local state
      setEducationList(prev => 
        prev.map(edu => edu.id === editingId ? formData : edu)
      );
    } else {
      const newEdu = { ...formData, id: generateId() };
      addEducation(newEdu);
      
      // Update local state
      setEducationList(prev => [...prev, newEdu]);
    }
    resetForm();
  };

  const handleEdit = (edu: Education) => {
    setFormData(edu);
    setIsEditing(true);
    setEditingId(edu.id);
  };

  const handleDelete = (id: string) => {
    removeEducation(id);
    
    // Update local state
    setEducationList(prev => prev.filter(edu => edu.id !== id));
  };

  const handleSave = () => {
    // Save all education entries to context
    // This is already handled by individual add/update/remove operations
  };

  const isFormValid = formData.institution && formData.degree && formData.field && formData.startDate && (formData.current || formData.endDate);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Education
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Card 
          variant="outlined" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {editingId ? 'Edit Education' : 'Add New Education'}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormField
                  label="Institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="University or School Name"
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  label="Degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="Bachelor's, Master's, etc."
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  label="Field of Study"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  placeholder="Computer Science, Business, etc."
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  label="GPA"
                  name="gpa"
                  value={formData.gpa || ''}
                  onChange={handleChange}
                  placeholder="3.8/4.0 (Optional)"
                  helperText="Optional: Include if relevant"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  helperText="When did you start your studies?"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  height: '100%', 
                  pt: 3.5,
                  pl: 1
                }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.current}
                        onChange={handleSwitchChange}
                        name="current"
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        I am currently studying here
                      </Typography>
                    }
                  />
                </Box>
              </Grid>
              
              {!formData.current && (
                <Grid item xs={12} md={6}>
                  <FormField
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required={!formData.current}
                    helperText="When did you complete your studies?"
                  />
                </Grid>
              )}
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              {isEditing && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon />}
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                {isEditing ? 'Update Education' : 'Add Education'}
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        {educationList.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Education
            </Typography>
            
            {educationList.map((edu) => (
              <Card key={edu.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <SchoolIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="h6">{edu.degree} in {edu.field}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {edu.institution}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} - 
                          {edu.current ? ' Present' : new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </Typography>
                        {edu.gpa && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            GPA: {edu.gpa}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <IconButton color="primary" onClick={() => handleEdit(edu)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(edu.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography color="text.secondary">
              No education entries added yet. Use the form above to add your educational background.
            </Typography>
          </Box>
        )}
      </Box>
      
      <FormNavigation onSave={handleSave} />
    </motion.div>
  );
};

export default EducationForm; 