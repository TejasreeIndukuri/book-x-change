
import { db, storage } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfile } from '@/types/user';

const USERS_COLLECTION = 'users';

// Create or update a user profile
export const upsertUserProfile = async (userId: string, userData: Partial<UserProfile>, profileImage?: File): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);
  
  let photoURL = userData.photoURL;
  
  // If a profile image was provided, upload it to Firebase Storage
  if (profileImage) {
    const imageRef = ref(storage, `users/${userId}/profile-${Date.now()}`);
    await uploadBytes(imageRef, profileImage);
    photoURL = await getDownloadURL(imageRef);
  }
  
  const updatedUserData = {
    ...userData,
    ...(photoURL && { photoURL }),
  };
  
  if (!userSnap.exists()) {
    // Create new user profile
    await setDoc(userRef, {
      ...updatedUserData,
      id: userId,
      createdAt: new Date(),
    });
  } else {
    // Update existing profile
    await updateDoc(userRef, updatedUserData);
  }
};

// Get a user profile by ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  
  return null;
};

// Get user profiles by array of IDs
export const getUserProfiles = async (userIds: string[]): Promise<{[key: string]: UserProfile}> => {
  const users: {[key: string]: UserProfile} = {};
  
  const uniqueIds = [...new Set(userIds)];
  
  for (const userId of uniqueIds) {
    const profile = await getUserProfile(userId);
    if (profile) {
      users[userId] = profile;
    }
  }
  
  return users;
};
