/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { QuestionPaper } from '../types';
import { QUESTION_PAPERS } from '../data/collegeData';

export interface DepartmentCustomization {
  id: string;
  customDescription?: string;
  imageUrls?: string[];
}

/**
 * Fetch all question papers from Firestore, seeding them with initial data if empty.
 */
export async function getQuestionPapersFromFirestore(currentUserEmail?: string): Promise<QuestionPaper[]> {
  const collectionPath = 'question_papers';
  let snapshot;
  try {
    const qCol = collection(db, collectionPath);
    snapshot = await getDocs(qCol);
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
  
  try {
    if (snapshot.empty) {
      const emailLower = (currentUserEmail || auth.currentUser?.email || '').toLowerCase();
      // Only seed if the logged-in user is indeed the authorized administrator
      if (emailLower === 'kinetickali06@gmail.com' || emailLower === 'krishnavkashyap3@gmail.com') {
        console.log('Question papers collection is empty. Seeding initial papers to Firestore in parallel as admin...');
        
        const seedPromises = QUESTION_PAPERS.map(async (paper) => {
          const docRef = doc(db, collectionPath, paper.id);
          await setDoc(docRef, {
            subject: paper.subject,
            departmentId: paper.departmentId,
            semester: paper.semester,
            year: paper.year,
            examType: paper.examType,
            fileSize: paper.fileSize,
            downloads: paper.downloads,
            documentUrl: paper.documentUrl || null
          });
        });
        
        await Promise.all(seedPromises);
        console.log('Seeding completed successfully!');
        return QUESTION_PAPERS;
      } else {
        console.log('Question papers collection is empty. Returning static fallback data for guest/student view.');
        return QUESTION_PAPERS;
      }
    }

    const papers: QuestionPaper[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      papers.push({
        id: docSnap.id,
        subject: data.subject || '',
        departmentId: data.departmentId || 'physics',
        semester: data.semester || 'Semester I',
        year: Number(data.year) || 2024,
        examType: data.examType || 'End-Semester Exam',
        fileSize: data.fileSize || '1.0 MB',
        downloads: Number(data.downloads) || 0,
        documentUrl: data.documentUrl || ''
      });
    });

    // Sort papers: newest year first, then by subject
    return papers.sort((a, b) => b.year - a.year || a.subject.localeCompare(b.subject));
  } catch (error) {
    return handleFirestoreError(error, OperationType.WRITE, collectionPath);
  }
}

/**
 * Add a new question paper to Firestore (Admin action)
 */
export async function addQuestionPaperToFirestore(paper: Omit<QuestionPaper, 'id'>): Promise<string> {
  const collectionPath = 'question_papers';
  try {
    const qCol = collection(db, collectionPath);
    const docRef = await addDoc(qCol, {
      subject: paper.subject,
      departmentId: paper.departmentId,
      semester: paper.semester,
      year: Number(paper.year),
      examType: paper.examType,
      fileSize: paper.fileSize,
      downloads: Number(paper.downloads) || 0,
      documentUrl: paper.documentUrl || '',
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    return handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
}

/**
 * Delete a question paper from Firestore (Admin action)
 */
export async function deleteQuestionPaperFromFirestore(id: string): Promise<void> {
  const docPath = `question_papers/${id}`;
  try {
    const docRef = doc(db, 'question_papers', id);
    await deleteDoc(docRef);
  } catch (error) {
    return handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/**
 * Fetch department customizations (such as description changes and gallery/upload urls) from Firestore
 */
export async function getDepartmentCustomizations(): Promise<Record<string, DepartmentCustomization>> {
  const collectionPath = 'departments';
  try {
    const colRef = collection(db, collectionPath);
    const snapshot = await getDocs(colRef);
    const customizations: Record<string, DepartmentCustomization> = {};
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      customizations[docSnap.id] = {
        id: docSnap.id,
        customDescription: data.customDescription,
        imageUrls: data.imageUrls || []
      };
    });
    
    return customizations;
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

/**
 * Update department customization in Firestore (Admin action)
 */
export async function saveDepartmentCustomization(
  deptId: string, 
  customDescription: string, 
  imageUrls: string[]
): Promise<void> {
  const docPath = `departments/${deptId}`;
  try {
    const docRef = doc(db, 'departments', deptId);
    await setDoc(docRef, {
      customDescription,
      imageUrls,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    return handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}
