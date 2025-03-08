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
  FormControlLabel,
  Chip,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EnhanceIcon from '@mui/icons-material/AutoFixHigh';
import FormField from '../components/FormField';
import FormNavigation from '../components/FormNavigation';
import { useResumeContext } from '../context/ResumeContext';
import { Experience } from '../types';
import { generateId } from '../utils/helpers';

const ExperienceForm: React.FC = () => {
  const { resumeData, addExperience, updateExperience, removeExperience, enhanceWithAI } = useResumeContext();
  const [experiences, setExperiences] = useState<Experience[]>(resumeData.experiences);
  
  // State for the form
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Experience>({
    id: '',
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: []
  });
  const [newAchievement, setNewAchievement] = useState('');

  const resetForm = () => {
    setFormData({
      id: '',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    });
    setNewAchievement('');
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

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (editingId) {
      updateExperience(editingId, formData);
      
      // Update local state
      setExperiences(prev => 
        prev.map(exp => exp.id === editingId ? formData : exp)
      );
    } else {
      const newExp = { ...formData, id: generateId() };
      addExperience(newExp);
      
      // Update local state
      setExperiences(prev => [...prev, newExp]);
    }
    resetForm();
  };

  const handleEdit = (exp: Experience) => {
    setFormData(exp);
    setIsEditing(true);
    setEditingId(exp.id);
  };

  const handleDelete = (id: string) => {
    removeExperience(id);
    
    // Update local state
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description.trim()) return;
    
    try {
      const enhancedText = await enhanceWithAI(formData.description, 'experience');
      setFormData(prev => ({
        ...prev,
        description: enhancedText,
      }));
    } catch (error) {
      console.error('Error enhancing description:', error);
    }
  };

  const handleSave = () => {
    // Save all experiences to context
    // This is already handled by individual add/update/remove operations
  };

  const isFormValid = formData.company && formData.position && formData.startDate && (formData.current || formData.endDate);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Work Experience
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
              {editingId ? 'Edit Experience' : 'Add New Experience'}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormField
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company Name"
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Job Title"
                  required
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
                  helperText="When did you start this position?"
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
                        I currently work here
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
                    helperText="When did you leave this position?"
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Box sx={{ position: 'relative' }}>
                  <FormField
                    label="Job Description"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your responsibilities and accomplishments..."
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EnhanceIcon />}
                    onClick={handleEnhanceDescription}
                    disabled={!formData.description.trim()}
                    sx={{ mt: 1 }}
                  >
                    Enhance with AI
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Key Achievements
                </Typography>
                
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add an achievement"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAchievement();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddAchievement}
                    disabled={!newAchievement.trim()}
                    sx={{ ml: 1 }}
                  >
                    Add
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.achievements.map((achievement, index) => (
                    <Chip
                      key={index}
                      label={achievement}
                      onDelete={() => handleRemoveAchievement(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
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
                {isEditing ? 'Update Experience' : 'Add Experience'}
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        {experiences.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Experiences
            </Typography>
            
            {experiences.map((exp) => (
              <Card key={exp.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">{exp.position}</Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {exp.company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} - 
                        {exp.current ? ' Present' : new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton color="primary" onClick={() => handleEdit(exp)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(exp.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body2" paragraph>
                    {exp.description}
                  </Typography>
                  
                  {exp.achievements.length > 0 && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Key Achievements:
                      </Typography>
                      <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {exp.achievements.map((achievement, index) => (
                          <li key={index}>
                            <Typography variant="body2">{achievement}</Typography>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography color="text.secondary">
              No work experiences added yet. Use the form above to add your work history.
            </Typography>
          </Box>
        )}
      </Box>
      
      <FormNavigation onSave={handleSave} />
    </motion.div>
  );
};

export default ExperienceForm; 