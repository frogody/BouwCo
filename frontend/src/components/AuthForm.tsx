import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
  isLoading?: boolean;
}

export default function AuthForm({ mode, onSubmit, isLoading = false }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="button-primary w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <Link href="/signup" className="text-accent hover:underline">
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
} 