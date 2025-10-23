import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextRequest } from 'next/server';
import Logger from '@/lib/logger';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        console.log('Starting authorization...');
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          // Using mock database in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock database for authentication');
            
            // Check for admin credentials
            if (credentials.email === 'admin@ouswear.com' && credentials.password === 'admin123') {
              return {
                id: 'admin-id',
                email: 'admin@ouswear.com',
                name: 'Admin User',
                role: 'admin'
              };
            }
          }

          await connectDB();
          console.log('Looking for user:', credentials.email);
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }

          console.log('Found user:', user.email, 'role:', user.role);
          console.log('Stored hash:', user.passwordHash);
          
          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
          console.log('Password comparison result:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email);
            return null;
          }

          console.log('Authentication successful, returning user:', {
            id: user._id?.toString() || 'mock_id',
            email: user.email,
            name: user.name,
            role: user.role,
          });

          return {
            id: user._id?.toString() || 'mock_id',
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          Logger.error('Authentication failed', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as 'customer' | 'admin';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

// Remove aggressive rate limiting for auth routes
// NextAuth has its own security mechanisms
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
