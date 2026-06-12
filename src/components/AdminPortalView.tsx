/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  ClipboardList, 
  Building, 
  Image as ImageIcon, 
  CheckCircle2, 
  Info, 
  BookOpen, 
  GraduationCap, 
  Loader2,
  Undo2,
  Calendar,
  Layers,
  Sparkles,
  Link
} from 'lucide-react';
import { Student, QuestionPaper } from '../types';
import { DEPARTMENTS_DATA } from '../data/collegeData';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  getQuestionPapersFromFirestore, 
  addQuestionPaperToFirestore, 
  deleteQuestionPaperFromFirestore, 
  getDepartmentCustomizations, 
  saveDepartmentCustomization,
  DepartmentCustomization
} from '../lib/adminService';

interface AdminPortalViewProps {
  loggedInStudent: Student | null;
  onLogout: () => void;
}

// Preset Premium science stock image URLs so the admin doesn't have to find URLs manually!
const SUGGESTED_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200',
    category: 'Chemistry / Labs',
    caption: 'Modern Organic Synthesis Spectrometer Station'
  },
  {
    url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1200',
    category: 'Physics / Optics',
    caption: 'Interferometer Coherent Laser Bench Setup'
  },
  {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
    category: 'Mathematics / Computing',
    caption: 'High-Performance Physics Simulation Cell'
  },
  {
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200',
    category: 'Botany / Ecology',
    caption: 'Regional Ethnobotanical Conservatory'
  },
  {
    url: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=1200',
    category: 'Zoology / Marine',
    caption: 'Cell Biology Research Microscope Colony'
  }
];

