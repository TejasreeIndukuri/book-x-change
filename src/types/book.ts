
export type BookCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  condition: BookCondition;
  price: number;
  description: string;
  imageUrl: string;
  userId: string;
  createdAt: Date;
}

export type BookFormData = Omit<Book, 'id' | 'userId' | 'createdAt' | 'imageUrl'>;
