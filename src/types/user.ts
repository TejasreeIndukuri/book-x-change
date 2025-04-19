
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  createdAt: Date;
}
