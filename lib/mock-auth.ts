import bcrypt from 'bcryptjs';
import type { MockDocument } from './mock-db.types';

interface MockUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  role: 'admin' | 'customer';
  createdAt: Date;
  updatedAt: Date;
}

const mockUsers = new Map<string, MockUser>();

// Initialize with admin user
const initializeAdmin = async (): Promise<MockUser> => {
  const adminUser: MockUser = {
    _id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@sybau.com',
    phoneNumber: '1234567890',
    passwordHash: await bcrypt.hash('admin123', 10),
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockUsers.set('admin@sybau.com', adminUser);
  return adminUser;
};

export const mockAuthHandler = {
  async findUserByEmail(email: string): Promise<MockUser | null> {
    // Initialize admin if not exists
    if (mockUsers.size === 0) {
      await initializeAdmin();
    }
    
    return mockUsers.get(email) || null;
  },
  
  async validatePassword(user: MockUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  },
  
  // Helper method to get all users (for testing)
  async getUsers(): Promise<MockUser[]> {
    if (mockUsers.size === 0) {
      await initializeAdmin();
    }
    return Array.from(mockUsers.values());
  }
};