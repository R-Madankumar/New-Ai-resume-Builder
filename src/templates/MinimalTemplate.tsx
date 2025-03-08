import React from 'react';
import { ResumeData } from '../types';
import { formatDate } from '../utils/helpers';

interface MinimalTemplateProps {
  data: ResumeData;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, projects, certificates } = data;

  return (
    <div className="bg-white text-gray-800 p-8 max-w-4xl mx-auto" id="resume-template">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-2">{personalInfo.fullName}</h1>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}
          
          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}
          
          {personalInfo.address && (
            <span>{personalInfo.address}</span>
          )}
          
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
              LinkedIn
            </a>
          )}
          
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
              Website
            </a>
          )}
        </div>
      </header>
      
      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <p className="text-center italic">{personalInfo.summary}</p>
        </section>
      )}
      
      <hr className="my-6 border-gray-200" />
      
      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-light uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Experience</h2>
          
          <div className="space-y-6">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium">{exp.position}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-1">{exp.company}</p>
                <p className="text-sm mb-2">{exp.description}</p>
                
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
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
          <h2 className="text-xl font-light uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Education</h2>
          
          <div className="space-y-4">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium">{edu.degree} in {edu.field}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </span>
                </div>
                
                <p className="text-gray-600">{edu.institution}</p>
                {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-light uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Skills</h2>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {skills.map(skill => (
              <div key={skill.id} className="text-sm">
                {skill.name}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-light uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Projects</h2>
          
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id}>
                <h3 className="font-medium">
                  {project.name}
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-2 text-gray-500 text-sm"
                    >
                      (Link)
                    </a>
                  )}
                </h3>
                
                <p className="text-sm mb-1">{project.description}</p>
                
                {project.technologies.length > 0 && (
                  <div className="text-xs text-gray-500">
                    Technologies: {project.technologies.join(', ')}
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
          <h2 className="text-xl font-light uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Certifications</h2>
          
          <div className="space-y-2">
            {certificates.map(cert => (
              <div key={cert.id} className="flex justify-between">
                <div>
                  <span className="font-medium">{cert.name}</span>
                  <span className="text-gray-600 ml-2">({cert.issuer})</span>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(cert.date)}
                  {cert.link && (
                    <a 
                      href={cert.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-2 text-gray-500"
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

export default MinimalTemplate; 