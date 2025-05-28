
import { supabase } from '@/integrations/supabase/client';
import { Book, BookFormData } from '@/types/book';

export const uploadBook = async (userId: string, data: BookFormData, imageFile: File): Promise<void> => {
  // Upload image first
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `book-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('books')
    .upload(filePath, imageFile);

  if (uploadError) {
    throw new Error('Failed to upload image');
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('books')
    .getPublicUrl(filePath);

  // Create book record
  const { error: insertError } = await supabase
    .from('books')
    .insert({
      user_id: userId,
      title: data.title,
      author: data.author,
      genre: data.genre,
      condition: data.condition,
      price: data.price,
      description: data.description,
      image_url: urlData.publicUrl,
    });

  if (insertError) {
    // Clean up uploaded image if book creation fails
    await supabase.storage.from('books').remove([filePath]);
    throw new Error('Failed to create book record');
  }
};

export const getUserBooks = async (userId: string): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch user books');
  }

  return data.map(book => ({
    id: book.id,
    userId: book.user_id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    condition: book.condition as any,
    price: book.price,
    description: book.description,
    imageUrl: book.image_url,
    createdAt: new Date(book.created_at),
  }));
};

export const getAllBooks = async (): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch books');
  }

  return data.map(book => ({
    id: book.id,
    userId: book.user_id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    condition: book.condition as any,
    price: book.price,
    description: book.description,
    imageUrl: book.image_url,
    createdAt: new Date(book.created_at),
  }));
};

export const deleteBook = async (bookId: string, imageUrl: string): Promise<void> => {
  // Delete book record
  const { error: deleteError } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId);

  if (deleteError) {
    throw new Error('Failed to delete book');
  }

  // Extract file path from URL and delete image
  try {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `book-images/${fileName}`;
    
    await supabase.storage
      .from('books')
      .remove([filePath]);
  } catch (error) {
    console.warn('Failed to delete image file:', error);
  }
};

export const updateBook = async (
  bookId: string, 
  data: BookFormData, 
  currentImageUrl: string,
  newImageFile?: File
): Promise<void> => {
  let imageUrl = currentImageUrl;

  // Upload new image if provided
  if (newImageFile) {
    const fileExt = newImageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `book-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('books')
      .upload(filePath, newImageFile);

    if (uploadError) {
      throw new Error('Failed to upload new image');
    }

    // Get public URL for new image
    const { data: urlData } = supabase.storage
      .from('books')
      .getPublicUrl(filePath);

    imageUrl = urlData.publicUrl;

    // Delete old image
    try {
      const urlParts = currentImageUrl.split('/');
      const oldFileName = urlParts[urlParts.length - 1];
      const oldFilePath = `book-images/${oldFileName}`;
      
      await supabase.storage
        .from('books')
        .remove([oldFilePath]);
    } catch (error) {
      console.warn('Failed to delete old image file:', error);
    }
  }

  // Update book record
  const { error: updateError } = await supabase
    .from('books')
    .update({
      title: data.title,
      author: data.author,
      genre: data.genre,
      condition: data.condition,
      price: data.price,
      description: data.description,
      image_url: imageUrl,
    })
    .eq('id', bookId);

  if (updateError) {
    throw new Error('Failed to update book record');
  }
};
