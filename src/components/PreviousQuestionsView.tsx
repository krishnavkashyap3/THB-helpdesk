/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Info, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { QUESTION_PAPERS, DEPARTMENTS_DATA } from '../data/collegeData';
import { QuestionPaper } from '../types';
import { getQuestionPapersFromFirestore } from '../lib/adminService';

export default function PreviousQuestionsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedSem, setSelectedSem] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic state loaded live from Firestore
  const [papersList, setPapersList] = useState<QuestionPaper[]>([]);

  useEffect(() => {
    async function loadPapers() {
      setIsLoading(true);
      try {
        const data = await getQuestionPapersFromFirestore();
        setPapersList(data);
      } catch (err) {
        console.error("Failed to fetch questions from Firestore:", err);
        setPapersList(QUESTION_PAPERS);
      } finally {
        setIsLoading(false);
      }
    }
    loadPapers();
  }, []);

  const semesters = [
    'Semester I', 'Semester II', 'Semester III', 'Semester IV', 'Semester V', 'Semester VI'
  ];

  const examTypes = ['End-Semester Exam', 'Sessional Exam', 'Practical Exam'];

  // Handle Filtering
  const filteredPapers = useMemo(() => {
    return papersList.filter((paper) => {
      const matchesSearch = paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.year.toString().includes(searchQuery);
      const matchesDept = selectedDept === 'all' || paper.departmentId === selectedDept;
      const matchesSem = selectedSem === 'all' || paper.semester === selectedSem;
      const matchesType = selectedType === 'all' || paper.examType === selectedType;

      return matchesSearch && matchesDept && matchesSem && matchesType;
    });
  }, [papersList, searchQuery, selectedDept, selectedSem, selectedType]);

  const handleDownloadSimulate = (id: string, subject: string, documentUrl?: string) => {
    setIsDownloading(id);
    
    // Simulate API delay
    setTimeout(() => {
      setIsDownloading(null);
      setDownloadSuccess(subject);

      // Increment downloads count in local state
      setPapersList(prev => prev.map(p => {
        if (p.id === id) {
          return { ...p, downloads: p.downloads + 1 };
        }
        return p;
      }));

      // Open sharing URL if specified
      if (documentUrl) {
        try {
          window.open(documentUrl, '_blank', 'noopener,noreferrer');
        } catch (e) {
          console.error("Popup window open failed: ", e);
        }
      }

      // Auto-clear success toast after 3 seconds
      setTimeout(() => {
        setDownloadSuccess(null);
      }, 3500);
    }, 1200);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('all');
    setSelectedSem('all');
    setSelectedType('all');
  };

  return (
    <div id="previous-questions-view" className="py-6 space-y-10 max-w-7xl mx-auto">
      
      {/* View Header */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Previous Years Question Bank
        </h2>
        <p className="max-w-2xl mx-auto text-slate-600 text-xs sm:text-sm">
          Access past semester questions to inspect syllabus weightage, question structures, and prepare efficiently under Gauhati University standards.
        </p>
      </div>

      {/* Floating Toast Notification for Downloads */}
      {downloadSuccess && (
        <div 
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 rounded-2xl bg-slate-900 text-teal-100 p-4 shadow-2xl border border-teal-500/30 animate-bounce"
          id="download-toast-notification"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-slate-950">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold font-mono tracking-wide text-teal-400">DOWNLOAD INITIATED</p>
            <p className="text-xs text-white max-w-xs truncate font-semibold">{downloadSuccess}.pdf</p>
          </div>
          <button 
            onClick={() => setDownloadSuccess(null)}
            className="text-slate-400 hover:text-white text-xs pl-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Control Panel: Filters Box */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Filter className="h-4 w-4 text-teal-800" />
            <span>Search & Filter Parameters</span>
          </div>
          {/* Active badge */}
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start md:self-auto">
            {filteredPapers.length} Question papers indexed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Query search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="search-papers-query"
              placeholder="Search subject or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-teal-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Department Select */}
          <div>
            <select
              id="filter-papers-dept"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-teal-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition-all cursor-pointer"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS_DATA.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Semester Select */}
          <div>
            <select
              id="filter-papers-sem"
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-teal-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition-all cursor-pointer"
            >
              <option value="all">All Semesters</option>
              {semesters.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Exam Type Select */}
          <div>
            <select
              id="filter-papers-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-teal-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition-all cursor-pointer"
            >
              <option value="all">All Exam Types</option>
              {examTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Clear filter shortcut button */}
        {(searchQuery || selectedDept !== 'all' || selectedSem !== 'all' || selectedType !== 'all') && (
          <div className="flex justify-end pt-2 border-t border-slate-50">
            <button
              id="btn-reset-filters"
              onClick={handleResetFilters}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all cursor-pointer select-none"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset active filters</span>
            </button>
          </div>
        )}
      </section>

      {/* Grid List of indexed Past papers */}
      <section>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3" id="papers-sync-loader">
            <Loader2 className="h-7 w-7 text-teal-800 animate-spin" />
            <p className="text-xs text-slate-500 font-mono">Synchronizing interactive past papers from Firestore cloud...</p>
          </div>
        ) : filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="papers-results-grid">
            {filteredPapers.map((paper) => {
              const paperDept = DEPARTMENTS_DATA.find(d => d.id === paper.departmentId);
              const isPaperDownloading = isDownloading === paper.id;
              
              return (
                <div
                  key={paper.id}
                  id={`paper-card-${paper.id}`}
                  className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow transition-all hover:border-teal-200"
                >
                  <div className="space-y-4">
                    {/* Tags block */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 uppercase tracking-wider">
                        {paper.semester}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900 border border-slate-200 rounded px-2 py-0.5">
                        {paper.year}
                      </span>
                    </div>

                    {/* Subject line */}
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {paper.subject}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-tight mt-1.5">
                        {paperDept?.name || 'Science Stream'}
                      </p>
                    </div>

                    {/* Metadata line info */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-3 text-xs border border-slate-100 text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Category</span>
                        <span className="font-medium truncate block">{paper.examType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">File Size</span>
                        <span className="font-medium block">{paper.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      {paper.downloads} downloads
                    </span>

                    <button
                      id={`btn-download-paper-${paper.id}`}
                      disabled={isPaperDownloading}
                      onClick={() => handleDownloadSimulate(paper.id, paper.subject, paper.documentUrl)}
                      className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                        isPaperDownloading
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed animate-pulse'
                          : 'bg-teal-800 hover:bg-teal-900 text-teal-50 border-transparent shadow hover:shadow-md'
                      }`}
                    >
                      {isPaperDownloading ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-teal-800 border-t-transparent rounded-full animate-spin"></div>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          <span>Get Question Paper</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4" id="papers-empty-state">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-450 border border-slate-100">
              <HelpCircle className="h-6 w-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-extrabold text-slate-900 text-base">
                No Past Papers Match Your Query
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                Try shortening your query, choosing a different semester selection, or checking another science department honors portal.
              </p>
            </div>
            
            <button
              id="btn-empty-reset"
              onClick={handleResetFilters}
              className="bg-slate-950 text-slate-100 text-xs font-bold px-5 py-2 rounded-lg hover:bg-slate-800 transition-all select-none cursor-pointer"
            >
              Reset Search Parameters
            </button>
          </div>
        )}
      </section>

      {/* Info Tip block */}
      <section className="bg-teal-50/60 border border-teal-100 rounded-2xl p-4 flex items-start space-x-3 max-w-3xl mx-auto">
        <Info className="h-5 w-5 text-teal-800 shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs text-slate-600">
          <p className="font-bold text-teal-950">Gauhati University CBCS Examination Notice</p>
          <p className="leading-relaxed">
            All question papers indexed conform with the current Under-Graduate CBCS system syllabus rules. For papers prior to 2019, physical copy booklets are archived inside the central administrative science library counter. Contact library supervisor Prof. N. Dutta for access.
          </p>
        </div>
      </section>

    </div>
  );
}
