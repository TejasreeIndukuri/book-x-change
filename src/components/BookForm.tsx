import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookFormData, BookCondition } from '@/types/book';
import { toast } from 'sonner';
import PriceSuggestion from './PriceSuggestion';

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  onSubmit: (data: BookFormData, imageFile: File | null) => Promise<void>;
  buttonText: string;
}

const BookForm = ({ initialData, onSubmit, buttonText }: BookFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<BookFormData>({
    defaultValues: initialData
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [selectedGenre, setSelectedGenre] = useState(initialData?.genre || '');
  const [selectedCondition, setSelectedCondition] = useState<BookCondition>(initialData?.condition || 'good');

  const conditions: BookCondition[] = ['new', 'like-new', 'good', 'fair', 'poor'];

  const onFormSubmit = async (data: BookFormData) => {
    try {
      await onSubmit(data, imageFile);
      toast.success('Book saved successfully!');
    } catch (error) {
      toast.error('Failed to save book');
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <Input 
          {...register('title', { required: 'Title is required' })}
          placeholder="Book Title"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <Input 
          {...register('author', { required: 'Author is required' })}
          placeholder="Author"
        />
        {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
      </div>

      <div>
        <Input 
          {...register('genre', { required: 'Genre is required' })}
          placeholder="Genre"
          onChange={(e) => setSelectedGenre(e.target.value)}
        />
        {errors.genre && <p className="text-red-500 text-sm">{errors.genre.message}</p>}
      </div>

      <select 
        {...register('condition')}
        className="w-full rounded-md border p-2"
        onChange={(e) => setSelectedCondition(e.target.value as BookCondition)}
      >
        {conditions.map((condition) => (
          <option key={condition} value={condition}>
            {condition.charAt(0).toUpperCase() + condition.slice(1)}
          </option>
        ))}
      </select>

      {selectedGenre && selectedCondition && (
        <PriceSuggestion
          genre={selectedGenre}
          condition={selectedCondition}
        />
      )}

      <div>
        <Input 
          type="number"
          {...register('price', { 
            required: 'Price is required',
            min: { value: 0, message: 'Price must be positive' }
          })}
          placeholder="Price"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      <div>
        <Textarea 
          {...register('description')}
          placeholder="Book Description"
        />
      </div>

      <div>
        <Input 
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

export default BookForm;
