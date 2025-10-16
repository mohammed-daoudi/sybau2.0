import bcrypt from 'bcryptjs';

export const createAdminUser = async () => {
  const adminData = {
    name: 'Admin User',
    email: 'admin@sybau.com',
    passwordHash: await bcrypt.hash('admin123', 10),
    role: 'admin',
    isVerified: true,
    profile: {
      phoneNumber: '1234567890',
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return adminData;
};
