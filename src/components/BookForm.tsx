
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
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BookFormData>({
    defaultValues: initialData
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [selectedGenre, setSelectedGenre] = useState(initialData?.genre || '');
  const [selectedCondition, setSelectedCondition] = useState<BookCondition>(initialData?.condition || 'Good');

  const conditions: BookCondition[] = ['New', 'Like New', 'Very Good', 'Good', 'Acceptable'];
  const genres = [
    "Fiction", "Non-Fiction", "Mystery", "Fantasy", "Romance", "Science Fiction", 
    "Biography", "History", "Self-Help", "Business", "Technology", "Health", 
    "Travel", "Cooking", "Art", "Music", "Sports", "Children's", "Young Adult"
  ];

  const onFormSubmit = async (data: BookFormData) => {
    if (!imageFile && !initialData) {
      toast.error('Please select an image for your book');
      return;
    }
    
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
        <Select 
          value={selectedGenre}
          onValueChange={(value) => {
            setSelectedGenre(value);
            setValue('genre', value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register('genre', { required: 'Genre is required' })} />
        {errors.genre && <p className="text-red-500 text-sm">{errors.genre.message}</p>}
      </div>

      <div>
        <Select 
          value={selectedCondition}
          onValueChange={(value) => {
            setSelectedCondition(value as BookCondition);
            setValue('condition', value as BookCondition);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Condition" />
          </SelectTrigger>
          <SelectContent>
            {conditions.map((condition) => (
              <SelectItem key={condition} value={condition}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register('condition', { required: 'Condition is required' })} />
        {errors.condition && <p className="text-red-500 text-sm">{errors.condition.message}</p>}
      </div>

      {selectedGenre && selectedCondition && (
        <PriceSuggestion
          genre={selectedGenre}
          condition={selectedCondition}
        />
      )}

      <div>
        <Input 
          type="number"
          step="0.01"
          {...register('price', { 
            required: 'Price is required',
            min: { value: 0, message: 'Price must be positive' },
            valueAsNumber: true
          })}
          placeholder="Price ($)"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      <div>
        <Textarea 
          {...register('description')}
          placeholder="Book Description (condition details, any notes, etc.)"
          rows={4}
        />
      </div>

      <div>
        <Input 
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          required={!initialData}
        />
        {!initialData && !imageFile && (
          <p className="text-sm text-gray-500 mt-1">Please upload a clear photo of your book</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
        {buttonText}
      </Button>
    </form>
  );
};

export default BookForm;
