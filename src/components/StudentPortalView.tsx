/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  KeyRound, 
  User, 
  GraduationCap, 
  Bookmark, 
  BookmarkCheck, 
  BookOpen, 
  Download, 
  HelpCircle, 
  Eye, 
  CheckCircle2, 
  XCircle,
  RotateCcw,
  Clock,
  Sparkles,
  Award,
  BookMarked,
  Search
} from 'lucide-react';
import { STUDY_RESOURCES, SCIENCE_QUIZ, DEPARTMENTS_DATA } from '../data/collegeData';
import { StudyResource, Student, QuizQuestion } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface StudentPortalViewProps {
  loggedInStudent: Student | null;
  onLogin: (student: Student) => void;
  onLogout: () => void;
}

export default function StudentPortalView({
  loggedInStudent,
  onLogin,
  onLogout
}: StudentPortalViewProps) {
  
  // Login Form States
  const [formIsSignUp, setFormIsSignUp] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formName, setFormName] = useState('');
  const [formRoll, setFormRoll] = useState('');
  const [formDept, setFormDept] = useState('physics');
  const [formSem, setFormSem] = useState('Semester I');
  const [loginError, setLoginError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Active Tab inside Portal
  const [portalTab, setPortalTab] = useState<'resources' | 'quiz' | 'bookmarks'>('resources');

  // Resource viewer modal state
  const [activeResPreview, setActiveResPreview] = useState<StudyResource | null>(null);

  // Bookmarks state (persistent in localStorage or React state)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('thb_student_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Simulated download triggers
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [resourceSuccess, setResourceSuccess] = useState<string | null>(null);

  // Quiz States
  const [selectedQuizDept, setSelectedQuizDept] = useState('all');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizLogs, setQuizLogs] = useState<{ questionId: string; chosen: number; correct: boolean }[]>([]);

  // Search/Filters inside Core Resources Tab
  const [resSearchQuery, setResSearchQuery] = useState('');
  const [resTypeFilter, setResTypeFilter] = useState('all');
  const [resDeptFilter, setResDeptFilter] = useState('all');

  // Filter study resources
  const filteredResources = useMemo(() => {
    return STUDY_RESOURCES.filter((res) => {
      // If user is logged in, default to displaying resources matching their department
      // But let them search and filter wider resources as they desire
      const matchesSearch = res.title.toLowerCase().includes(resSearchQuery.toLowerCase()) ||
        res.author.toLowerCase().includes(resSearchQuery.toLowerCase());
      const matchesType = resTypeFilter === 'all' || res.type === resTypeFilter;
      
      // Smart default: if dept filter is "all", we check if we should display everything
      const matchesDept = resDeptFilter === 'all' || res.departmentId === resDeptFilter;

      return matchesSearch && matchesType && matchesDept;
    });
  }, [resSearchQuery, resTypeFilter, resDeptFilter]);

  // Quiz questions filtered
  const filteredQuizQuestions = useMemo(() => {
    return SCIENCE_QUIZ.filter((q) => {
      return selectedQuizDept === 'all' || q.departmentId === selectedQuizDept;
    });
  }, [selectedQuizDept]);

  // Toggle dynamic bookmarked state
  const handleToggleBookmark = (id: string) => {
    let nextBookmarks = [...bookmarkedIds];
    if (nextBookmarks.includes(id)) {
      nextBookmarks = nextBookmarks.filter(item => item !== id);
    } else {
      nextBookmarks.push(id);
    }
    setBookmarkedIds(nextBookmarks);
    localStorage.setItem('thb_student_bookmarks', JSON.stringify(nextBookmarks));
  };

  // Simulated Note Download handler
  const handleResourceDownload = (res: StudyResource) => {
    setIsDownloading(res.id);
    setTimeout(() => {
      setIsDownloading(null);
      setResourceSuccess(res.title);
      
      // locally bump counter
      res.downloadCount += 1;

      setTimeout(() => {
        setResourceSuccess(null);
      }, 3000);
    }, 1100);
  };

  // Sign In / Sign Up submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!formEmail.trim() || !formPassword.trim()) {
      setLoginError('Complete both Email and Password fields.');
      return;
    }

    if (formIsSignUp && (!formName.trim() || !formRoll.trim())) {
      setLoginError('Name and Roll Number are required for Sign Up.');
      return;
    }

    setFormLoading(true);

    try {
      const emailLower = formEmail.trim().toLowerCase();
      if (formIsSignUp) {
        // Register in firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, emailLower, formPassword);
        const user = userCredential.user;

        // Store student attributes in Firestore
        const profile = {
          name: formName.trim(),
          email: emailLower,
          rollNumber: formRoll.toUpperCase().trim(),
          departmentId: formDept,
          semester: formSem
        };

        try {
          await setDoc(doc(db, 'students', user.uid), profile);
        } catch (setErr) {
          handleFirestoreError(setErr, OperationType.WRITE, `students/${user.uid}`);
        }
        
        onLogin(profile);
        // Preset major filters
        setResDeptFilter(formDept);
      } else {
        // Authenticate standard user
        try {
          await signInWithEmailAndPassword(auth, emailLower, formPassword);
        } catch (signInErr: any) {
          if ((emailLower === 'kinetickali06@gmail.com' || emailLower === 'krishnavkashyap3@gmail.com') && formPassword === '123456') {
            // Auto-create admin account on first login
            const userCredential = await createUserWithEmailAndPassword(auth, emailLower, formPassword);
            const user = userCredential.user;
            const adminProfile = {
              name: emailLower === 'kinetickali06@gmail.com' ? "Kinetic Kali" : "Krishna Kashyap",
              email: emailLower,
              rollNumber: "ADMIN",
              departmentId: "all",
              semester: "All"
            };
            try {
              await setDoc(doc(db, 'students', user.uid), adminProfile);
            } catch (fsErr) {
              console.error("Failed to write admin profile doc:", fsErr);
            }
          } else {
            throw signInErr;
          }
        }
      }
      setLoginError('');
    } catch (err: any) {
      console.error("Auth action failed:", err);
      let errorMsg = 'Authentication failed. Please check credentials and try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered. Try signing in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMsg = 'Invalid email or password credentials.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setLoginError(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  // Quiz Handlers
  const handleStartQuiz = () => {
    if (filteredQuizQuestions.length === 0) return;
    setQuizStarted(true);
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizLogs([]);
  };

  const handleAnswerSelection = (idx: number) => {
    if (selectedAnswerIdx !== null) return; // already answered
    setSelectedAnswerIdx(idx);
    const currentQ = filteredQuizQuestions[currentQuestionIdx];
    const isCorrect = idx === currentQ.correctIndex;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    setQuizLogs(prev => [...prev, {
      questionId: currentQ.id,
      chosen: idx,
      correct: isCorrect
    }]);
  };

  const handleNextQuizQuestion = () => {
    if (currentQuestionIdx + 1 < filteredQuizQuestions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswerIdx(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setQuizScore(0);
    setQuizLogs([]);
  };

  const currentQuizPercent = useMemo(() => {
    if (filteredQuizQuestions.length === 0) return 0;
    return Math.round((quizScore / filteredQuizQuestions.length) * 100);
  }, [quizScore, filteredQuizQuestions]);

  return (
    <div id="student-portal-section" className="py-6 max-w-7xl mx-auto space-y-10">
      
      {/* Toast alert popup inside view */}
      {resourceSuccess && (
        <div 
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 rounded-2xl bg-teal-900 border border-teal-500/30 p-4 text-white shadow-2xl animate-bounce"
          id="portal-success-toast"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block text-teal-200">SAVED OFFLINE</span>
            <span className="font-semibold block max-w-xs truncate">{resourceSuccess}</span>
          </div>
        </div>
      )}

      {/* CASE A: STUDENT NOT LOGGED IN */}
      {!loggedInStudent ? (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Welcome promo left */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-display text-3xl font-extrabold text-slate-900 leading-tight">
              Access Specialized Notes, Syllabus & Take Quizzes
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              Enter your student details to activate your study portal. Signing in allows honors aspirants to:
              {"\n\n"}
              • Browse lecture notes written by your department faculty.
              {"\n"}
              • Access official Gauhati University CBCS B.Sc. syllabus structures.
              {"\n"}
              • Challenge yourself with our newly commissioned self-test science quizzes.
              {"\n"}
              • Bookmark important course materials to your personalized clipboard list.
            </p>
            
            <div className="border-t border-slate-100 pt-6 flex items-center gap-6">
              <div>
                <span className="font-display text-2xl font-bold text-slate-950">100%</span>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Free educational outreach</span>
              </div>
              <div className="border-l border-slate-200 h-8"></div>
              <div>
                <span className="font-display text-2xl font-bold text-slate-950">Self-Test</span>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Instant answers & analysis</span>
              </div>
            </div>
          </div>

          {/* Elegant Sign-In Form card */}
          <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="text-center space-y-1 mb-6">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500">
                <KeyRound className="h-5 w-5 text-teal-850" />
              </div>
              <h4 className="font-display text-lg font-bold text-slate-900">Student Portal Login</h4>
              <p className="text-xs text-slate-500">Sign in or register security credentials matching your profile</p>
            </div>

            {/* Toggle Switch between Sign In / Sign Up */}
            <div className="flex border-b border-slate-100 mb-6">
              <button
                type="button"
                id="portal-toggle-signin"
                className={`flex-1 pb-3 text-xs font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
                  !formIsSignUp
                    ? 'border-teal-805 text-teal-950 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
                onClick={() => {
                  setFormIsSignUp(false);
                  setLoginError('');
                }}
                disabled={formLoading}
              >
                Sign In
              </button>
              <button
                type="button"
                id="portal-toggle-signup"
                className={`flex-1 pb-3 text-xs font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
                  formIsSignUp
                    ? 'border-teal-805 text-teal-950 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
                onClick={() => {
                  setFormIsSignUp(true);
                  setLoginError('');
                }}
                disabled={formLoading}
              >
                Sign Up & Register
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4" id="student-login-form">
              {loginError && (
                <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-center">
                  {loginError}
                </div>
              )}

              {/* Sign Up specific fields */}
              {formIsSignUp && (
                <>
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-705 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 text-slate-450" />
                      <input
                        type="text"
                        id="login-name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Enter your name..."
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-700 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none transition-all text-slate-800"
                        required
                        disabled={formLoading}
                      />
                    </div>
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-705 block">College Roll Number</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-4 text-slate-450" />
                      <input
                        type="text"
                        id="login-roll"
                        value={formRoll}
                        onChange={(e) => setFormRoll(e.target.value)}
                        placeholder="e.g. S-2024-41"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-700 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none transition-all text-slate-800"
                        required
                        disabled={formLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Department Select */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 block">Honors Major</label>
                      <select
                        id="login-dept"
                        value={formDept}
                        onChange={(e) => setFormDept(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none transition-all text-slate-800 cursor-pointer"
                        disabled={formLoading}
                      >
                        {DEPARTMENTS_DATA.map(d => (
                          <option key={d.id} value={d.id}>{d.name.replace('Department of ', '')}</option>
                        ))}
                      </select>
                    </div>

                    {/* Semester Select */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 block">Semester</label>
                      <select
                        id="login-sem"
                        value={formSem}
                        onChange={(e) => setFormSem(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none transition-all text-slate-800 cursor-pointer"
                        disabled={formLoading}
                      >
                        <option value="Semester I">Semester I</option>
                        <option value="Semester II">Semester II</option>
                        <option value="Semester III">Semester III</option>
                        <option value="Semester IV">Semester IV</option>
                        <option value="Semester V">Semester V</option>
                        <option value="Semester VI">Semester VI</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Shared security fields */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-705 block">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="student@thbcollege.ac.in"
                  className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none transition-all text-slate-800"
                  required
                  disabled={formLoading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-705 block">Security Password</label>
                <input
                  type="password"
                  id="login-password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none transition-all text-slate-800"
                  required
                  disabled={formLoading}
                />
              </div>

              <button
                type="submit"
                id="btn-login-submit"
                className="w-full bg-teal-800 hover:bg-teal-900 text-teal-50 font-bold py-3 rounded-xl transition-all shadow hover:shadow-md mt-4 cursor-pointer select-none text-xs sm:text-sm disabled:opacity-50"
                disabled={formLoading}
              >
                {formLoading
                  ? (formIsSignUp ? 'Registering Student...' : 'Authenticating...')
                  : (formIsSignUp ? 'Register & Enter Student Station' : 'Sign In To Student Station')
                }
              </button>
            </form>
          </div>
        </section>
      ) : (
        /* CASE B: STUDENT IS SIGNED IN (DASHBOARD DISPLAY) */
        <div className="space-y-8" id="student-portal-dashboard">
          
          {/* Dashboard Header Bar */}
          <div className="bg-white border border-slate-105 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                Study Station Dashboard
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                Welcome back, {loggedInStudent.name}!
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600 font-medium font-light">
                <span>Roll: <strong className="text-slate-900 font-mono">{loggedInStudent.rollNumber}</strong></span>
                <span>•</span>
                <span>Major: <strong className="text-slate-900 capitalize">{loggedInStudent.departmentId}</strong></span>
                <span>•</span>
                <span>Class: <strong className="text-teal-850">{loggedInStudent.semester}</strong></span>
              </div>
            </div>

            {/* Change Profile action buttons */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                id="btn-switch-tab-res"
                onClick={() => setPortalTab(portalTab === 'resources' ? 'quiz' : 'resources')}
                className="flex-1 md:flex-none text-center bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold px-4 py-2.5 rounded-xl border border-teal-100 transition-all select-none cursor-pointer"
              >
                {portalTab === 'resources' ? 'Switch to Quizzes' : 'Access Study notes'}
              </button>
              <button
                id="btn-signout-inside"
                onClick={onLogout}
                className="text-xs font-bold border border-rose-100 text-rose-500 bg-rose-50/50 hover:bg-rose-50 hover:text-rose-600 px-4 py-2.5 rounded-xl transition-colors cursor-pointer select-none"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Sub Navigation Inside Portal */}
          <div className="flex border-b border-slate-200" id="portal-sub-nav">
            <button
              onClick={() => setPortalTab('resources')}
              id="subtab-resources"
              className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                portalTab === 'resources'
                  ? 'border-teal-800 text-teal-950'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Study Materials Center
            </button>
            <button
              onClick={() => setPortalTab('quiz')}
              id="subtab-quiz"
              className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                portalTab === 'quiz'
                  ? 'border-teal-800 text-teal-950'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Interactive Self-Test Quizzes
            </button>
            <button
              onClick={() => setPortalTab('bookmarks')}
              id="subtab-bookmarks"
              className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                portalTab === 'bookmarks'
                  ? 'border-teal-800 text-teal-950'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Bookmark className="h-4 w-4 shrink-0" />
              <span>Bookmarked Notes ({bookmarkedIds.length})</span>
            </button>
          </div>

          {/* SUB-VIEW 1: STUDY MATERIALS AND COURSE NOTES EXPLORATION */}
          {portalTab === 'resources' && (
            <div className="space-y-6" id="portal-resources-engine">
              
              {/* Internal filters */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row items-center gap-4">
                
                {/* Text search */}
                <div className="relative w-full md:flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    id="res-search-field"
                    placeholder="Search by topic title or faculty author..."
                    value={resSearchQuery}
                    onChange={(e) => setResSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-teal-700 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-slate-400 text-slate-800"
                  />
                </div>

                {/* Scope Selection filter */}
                <div className="flex gap-2 w-full md:w-auto">
                  <select
                    id="res-filter-dept"
                    value={resDeptFilter}
                    onChange={(e) => setResDeptFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer flex-1 md:flex-none text-slate-705 text-slate-800"
                  >
                    <option value="all">All Departments</option>
                    {DEPARTMENTS_DATA.map(d => (
                      <option key={d.id} value={d.id}>{d.name.replace('Department of ', '')}</option>
                    ))}
                  </select>

                  <select
                    id="res-filter-type"
                    value={resTypeFilter}
                    onChange={(e) => setResTypeFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer flex-1 md:flex-none text-slate-705 text-slate-800"
                  >
                    <option value="all">All Materials</option>
                    <option value="Note">Lecture Notes</option>
                    <option value="Syllabus">GU Syllabus</option>
                    <option value="Lab Manual">Lab Manuals</option>
                  </select>
                </div>

              </div>

              {/* Resources list cards */}
              {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="resources-cards-grid">
                  {filteredResources.map((res) => {
                    const isBookmarked = bookmarkedIds.includes(res.id);
                    const isResDownloading = isDownloading === res.id;
                    const resDept = DEPARTMENTS_DATA.find(d => d.id === res.departmentId);

                    return (
                      <div
                        key={res.id}
                        id={`resource-portal-card-${res.id}`}
                        className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-teal-200 transition-colors"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-teal-850 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                              {res.type}
                            </span>
                            
                            <button
                              id={`btn-bookmark-resource-${res.id}`}
                              onClick={() => handleToggleBookmark(res.id)}
                              className="text-slate-400 hover:text-teal-800 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                              title={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="h-5 w-5 text-teal-700 fill-teal-700" />
                              ) : (
                                <Bookmark className="h-5 w-5" />
                              )}
                            </button>
                          </div>

                          <div>
                            <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base leading-snug">
                              {res.title}
                            </h4>
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight mt-1">
                              Prepared by {res.author} · {resDept?.name || 'Science Division'}
                            </p>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {res.description}
                          </p>
                        </div>

                        {/* Resource stats & buttons */}
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="text-[11px] text-slate-400 space-y-0.5">
                            <span className="block font-mono">Downloads: {res.downloadCount} times</span>
                            <span className="block italic">File Size: {res.fileSize}</span>
                          </div>

                          <div className="flex space-x-2">
                            {/* Preview button */}
                            {res.contentPreview && (
                              <button
                                id={`btn-preview-res-${res.id}`}
                                onClick={() => setActiveResPreview(res)}
                                className="flex items-center space-x-1 border border-slate-200 hover:border-teal-700 bg-white hover:bg-teal-50/20 text-slate-700 hover:text-teal-900 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Study / Read</span>
                              </button>
                            )}

                            <button
                              id={`btn-dl-res-${res.id}`}
                              disabled={isResDownloading}
                              onClick={() => handleResourceDownload(res)}
                              className={`flex items-center space-x-1 text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                                isResDownloading
                                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                  : 'bg-teal-800 hover:bg-teal-950 text-teal-50 border-transparent'
                              }`}
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>{isResDownloading ? 'Saving...' : 'Get PDF'}</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center max-w-md mx-auto space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-sm">No study resources found</h4>
                    <p className="text-xs text-slate-500 mt-1">Try switching departments filter or searching other semesters.</p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* SUB-VIEW 2: THE SELF-TEST SCIENCE QUIZ ENGINE */}
          {portalTab === 'quiz' && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="portal-quiz-engine">
              
              {!quizStarted ? (
                /* QUIZ PRE-START SCREEN */
                <div className="max-w-2xl mx-auto space-y-6 text-center py-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-800">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                      THB Science Self-Assessment Board
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                      Test your core honors understanding with peerless multiple-choice test questions generated directly from quantum, thermodynamics, and modular code algorithms.
                    </p>
                  </div>

                  {/* Filter select to configure quiz department */}
                  <div className="max-w-xs mx-auto space-y-1">
                    <label className="text-xs font-bold text-slate-600 block text-left">Target Subject Area</label>
                    <select
                      id="quiz-subject-select"
                      value={selectedQuizDept}
                      onChange={(e) => setSelectedQuizDept(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none transition-all text-slate-800 cursor-pointer"
                    >
                      <option value="all">All Combined Sciences</option>
                      {DEPARTMENTS_DATA.map(d => (
                        <option key={d.id} value={d.id}>{d.name.replace('Department of ', '')}</option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-400 block text-left">
                      Currently {filteredQuizQuestions.length} practice questions loaded
                    </span>
                  </div>

                  <button
                    id="btn-start-quiz"
                    onClick={handleStartQuiz}
                    disabled={filteredQuizQuestions.length === 0}
                    className="bg-teal-800 hover:bg-teal-900 text-teal-50 font-semibold px-6 py-3 rounded-xl transition-all shadow cursor-pointer text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    Launch Interactive Test
                  </button>
                </div>
              ) : quizFinished ? (
                /* QUIZ FINISHED RESULTS SCREEN */
                <div className="max-w-md mx-auto text-center py-8 space-y-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-800 border-2 border-teal-100">
                    <Award className="h-8 w-8 text-teal-700" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-display text-xl font-bold text-slate-900">Quiz Completed!</h4>
                    <p className="text-xs text-slate-500">Your custom scientific score breakdown:</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2">
                    <span className="font-display text-4xl font-extrabold text-teal-950 block">
                      {quizScore} / {filteredQuizQuestions.length}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block">
                      Score: {currentQuizPercent}%
                    </span>
                  </div>

                  {/* Motivational comment */}
                  <p className="text-xs text-slate-600 italic">
                    {currentQuizPercent === 100 
                      ? "Outstanding master of science concepts! Excellent academic grounding."
                      : currentQuizPercent >= 60 
                      ? "Competent scientific foundation. Keep reading your course notes for perfection."
                      : "Good effort! Revise the syllabus sections and try again."}
                  </p>

                  <div className="flex gap-3 justify-center">
                    <button
                      id="btn-quiz-retry"
                      onClick={handleStartQuiz}
                      className="bg-teal-800 hover:bg-teal-950 text-teal-50 text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow hover:shadow-md cursor-pointer inline-flex items-center space-x-2"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Test Again</span>
                    </button>
                    <button
                      id="btn-quiz-exit-results"
                      onClick={handleResetQuiz}
                      className="border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Change Subject
                    </button>
                  </div>
                </div>
              ) : (
                /* QUIZ QUESTION IN PROGRESS SCREEN */
                <div className="max-w-2xl mx-auto space-y-6" id="quiz-active-block">
                  
                  {/* Progress tracker */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs text-slate-400 font-mono">
                      Question {currentQuestionIdx + 1} of {filteredQuizQuestions.length}
                    </span>
                    <span className="text-xs font-semibold uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded-sm">
                      {filteredQuizQuestions[currentQuestionIdx].departmentId} Unit
                    </span>
                  </div>

                  {/* The actual question */}
                  <h4 className="font-display font-bold text-slate-900 text-base sm:text-lg leading-snug">
                    {filteredQuizQuestions[currentQuestionIdx].question}
                  </h4>

                  {/* Option Lists */}
                  <div className="space-y-2.5">
                    {filteredQuizQuestions[currentQuestionIdx].options.map((option, idx) => {
                      const isSelected = selectedAnswerIdx === idx;
                      const isCorrect = idx === filteredQuizQuestions[currentQuestionIdx].correctIndex;
                      
                      // Formatting colors post-answer click
                      let optionStyle = 'bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-800';
                      if (selectedAnswerIdx !== null) {
                        if (isCorrect) {
                          optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold';
                        } else if (isSelected) {
                          optionStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                        } else {
                          optionStyle = 'opacity-60 bg-slate-50 border-slate-150 text-slate-400';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-teal-50 border-teal-300 text-teal-950 font-semibold';
                      }

                      return (
                        <button
                          key={idx}
                          id={`quiz-option-${idx}`}
                          disabled={selectedAnswerIdx !== null}
                          onClick={() => handleAnswerSelection(idx)}
                          className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all focus:outline-none flex items-start space-x-3 cursor-pointer ${optionStyle}`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold leading-none uppercase">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Correct/Incorrect Explanation Banner */}
                  {selectedAnswerIdx !== null && (
                    <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-2 animate-fadeIn transition-all">
                      <div className="flex items-center space-x-2">
                        {selectedAnswerIdx === filteredQuizQuestions[currentQuestionIdx].correctIndex ? (
                          <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wide">
                            <CheckCircle2 className="h-4.5 w-4.5" />
                            <span>Correct Answer!</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5 text-rose-600 font-bold text-xs uppercase tracking-wide">
                            <XCircle className="h-4.5 w-4.5" />
                            <span>Incorrect Response</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        <strong className="text-slate-807 font-semibold">Diagnostic analysis: </strong>
                        {filteredQuizQuestions[currentQuestionIdx].explanation}
                      </p>

                      <div className="flex justify-end pt-3">
                        <button
                          id="btn-quiz-next"
                          onClick={handleNextQuizQuestion}
                          className="bg-slate-950 text-slate-50 text-xs font-bold px-5 py-2 rounded-xl hover:bg-slate-800 transition-all select-none cursor-pointer"
                        >
                          {currentQuestionIdx + 1 < filteredQuizQuestions.length ? 'Next Question' : 'View Core score'}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* SUB-VIEW 3: PRIVATE BOOKBOOK/CLIPBOARD COLLECTION */}
          {portalTab === 'bookmarks' && (
            <div className="space-y-6" id="portal-bookmarks-engine">
              <div className="flex items-center space-x-2 text-teal-950 mb-2">
                <BookMarked className="h-5 w-5 text-teal-800" />
                <h4 className="font-display text-lg font-bold">Your Bookmarked Study syllabus and lecture notes</h4>
              </div>

              {bookmarkedIds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {STUDY_RESOURCES.filter(r => bookmarkedIds.includes(r.id)).map((res) => {
                    const resDept = DEPARTMENTS_DATA.find(d => d.id === res.departmentId);
                    return (
                      <div
                        key={res.id}
                        id={`bookmark-card-item-${res.id}`}
                        className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-teal-200 transition-colors"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-100 px-2 py-0.5 rounded-sm">
                              {res.type}
                            </span>
                            <button
                              id={`btn-remove-bookmark-${res.id}`}
                              onClick={() => handleToggleBookmark(res.id)}
                              className="text-teal-700 hover:text-rose-600 text-xs font-semibold hover:underline"
                            >
                              Remove bookmark
                            </button>
                          </div>
                          
                          <h5 className="font-bold text-slate-800 text-sm leading-snug">{res.title}</h5>
                          <p className="text-[11px] text-slate-450 font-semibold uppercase tracking-tight">
                            Prepared by {res.author} · {resDept?.name || 'Science'}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end space-x-2">
                          {res.contentPreview && (
                            <button
                              id={`bookmark-preview-btn-${res.id}`}
                              onClick={() => setActiveResPreview(res)}
                              className="text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              Read Note
                            </button>
                          )}
                          <button
                            id={`bookmark-dl-btn-${res.id}`}
                            onClick={() => handleResourceDownload(res)}
                            className="bg-teal-850 text-teal-50 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-teal-950 transition-colors"
                          >
                            PDF Download
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                    <Bookmark className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-slate-900 text-sm">No bookmarked material yet</h5>
                    <p className="text-xs text-slate-500 mt-1">Browse study resources inside the materials center and click the bookmark ribbon key to register notes here.</p>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* Resource content preview full modal */}
      {activeResPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" id="resource-preview-modal">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal sticky top banner */}
            <div className="bg-slate-900 text-white p-6 flex justify-between items-start shrink-0">
              <div className="space-y-1">
                <span className="text-[9px] font-bold bg-teal-500 text-slate-950 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Course Material: {activeResPreview.type}
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold tracking-tight line-clamp-1">
                  {activeResPreview.title}
                </h3>
                <p className="text-xs text-slate-300">Authored by {activeResPreview.author}</p>
              </div>

              <button
                id="btn-close-preview-modal"
                onClick={() => setActiveResPreview(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Preview Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm" id="res-preview-body">
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4">
                <p className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-wider text-slate-500">Resource Context</p>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{activeResPreview.description}</p>
              </div>

              {/* Formatted body text representing beautiful markdown */}
              <div className="prose max-w-none text-slate-800">
                <div className="p-4 bg-teal-50/20 border border-teal-100 rounded-2xl font-mono text-xs text-teal-900 mb-4 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-teal-800 shrink-0" />
                  <span>Interactive Class note study workbook - Compiled following Gauhati University syllabus.</span>
                </div>
                
                {/* Content text */}
                <div className="whitespace-pre-wrap leading-relaxed font-light font-sans text-sm space-y-4">
                  {activeResPreview.contentPreview}
                </div>
              </div>
            </div>

            {/* Modal Bottom banner */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500">
                Filesize check: <strong className="font-medium text-slate-800">{activeResPreview.fileSize}</strong>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleBookmark(activeResPreview.id)}
                  className="bg-white border border-slate-200 hover:border-teal-700 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  {bookmarkedIds.includes(activeResPreview.id) ? 'Bookmarked' : 'Add to Bookmarks'}
                </button>
                <button
                  onClick={() => handleResourceDownload(activeResPreview)}
                  className="bg-teal-800 hover:bg-teal-900 text-teal-50 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Download complete PDF
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
