'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import Navigation from '@/components/Navigation';
import '../app/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
} 