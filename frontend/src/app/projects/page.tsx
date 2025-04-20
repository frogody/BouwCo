'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';

const projects = [
  {
    id: 1,
    name: 'Modern Office Complex',
    location: 'Amsterdam, Netherlands',
    type: 'Commercial',
    area: '25,000 sqm',
    status: 'In Progress',
    image: '/projects/office-complex.jpg',
  },
  {
    id: 2,
    name: 'Residential Tower',
    location: 'Rotterdam, Netherlands',
    type: 'Residential',
    area: '15,000 sqm',
    status: 'Planning',
    image: '/projects/residential-tower.jpg',
  },
  {
    id: 3,
    name: 'Shopping Mall Renovation',
    location: 'Utrecht, Netherlands',
    type: 'Commercial',
    area: '35,000 sqm',
    status: 'Review',
    image: '/projects/shopping-mall.jpg',
  },
  {
    id: 4,
    name: 'Sustainable Housing Complex',
    location: 'The Hague, Netherlands',
    type: 'Residential',
    area: '20,000 sqm',
    status: 'Completed',
    image: '/projects/housing-complex.jpg',
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-4xl font-bold">Projects</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 rounded-full border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent w-full md:w-64"
              />
            </div>
            <button className="p-2 rounded-full border border-border hover:bg-accent/5">
              <Filter className="w-5 h-5" />
            </button>
            <button className="button-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden hover-card group"
            >
              <div className="relative h-48">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-background/80 backdrop-blur-sm">
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {project.name}
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{project.location}</p>
                  <div className="flex items-center justify-between">
                    <span>{project.type}</span>
                    <span>{project.area}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 