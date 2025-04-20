import React from 'react';
import Services from '@/components/Services';

export default function ServicesPage() {
  return (
    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Our Services</h1>
        <Services />
      </div>
    </main>
  );
} 