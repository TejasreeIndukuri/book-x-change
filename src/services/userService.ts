
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const updateUserProfile = async (
  userId: string, 
  updates: Partial<UserProfile>
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    throw new Error('Failed to update profile');
  }
};

export const uploadProfileImage = async (
  userId: string, 
  imageFile: File
): Promise<string> => {
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `profile-images/${fileName}`;

  // Upload image
  const { error: uploadError } = await supabase.storage
    .from('profiles')
    .upload(filePath, imageFile, { upsert: true });

  if (uploadError) {
    throw new Error('Failed to upload profile image');
  }

  // Get public URL
  const { data } = supabase.storage
    .from('profiles')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
