// ============================================================
// FRONTEND src/pages/admin/AdminProjects.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    longDescription: '',
    technologies: [],
    coverImage: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    status: 'planning',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/projects');
      setProjects(res.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/projects/${editing}`, form);
      } else {
        await api.post('/admin/projects', form);
      }
      setForm({ name: '', description: '', longDescription: '', technologies: [], coverImage: '', githubUrl: '', liveUrl: '', featured: false, status: 'planning' });
      setEditing(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error.response?.data?.error || 'Failed to save project');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete project "${name}"?`)) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEdit = (project) => {
    setEditing(project._id);
    setForm({
      name: project.name,
      description: project.description,
      longDescription: project.longDescription || '',
      technologies: project.technologies || [],
      coverImage: project.coverImage || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: project.featured || false,
      status: project.status || 'planning',
    });
  };

  const handleTechChange = (e) => {
    setForm(prev => ({ ...prev, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }));
  };

  if (loading) {
    return (
      <AdminLayout title="Projects">
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Projects">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-background-secondary border border-border rounded-xl p-4">
          <h3 className="font-medium mb-4">{editing ? 'Edit Project' : 'New Project'}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Project name *"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 outline-none transition"
              required
            />
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Short description *"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 outline-none transition"
              required
            />
            <textarea
              value={form.longDescription}
              onChange={(e) => setForm(prev => ({ ...prev, longDescription: e.target.value }))}
              placeholder="Long description (markdown)"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 outline-none transition resize-y"
            />
            <input
              type="text"
              value={form.technologies.join(', ')}
              onChange={handleTechChange}
              placeholder="Technologies (comma separated)"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 outline-none transition"
            />
            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
              placeholder="Cover image URL"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 outline-none transition"
            />
            <input
              type="text"
              value={form.githubUrl}
              onChange={(e) => setForm(prev => ({ ...prev, githubUrl: e.target.value }))}
              placeholder="GitHub URL"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 outline-none transition"
            />
            <input
              type="text"
              value={form.liveUrl}
              onChange={(e) => setForm(prev => ({ ...prev, liveUrl: e.target.value }))}
              placeholder="Live demo URL"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 outline-none transition"
            />
            <select
              value={form.status}
              onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 outline-none transition"
            >
              <option value="planning">Planning</option>
              <option value="development">Development</option>
              <option value="completed">Completed</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                id="featured-project"
                className="w-4 h-4 rounded border-border accent-blue-600"
              />
              <label htmlFor="featured-project" className="text-sm">Featured</label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                {editing ? 'Update' : 'Create'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => { setEditing(null); setForm({ name: '', description: '', longDescription: '', technologies: [], coverImage: '', githubUrl: '', liveUrl: '', featured: false, status: 'planning' }); }}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-background/50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-background-secondary border border-border rounded-xl p-4">
          <h3 className="font-medium mb-4">All Projects ({projects.length})</h3>
          {projects.length === 0 ? (
            <p className="text-text-secondary text-sm">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors border border-border">
                  <div>
                    <span className="font-medium">{proj.name}</span>
                    <span className={`text-xs ml-2 px-2 py-0.5 rounded ${
                      proj.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                      proj.status === 'development' ? 'bg-blue-500/10 text-blue-600' :
                      proj.status === 'maintenance' ? 'bg-purple-500/10 text-purple-600' :
                      'bg-yellow-500/10 text-yellow-600'
                    }`}>
                      {proj.status}
                    </span>
                    {proj.featured && <span className="text-xs ml-1 text-blue-600">⭐</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(proj)} className="text-blue-600 dark:text-blue-400 text-xs hover:underline">Edit</button>
                    <button onClick={() => handleDelete(proj._id, proj.name)} className="text-red-600 dark:text-red-400 text-xs hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;