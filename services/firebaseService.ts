import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  increment
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  rank: string;
  placa?: string;
  plan: 'free' | 'plus';
  createdAt: Date;
  subscription?: {
    startDate: Date;
    endDate: Date;
    status: 'active' | 'inactive' | 'cancelled';
  };
  usage: {
    documentsThisMonth: number;
    lastReset: Date;
  };
}

// Authentication functions
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string,
  rank: string
): Promise<FirebaseUser> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update profile
  await updateProfile(user, { displayName });

  // Create user document in Firestore
  await createUserProfile(user.uid, {
    uid: user.uid,
    email: email,
    displayName,
    rank,
    plan: 'free',
    createdAt: new Date(),
    usage: {
      documentsThisMonth: 0,
      lastReset: new Date()
    }
  });

  return user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const createUserProfile = async (
  uid: string,
  profile: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...profile,
    createdAt: Timestamp.fromDate(profile.createdAt || new Date()),
    'usage.lastReset': Timestamp.fromDate(new Date())
  });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate(),
      'usage.lastReset': data.usage?.lastReset?.toDate(),
      subscription: data.subscription ? {
        ...data.subscription,
        startDate: data.subscription.startDate?.toDate(),
        endDate: data.subscription.endDate?.toDate()
      } : undefined
    } as UserProfile;
  }

  return null;
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, updates as any);
};

// Usage tracking functions
export const checkUsageLimit = async (uid: string): Promise<{
  canGenerate: boolean;
  remaining: number;
  limit: number;
}> => {
  const profile = await getUserProfile(uid);

  if (!profile) {
    throw new Error('Usuario no encontrado');
  }

  // Check if need to reset monthly counter
  const now = new Date();
  const lastReset = profile.usage.lastReset;
  const monthDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 +
                    (now.getMonth() - lastReset.getMonth());

  if (monthDiff >= 1) {
    // Reset counter
    await updateDoc(doc(db, 'users', uid), {
      'usage.documentsThisMonth': 0,
      'usage.lastReset': Timestamp.fromDate(now)
    });
    profile.usage.documentsThisMonth = 0;
  }

  const limit = profile.plan === 'free' ? 2 : 25;
  const remaining = limit - profile.usage.documentsThisMonth;
  const canGenerate = remaining > 0;

  return { canGenerate, remaining, limit };
};

export const incrementUsage = async (uid: string): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    'usage.documentsThisMonth': increment(1)
  });
};

// Document management
export interface DocumentRecord {
  id?: string;
  userId: string;
  type: 'captura-flagrancia' | 'primer-respondiente' | 'derechos-capturado' | 'acta-incautacion';
  formData: any;
  fileUrl?: string;
  createdAt: Date;
}

export const saveDocument = async (document: DocumentRecord): Promise<string> => {
  const docRef = doc(collection(db, 'documents'));
  await setDoc(docRef, {
    ...document,
    createdAt: Timestamp.fromDate(document.createdAt)
  });
  return docRef.id;
};

export const getUserDocuments = async (uid: string): Promise<DocumentRecord[]> => {
  const q = query(
    collection(db, 'documents'),
    where('userId', '==', uid)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate()
  })) as DocumentRecord[];
};
