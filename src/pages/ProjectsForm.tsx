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
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import EnhanceIcon from '@mui/icons-material/AutoFixHigh';
import FormField from '../components/FormField';
import FormNavigation from '../components/FormNavigation';
import { useResumeContext } from '../context/ResumeContext';
import { Project } from '../types';
import { generateId } from '../utils/helpers';

const ProjectsForm: React.FC = () => {
  const { resumeData, addProject, updateProject, removeProject, enhanceWithAI } = useResumeContext();
  const [projects, setProjects] = useState<Project[]>(resumeData.projects);
  
  // State for the form
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Project>({
    id: '',
    name: '',
    description: '',
    technologies: [],
    link: ''
  });
  const [newTechnology, setNewTechnology] = useState('');

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      technologies: [],
      link: ''
    });
    setNewTechnology('');
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

  const handleAddTechnology = () => {
    if (newTechnology.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const handleRemoveTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (editingId) {
      updateProject(editingId, formData);
      
      // Update local state
      setProjects(prev => 
        prev.map(project => project.id === editingId ? formData : project)
      );
    } else {
      const newProject = { ...formData, id: generateId() };
      addProject(newProject);
      
      // Update local state
      setProjects(prev => [...prev, newProject]);
    }
    resetForm();
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setIsEditing(true);
    setEditingId(project.id);
  };

  const handleDelete = (id: string) => {
    removeProject(id);
    
    // Update local state
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description.trim()) return;
    
    try {
      const enhancedText = await enhanceWithAI(formData.description, 'project');
      setFormData(prev => ({
        ...prev,
        description: enhancedText,
      }));
    } catch (error) {
      console.error('Error enhancing description:', error);
    }
  };

  const handleSave = () => {
    // Save all projects to context
    // This is already handled by individual add/update/remove operations
  };

  const isFormValid = formData.name && formData.description;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Projects
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {editingId ? 'Edit Project' : 'Add New Project'}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormField
                  label="Project Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="My Awesome Project"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  label="Project URL"
                  name="link"
                  value={formData.link || ''}
                  onChange={handleChange}
                  placeholder="https://github.com/username/project"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ position: 'relative' }}>
                  <FormField
                    label="Project Description"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your project, its purpose, and your role..."
                    required
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
                  Technologies Used
                </Typography>
                
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a technology (e.g., React, Python, AWS)"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTechnology();
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CodeIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTechnology}
                    disabled={!newTechnology.trim()}
                    sx={{ ml: 1 }}
                  >
                    Add
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.technologies.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      onDelete={() => handleRemoveTechnology(index)}
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
                {isEditing ? 'Update Project' : 'Add Project'}
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        {projects.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Projects
            </Typography>
            
            {projects.map((project) => (
              <Card key={project.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">
                        {project.name}
                        {project.link && (
                          <IconButton 
                            size="small" 
                            color="primary" 
                            component="a" 
                            href={project.link} 
                            target="_blank"
                            sx={{ ml: 1 }}
                          >
                            <LinkIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton color="primary" onClick={() => handleEdit(project)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(project.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body2" paragraph>
                    {project.description}
                  </Typography>
                  
                  {project.technologies.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Technologies:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {project.technologies.map((tech, index) => (
                          <Chip
                            key={index}
                            label={tech}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography color="text.secondary">
              No projects added yet. Use the form above to showcase your work.
            </Typography>
          </Box>
        )}
      </Box>
      
      <FormNavigation onSave={handleSave} />
    </motion.div>
  );
};

export default ProjectsForm; 