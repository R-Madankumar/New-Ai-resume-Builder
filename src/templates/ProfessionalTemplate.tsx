import React from 'react';
import { ResumeData } from '../types';
import { formatDate } from '../utils/helpers';

interface ProfessionalTemplateProps {
  data: ResumeData;
}

const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, projects, certificates } = data;

  return (
    <div className="bg-white text-gray-800 p-8 max-w-4xl mx-auto" id="resume-template">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-end border-b-4 border-blue-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">{personalInfo.fullName}</h1>
          </div>
          <div className="text-right">
            {personalInfo.email && (
              <div className="text-sm mb-1">
                <span className="font-semibold">Email: </span>
                <span>{personalInfo.email}</span>
              </div>
            )}
            
            {personalInfo.phone && (
              <div className="text-sm mb-1">
                <span className="font-semibold">Phone: </span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            
            {personalInfo.address && (
              <div className="text-sm mb-1">
                <span className="font-semibold">Location: </span>
                <span>{personalInfo.address}</span>
              </div>
            )}
            
            <div className="flex gap-3 justify-end mt-2">
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                  LinkedIn
                </a>
              )}
              
              {personalInfo.website && (
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Column */}
        <div className="md:w-2/3">
          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-900 mb-3 border-b border-gray-300 pb-1">Professional Summary</h2>
              <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}
          
          {/* Experience */}
          {experiences.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-900 mb-3 border-b border-gray-300 pb-1">Work Experience</h2>
              
              <div className="space-y-5">
                {experiences.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold">{exp.position}</h3>
                      <span className="text-sm text-gray-600">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    
                    <p className="text-blue-800 font-medium">{exp.company}</p>
                    <p className="text-sm my-2">{exp.description}</p>
                    
                    {exp.achievements.length > 0 && (
                      <ul className="list-disc list-outside ml-5 text-sm space-y-1">
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
          
          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-900 mb-3 border-b border-gray-300 pb-1">Projects</h2>
              
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold">{project.name}</h3>
                      {project.url && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-700 text-sm"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                    
                    <p className="text-sm my-2">{project.description}</p>
                    
                    {project.technologies.length > 0 && (
                      <div className="text-sm">
                       Technologies: {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/3">
          {/* Education */}
          {education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-900 mb-3 border-b border-gray-300 pb-1">Education</h2>
              
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-blue-800">{edu.field}</p>
                    <p className="text-sm">{edu.institution}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </p>
                    {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-900 mb-3 border-b border-gray-300 pb-1">Skills</h2>
              
              <div className="space-y-2">
                {skills.map(skill => (
                  <div key={skill.id} className="flex items-center">
                    <div className="w-1/2">
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <div className="w-1/2">
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-3 h-3 rounded-full mx-0.5 ${
                              i < skill.level ? 'bg-blue-700' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Certificates */}
          {certificates.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-900 mb-3 border-b border-gray-300 pb-1">Certifications</h2>
              
              <div className="space-y-3">
                {certificates.map(cert => (
                  <div key={cert.id}>
                    <h3 className="font-medium">{cert.name}</h3>
                    <p className="text-sm">{cert.issuer}</p>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatDate(cert.date)}</span>
                      {cert.link && (
                        <a 
                          href={cert.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-700"
                        >
                          Verify
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate; 