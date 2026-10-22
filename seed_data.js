/**
 * Standalone Script to Seed Demo Books to Firestore
 * Usage:
 *   node seed_data.js <email> <password>
 * Example:
 *   node seed_data.js test@example.com Password123!
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Simple .env parser (built-in, no external dependencies)
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const SAMPLE_BOOKS = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    status: 'Finished',
    rating: 5,
    favorite: true,
    notes: 'A classic exploration of wealth, love, and the American dream in the Roaring Twenties.',
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Academic',
    status: 'Reading',
    rating: 5,
    favorite: true,
    notes: 'A handbook of agile software craftsmanship. Essential reading for all developers.',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Non-Fiction',
    status: 'Reading',
    rating: 4,
    favorite: false,
    notes: 'Tiny changes, remarkable results. Practical strategies to build good habits.',
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    status: 'Finished',
    rating: 5,
    favorite: true,
    notes: 'Fascinating survey of human evolution, history, cognition, and society.',
  },
  {
    title: 'Design Patterns',
    author: 'Erich Gamma',
    genre: 'Academic',
    status: 'To Read',
    rating: null,
    favorite: false,
    notes: 'Classic Gang of Four reference for scalable software architectures.',
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    genre: 'Other',
    status: 'To Read',
    rating: null,
    favorite: false,
    notes: 'Exclusive biography based on over forty interviews with Steve Jobs.',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    status: 'Finished',
    rating: 5,
    favorite: true,
    notes: 'Pulitzer Prize-winning novel addressing racial injustice and courage.',
  },
];

async function main() {
  const email = process.argv[2] || 'test@example.com';
  const password = process.argv[3] || 'Password123!';

  console.log(`Connecting to Firebase (${firebaseConfig.projectId})...`);
  console.log(`Authenticating as ${email}...`);

  let userCredential;
  try {
    userCredential = await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      console.log('Account not found, creating new account...');
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } else {
      throw err;
    }
  }

  const userId = userCredential.user.uid;
  console.log(`User logged in! UID: ${userId}`);
  console.log(`Seeding ${SAMPLE_BOOKS.length} books...`);

  let count = 0;
  for (const item of SAMPLE_BOOKS) {
    const cleanTitle = item.title.trim().toLowerCase();
    const cleanAuthor = item.author.trim().toLowerCase();
    const docId = `${userId}_${cleanTitle}_${cleanAuthor}`;
    const docRef = doc(db, 'books', docId);

    await setDoc(docRef, {
      id: docId,
      userId,
      title: item.title,
      author: item.author,
      genre: item.genre,
      status: item.status,
      rating: item.rating,
      favorite: item.favorite,
      notes: item.notes,
      createdAt: Date.now() - count * 60000,
    });
    console.log(`  [OK] Added: "${item.title}" (${item.genre} | ${item.status})`);
    count++;
  }

  console.log(`\n Successfully seeded ${count} sample books into Firestore!`);
  console.log('Open your app on Android Emulator to view and take screenshots.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n Error seeding data:', err.message);
  process.exit(1);
});
