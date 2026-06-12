/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FacultyMember {
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  contact?: string;
  avatarUrl?: string;
}

export interface Department {
  id: string; // e.g. 'physics', 'chemistry'
  name: string;
  description: string;
  hodName: string;
  establishedYear?: number;
  faculties: FacultyMember[];
  labs: string[];
  careerProspects: string[];
  achievements: string[];
  studentCount?: number;
  syllabus?: {
    title: string;
    pdfUrl: string;
    fileSize: string;
    modules: string[];
  };
}

export interface QuestionPaper {
  id: string;
  subject: string;
  departmentId: string;
  semester: string; // 'Semester I' | 'Semester II' etc.
  year: number;
  examType: 'End-Semester Exam' | 'Sessional Exam' | 'Practical Exam';
  fileSize: string;
  downloads: number;
  documentUrl?: string;
}

export interface StudyResource {
  id: string;
  title: string;
  departmentId: string;
  semester: string;
  type: 'Note' | 'Syllabus' | 'Lab Manual' | 'Lecture Note';
  author: string;
  description: string;
  downloadCount: number;
  fileSize: string;
  contentPreview?: string; // Markdown or bullet points to preview
}

export interface QuizQuestion {
  id: string;
  departmentId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: 'Academic' | 'Exam' | 'Admission' | 'Event';
  isImportant?: boolean;
}

export interface Student {
  name: string;
  email?: string;
  rollNumber: string;
  semester: string;
  departmentId: string;
  isAdmin?: boolean;
}
