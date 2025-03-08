export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

export interface Experience {
  id?: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id?: string;
  degree: string;
  field: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  id?: string;
  name: string;
  level: string;
  category?: string;
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  technologies: string[] | string;
  url?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

export interface Certificate {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  description?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  template: 'modern' | 'minimal' | 'creative' | 'professional';
} 