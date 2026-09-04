// ============================================================
// FRONTEND src/pages/public/Home.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import Hero from '../../components/home/Hero';
import FeaturedArticles from '../../components/home/FeaturedArticles';
import LatestPosts from '../../components/home/LatestPosts';
import PopularPosts from '../../components/home/PopularPosts';
import ProjectsPreview from '../../components/home/ProjectsPreview';
import Newsletter from '../../components/common/Newsletter';
import { api } from '../../services/api';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, latestRes, popularRes, projectsRes] = await Promise.all([
          api.get('/posts/featured'),
          api.get('/posts?page=1&limit=6'),
          api.get('/posts/popular'),
          api.get('/projects?featured=true'),
        ]);
        setFeatured(featuredRes.data || []);
        setLatest(latestRes.data.posts || []);
        setPopular(popularRes.data || []);
        setProjects(projectsRes.data || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Hero />
      {featured.length > 0 && <FeaturedArticles posts={featured} />}
      <LatestPosts posts={latest} />
      {popular.length > 0 && <PopularPosts posts={popular} />}
      {projects.length > 0 && <ProjectsPreview projects={projects} />}
      <Newsletter />
    </>
  );
};

export default Home;