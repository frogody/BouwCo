'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen section-padding overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl font-bold mb-6">
              <span className="gradient-text">Modern</span>
              <br />
              architecture
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Building the future of innovative architecture
            </p>
            <div className="flex gap-4">
              <button className="button-primary">
                Get Started
              </button>
              <button className="px-6 py-3 rounded-full border border-border hover:bg-accent/5 transition-colors">
                Watch video
              </button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-[2rem] overflow-hidden">
              <Image
                src="/assets/images/modern-building.jpg"
                alt="Modern Architecture"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 right-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -z-10 bottom-0 left-1/2 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 