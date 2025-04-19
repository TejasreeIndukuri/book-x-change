
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  getDocs, 
  where, 
  query, 
  orderBy
} from 'firebase/firestore';
import { ExchangeRequest, ExchangeStatus } from '@/types/exchange';
import { Book } from '@/types/book';

const EXCHANGES_COLLECTION = 'exchanges';
const BOOKS_COLLECTION = 'books';

// Create a new exchange request
export const createExchangeRequest = async (
  senderId: string,
  receiverId: string,
  bookId: string,
  message?: string
): Promise<string> => {
  // Get the book information
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const bookSnap = await getDoc(bookRef);
  const bookData = bookSnap.data() as Book;
  
  // Create the exchange request
  const exchangeData: Omit<ExchangeRequest, 'id'> = {
    senderId,
    receiverId,
    bookId,
    bookTitle: bookData.title,
    bookImageUrl: bookData.imageUrl,
    status: 'pending',
    message,
    createdAt: new Date(),
  };
  
  const exchangeRef = await addDoc(collection(db, EXCHANGES_COLLECTION), exchangeData);
  return exchangeRef.id;
};

// Update an exchange request status
export const updateExchangeStatus = async (
  exchangeId: string,
  status: ExchangeStatus
): Promise<void> => {
  const exchangeRef = doc(db, EXCHANGES_COLLECTION, exchangeId);
  await updateDoc(exchangeRef, {
    status,
    updatedAt: new Date(),
  });
};

// Delete an exchange request
export const deleteExchangeRequest = async (exchangeId: string): Promise<void> => {
  await deleteDoc(doc(db, EXCHANGES_COLLECTION, exchangeId));
};

// Get all exchange requests where user is the sender
export const getSentExchangeRequests = async (userId: string): Promise<ExchangeRequest[]> => {
  const q = query(
    collection(db, EXCHANGES_COLLECTION),
    where('senderId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as ExchangeRequest));
};

// Get all exchange requests where user is the receiver
export const getReceivedExchangeRequests = async (userId: string): Promise<ExchangeRequest[]> => {
  const q = query(
    collection(db, EXCHANGES_COLLECTION),
    where('receiverId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as ExchangeRequest));
};

// Get all exchange requests for a specific book
export const getBookExchangeRequests = async (bookId: string): Promise<ExchangeRequest[]> => {
  const q = query(
    collection(db, EXCHANGES_COLLECTION),
    where('bookId', '==', bookId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as ExchangeRequest));
};

// Count pending exchange requests for a user
export const countPendingExchangeRequests = async (userId: string): Promise<number> => {
  const q = query(
    collection(db, EXCHANGES_COLLECTION),
    where('receiverId', '==', userId),
    where('status', '==', 'pending')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};
