import {
  collection,
  query,
  where,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db, generateBookDocId } from '../config/firebase';
import { Book, BookFormData } from '../models/book';

export async function checkBookExists(docId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'books', docId);
    const snap = await getDoc(docRef);
    return snap.exists();
  } catch (err: any) {
    return false;
  }
}

export async function addBookApi(
  userId: string,
  data: BookFormData
): Promise<{ success: boolean; error?: string }> {
  const cleanTitle = data.title.trim();
  const cleanAuthor = data.author.trim();
  const docId = generateBookDocId(userId, cleanTitle, cleanAuthor);

  try {
    const docRef = doc(db, 'books', docId);
    const exists = await checkBookExists(docId);
    if (exists) {
      return { success: false, error: 'A book with this title and author already exists.' };
    }

    const ratingVal =
      data.rating !== undefined && data.rating !== '' && data.rating !== null
        ? parseInt(data.rating, 10)
        : null;

    await setDoc(docRef, {
      id: docId,
      userId,
      title: cleanTitle,
      author: cleanAuthor,
      genre: data.genre,
      status: data.status,
      rating: ratingVal,
      favorite: false,
      notes: data.notes?.trim() || '',
      createdAt: Date.now(),
    });

    return { success: true };
  } catch (err: any) {
    console.error('addBookApi error:', err);
    return { success: false, error: err?.message || 'Failed to add book.' };
  }
}

export async function updateBookApi(
  userId: string,
  currentBook: Book,
  data: BookFormData
): Promise<{ success: boolean; error?: string }> {
  const cleanTitle = data.title.trim();
  const cleanAuthor = data.author.trim();
  const newDocId = generateBookDocId(userId, cleanTitle, cleanAuthor);

  try {
    const ratingVal =
      data.rating !== undefined && data.rating !== '' && data.rating !== null
        ? parseInt(data.rating, 10)
        : null;

    if (newDocId !== currentBook.id) {
      const exists = await checkBookExists(newDocId);
      if (exists) {
        return { success: false, error: 'A book with this title and author already exists.' };
      }

      const newDocRef = doc(db, 'books', newDocId);
      await setDoc(newDocRef, {
        id: newDocId,
        userId,
        title: cleanTitle,
        author: cleanAuthor,
        genre: data.genre,
        status: data.status,
        rating: ratingVal,
        favorite: currentBook.favorite,
        notes: data.notes?.trim() || '',
        createdAt: currentBook.createdAt || Date.now(),
      });

      await deleteDoc(doc(db, 'books', currentBook.id));
    } else {
      const docRef = doc(db, 'books', currentBook.id);
      await updateDoc(docRef, {
        genre: data.genre,
        status: data.status,
        rating: ratingVal,
        notes: data.notes?.trim() || '',
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error('updateBookApi error:', err);
    return { success: false, error: err?.message || 'Failed to update book.' };
  }
}

export async function toggleFavoriteApi(bookId: string, currentFavorite: boolean): Promise<void> {
  const docRef = doc(db, 'books', bookId);
  await updateDoc(docRef, { favorite: !currentFavorite });
}

export async function deleteBookApi(bookId: string): Promise<void> {
  const docRef = doc(db, 'books', bookId);
  await deleteDoc(docRef);
}

export const SAMPLE_BOOKS = [
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

export async function seedSampleBooksApi(userId: string): Promise<{ success: boolean; count: number }> {
  let count = 0;
  for (const item of SAMPLE_BOOKS) {
    const docId = generateBookDocId(userId, item.title, item.author);
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
    count++;
  }
  return { success: true, count };
}
