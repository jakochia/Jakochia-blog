// ============================================================
// FRONTEND src/components/home/ProjectsPreview.jsx
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../projects/ProjectCard';

const ProjectsPreview = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  const preview = projects.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Featured Projects</h2>
        <Link to="/projects" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {preview.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsPreview;