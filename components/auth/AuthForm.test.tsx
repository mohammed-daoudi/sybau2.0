import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useToast } from '@/hooks/use-toast';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('AuthForm', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (signIn as jest.Mock).mockClear();
    (useToast as jest.Mock).mockImplementation(() => ({
      toast: mockToast,
    }));
  });

  describe('Sign In', () => {
    test('handles successful sign in', async () => {
      (signIn as jest.Mock).mockResolvedValueOnce({ ok: true, error: null });

      render(<AuthForm mode="signin" />);

      fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.input(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith('credentials', {
          email: 'test@example.com',
          password: 'password123',
          redirect: false,
        });
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Success',
          description: 'Signed in successfully',
        });
      });
    });

    test('handles sign in error', async () => {
      (signIn as jest.Mock).mockResolvedValueOnce({
        ok: false,
        error: 'Invalid credentials',
      });

      render(<AuthForm mode="signin" />);

      fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.input(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Invalid credentials',
          variant: 'destructive',
        });
      });
    });
  });

  describe('Sign Up', () => {
    test('handles successful sign up', async () => {
      const mockResponse = { ok: true, error: null };
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      render(<AuthForm mode="signup" />);

      fireEvent.input(screen.getByLabelText(/name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.input(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
          }),
        });
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Success',
          description: 'Account created successfully',
        });
      });
    });

    test('handles sign up validation', async () => {
      render(<AuthForm mode="signup" />);

      // Submit without filling any fields
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    test('validates password requirements', async () => {
      render(<AuthForm mode="signup" />);

      fireEvent.input(screen.getByLabelText(/password/i), {
        target: { value: 'short' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });
  });

  test('toggles between sign in and sign up modes', () => {
    const { rerender } = render(<AuthForm mode="signin" />);
    
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();

    rerender(<AuthForm mode="signup" />);
    
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  test('handles password reset request', async () => {
    const mockResponse = { ok: true };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    render(<AuthForm mode="signin" />);

    fireEvent.click(screen.getByText(/forgot password/i));
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.input(emailInput, {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Password reset email sent',
      });
    });
  });
});