export default function AdminPortalView({ loggedInStudent, onLogout }: AdminPortalViewProps) {
  const [activeTab, setActiveTab] = useState<'pyqs' | 'departments'>('pyqs');
  const [loading, setLoading] = useState(true);
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [deptCustomizations, setDeptCustomizations] = useState<Record<string, DepartmentCustomization>>({});
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states: PYQ Add form
  const [subject, setSubject] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [deptId, setDeptId] = useState('physics');
  const [semester, setSemester] = useState('Semester I');
  const [year, setYear] = useState(new Date().getFullYear());
  const [examType, setExamType] = useState<'End-Semester Exam' | 'Sessional Exam' | 'Practical Exam'>('End-Semester Exam');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [isSubmittingPyq, setIsSubmittingPyq] = useState(false);

  // Form states: Department Customization form
  const [selectedDeptId, setSelectedDeptId] = useState('physics');
  const [customDesc, setCustomDesc] = useState('');
  const [deptImageUrls, setDeptImageUrls] = useState<string[]>([]);
  const [newImgUrl, setNewImgUrl] = useState('');
  const [isSavingDept, setIsSavingDept] = useState(false);

  // Load everything on mount only after Firebase authentication state is verified and resolved
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Safe buffer to allow Firebase token & context registration to propagate down fully before executing reads
        await new Promise((resolve) => setTimeout(resolve, 400));
        await loadAdminData(user.email || undefined);
      } else {
        // Hand off to login flow or end the loading state
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadAdminData = async (userEmail?: string) => {
    setLoading(true);
    try {
      const emailToUse = userEmail || loggedInStudent?.email;
      const [fetchedPapers, fetchedCustoms] = await Promise.all([
        getQuestionPapersFromFirestore(emailToUse),
        getDepartmentCustomizations()
      ]);
      setPapers(fetchedPapers);
      setDeptCustomizations(fetchedCustoms);
      
      // Seed current department edit fields
      const currentCustom = fetchedCustoms[selectedDeptId];
      const initialDept = DEPARTMENTS_DATA.find(d => d.id === selectedDeptId);
      setCustomDesc(currentCustom?.customDescription || initialDept?.description || '');
      setDeptImageUrls(currentCustom?.imageUrls || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      showStatus("Failed to synchronize with Firestore.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Switch edited department
  useEffect(() => {
    const currentCustom = deptCustomizations[selectedDeptId];
    const initialDept = DEPARTMENTS_DATA.find(d => d.id === selectedDeptId);
    setCustomDesc(currentCustom?.customDescription || initialDept?.description || '');
    setDeptImageUrls(currentCustom?.imageUrls || []);
  }, [selectedDeptId, deptCustomizations]);

  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // Submit PYQ
  const handleAddPyq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      showStatus("Please enter a subject topic name.", "error");
      return;
    }
    if (!documentUrl.trim()) {
      showStatus("Please provide a path or a URL sharing link for this question paper.", "error");
      return;
    }
    setIsSubmittingPyq(true);
    try {
      const payload = {
        subject: subject.trim(),
        departmentId: deptId,
        semester,
        year: Number(year),
        examType,
        fileSize: fileSize.trim(),
        downloads: 0,
        documentUrl: documentUrl.trim()
      };
      
      await addQuestionPaperToFirestore(payload);
      showStatus("Question paper added successfully!", "success");
      setSubject('');
      setUploadedFileName('');
      setDocumentUrl('');
      
      // Reload list
      const fetchedPapers = await getQuestionPapersFromFirestore(loggedInStudent?.email);
      setPapers(fetchedPapers);
    } catch (err) {
      console.error("Failed to add paper:", err);
      showStatus("Error saving question paper to database.", "error");
    } finally {
      setIsSubmittingPyq(false);
    }
  };

  // Delete PYQ
  const handleDeletePyq = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this previous year question paper from the core directory? This action is permanent.")) return;
    try {
      await deleteQuestionPaperFromFirestore(id);
      showStatus("Question paper deleted successfully.", "success");
      setPapers(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      showStatus("Error removing paper from Firestore.", "error");
    }
  };

  // Add individual image url to current list
  const handleAddImageUrl = (urlToAdd: string) => {
    const cleaned = urlToAdd.trim();
    if (!cleaned) return;
    if (deptImageUrls.includes(cleaned)) {
      showStatus("This image is already in the department list.", "error");
      return;
    }
    setDeptImageUrls(prev => [...prev, cleaned]);
    setNewImgUrl('');
  };

  // Delete image url from current list
  const handleRemoveImageUrl = (urlToRemove: string) => {
    setDeptImageUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showStatus("Image size is too large. Please select an image under 2MB for optimal performance.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Str = uploadEvent.target?.result as string;
        if (base64Str) {
          if (deptImageUrls.includes(base64Str)) {
            showStatus("This image is already in the department list.", "error");
            return;
          }
          setDeptImageUrls(prev => [...prev, base64Str]);
          showStatus("Locally selected image loaded successfully!", "success");
        }
      };
      reader.onerror = () => {
        showStatus("Error reading the image file.", "error");
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes to current edited department
  const handleSaveDepartment = async () => {
    setIsSavingDept(true);
    try {
      await saveDepartmentCustomization(selectedDeptId, customDesc.trim(), deptImageUrls);
      showStatus(`Successfully updated documentation and gallery for ${selectedDeptId.toUpperCase()}!`, "success");
      
      // Refresh local caches
      const fetchedCustoms = await getDepartmentCustomizations();
      setDeptCustomizations(fetchedCustoms);
    } catch (err) {
      console.error("Failed to save department configurations:", err);
      showStatus("Error saving department details.", "error");
    } finally {
      setIsSavingDept(false);
    }
  };

  return (
    <div id="admin-portal-dashboard" className="space-y-8 py-4">
      
      {/* 1. Header Admin Deck Title Block */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md border border-teal-800">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SYSTEM POWERED ADMINISTRATOR DESK</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Core College Administration Portal
          </h2>
          <p className="text-xs text-teal-200/90 font-light max-w-xl">
            Welcome, <strong className="text-white hover:text-emerald-400 transition-colors font-bold">Kinetic Kali</strong>. Here you can index upcoming past questions, edit academic missions, and seed high-contrast departmental activities and photos.
          </p>
        </div>

        <button
          id="admin-btn-logout"
          onClick={onLogout}
          className="bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-600 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow cursor-pointer uppercase tracking-wider"
        >
          Sign Out of Admin Desk
        </button>
      </div>

      {/* Floating alert banner */}
      {statusMessage && (
        <div 
          id="admin-status-toast"
          className={`flex items-center space-x-3 rounded-2xl p-4 shadow-xl border animate-fadeIn transition-all max-w-xl mx-auto text-xs font-medium ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-150 text-emerald-950' 
              : 'bg-rose-50 border-rose-150 text-rose-950'
          }`}
        >
          <CheckCircle2 className={`h-5 w-5 shrink-0 ${statusMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`} />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 2. Portal Workspace Navigation Tabs */}
      <div className="flex border-b border-slate-200" id="admin-workspace-tabs">
        <button
          id="admin-tab-pyqs"
          onClick={() => setActiveTab('pyqs')}
          className={`pb-3 px-6 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'pyqs'
              ? 'border-teal-800 text-teal-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Previous Years Question Papers</span>
        </button>
        <button
          id="admin-tab-departments"
          onClick={() => setActiveTab('departments')}
          className={`pb-3 px-6 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'departments'
              ? 'border-teal-800 text-teal-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>Manage Departments & Images</span>
        </button>
      </div>

      {loading ? (
        <div id="admin-view-loading-panel" className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="h-8 w-8 text-teal-800 animate-spin" />
          <p className="text-xs text-slate-500 font-mono">Synchronizing workspace tables with Cloud Run and Firestore...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: PREVIOUS YEARS QUESTION BANK MANAGER */}
          {activeTab === 'pyqs' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
              
              {/* Left column: Add new pyq form (5 cols) */}
              <form onSubmit={handleAddPyq} className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5" id="add-pyq-form">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-sm">
                    Database Input Form
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Add Past Question Paper
                  </h3>
                  <p className="text-xs text-slate-500 font-light">Index high quality educational archives to let honors students download them.</p>
                </div>

                <hr className="border-slate-100" />

                {/* Subject Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Subject Topic & Name</label>
                  <input
                    type="text"
                    required
                    id="add-pyq-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Electromagnetism & Dielectrics"
                    className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all text-slate-800"
                  />
                </div>

                {/* Shareable Document Link Input */}
                <div className="space-y-1.5 focus-within:text-teal-950">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 block" htmlFor="add-pyq-document-url">Document Share URL Link</label>
                    <span className="text-[10px] text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded-sm">Bypasses Storage Limits</span>
                  </div>
                  <div className="relative">
                    <Link className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="url"
                      required
                      id="add-pyq-document-url"
                      value={documentUrl}
                      onChange={(e) => setDocumentUrl(e.target.value)}
                      placeholder="e.g. https://drive.google.com/file/d/..."
                      className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs outline-none transition-all text-slate-800"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                    Paste any shareable link (e.g. Google Drive, Dropbox, Onedrive, or public PDF web url).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Department Select */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Department</label>
                    <select
                      id="add-pyq-dept"
                      value={deptId}
                      onChange={(e) => setDeptId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 cursor-pointer outline-none"
                    >
                      {DEPARTMENTS_DATA.map(d => (
                        <option key={d.id} value={d.id}>{d.name.replace('Department of ', '')}</option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Select */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Semester</label>
                    <select
                      id="add-pyq-semester"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 cursor-pointer outline-none"
                    >
                      {['Semester I', 'Semester II', 'Semester III', 'Semester IV', 'Semester V', 'Semester VI'].map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Exam Year */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Examination Year</label>
                    <input
                      type="number"
                      required
                      id="add-pyq-year"
                      min={2010}
                      max={2030}
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3.5 py-2 text-xs outline-none transition-all text-slate-800"
                    />
                  </div>

                  {/* Exam Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-705 block">Exam Category</label>
                    <select
                      id="add-pyq-category"
                      value={examType}
                      onChange={(e) => setExamType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 cursor-pointer outline-none"
                    >
                      <option value="End-Semester Exam">End-Semester Exam</option>
                      <option value="Sessional Exam">Sessional Exam</option>
                      <option value="Practical Exam">Practical Exam</option>
                    </select>
                  </div>
                </div>

                {/* Dummy File Size */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Simulated Attachment File Size</label>
                  <input
                    type="text"
                    required
                    id="add-pyq-filesize"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="e.g. 1.8 MB"
                    className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  id="add-pyq-submit-btn"
                  disabled={isSubmittingPyq}
                  className="w-full bg-teal-800 hover:bg-teal-950 text-teal-50 font-bold py-3 rounded-xl transition-all shadow select-none cursor-pointer mt-2 text-xs sm:text-sm inline-flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmittingPyq ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving Paper...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Publish Question Paper</span>
                    </>
                  )}
                </button>
              </form>

              {/* Right column: List of existing PYQs (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-xs font-bold text-slate-700 font-mono text-teal-950 uppercase">Active Question Papers Collection</span>
                  <span className="text-xs font-mono font-bold bg-white text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-full">
                    {papers.length} Papers indexed
                  </span>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs" id="admin-papers-roster">
                  <div className="overflow-y-auto max-h-[600px] divide-y divide-slate-100">
                    {papers.length === 0 ? (
                      <div className="text-center p-12 text-slate-400 text-xs font-light">
                        No previous year questions indexed in cloud yet. Adding your first document will seed the collection.
                      </div>
                    ) : (
                      papers.map((paper) => {
                        const deptName = DEPARTMENTS_DATA.find(d => d.id === paper.departmentId)?.name.replace('Department of ', '') || paper.departmentId;
                        return (
                          <div 
                            key={paper.id} 
                            id={`admin-paper-row-${paper.id}`}
                            className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="space-y-1 pr-4 max-w-sm">
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm block truncate">{paper.subject}</h4>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500 font-semibold uppercase">
                                <span className="bg-slate-100 px-2 py-0.2 rounded font-bold text-slate-600">{paper.year}</span>
                                <span>•</span>
                                <span className="text-teal-800">{deptName}</span>
                                <span>•</span>
                                <span className="bg-teal-50 text-teal-800 px-1.5 py-0.1 rounded border border-teal-100">{paper.semester}</span>
                                <span>•</span>
                                <span>{paper.examType}</span>
                              </div>
                            </div>

                            <button
                              id={`admin-btn-delete-paper-${paper.id}`}
                              onClick={() => handleDeletePyq(paper.id)}
                              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                              title="Delete past paper"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANAGE DEPARTMENT CORE TEXT & GALLERY IMAGES */}
          {activeTab === 'departments' && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8 animate-fadeIn" id="admin-dept-manager">
              
              {/* Select department selector */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center space-x-2">
                    <Building className="h-5 w-5 text-teal-800" />
                    <span>Academic Honors Department Editor</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-light">Select a science specialization honors program to update description text and add department-related activity photos.</p>
                </div>

                <select
                  id="admin-select-edited-dept"
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 outline-none cursor-pointer"
                >
                  {DEPARTMENTS_DATA.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Split pane for department text and gallery editing */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Academic profile text edits (7 cols) */}
                <div className="lg:col-span-6 space-y-5">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Academic Mission Description</h4>
                    <p className="text-[11px] text-slate-400 font-light">This edits the primary introduction block visible inside the Honors programs tab of the website.</p>
                  </div>

                  <textarea
                    id="admin-dept-desc-editor"
                    rows={8}
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    placeholder="Enter updated academic mission, specialized lab scopes, and Gauhati University syllabus descriptions here..."
                    className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-2xl p-4 text-xs sm:text-sm outline-none transition-all text-slate-800 leading-relaxed font-light font-sans"
                  />

                  {/* Suggest premium stock images list helper */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                    <div className="flex items-center space-x-1.5 text-teal-900 font-bold text-[11px] uppercase tracking-wider">
                      <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>One-Click Premium Crop Images Helper</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                      Click any high-resolution scientific image preset below to immediately add it to your department gallery to test or populate:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SUGGESTED_IMAGES.map((preset, idx) => (
                        <button
                          type="button"
                          key={idx}
                          id={`preset-img-btn-${idx}`}
                          onClick={() => handleAddImageUrl(preset.url)}
                          className="flex items-center space-x-2 text-left p-2 rounded-xl bg-white border border-slate-150 hover:border-emerald-500 hover:bg-emerald-50/10 transition-all cursor-pointer group"
                        >
                          <img 
                            src={preset.url} 
                            alt={preset.caption} 
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 object-cover rounded-lg shrink-0 border border-slate-100" 
                          />
                          <div className="overflow-hidden space-y-0.5">
                            <span className="block text-[10px] font-bold text-slate-700 font-sans group-hover:text-emerald-800 truncate">{preset.category}</span>
                            <span className="block text-[9px] text-slate-400 truncate leading-none">{preset.caption}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gallery Images Editor (5 cols) */}
                <div className="lg:col-span-6 space-y-5">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Department Event & Lab Photos</h4>
                    <p className="text-[11px] text-slate-400 font-light">Add custom URLs to high-contrast student exhibits, laboratory setups, or outdoor field excursions.</p>
                  </div>

                  {/* Form to enter a custom Image URL manually & Device File Explorer picker */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        id="admin-new-img-url"
                        value={newImgUrl}
                        onChange={(e) => setNewImgUrl(e.target.value)}
                        placeholder="Paste image URL here..."
                        className="flex-1 bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all text-slate-800"
                      />
                      {newImgUrl.trim() && (
                        <button
                          type="button"
                          id="admin-add-url-btn"
                          onClick={() => handleAddImageUrl(newImgUrl)}
                          className="bg-teal-850 hover:bg-teal-900 text-teal-100 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer select-none"
                        >
                          Add URL
                        </button>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      id="admin-image-file-picker"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      id="admin-add-img-btn"
                      onClick={() => document.getElementById('admin-image-file-picker')?.click()}
                      className="w-full bg-slate-950 hover:bg-slate-800 text-slate-100 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer select-none inline-flex items-center justify-center space-x-1.5"
                    >
                      <ImageIcon className="h-4 w-4 text-emerald-400" />
                      <span>Add Image (Redirects to Device Explorer)</span>
                    </button>
                  </div>

                  {/* Roster list of existing images added */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400 block">Department Gallery roster</span>

                    {deptImageUrls.length === 0 ? (
                      <div className="text-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-slate-400 text-xs font-light">
                        No active gallery images added yet. Click on any of our one-click crop presets above to load professional snapshots, or paste clean URLs manually!
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3" id="admin-gallery-preview-grid">
                        {deptImageUrls.map((url, index) => (
                          <div 
                            key={index}
                            className="relative group border border-slate-150 rounded-2xl overflow-hidden bg-slate-50 aspect-video shadow-xs"
                          >
                            <img 
                              src={url} 
                              alt={`Department Snapshot #${index+1}`} 
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover transition-transform group-hover:scale-105" 
                            />
                            
                            {/* Hover info / Delete mask */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                              <span className="text-[10px] font-mono leading-tight">Image #{index+1}</span>
                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  id={`delete-dept-img-btn-${index}`}
                                  onClick={() => handleRemoveImageUrl(url)}
                                  className="p-1 px-2.5 bg-rose-600/90 hover:bg-rose-750 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                                  title="Remove image from gallery"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Sticky save bar/submit for Department */}
              <div className="border-t border-slate-100 pt-6 flex justify-end">
                <button
                  type="button"
                  id="admin-save-dept-btn"
                  disabled={isSavingDept}
                  onClick={handleSaveDepartment}
                  className="bg-teal-800 hover:bg-teal-950 text-teal-50 font-bold px-6 py-3 rounded-xl transition-all shadow hover:shadow-md cursor-pointer text-xs sm:text-sm inline-flex items-center space-x-1.5 disabled:opacity-50 select-none"
                >
                  {isSavingDept ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving configurations to cloud...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Save Department changes</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
}
