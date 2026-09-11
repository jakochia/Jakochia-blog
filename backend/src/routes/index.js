import express from 'express';

// ============ PUBLIC ROUTES ============
import publicPosts from './public/posts.js';
import publicCategories from './public/categories.js';
import publicTags from './public/tags.js';
import publicProjects from './public/projects.js';
import publicComments from './public/comments.js';
import publicReactions from './public/reactions.js';
import publicNewsletter from './public/newsletter.js';
import publicSearch from './public/search.js';
import publicContact from './public/contact.js';
import publicChat from './public/chat.js';                    // ✅ AI Chat
import publicChatMessages from './public/chatMessages.js';    // ✅ Human Chat

// ============ ADMIN ROUTES ============
import adminAuth from './admin/auth.js';
import adminDashboard from './admin/dashboard.js';
import adminPosts from './admin/posts.js';
import adminComments from './admin/comments.js';
import adminSubscribers from './admin/subscribers.js';
import adminMedia from './admin/media.js';
import adminProjects from './admin/projects.js';
import adminSettings from './admin/settings.js';
import adminNewsletter from './admin/newsletter.js';
import adminChatMessages from './admin/chatMessages.js';

const router = express.Router();

// ============ PUBLIC ROUTES ============
router.use('/posts', publicPosts);
router.use('/categories', publicCategories);
router.use('/tags', publicTags);
router.use('/projects', publicProjects);
router.use('/comments', publicComments);
router.use('/reactions', publicReactions);
router.use('/newsletter', publicNewsletter);
router.use('/search', publicSearch);
router.use('/contact', publicContact);

// ✅ AI Chat mounted at /api/ai/chat
router.use('/ai/chat', publicChat);

// ✅ Human Chat mounted at /api/chat-messages
router.use('/chat-messages', publicChatMessages);

// ============ ADMIN ROUTES ============
router.use('/admin/auth', adminAuth);
router.use('/admin/dashboard', adminDashboard);
router.use('/admin/posts', adminPosts);
router.use('/admin/comments', adminComments);
router.use('/admin/subscribers', adminSubscribers);
router.use('/admin/media', adminMedia);
router.use('/admin/projects', adminProjects);
router.use('/admin/settings', adminSettings);
router.use('/admin/newsletter', adminNewsletter);
router.use('/admin/chat-messages', adminChatMessages);

export default router;