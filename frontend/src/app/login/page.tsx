'use client';

import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const response = await auth.login(data.email, data.password);
      
      // Store the token
      localStorage.setItem('token', response.token);
      
      // Show success message
      toast.success('Successfully logged in!');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="w-full">
        <AuthForm 
          mode="login" 
          onSubmit={handleLogin}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 