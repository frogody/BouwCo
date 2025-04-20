import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-6">About BouwCo</h1>
            <p className="text-lg text-muted-foreground mb-6">
              BouwCo is a leading construction cost estimation platform that combines
              cutting-edge AI technology with years of industry expertise to provide
              accurate and reliable cost estimates for your construction projects.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Our mission is to simplify the construction planning process by providing
              instant, accurate cost estimates through advanced floor plan analysis
              and AI-powered calculations.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">500+</h3>
                <p className="text-muted-foreground">Projects Completed</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">98%</h3>
                <p className="text-muted-foreground">Accuracy Rate</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image
              src="/assets/images/about-image.jpg"
              alt="BouwCo Team"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously push the boundaries of what's possible in construction
                cost estimation through AI and machine learning.
              </p>
            </div>
            <div className="p-6 bg-card rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Accuracy</h3>
              <p className="text-muted-foreground">
                Our estimates are backed by real-world data and advanced algorithms
                to ensure the highest level of precision.
              </p>
            </div>
            <div className="p-6 bg-card rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in clear, detailed breakdowns of all costs and
                calculations to help you make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 