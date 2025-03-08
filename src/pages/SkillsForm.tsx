import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  IconButton, 
  Button, 
  TextField,
  Slider,
  Chip,
  Grid,
  Rating
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import FormNavigation from '../components/FormNavigation';
import { useResumeContext } from '../context/ResumeContext';
import { Skill } from '../types';
import { generateId } from '../utils/helpers';

const SkillsForm: React.FC = () => {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResumeContext();
  const [skills, setSkills] = useState<Skill[]>(resumeData.skills);
  
  // State for the form
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Skill>({
    id: '',
    name: '',
    level: 3
  });

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      level: 3
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLevelChange = (_event: Event, newValue: number | number[]) => {
    setFormData(prev => ({
      ...prev,
      level: newValue as number,
    }));
  };

  const handleSubmit = () => {
    if (editingId) {
      updateSkill(editingId, formData);
      
      // Update local state
      setSkills(prev => 
        prev.map(skill => skill.id === editingId ? formData : skill)
      );
    } else {
      const newSkill = { ...formData, id: generateId() };
      addSkill(newSkill);
      
      // Update local state
      setSkills(prev => [...prev, newSkill]);
    }
    resetForm();
  };

  const handleEdit = (skill: Skill) => {
    setFormData(skill);
    setIsEditing(true);
    setEditingId(skill.id);
  };

  const handleDelete = (id: string) => {
    removeSkill(id);
    
    // Update local state
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  const handleSave = () => {
    // Save all skills to context
    // This is already handled by individual add/update/remove operations
  };

  const isFormValid = formData.name.trim() !== '';

  // Group skills by level for better organization
  const groupedSkills = skills.reduce<Record<number, Skill[]>>((acc, skill) => {
    if (!acc[skill.level]) {
      acc[skill.level] = [];
    }
    acc[skill.level].push(skill);
    return acc;
  }, {});

  const skillLevels = [5, 4, 3, 2, 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Skills
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Skill Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., JavaScript, Project Management, Photoshop"
                required
                variant="outlined"
                sx={{ mb: 3 }}
              />
              
              <Typography gutterBottom>
                Proficiency Level
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Beginner
                </Typography>
                <Slider
                  value={formData.level}
                  onChange={handleLevelChange}
                  step={1}
                  marks
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  sx={{ flexGrow: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Expert
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Rating 
                  value={formData.level} 
                  onChange={(_event, newValue) => {
                    if (newValue !== null) {
                      setFormData(prev => ({
                        ...prev,
                        level: newValue,
                      }));
                    }
                  }}
                  max={5}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
                {isEditing ? 'Update Skill' : 'Add Skill'}
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        {skills.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Skills
            </Typography>
            
            {skillLevels.map(level => {
              const levelSkills = groupedSkills[level] || [];
              if (levelSkills.length === 0) return null;
              
              return (
                <Box key={level} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      {level === 5 ? 'Expert' : 
                       level === 4 ? 'Advanced' : 
                       level === 3 ? 'Intermediate' : 
                       level === 2 ? 'Basic' : 'Beginner'}
                    </Typography>
                    <Rating value={level} readOnly size="small" />
                  </Box>
                  
                  <Grid container spacing={1}>
                    {levelSkills.map(skill => (
                      <Grid item key={skill.id}>
                        <Chip
                          label={skill.name}
                          color="primary"
                          variant="outlined"
                          onDelete={() => handleDelete(skill.id)}
                          deleteIcon={<DeleteIcon />}
                          onClick={() => handleEdit(skill)}
                          sx={{ 
                            '& .MuiChip-deleteIcon': { 
                              color: 'error.main',
                              '&:hover': { color: 'error.dark' } 
                            }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography color="text.secondary">
              No skills added yet. Use the form above to add your skills.
            </Typography>
          </Box>
        )}
      </Box>
      
      <FormNavigation onSave={handleSave} />
    </motion.div>
  );
};

export default SkillsForm; 