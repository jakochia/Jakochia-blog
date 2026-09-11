import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const AdminLayout = ({ children, title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/posts', label: 'Posts', icon: '📝' },
    { to: '/admin/categories', label: 'Categories', icon: '📂' },
    { to: '/admin/tags', label: 'Tags', icon: '🏷️' },
    { to: '/admin/comments', label: 'Comments', icon: '💬' },
    { to: '/admin/subscribers', label: 'Subscribers', icon: '📧' },
    { to: '/admin/inbox', label: 'Inbox', icon: '💬' },
    { to: '/admin/media', label: 'Media', icon: '🖼️' },
    { to: '/admin/projects', label: 'Projects', icon: '🚀' },
    { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
    { to: '/admin/newsletter', label: 'Newsletter', icon: '✉️' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background-secondary/80 backdrop-blur-md border-r border-border/50 overflow-y-auto transition-transform duration-200 z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-400 shadow-glow'
                      : 'text-text-secondary hover:text-text hover:bg-background/50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && <span className="ml-auto w-1.5 h-6 bg-primary-500 rounded-full"></span>}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all w-full mt-4"
            >
              <span className="text-lg">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 left-6 z-40 p-3 rounded-full bg-primary-600 text-white shadow-glow hover:bg-primary-700 transition-all"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-display font-bold text-gradient-blue">{title}</h1>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link
                  to="/"
                  target="_blank"
                  className="text-sm text-text-secondary hover:text-primary-400 transition-colors"
                >
                  View Site →
                </Link>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;