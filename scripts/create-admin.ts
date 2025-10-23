import User from '@/models/User';

async function createAdminUser() {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@ouswear.com' });
    
    if (!existingAdmin) {
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@ouswear.com',
        passwordHash: 'admin123', // Will be hashed by the model
        role: 'admin',
        isVerified: true
      });
      
      console.log('Admin user created successfully:', admin);
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();