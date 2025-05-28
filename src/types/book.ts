
export type BookCondition = 'New' | 'Like New' | 'Very Good' | 'Good' | 'Acceptable';

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
