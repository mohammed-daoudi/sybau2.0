import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface PasswordResetProps {
  email?: string;
  token?: string;
}

export function PasswordReset({ email, token }: PasswordResetProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState(email || '');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput }),
      });

      if (!response.ok) throw new Error('Failed to request password reset');

      toast({
        title: 'Check your email',
        description: 'We\'ve sent you a password reset link if an account exists with that email.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request password reset. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) throw new Error('Failed to reset password');

      toast({
        title: 'Success',
        description: 'Your password has been reset successfully. Please log in with your new password.',
      });

      // Redirect to login page after successful reset
      window.location.href = '/auth/signin';
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password. The link may have expired.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton className="w-full h-48" />;
  }

  if (token) {
    // Reset password form (after clicking email link)
    return (
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    );
  }

  // Initial password reset request form
  return (
    <form onSubmit={handleRequestReset} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <Button type="submit" className="w-full">
        Request Password Reset
      </Button>
    </form>
  );
}