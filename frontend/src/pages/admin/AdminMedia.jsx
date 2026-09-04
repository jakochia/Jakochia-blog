import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

const AdminMedia = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, [page]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/media?page=${page}&limit=20`);
      setMedia(res.data.media || []);
      setPagination(res.data.pagination || { page: 1, total: 0, pages: 0 });
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        await api.post('/admin/media', {
          filename: file.name,
          originalName: file.name,
          path: `/uploads/${file.name}`,
          url: base64,
          altText: file.name,
          mimeType: file.type,
          size: file.size,
        });
        fetchMedia();
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading:', error);
      setUploading(false);
    }
  };

  const handleDelete = async (id, filename) => {
    if (!confirm(`Delete "${filename}"?`)) return;
    try {
      await api.delete(`/admin/media/${id}`);
      fetchMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Media Library">
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Media Library">
      <div className="mb-4">
        <label className="inline-block px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors cursor-pointer shadow-glow">
          {uploading ? 'Uploading...' : '📤 Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
        <span className="ml-3 text-xs text-text-secondary">
          {media.length} images in library
        </span>
      </div>

      {media.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p className="text-4xl mb-2">🖼️</p>
          <p>No media uploaded yet</p>
          <p className="text-xs mt-1">Upload your first image to get started</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => (
              <div key={item._id} className="group relative bg-background-secondary border border-border/50 rounded-lg overflow-hidden transition-all hover:shadow-glow">
                <img
                  src={item.url}
                  alt={item.altText || item.filename}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => copyToClipboard(item.url, item._id)}
                    className="px-3 py-1.5 rounded bg-primary-600 text-white text-xs font-medium hover:bg-primary-700 transition-colors"
                  >
                    {copiedId === item._id ? '✅ Copied!' : '📋 Copy URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.filename)}
                    className="px-3 py-1.5 rounded bg-rose-600/80 text-white text-xs font-medium hover:bg-rose-700 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
                {/* File name */}
                <div className="p-2 bg-background/80 backdrop-blur-sm">
                  <p className="text-xs text-text-secondary truncate">{item.originalName}</p>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded transition-colors ${
                    p === page ? 'bg-primary-600 text-white' : 'hover:bg-background'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminMedia;