import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ResumeData, 
  ResumeContextType, 
  PersonalInfo, 
  Experience, 
  Education, 
  Skill, 
  Project, 
  Certificate, 
  FormStep 
} from '../types';
import { generateId, saveToLocalStorage, getFromLocalStorage, enhanceTextWithAI } from '../utils/helpers';

// Default empty resume data
const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
  template: 'modern',
};

// Create context with default values
const ResumeContext = createContext<ResumeContextType>({
  resumeData: defaultResumeData,
  currentStep: 'personal',
  updatePersonalInfo: () => {},
  addExperience: () => {},
  updateExperience: () => {},
  removeExperience: () => {},
  addEducation: () => {},
  updateEducation: () => {},
  removeEducation: () => {},
  addSkill: () => {},
  updateSkill: () => {},
  removeSkill: () => {},
  addProject: () => {},
  updateProject: () => {},
  removeProject: () => {},
  addCertificate: () => {},
  updateCertificate: () => {},
  removeCertificate: () => {},
  setTemplate: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  enhanceWithAI: async () => '',
});

// Define the order of form steps
const formSteps: FormStep[] = [
  'personal',
  'experience',
  'education',
  'skills',
  'projects',
  'certificates',
  'template',
  'preview',
];

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or use default values
  const [resumeData, setResumeData] = useState<ResumeData>(
    getFromLocalStorage<ResumeData>('resumeData', defaultResumeData)
  );
  const [currentStep, setCurrentStep] = useState<FormStep>(
    getFromLocalStorage<FormStep>('currentStep', 'personal')
  );

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage('resumeData', resumeData);
  }, [resumeData]);

  useEffect(() => {
    saveToLocalStorage('currentStep', currentStep);
  }, [currentStep]);

  // Personal Info
  const updatePersonalInfo = (info: PersonalInfo) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: info,
    }));
  };

  // Experience
  const addExperience = (exp: Experience) => {
    const newExp = { ...exp, id: generateId() };
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExp],
    }));
  };

  const updateExperience = (id: string, exp: Experience) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => (e.id === id ? exp : e)),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id),
    }));
  };

  // Education
  const addEducation = (edu: Education) => {
    const newEdu = { ...edu, id: generateId() };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = (id: string, edu: Education) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(e => (e.id === id ? edu : e)),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));
  };

  // Skills
  const addSkill = (skill: Skill) => {
    const newSkill = { ...skill, id: generateId() };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const updateSkill = (id: string, skill: Skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s => (s.id === id ? skill : s)),
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  };

  // Projects
  const addProject = (project: Project) => {
    const newProject = { ...project, id: generateId() };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (id: string, project: Project) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === id ? project : p)),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  };

  // Certificates
  const addCertificate = (cert: Certificate) => {
    const newCert = { ...cert, id: generateId() };
    setResumeData(prev => ({
      ...prev,
      certificates: [...prev.certificates, newCert],
    }));
  };

  const updateCertificate = (id: string, cert: Certificate) => {
    setResumeData(prev => ({
      ...prev,
      certificates: prev.certificates.map(c => (c.id === id ? cert : c)),
    }));
  };

  const removeCertificate = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certificates: prev.certificates.filter(c => c.id !== id),
    }));
  };

  // Template
  const setTemplate = (template: string) => {
    setResumeData(prev => ({
      ...prev,
      template,
    }));
  };

  // Navigation
  const nextStep = () => {
    const currentIndex = formSteps.indexOf(currentStep);
    if (currentIndex < formSteps.length - 1) {
      setCurrentStep(formSteps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = formSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(formSteps[currentIndex - 1]);
    }
  };

  const goToStep = (step: FormStep) => {
    setCurrentStep(step);
  };

  // AI Enhancement
  const enhanceWithAI = async (text: string, type: string): Promise<string> => {
    return enhanceTextWithAI(text, type);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        currentStep,
        updatePersonalInfo,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        updateSkill,
        removeSkill,
        addProject,
        updateProject,
        removeProject,
        addCertificate,
        updateCertificate,
        removeCertificate,
        setTemplate,
        nextStep,
        prevStep,
        goToStep,
        enhanceWithAI,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

// Custom hook to use the resume context
export const useResumeContext = () => useContext(ResumeContext);

export default ResumeContext; 