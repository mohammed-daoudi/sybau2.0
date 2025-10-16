import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function GenerateSecretPage() {
  const { data: session } = useSession();
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not admin
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/auth/signin');
  }

  const generateSecret = async () => {
    try {
      const response = await fetch('/api/admin/generate-secret');
      if (!response.ok) {
        throw new Error('Failed to generate secret');
      }
      const data = await response.json();
      setSecret(data.secret);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Generate NEXTAUTH_SECRET</CardTitle>
          <CardDescription>
            Generate a secure secret for NextAuth.js configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateSecret}>Generate New Secret</Button>
          
          {secret && (
            <Alert className="mt-4">
              <AlertDescription>
                <div className="mt-2 font-mono break-all">
                  NEXTAUTH_SECRET={secret}
                </div>
                <p className="mt-2 text-sm">
                  Add this to your .env file
                </p>
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}