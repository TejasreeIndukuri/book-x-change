import { db, storage } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, where, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Book, BookFormData } from '@/types/book';

const BOOKS_COLLECTION = 'books';

export const uploadBook = async (userId: string, bookData: BookFormData, imageFile: File): Promise<string> => {
  // Upload image first
  const imageRef = ref(storage, `books/${userId}/${Date.now()}-${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(imageRef);

  // Add book to Firestore
  const bookRef = await addDoc(collection(db, BOOKS_COLLECTION), {
    ...bookData,
    userId,
    imageUrl,
    createdAt: new Date()
  });

  return bookRef.id;
};

export const updateBook = async (bookId: string, bookData: Partial<BookFormData>, imageUrl?: string, newImageFile?: File): Promise<void> => {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const updateData: any = { ...bookData };

  if (newImageFile) {
    // If there's a new image file, upload it and get the new URL
    const storageRef = ref(storage, `books/${Date.now()}-${newImageFile.name}`);
    await uploadBytes(storageRef, newImageFile);
    updateData.imageUrl = await getDownloadURL(storageRef);
  } else if (imageUrl) {
    // If there's an existing image URL but no new file, keep the existing URL
    updateData.imageUrl = imageUrl;
  }

  await updateDoc(bookRef, updateData);
};

export const deleteBook = async (bookId: string, imageUrl: string): Promise<void> => {
  // Delete image from Storage
  if (imageUrl) {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  }

  // Delete book document
  await deleteDoc(doc(db, BOOKS_COLLECTION, bookId));
};

export const getUserBooks = async (userId: string): Promise<Book[]> => {
  const q = query(collection(db, BOOKS_COLLECTION), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Book));
};

export const getAllBooks = async (): Promise<Book[]> => {
  const querySnapshot = await getDocs(collection(db, BOOKS_COLLECTION));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Book));
};
