import React from 'react';
import { motion } from 'framer-motion';
import { Box, Layout, Compass, Building2 } from 'lucide-react';

const services = [
  {
    icon: Box,
    title: 'Architecture',
    description: 'Innovative design solutions for modern living',
  },
  {
    icon: Layout,
    title: 'Planning',
    description: 'Strategic planning for efficient project execution',
  },
  {
    icon: Compass,
    title: 'Interior Design',
    description: 'Creating functional and aesthetic interior spaces',
  },
  {
    icon: Building2,
    title: 'Exterior Design',
    description: 'Designing striking and sustainable building exteriors',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Services() {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold mb-4"
            {...fadeInUp}
          >
            Our Services
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            {...fadeInUp}
            transition={{ delay: 0.1 }}
          >
            Explore our range of services and discover how we bring your vision to life.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="glass-card hover-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mb-4 p-3 bg-accent/10 w-fit rounded-xl">
                <service.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 