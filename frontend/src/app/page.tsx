import React from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import FloorPlanAnalysis from '@/components/FloorPlanAnalysis';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="container mx-auto py-12">
        <FloorPlanAnalysis />
      </div>
      <Services />
    </main>
  );
} 