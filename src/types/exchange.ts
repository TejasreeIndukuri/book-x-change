
export type ExchangeStatus = 'pending' | 'accepted' | 'rejected';

export interface ExchangeRequest {
  id: string;
  senderId: string;
  senderName?: string;
  receiverId: string;
  bookId: string;
  bookTitle?: string;
  bookImageUrl?: string;
  status: ExchangeStatus;
  message?: string;
  createdAt: Date | { seconds: number; nanoseconds: number };
  updatedAt?: Date | { seconds: number; nanoseconds: number };
}
