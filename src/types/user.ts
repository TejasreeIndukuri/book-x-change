
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
