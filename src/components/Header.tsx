/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LogIn, LogOut, Menu, X, User } from 'lucide-react';
import { Student } from '../types';
import CrestLogo from './CrestLogo';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  loggedInStudent: Student | null;
  onLogout: () => void;
  onOpenLoginModal: () => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  loggedInStudent,
  onLogout,
  onOpenLoginModal
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'departments', label: 'Departments' },
    { id: 'questions', label: 'Previous Questions' },
    { id: 'portal', label: 'Student Portal & Resources' }
  ];

  if (loggedInStudent?.isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Desk' });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-teal-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand/logo element */}
        <div 
          onClick={() => setCurrentTab('home')} 
          className="flex cursor-pointer items-center space-x-3 group"
          id="nav-brand-logo"
        >
          <CrestLogo size={46} className="text-teal-800 transition-transform group-hover:scale-105" />
          <div>
            <h1 className="font-display text-base font-bold tracking-tight text-teal-950 sm:text-lg">
              Tyagbir Hem Baruah College
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              Science Division
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1" id="desktop-nav">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-900 border-b-2 border-teal-700'
                    : 'text-slate-600 hover:text-teal-800 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button: Student Login State */}
        <div className="hidden md:flex items-center space-x-3" id="desktop-actions">
          {loggedInStudent ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 rounded-full bg-teal-50 px-3 py-1.5 border border-teal-100 text-teal-900 text-xs font-medium">
                <User className="h-3.5 w-3.5 text-teal-600" />
                <span>Hi, {loggedInStudent.name.split(' ')[0]}</span>
              </div>
              <button
                id="btn-logout-desktop"
                onClick={onLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 border border-slate-200 rounded-lg bg-white hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              id="btn-login-desktop"
              onClick={onOpenLoginModal}
              className="flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 text-teal-50 text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Student Sign-In</span>
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center space-x-2" id="mobile-controls">
          {loggedInStudent && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-teal-900 border border-teal-100 text-xs font-semibold">
              {loggedInStudent.name.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 rounded-md"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 px-4 pt-2 pb-4 space-y-2 shadow-lg" id="mobile-nav-drawer">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-tab-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2.5 text-base font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-900 border-l-4 border-teal-800'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="border-t border-slate-100 pt-3 flex flex-col space-y-2">
            {loggedInStudent ? (
              <div className="space-y-2 px-3">
                <div className="text-sm font-semibold text-slate-700">
                  Signed in as <span className="text-teal-800">{loggedInStudent.name}</span>
                </div>
                <button
                  id="btn-logout-mobile"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-lg transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-login-mobile"
                onClick={() => {
                  onOpenLoginModal();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center space-x-2 bg-teal-800 text-teal-50 px-4 py-2.5 text-sm font-semibold rounded-lg hover:bg-teal-950 transition-all shadow"
              >
                <LogIn className="h-4 w-4" />
                <span>Student Sign-In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
