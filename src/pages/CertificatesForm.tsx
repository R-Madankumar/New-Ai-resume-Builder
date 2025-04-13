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
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LinkIcon from '@mui/icons-material/Link';
import VerifiedIcon from '@mui/icons-material/Verified';
import FormField from '../components/FormField';
import FormNavigation from '../components/FormNavigation';
import { useResumeContext } from '../context/ResumeContext';
import { Certificate } from '../types';
import { generateId } from '../utils/helpers';

const CertificatesForm: React.FC = () => {
  const { resumeData, addCertificate, updateCertificate, removeCertificate } = useResumeContext();
  const [certificates, setCertificates] = useState<Certificate[]>(resumeData.certificates);
  
  // State for the form
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dateError, setDateError] = useState('');

  const [formData, setFormData] = useState<Certificate>({
    id: '',
    name: '',
    issuer: '',
    date: '',
    link: ''
  });

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      issuer: '',
      date: '',
      link: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const validateDate = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const certDate = new Date(date);
    certDate.setHours(0, 0, 0, 0);

    if (certDate > today) {
      return 'Issue date cannot be in the future';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);

    // Validate date when date field changes
    if (name === 'date') {
      const error = validateDate(value);
      setDateError(error);
    }
  };

  const handleSubmit = () => {
    if (editingId) {
      updateCertificate(editingId, formData);
      
      // Update local state
      setCertificates(prev => 
        prev.map(cert => cert.id === editingId ? formData : cert)
      );
    } else {
      const newCert = { ...formData, id: generateId() };
      addCertificate(newCert);
      
      // Update local state
      setCertificates(prev => [...prev, newCert]);
    }
    resetForm();
  };

  const handleEdit = (cert: Certificate) => {
    setFormData(cert);
    setIsEditing(true);
    setEditingId(cert.id);
  };

  const handleDelete = (id: string) => {
    removeCertificate(id);
    
    // Update local state
    setCertificates(prev => prev.filter(cert => cert.id !== id));
  };

  const handleSave = () => {
    // Save all certificates to context
    // This is already handled by individual add/update/remove operations
  };

  const isFormValid = formData.name && formData.issuer && formData.date && !dateError;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Certifications
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {editingId ? 'Edit Certification' : 'Add New Certification'}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormField
                  label="Certification Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="AWS Certified Solutions Architect"
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  label="Issuing Organization"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  placeholder="Amazon Web Services"
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  label="Date Issued"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  maxDate={new Date().toISOString().split('T')[0]}
                  error={dateError}
                  helperText={dateError || "When was this certification issued?"}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  label="Credential URL"
                  name="link"
                  value={formData.link || ''}
                  onChange={handleChange}
                  placeholder="https://www.credential.net/..."
                />
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
                {isEditing ? 'Update Certification' : 'Add Certification'}
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        {certificates.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Certifications
            </Typography>
            
            {certificates.map((cert) => (
              <Card key={cert.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <VerifiedIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="h6">
                          {cert.name}
                          {cert.link && (
                            <IconButton 
                              size="small" 
                              color="primary" 
                              component="a" 
                              href={cert.link} 
                              target="_blank"
                              sx={{ ml: 1 }}
                              title="View Credential"
                            >
                              <LinkIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {cert.issuer}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Issued: {new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <IconButton color="primary" onClick={() => handleEdit(cert)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(cert.id)}>
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
              No certifications added yet. Use the form above to add your professional certifications.
            </Typography>
          </Box>
        )}
      </Box>
      
      <FormNavigation onSave={handleSave} />
    </motion.div>
  );
};

export default CertificatesForm;