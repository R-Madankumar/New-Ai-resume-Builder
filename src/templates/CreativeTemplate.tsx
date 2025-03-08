import React from 'react';
import { ResumeData } from '../types';
import { formatDate } from '../utils/helpers';

interface CreativeTemplateProps {
  data: ResumeData;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, projects, certificates } = data;

  return (
    <div className="bg-white text-gray-800 p-8 max-w-4xl mx-auto" id="resume-template">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-4 bg-purple-100 p-6 rounded-lg">
          {/* Profile */}
          <div className="mb-8 text-center">
            <div className="w-32 h-32 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-purple-700">
                {personalInfo.fullName.split(' ').map(name => name[0]).join('')}
              </span>
            </div>
            <h1 className="text-xl font-bold text-purple-800 mb-1">{personalInfo.fullName}</h1>
            
            <div className="space-y-1 text-sm">
              {personalInfo.email && (
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{personalInfo.email}</span>
                </div>
              )}
              
              {personalInfo.phone && (
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              
              {personalInfo.address && (
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{personalInfo.address}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-purple-800 mb-3 border-b-2 border-purple-300 pb-1">Skills</h2>
              
              <div className="space-y-3">
                {skills.map(skill => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-purple-600">
                        {Array(skill.level).fill('●').join(' ')}
                        {Array(5 - skill.level).fill('○').join(' ')}
                      </span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full" 
                        style={{ width: `${skill.level * 20}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-purple-800 mb-3 border-b-2 border-purple-300 pb-1">Education</h2>
              
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-sm text-purple-700">{edu.field}</p>
                    <p className="text-sm">{edu.institution}</p>
                    <p className="text-xs text-gray-600">
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </p>
                    {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="col-span-8">
          {/* Summary */}
          {personalInfo.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-purple-800 mb-3 border-b-2 border-purple-300 pb-1">About Me</h2>
              <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}
          
          {/* Experience */}
          {experiences.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-purple-800 mb-3 border-b-2 border-purple-300 pb-1">Work Experience</h2>
              
              <div className="space-y-6">
                {experiences.map(exp => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-purple-300">
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-[7px] top-1"></div>
                    
                    <h3 className="font-bold">{exp.position}</h3>
                    <p className="text-purple-700 font-medium">{exp.company}</p>
                    <p className="text-xs text-gray-600 mb-2">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                    
                    <p className="text-sm mb-2">{exp.description}</p>
                    
                    {exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-purple-800 mb-3 border-b-2 border-purple-300 pb-1">Projects</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(project => (
                  <div key={project.id} className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-bold text-purple-700">
                      {project.name}
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="ml-2 text-purple-500 text-xs"
                        >
                          (View)
                        </a>
                      )}
                    </h3>
                    
                    <p className="text-sm my-2">{project.description}</p>
                    
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Certificates */}
          {certificates.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-purple-800 mb-3 border-b-2 border-purple-300 pb-1">Certifications</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certificates.map(cert => (
                  <div key={cert.id} className="flex items-start">
                    <div className="mr-2 mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">{cert.name}</h3>
                      <p className="text-xs text-gray-600">{cert.issuer} • {formatDate(cert.date)}</p>
                      {cert.link && (
                        <a 
                          href={cert.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-purple-600 text-xs"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Links */}
          <div className="mt-8 flex gap-4 justify-end">
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.08-1.6 2.2v4.26H8.014v-8.6h2.558v1.17h.036c.356-.67 1.227-1.38 2.526-1.38 2.703 0 3.204 1.78 3.204 4.09v4.72zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.6H3.667v8.6zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            )}
            
            {personalInfo.website && (
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate; 