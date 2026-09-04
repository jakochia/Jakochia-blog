// ============================================================
// FRONTEND src/components/projects/ProjectCard.jsx
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const statusColors = {
    planning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    development: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    completed: 'bg-green-500/10 text-green-600 dark:text-green-400',
    maintenance: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  };

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block rounded-lg overflow-hidden border border-border bg-background-secondary hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/5"
    >
      {project.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs px-2 py-0.5 rounded ${statusColors[project.status] || 'bg-neutral-500/10 text-neutral-600'}`}>
            {project.status}
          </span>
          {project.featured && (
            <span className="text-xs text-blue-600 dark:text-blue-400">⭐ Featured</span>
          )}
        </div>
        <h3 className="font-semibold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-text-secondary mt-1 line-clamp-2">{project.description}</p>
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-text-secondary"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs text-text-secondary">+{project.technologies.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;