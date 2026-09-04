// ============================================================
// FRONTEND src/pages/public/ProjectDetail.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api } from '../../services/api';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/projects/${slug}`);
        setProject(res.data);
      } catch (error) {
        console.error('Error fetching project:', error);
        if (error.response?.status === 404) {
          navigate('/404');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Link to="/projects" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">
          ← Back to projects
        </Link>
      </div>
    );
  }

  const statusColors = {
    planning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    development: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    completed: 'bg-green-500/10 text-green-600 dark:text-green-400',
    maintenance: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/projects" className="text-sm text-text-secondary hover:text-text transition-colors inline-block mb-6">
        ← Back to projects
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs px-3 py-1 rounded ${statusColors[project.status] || 'bg-neutral-500/10 text-neutral-600'}`}>
            {project.status}
          </span>
          {project.featured && (
            <span className="text-xs text-blue-600 dark:text-blue-400">⭐ Featured</span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">{project.name}</h1>
        <p className="text-text-secondary mt-2 text-lg">{project.description}</p>
      </header>

      {project.coverImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.name}
            className="w-full h-auto max-h-[400px] object-cover"
          />
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none">
        {project.longDescription ? (
          <ReactMarkdown>{project.longDescription}</ReactMarkdown>
        ) : (
          <p>{project.description}</p>
        )}
      </div>

      {project.technologies && project.technologies.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="text-sm px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-text-secondary">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {(project.githubUrl || project.liveUrl) && (
        <div className="flex flex-wrap gap-3 mt-6">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-background-secondary border border-border hover:bg-border transition-colors"
            >
              🐙 View on GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              🚀 Live Demo
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;