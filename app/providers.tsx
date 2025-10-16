'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/hooks/useCart';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
}