'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AuthLoadingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const hasRedirected = useRef(false);
  const MAX_RETRIES = 5;

  useEffect(() => {
    // Prevent running if already redirected
    if (hasRedirected.current) return;

    console.log('Loading page - Session status:', status);
    console.log('Loading page - Session data:', session);
    console.log('Loading page - Retry count:', retryCount);

    if (status === 'loading') {
      console.log('Session still loading...');
      return; // Still loading
    }

    if (status === 'authenticated' && session?.user) {
      console.log('User authenticated, checking role:', session.user.role);
      hasRedirected.current = true;

      // Check user role and redirect accordingly
      if (session.user.role === 'admin') {
        console.log('✅ Redirecting to admin page');
        router.replace('/admin');
      } else {
        console.log('✅ Redirecting to shop page');
        router.replace('/shop');
      }
    } else if (status === 'unauthenticated') {
      // Try to update session a few times before giving up
      if (retryCount < MAX_RETRIES) {
        console.log(`⚠️ Session not found, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          update(); // Force session refresh
        }, 500);
      } else {
        console.log('❌ Max retries reached, redirecting to signin');
        hasRedirected.current = true;
        router.replace('/auth/signin');
      }
    }
  }, [session, status, router, retryCount, update]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-brand-auraRed border-t-transparent rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-white mb-2">Signing you in...</h2>
        <p className="text-white/70">Please wait while we verify your credentials</p>
        <div className="mt-4 text-sm text-white/50">
          Status: {status} | Role: {session?.user?.role || 'none'}
        </div>
      </motion.div>
    </div>
  );
}
