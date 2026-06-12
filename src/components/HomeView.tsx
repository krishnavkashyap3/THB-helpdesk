/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Download, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';
import { DEPARTMENTS_DATA } from '../data/collegeData';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  setSelectedDepartmentId: (deptId: string) => void;
}

export default function HomeView({ setCurrentTab, setSelectedDepartmentId }: HomeViewProps) {
  const handleQuickDeptClick = (id: string) => {
    setSelectedDepartmentId(id);
    setCurrentTab('departments');
  };

  return (
    <div id="home-view-container" className="space-y-16 py-6 font-sans">
      
      {/* 1. Hero Block with Sophisticated Nature/Science Concept */}
      <section className="relative overflow-hidden rounded-3xl bg-radial from-teal-900 via-teal-950 to-emerald-950 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Abstract biological leaf / chemistry molecule graphics through pure styled CSS */}
        <div className="absolute -right-16 -top-16 h-96 w-96 rounded-full bg-teal-500/10 blur-[100px]"></div>
        <div className="absolute -left-16 -bottom-16 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]"></div>

        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center sm:px-12 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 rounded-full bg-teal-500/20 px-4 py-1.5 border border-teal-400/30 text-xs font-semibold text-teal-200 uppercase tracking-widest mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Est. 1963 · Affiliated to Gauhati University</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
          >
            Tyagbir Hem Baruah College <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-200 to-teal-100 font-sans font-medium text-3xl sm:text-4xl block mt-3">
              Science Division of Academic Excellence
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-teal-100/90 leading-relaxed font-light"
          >
            Nurturing analytical logic, botanical research, chemical innovation, and computational mastery in Assam's historic rural heartland. Discover a beautiful learning ecosystem designed for builders of science.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => setCurrentTab('portal')}
              className="flex items-center space-x-2 bg-white text-teal-950 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-all cursor-pointer shadow-md select-none"
            >
              <BookOpen className="h-4 w-4 text-teal-800" />
              <span>Explore Materials Portal</span>
            </button>
            <button
              onClick={() => setCurrentTab('questions')}
              className="flex items-center space-x-2 bg-teal-800/60 hover:bg-teal-800 text-teal-100 border border-teal-500/30 font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer select-none"
            >
              <Download className="h-4 w-4" />
              <span>Previous Years questions</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Center-Aligned Principal's Desk Message Panel (Full Width Focused Section) */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow transition-all relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-teal-50/50 rounded-full blur-2xl -z-10"></div>
          
          <div>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="h-1.5 w-8 rounded-full bg-teal-800"></div>
              <h3 className="font-display text-lg font-bold text-teal-950 uppercase tracking-wider text-center">
                From the Principal's Desk
              </h3>
              <div className="h-1.5 w-8 rounded-full bg-teal-800"></div>
            </div>
            
            <blockquote className="text-slate-600 leading-relaxed font-light italic text-sm md:text-base text-center max-w-3xl mx-auto">
              "It gives me immense pleasure to welcome you to the digital hub of Tyagbir Hem Baruah College. Since our foundation in 1963, we have been committed to empowering the rural masses of Jamugurihat and wider Sonitpur with high-quality education. Our Science Stream division is a beacon of logic and research, featuring advanced DST-FIST interactive labs, dedicated faculty mentors, and an active ecosystem that turns textbook concepts into real student innovations."
            </blockquote>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="h-14 w-14 rounded-full bg-teal-800 flex items-center justify-center text-teal-50 text-lg font-bold select-none border-2 border-teal-100">
                AH
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-bold text-slate-900">Dr. Ajit Hazarika</h4>
                <p className="text-xs text-slate-500">Principal & Chief Administrative Officer</p>
                <p className="text-sm font-bold text-teal-700 italic">Tyagbir Hem Baruah College</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Quick-Link Departments Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h3 className="font-display text-2xl font-bold text-slate-950 sm:text-3xl">
            Choose Your Science Honors Track
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            A comprehensive offering of highly relevant, undergraduate curricula supported by dedicated mentors and pristine labs. Key Honors disciplines include:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="quick-departments-grid">
          {DEPARTMENTS_DATA.map((dept) => (
            <div
              key={dept.id}
              id={`quick-dept-card-${dept.id}`}
              className="group relative flex flex-col justify-between overflow-hidden bg-white hover:bg-slate-50 border border-slate-100 rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-md hover:border-teal-200"
            >
              <div>
                <h4 className="font-display text-lg font-bold text-slate-900 group-hover:text-teal-950 transition-colors">
                  {dept.name}
                </h4>
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {dept.description}
                </p>
                <div className="mt-4">
                  <span className="text-xs font-medium text-slate-500">HoD in responsibility:</span>
                  <p className="text-xs font-bold text-slate-800">{dept.hodName}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-teal-700 font-semibold group-hover:underline">
                  View Faculty & Labs
                </span>
                <button
                  onClick={() => handleQuickDeptClick(dept.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-all cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
