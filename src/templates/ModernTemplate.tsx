import React from 'react';
import { ResumeData } from '../types';
import { formatDate } from '../utils/helpers';

interface ModernTemplateProps {
  data: ResumeData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, projects, certificates } = data;

  return (
    <div className="bg-white text-dark p-8 shadow-lg max-w-4xl mx-auto" id="resume-template">
      {/* Header */}
      <header className="border-b-2 border-primary pb-4 mb-6">
        <h1 className="text-3xl font-bold">{personalInfo.fullName}</h1>
        
        <div className="flex flex-wrap gap-3 mt-2 text-sm">
          {personalInfo.email && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>{personalInfo.email}</span>
            </div>
          )}
          
          {personalInfo.phone && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          
          {personalInfo.address && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{personalInfo.address}</span>
            </div>
          )}
          
          {personalInfo.linkedin && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.08-1.6 2.2v4.26H8.014v-8.6h2.558v1.17h.036c.356-.67 1.227-1.38 2.526-1.38 2.703 0 3.204 1.78 3.204 4.09v4.72zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.6H3.667v8.6zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary">
                LinkedIn
              </a>
            </div>
          )}
          
          {personalInfo.website && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                Website
              </a>
            </div>
          )}
        </div>
      </header>
      
      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-2">Professional Summary</h2>
          <p>{personalInfo.summary}</p>
        </section>
      )}
      
      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-3">Work Experience</h2>
          
          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{exp.position}</h3>
                    <p className="text-gray-700">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                
                <p className="mt-2 text-sm">{exp.description}</p>
                
                {exp.achievements.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-3">Education</h2>
          
          <div className="space-y-4">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{edu.degree} in {edu.field}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </div>
                </div>
                
                {edu.gpa && <p className="mt-1 text-sm">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-3">Skills</h2>
          
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <div 
                key={skill.id} 
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {skill.name}
                <span className="ml-1 text-gray-500">
                  {Array(skill.level).fill('★').join('')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-3">Projects</h2>
          
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id}>
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">
                    {project.name}
                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ml-2 text-primary text-sm"
                      >
                        (Link)
                      </a>
                    )}
                  </h3>
                </div>
                
                <p className="mt-1 text-sm">{project.description}</p>
                
                {project.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                   
                   Technologies: {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Certificates */}
      {certificates.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">Certifications</h2>
          
          <div className="space-y-2">
            {certificates.map(cert => (
              <div key={cert.id} className="flex justify-between">
                <div>
                  <h3 className="font-medium">{cert.name}</h3>
                  <p className="text-sm text-gray-700">{cert.issuer}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(cert.date)}
                  {cert.link && (
                    <a 
                      href={cert.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-2 text-primary"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate; 