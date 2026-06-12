/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import DepartmentsView from './components/DepartmentsView';
import PreviousQuestionsView from './components/PreviousQuestionsView';
import StudentPortalView from './components/StudentPortalView';
import AdminPortalView from './components/AdminPortalView';
import { Student } from './types';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  Lock,
  Compass,
  GraduationCap
} from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('physics');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const emailLower = firebaseUser.email?.toLowerCase();
          if (emailLower === 'kinetickali06@gmail.com' || emailLower === 'krishnavkashyap3@gmail.com') {
            setLoggedInStudent({
              name: emailLower === 'kinetickali06@gmail.com' ? "Kinetic Kali" : "Krishna Kashyap",
              email: emailLower,
              rollNumber: "ADMIN",
              departmentId: "all",
              semester: "All",
              isAdmin: true
            });
            return;
          }

          const docRef = doc(db, 'students', firebaseUser.uid);
          let docSnap;
          try {
            docSnap = await getDoc(docRef);
          } catch (getErr) {
            handleFirestoreError(getErr, OperationType.GET, `students/${firebaseUser.uid}`);
            return;
          }

          if (docSnap.exists()) {
            const data = docSnap.data();
            setLoggedInStudent({
              name: data.name,
              email: data.email || firebaseUser.email || '',
              rollNumber: data.rollNumber,
              departmentId: data.departmentId,
              semester: data.semester
            });
          } else {
            setLoggedInStudent({
              name: firebaseUser.displayName || 'Guest Student',
              email: firebaseUser.email || '',
              rollNumber: 'N/A',
              departmentId: 'physics',
              semester: 'Semester I'
            });
          }
        } catch (err) {
          console.error("Error fetching student profile from Firestore:", err);
        }
      } else {
        setLoggedInStudent(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Scroll to top upon tab changing
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Handle Login session
  const handleLogin = (student: Student) => {
    setLoggedInStudent(student);
    setIsLoginModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedInStudent(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // State controls for modal login inputs
  const [modalIsSignUp, setModalIsSignUp] = useState(false); // Switch between Sign In and Sign Up
  const [modalEmail, setModalEmail] = useState('');
  const [modalPassword, setModalPassword] = useState('');
  const [modalName, setModalName] = useState('');
  const [modalRoll, setModalRoll] = useState('');
  const [modalDept, setModalDept] = useState('physics');
  const [modalSem, setModalSem] = useState('Semester I');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!modalEmail.trim() || !modalPassword.trim()) {
      setModalError('Please enter email and password.');
      return;
    }

    if (modalIsSignUp && (!modalName.trim() || !modalRoll.trim())) {
      setModalError('All fields (Name, Roll, Department, Semester) are required for Sign Up.');
      return;
    }

    setModalLoading(true);

    try {
      const emailLower = modalEmail.trim().toLowerCase();
      if (modalIsSignUp) {
        // Sign up logic with Firebase Auth & Firestore
        const userCredential = await createUserWithEmailAndPassword(auth, emailLower, modalPassword);
        const user = userCredential.user;

        // Store profile details securely in Firestore students collection
        const studentProfile = {
          name: modalName.trim(),
          email: emailLower,
          rollNumber: modalRoll.toUpperCase().trim(),
          departmentId: modalDept,
          semester: modalSem
        };

        try {
          await setDoc(doc(db, 'students', user.uid), studentProfile);
        } catch (setErr) {
          handleFirestoreError(setErr, OperationType.WRITE, `students/${user.uid}`);
        }
        
        handleLogin({
          ...studentProfile
        });
      } else {
        // Sign In logic
        try {
          await signInWithEmailAndPassword(auth, emailLower, modalPassword);
        } catch (signInErr: any) {
          if ((emailLower === 'kinetickali06@gmail.com' || emailLower === 'krishnavkashyap3@gmail.com') && modalPassword === '123456') {
            // Auto-create admin account on first login
            const userCredential = await createUserWithEmailAndPassword(auth, emailLower, modalPassword);
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
        setIsLoginModalOpen(false);
      }
      
      // Reset Modal input states
      setModalEmail('');
      setModalPassword('');
      setModalName('');
      setModalRoll('');
      setModalError('');
    } catch (err: any) {
      console.error("Auth action failed:", err);
      let errorMsg = 'Authentication failed. Please check your network and credentials.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered. Please login instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMsg = 'Invalid email or password.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setModalError(errorMsg);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div id="website-app-shell" className="min-h-screen bg-[#FAFBFB] flex flex-col justify-between font-sans">
      
      {/* 1. Navbar Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        loggedInStudent={loggedInStudent}
        onLogout={handleLogout}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* 2. Primary Page Content Switch */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {currentTab === 'home' && (
          <HomeView 
            setCurrentTab={setCurrentTab} 
            setSelectedDepartmentId={setSelectedDepartmentId} 
          />
        )}

        {currentTab === 'departments' && (
          <DepartmentsView 
            selectedDepartmentId={selectedDepartmentId}
            setSelectedDepartmentId={setSelectedDepartmentId}
          />
        )}

        {currentTab === 'questions' && (
          <PreviousQuestionsView />
        )}

        {currentTab === 'portal' && (
          <StudentPortalView 
            loggedInStudent={loggedInStudent}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        )}

        {currentTab === 'admin' && loggedInStudent?.isAdmin && (
          <AdminPortalView 
            loggedInStudent={loggedInStudent}
            onLogout={handleLogout}
          />
        )}

      </main>

      {/* 3. Footer Block */}
      <footer className="bg-teal-950 border-t border-teal-900 text-teal-200 text-xs sm:text-sm mt-16" id="college-footer">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top segment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Campus Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-800 text-teal-50">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="font-display font-bold tracking-tight text-white text-base">
                  THB College
                </span>
              </div>
              <p className="text-teal-300 leading-relaxed font-light">
                Tyagbir Hem Baruah College is a premier higher academic center established at Jamugurihat, Assam, empowering rural progression through the scientific vision of national builders.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2 text-teal-300">
                  <MapPin className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Karchola, Jamugurihat, Sonitpur, Assam - 784180</span>
                </div>
              </div>
            </div>

            {/* Official Coordinates */}
            <div className="space-y-4">
              <h4 className="font-display text-white font-bold tracking-wider uppercase text-xs pt-1.5 border-b border-teal-900 pb-2">
                Administrative Contacts
              </h4>
              <p className="text-teal-300 font-light leading-relaxed">
                For administrative issues relative to admission lists or roll number allocation:
              </p>
              <div className="space-y-2 pt-1.5 text-teal-300">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span> +91 7002186618 </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>tyagabirhbcollege1963@gmail.com</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom attribution segment */}
          <div className="border-t border-teal-900/60 pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 text-teal-400">
            <div className="space-y-1">
              <p>© {new Date().getFullYear()} Tyagbir Hem Baruah College. Science Stream Division. All Rights Reserved.</p>
              <p className="text-[10px] text-teal-500">Permanently Affiliated with Gauhati University. Recognized under section 2(f) & 12(B) of UGC Act.</p>
              
              {/* Developer Details i.e. Kinetic kali */}
              <div className="pt-2.5 text-[11px] text-teal-300/90 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans">
                <span>Developed by <strong className="text-white hover:text-emerald-400 transition-colors font-bold">Kinetic kali</strong></span>
                <span className="text-teal-800">•</span>
                <a 
                  href="https://www.linkedin.com/in/krishnav-kashyap-a6a2ba3a0" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-emerald-400 underline underline-offset-2 transition-all"
                >
                  <span>www.linkedin.com/in/krishnav-kashyap-a6a2ba3a0</span>
                </a>
                <span className="text-teal-800">•</span>
                <a 
                  href="mailto:kinetickali06@gmail.com" 
                  className="hover:text-emerald-400 underline underline-offset-2 transition-all"
                >
                  <span>kinetickali06@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-[11px] shrink-0">
              <a 
                href="https://thbcollege.in" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-teal-200 transition-colors inline-flex items-center space-x-1"
              >
                <span>Main College Website</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* 4. MODAL LOGIN COMPONENT (TRIGGERED FROM MENU NAVBAR ACTION) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" id="navbar-login-modal">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 text-teal-805">
                <Lock className="h-5 w-5" />
                <span className="font-display font-bold text-slate-900 text-lg">Student Login</span>
              </div>
              <button
                id="btn-close-navbar-login-modal"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setModalError('');
                }}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                disabled={modalLoading}
              >
                ✕
              </button>
            </div>

            {/* Toggle Switch between Sign In / Sign Up */}
            <div className="flex border-b border-slate-100 my-4">
              <button
                type="button"
                id="modal-toggle-signin"
                className={`flex-1 pb-2.5 text-xs font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
                  !modalIsSignUp
                    ? 'border-teal-850 text-teal-950 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
                onClick={() => {
                  setModalIsSignUp(false);
                  setModalError('');
                }}
                disabled={modalLoading}
              >
                Sign In
              </button>
              <button
                type="button"
                id="modal-toggle-signup"
                className={`flex-1 pb-2.5 text-xs font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
                  modalIsSignUp
                    ? 'border-teal-850 text-teal-950 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
                onClick={() => {
                  setModalIsSignUp(true);
                  setModalError('');
                }}
                disabled={modalLoading}
              >
                Sign Up & Register
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 font-normal leading-relaxed">
              {modalIsSignUp 
                ? "Create a secure account on THB College network to access resources, save sessional notes, and track your quiz progress."
                : "Sign in using your student email and password secure credentials."}
            </p>

            {/* Form */}
            <form onSubmit={handleModalSubmit} className="space-y-4.5" id="modal-login-form">
              {modalError && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-center font-semibold">
                  {modalError}
                </div>
              )}

              {/* Sign Up specific fields */}
              {modalIsSignUp && (
                <>
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Student Name</label>
                    <input
                      type="text"
                      id="modal-login-name-input"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      placeholder="e.g. Krishna Kashyap"
                      className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all text-slate-800"
                      required
                      disabled={modalLoading}
                    />
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Roll Number</label>
                    <input
                      type="text"
                      id="modal-login-roll-input"
                      value={modalRoll}
                      onChange={(e) => setModalRoll(e.target.value)}
                      placeholder="e.g. S-2024-41"
                      className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2.5 text-xs text-slate-800 uppercase outline-none transition-all font-mono"
                      required
                      disabled={modalLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Department Select */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-705 block">Major</label>
                      <select
                        id="modal-login-dept-select"
                        value={modalDept}
                        onChange={(e) => setModalDept(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 cursor-pointer"
                        disabled={modalLoading}
                      >
                        {['physics', 'chemistry', 'mathematics', 'botany', 'zoology'].map((id) => (
                          <option key={id} value={id}>{id.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    {/* Semester Select */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-705 block">Semester</label>
                      <select
                        id="modal-login-sem-select"
                        value={modalSem}
                        onChange={(e) => setModalSem(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 cursor-pointer"
                        disabled={modalLoading}
                      >
                        {['Semester I', 'Semester II', 'Semester III', 'Semester IV', 'Semester V', 'Semester VI'].map((sem) => (
                          <option key={sem} value={sem}>{sem}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Shared Credentials */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                <input
                  type="email"
                  id="modal-login-email-input"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  placeholder="student@thbcollege.ac.in"
                  className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all text-slate-800"
                  required
                  disabled={modalLoading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Security Password</label>
                <input
                  type="password"
                  id="modal-login-password-input"
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-205 focus:border-teal-700 focus:bg-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all text-slate-800"
                  required
                  disabled={modalLoading}
                />
              </div>

              <button
                type="submit"
                id="btn-modal-login-submit"
                className="w-full bg-teal-800 hover:bg-teal-900 text-teal-50 font-bold py-3 rounded-xl transition-all shadow hover:shadow-md mt-4 cursor-pointer select-none text-xs sm:text-sm disabled:opacity-50"
                disabled={modalLoading}
              >
                {modalLoading 
                  ? (modalIsSignUp ? 'Creating Account & Profile...' : 'Signing In...')
                  : (modalIsSignUp ? 'Create Account & Register' : 'Sign In To Account')
                }
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

