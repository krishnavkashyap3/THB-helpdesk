/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  ChevronRight,
  FileText,
  Download,
  BookOpen
} from 'lucide-react';
import { DEPARTMENTS_DATA } from '../data/collegeData';
import SyllabusPdfViewer from './SyllabusPdfViewer';
import { getDepartmentCustomizations, DepartmentCustomization } from '../lib/adminService';

interface DepartmentsViewProps {
  selectedDepartmentId: string;
  setSelectedDepartmentId: (id: string) => void;
}

export default function DepartmentsView({
  selectedDepartmentId,
  setSelectedDepartmentId
}: DepartmentsViewProps) {
  const [customizations, setCustomizations] = React.useState<Record<string, DepartmentCustomization>>({});

  React.useEffect(() => {
    async function fetchCustomizations() {
      try {
        const data = await getDepartmentCustomizations();
        setCustomizations(data);
      } catch (err) {
        console.error("Failed to load department customs:", err);
      }
    }
    fetchCustomizations();
  }, [selectedDepartmentId]);
  
  // Find current active department
  const activeDept = DEPARTMENTS_DATA.find(d => d.id === selectedDepartmentId) || DEPARTMENTS_DATA[0];
  const activeDescription = customizations[selectedDepartmentId]?.customDescription || activeDept.description;
  const activeImages = customizations[selectedDepartmentId]?.imageUrls || [];

  return (
    <div id="departments-view-container" className="py-6 space-y-10 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Science Department honors Programs
        </h2>
        <p className="max-w-2xl mx-auto text-slate-600 text-xs sm:text-sm">
          Select an academic discipline to inspect its laboratory infrastructure, faculty directory, honors curriculum, and research milestones.
        </p>
      </div>

      {/* Main Selection Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Quick Tabs Navigation - 3 Cols */}
        <div className="lg:col-span-3 space-y-2" id="dept-tabs-nav">
          <p className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider mb-2">Science Disciplines</p>
          <div className="flex flex-row overflow-x-auto lg:flex-col gap-2 pb-3 lg:pb-0 scrollbar-hide">
            {DEPARTMENTS_DATA.map((dept) => {
              const isSelected = activeDept.id === dept.id;
              return (
                <button
                  key={dept.id}
                  id={`dept-tab-select-${dept.id}`}
                  onClick={() => setSelectedDepartmentId(dept.id)}
                  className={`flex items-center justify-between shrink-0 px-4 py-3 rounded-xl font-medium text-xs sm:text-sm transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-teal-800 text-teal-50 shadow-sm border-l-4 border-teal-400'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  <span>{dept.name}</span>
                  <ChevronRight className={`hidden lg:block h-4 w-4 transition-transform ${isSelected ? 'translate-x-1 text-teal-300' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Complex Information Panel - 9 Cols */}
        <div className="lg:col-span-9 space-y-8" id="dept-info-panel">
          
          {/* Header Banner for Selected Department */}
          <motion.div
            key={activeDept.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
          >
            {/* Meta headers */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">
                  {activeDept.name}
                </h3>
                <p className="text-xs text-teal-700 font-semibold mt-1">
                  Tyagbir Hem Baruah College · Gauhati Univ Affiliation
                </p>
              </div>
            </div>

            {/* Department Summary text */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Academic Mission
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed font-light whitespace-pre-wrap">
                  {activeDescription}
                </p>
              </div>

              {/* Photo Gallery & Campus Activities (Dynamic from Admin Portal) */}
              {activeImages.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Department Gallery & Activities Snapshot
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="dept-gallery-grid-display">
                    {activeImages.map((url, imgIdx) => (
                      <div 
                        key={imgIdx} 
                        className="group overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 transition-all hover:scale-[1.02] hover:shadow-md aspect-video relative flex items-center justify-center"
                      >
                        <img 
                          src={url} 
                          alt={`Honors Activity Frame #${imgIdx+1}`}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* HOD Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded-sm">
                  Head of Department
                </span>
                <h5 className="font-semibold text-slate-900 text-base">{activeDept.hodName}</h5>
                <p className="text-xs text-slate-500">Supervises general science evaluation and syllabus distributions.</p>
              </div>
              <div className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs text-slate-600 font-medium">
                <Building className="h-3.5 w-3.5 text-slate-400" />
                <span>HoD Office Chamber #S4</span>
              </div>
            </div>
          </motion.div>

          {/* Syllabus & Curriculum Section */}
          {activeDept.syllabus && (
            <motion.div
              key={`syllabus-${activeDept.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              id={`dept-syllabus-section-${activeDept.id}`}
              className="scroll-mt-6"
            >
              <SyllabusPdfViewer 
                departmentId={activeDept.id}
                departmentName={activeDept.name}
                pdfUrl={activeDept.syllabus.pdfUrl}
                fileSize={activeDept.syllabus.fileSize}
              />
            </motion.div>
          )}

          {/* Department Faculty Directory */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-base font-bold text-slate-900">
                  Faculty Members Directory
                </h4>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Official roster of academic staff and designated mentors of the department.
                </p>
              </div>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full uppercase tracking-wider select-none shrink-0 w-fit">
                THB Official Roster
              </span>
            </div>
            
            {/* Real Table for Tablet/Desktop width matching the screenshot exactly */}
            <div className="hidden md:block overflow-hidden border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">Name</th>
                    <th className="py-4 px-6 font-semibold">Designation</th>
                    <th className="py-4 px-6 font-semibold">Contact No</th>
                    <th className="py-4 px-6 font-semibold text-center">Photo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/85">
                  {activeDept.faculties.map((fac, idx) => {
                    const initials = fac.name.replace(/Dr\.\s*|Prof\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <tr key={idx} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="py-5 px-6">
                          <div className="space-y-1">
                            <span className="font-bold text-sm text-slate-900 block group-hover:text-teal-950 transition-colors">
                              {fac.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className="text-xs font-semibold text-slate-700 bg-slate-50 group-hover:bg-teal-50/50 group-hover:text-teal-900 border border-slate-100 rounded-md px-2.5 py-1 transition-colors">
                            {fac.designation}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          {fac.contact && fac.contact !== 'N/A' && fac.contact !== 'Unavailable' ? (
                            <span className="text-sm font-mono text-slate-600 font-semibold tracking-wide flex items-center">
                              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2"></span>
                              {fac.contact}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 italic font-light">
                              Not Provided
                            </span>
                          )}
                        </td>
                        <td className="py-5 px-6 text-center">
                          <div className="inline-block relative">
                            {/* Signature Double Glow Gold/Amber circular border from screenshots */}
                            <div className="p-[3px] rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-600 shadow-md">
                              <div className="p-[2.5px] rounded-full bg-white">
                                <div className="h-14 w-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-800 font-display text-sm font-bold shadow-inner">
                                  {initials}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stack Roster Layout for smaller screens */}
            <div className="md:hidden space-y-4">
              {activeDept.faculties.map((fac, idx) => {
                const initials = fac.name.replace(/Dr\.\s*|Prof\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <div 
                    key={idx} 
                    className="rounded-2xl border border-slate-100 p-5 space-y-4 hover:border-teal-100 transition-all bg-slate-50/30"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Photo column */}
                      <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-600 shadow-xs shrink-0">
                        <div className="p-[2px] rounded-full bg-white">
                          <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-800 font-display text-xs font-bold">
                            {initials}
                          </div>
                        </div>
                      </div>

                      {/* Name & Designation */}
                      <div className="space-y-0.5">
                        <h5 className="font-bold text-sm text-slate-900">{fac.name}</h5>
                        <span className="inline-block text-[10px] font-semibold text-teal-800 uppercase tracking-wider">{fac.designation}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      {fac.contact && fac.contact !== 'N/A' && fac.contact !== 'Unavailable' && (
                        <p className="flex items-center justify-between text-slate-500">
                          <span className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider">Contact:</span>
                          <span className="font-mono text-[13px] font-bold text-slate-800">{fac.contact}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
