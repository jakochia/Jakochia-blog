import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './pages/AdminRoute';
import Layout from './components/common/Layout';

// Public pages
import Home from './pages/public/Home';
import Blog from './pages/public/Blog';
import Article from './pages/public/Article';
import Category from './pages/public/Category';
import Tag from './pages/public/Tag';
import Search from './pages/public/Search';
import Projects from './pages/public/Projects';
import ProjectDetail from './pages/public/ProjectDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import NewsletterPage from './pages/public/NewsletterPage';
import Tutorials from './pages/public/Tutorials';


// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPosts from './pages/admin/AdminPosts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTags from './pages/admin/AdminTags';
import AdminComments from './pages/admin/AdminComments';
import AdminSubscribers from './pages/admin/AdminSubscribers';
import AdminMedia from './pages/admin/AdminMedia';
import AdminProjects from './pages/admin/AdminProjects';
import AdminSettings from './pages/admin/AdminSettings';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><Article /></Layout>} />
            <Route path="/categories/:slug" element={<Layout><Category /></Layout>} />
            <Route path="/tags/:slug" element={<Layout><Tag /></Layout>} />
            <Route path="/search" element={<Layout><Search /></Layout>} />
            <Route path="/projects" element={<Layout><Projects /></Layout>} />
            <Route path="/projects/:slug" element={<Layout><ProjectDetail /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/newsletter" element={<Layout><NewsletterPage /></Layout>} />
            <Route path="/tutorials" element={<Layout><Tutorials /></Layout>} />
            <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
            <Route path="/terms" element={<Layout><Terms /></Layout>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/posts/*" element={<AdminRoute><AdminPosts /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/tags" element={<AdminRoute><AdminTags /></AdminRoute>} />
            <Route path="/admin/comments" element={<AdminRoute><AdminComments /></AdminRoute>} />
            <Route path="/admin/subscribers" element={<AdminRoute><AdminSubscribers /></AdminRoute>} />
            <Route path="/admin/media" element={<AdminRoute><AdminMedia /></AdminRoute>} />
            <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/newsletter" element={<AdminRoute><AdminNewsletter /></AdminRoute>} />
            {/* 404 */}
            <Route path="*" element={
              <Layout>
                <div className="min-h-[60vh] flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400">Page not found</p>
                  </div>
                </div>
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;