// Run this script to seed the database with an admin user
// Usage: node scripts/seed-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  addresses: { type: Array, default: [] },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin user seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ouswear.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = 'Admin User';

    // Check if admin already exists
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('ℹ️  Admin user already exists:', adminEmail);
      await mongoose.disconnect();
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const admin = new User({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'admin',
      addresses: [],
    });
    await admin.save();
    console.log('✅ Admin user seeded:', adminEmail);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Database connection closed');
    process.exit(0);
  }
}

seedAdmin();
