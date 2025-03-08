export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin?: string;
  website?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[] | string;
  url?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  template: string;
}

export type FormStep = 
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certificates'
  | 'template'
  | 'preview';

export interface ResumeContextType {
  resumeData: ResumeData;
  currentStep: FormStep;
  updatePersonalInfo: (info: PersonalInfo) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Experience) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Education) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Skill) => void;
  removeSkill: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Project) => void;
  removeProject: (id: string) => void;
  addCertificate: (cert: Certificate) => void;
  updateCertificate: (id: string, cert: Certificate) => void;
  removeCertificate: (id: string) => void;
  setTemplate: (template: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: FormStep) => void;
  enhanceWithAI: (text: string, type: string) => Promise<string>;
} 