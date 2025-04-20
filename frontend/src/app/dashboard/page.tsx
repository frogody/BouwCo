'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Clock, Users, FileText, Plus } from 'lucide-react';

const projects = [
  {
    id: 1,
    name: 'Modern Office Complex',
    status: 'In Progress',
    completion: 65,
    team: 8,
    deadline: '2024-06-15',
  },
  {
    id: 2,
    name: 'Residential Tower',
    status: 'Planning',
    completion: 25,
    team: 12,
    deadline: '2024-08-30',
  },
  {
    id: 3,
    name: 'Shopping Mall Renovation',
    status: 'Review',
    completion: 90,
    team: 15,
    deadline: '2024-04-20',
  },
];

const stats = [
  { icon: Building2, label: 'Active Projects', value: '12' },
  { icon: Users, label: 'Team Members', value: '48' },
  { icon: Clock, label: 'Hours Logged', value: '2,450' },
  { icon: FileText, label: 'Documents', value: '310' },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <button className="button-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 hover-card"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Projects */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Active Projects</h2>
          <div className="grid gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover-card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Status: {project.status}</span>
                      <span>Team: {project.team} members</span>
                      <span>Deadline: {project.deadline}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Completion</p>
                      <p className="text-xl font-bold">{project.completion}%</p>
                    </div>
                    <div className="w-24 h-24 relative">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          className="stroke-border fill-none stroke-2"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          className="stroke-accent fill-none stroke-2"
                          strokeDasharray={`${project.completion * 2.76} 276`}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 