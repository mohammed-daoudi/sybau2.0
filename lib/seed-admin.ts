import bcrypt from 'bcryptjs';

export const createAdminUser = async () => {
  const adminData = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@sybau.com',
    phoneNumber: '1234567890',
    passwordHash: await bcrypt.hash('admin123', 10),
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return adminData;
};