'use client';

import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (data: { email: string; password: string; name?: string }) => {
    if (!data.name) {
      toast.error('Please provide your name');
      return;
    }

    try {
      setIsLoading(true);
      const response = await auth.signup(data.email, data.password, data.name);
      
      // Store the token
      localStorage.setItem('token', response.token);
      
      // Show success message
      toast.success('Account created successfully!');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="w-full">
        <AuthForm 
          mode="signup" 
          onSubmit={handleSignup}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 