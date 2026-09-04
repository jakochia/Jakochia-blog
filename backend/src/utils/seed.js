// ============================================================
// BACKEND src/utils/seed.js
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

import { connectDB, disconnectDB } from '../config/database.js';
import { Admin } from '../models/Admin.js';
import { Category } from '../models/Category.js';
import { Tag } from '../models/Tag.js';

const seed = async () => {
  try {
    await connectDB();

    // Check if admin exists
    const adminExists = await Admin.findOne();
    if (!adminExists) {
      const passwordHash = await Admin.hashPassword('Asher01!?.');
      await Admin.create({
        email: 'admin@jakochia.com',
        passwordHash,
        name: 'Newton Asha',
        role: 'superadmin',
      });
      console.log('✅ Admin created: admin@jakochia.com / admin123');
    }

    // Seed categories
    const categories = [
      { name: 'Software Engineering', color: '#2563eb' },
      { name: 'Networking', color: '#059669' },
      { name: 'Cisco', color: '#7c3aed' },
      { name: 'Cybersecurity', color: '#dc2626' },
      { name: 'Cloud', color: '#f59e0b' },
      { name: 'AI', color: '#8b5cf6' },
      { name: 'Tutorials', color: '#0891b2' },
      { name: 'Projects', color: '#d946ef' },
      { name: 'Personal', color: '#6b7280' },
    ];

    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`✅ Category created: ${cat.name}`);
      }
    }

    // Seed tags
    const tags = [
      'React', 'Node.js', 'MongoDB', 'Express', 'Tailwind',
      'Cisco', 'CCNA', 'Kali Linux', 'AWS', 'Vercel',
      'JavaScript', 'Networking', 'Cybersecurity', 'Python', 'Docker',
      'TypeScript', 'GraphQL', 'Next.js', 'Linux', 'Git',
    ];

    for (const tagName of tags) {
      const exists = await Tag.findOne({ name: tagName });
      if (!exists) {
        await Tag.create({ name: tagName });
        console.log(`✅ Tag created: ${tagName}`);
      }
    }

    console.log('✅ Seeding complete!');
    await disconnectDB();
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seed();