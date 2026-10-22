import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
// @ts-ignore: getReactNativePersistence is exported in the React Native bundle of firebase/auth
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from './env';

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with React Native AsyncStorage persistence
let auth: ReturnType<typeof getAuth>;
try {
  const persistence =
    typeof getReactNativePersistence === 'function'
      ? getReactNativePersistence(AsyncStorage)
      : undefined;
  auth = persistence ? initializeAuth(app, { persistence }) : initializeAuth(app);
} catch {
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

/**
 * Generate a deterministic Firestore document ID for a book based on userId, title, and author.
 * Matches the Firestore security rule uniqueKey() function.
 */
export function generateBookDocId(userId: string, title: string, author: string): string {
  const cleanTitle = title.trim().toLowerCase();
  const cleanAuthor = author.trim().toLowerCase();
  return `${userId}_${cleanTitle}_${cleanAuthor}`;
}

export { app, auth, db };
