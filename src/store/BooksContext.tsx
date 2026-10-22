import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import {
  Book,
  BookFormData,
  BookStatus,
  FilterOptions,
  StatusCountBreakdown,
} from '../models/book';
import { STATUS_PRIORITY } from '../constants/options';
import {
  addBookApi,
  updateBookApi,
  toggleFavoriteApi,
  deleteBookApi,
  seedSampleBooksApi,
} from '../api/books';

export interface BooksContextType {
  books: Book[];
  filteredBooks: Book[];
  loading: boolean;
  filters: FilterOptions;
  setGenreFilter: (genre: string) => void;
  setStatusFilter: (status: string) => void;
  setFavoritesOnly: (favoritesOnly: boolean) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  addBook: (data: BookFormData) => Promise<{ success: boolean; error?: string }>;
  updateBook: (id: string, data: BookFormData) => Promise<{ success: boolean; error?: string }>;
  toggleFavorite: (id: string) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  seedSampleBooks: () => Promise<{ success: boolean; count: number }>;
  summary: {
    bookCount: number;
    favoriteCount: number;
    breakdown: StatusCountBreakdown[];
  };
}

const initialFilters: FilterOptions = {
  genre: 'All',
  status: 'All',
  favoritesOnly: false,
  searchQuery: '',
};

export const BooksContext = createContext<BooksContextType>({} as BooksContextType);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  // Real-time listener for current user's books
  useEffect(() => {
    if (!user) {
      setBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const booksRef = collection(db, 'books');
    const q = query(booksRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedBooks: Book[] = [];
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          loadedBooks.push({
            id: docSnapshot.id,
            userId: data.userId,
            title: data.title,
            author: data.author,
            genre: data.genre,
            status: data.status,
            rating: data.rating ?? null,
            favorite: Boolean(data.favorite),
            notes: data.notes ?? '',
            createdAt: data.createdAt ?? Date.now(),
          });
        });

        // Sort alphabetically by title (not case-sensitive; equal titles ordered by author)
        const sorted = loadedBooks.sort((a, b) => {
          const titleComparison = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
          if (titleComparison !== 0) return titleComparison;
          return a.author.localeCompare(b.author, undefined, { sensitivity: 'base' });
        });

        setBooks(sorted);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore listener error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const setGenreFilter = (genre: string) => setFilters((prev) => ({ ...prev, genre }));
  const setStatusFilter = (status: string) => setFilters((prev) => ({ ...prev, status }));
  const setFavoritesOnly = (favoritesOnly: boolean) => setFilters((prev) => ({ ...prev, favoritesOnly }));
  const setSearchQuery = (searchQuery: string) => setFilters((prev) => ({ ...prev, searchQuery }));
  const clearFilters = () => setFilters(initialFilters);

  // Combined real-time filtering
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (filters.genre !== 'All' && book.genre !== filters.genre) {
        return false;
      }
      if (filters.status !== 'All' && book.status !== filters.status) {
        return false;
      }
      if (filters.favoritesOnly && !book.favorite) {
        return false;
      }
      const trimmedQuery = filters.searchQuery.trim().toLowerCase();
      if (trimmedQuery.length > 0) {
        const titleMatch = book.title.toLowerCase().includes(trimmedQuery);
        const authorMatch = book.author.toLowerCase().includes(trimmedQuery);
        if (!titleMatch && !authorMatch) {
          return false;
        }
      }
      return true;
    });
  }, [books, filters]);

  // Real-time summary statistics for currently visible books
  const summary = useMemo(() => {
    const bookCount = filteredBooks.length;
    const favoriteCount = filteredBooks.filter((b) => b.favorite).length;

    const counts: Record<BookStatus, number> = {
      'To Read': 0,
      'Reading': 0,
      'Finished': 0,
    };

    filteredBooks.forEach((book) => {
      if (counts[book.status] !== undefined) {
        counts[book.status] += 1;
      }
    });

    const breakdown: StatusCountBreakdown[] = (Object.keys(counts) as BookStatus[])
      .filter((status) => counts[status] > 0)
      .map((status) => ({
        status,
        count: counts[status],
      }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
      });

    return {
      bookCount,
      favoriteCount,
      breakdown,
    };
  }, [filteredBooks]);

  const addBook = async (data: BookFormData) => {
    if (!user) return { success: false, error: 'User is not authenticated' };
    const cleanTitle = data.title.trim().toLowerCase();
    const cleanAuthor = data.author.trim().toLowerCase();
    const exists = books.some(
      (b) => b.title.trim().toLowerCase() === cleanTitle && b.author.trim().toLowerCase() === cleanAuthor
    );
    if (exists) {
      return { success: false, error: 'A book with this title and author already exists.' };
    }
    return addBookApi(user.uid, data);
  };

  const updateBook = async (id: string, data: BookFormData) => {
    if (!user) return { success: false, error: 'User is not authenticated' };
    const currentBook = books.find((b) => b.id === id);
    if (!currentBook) return { success: false, error: 'Book not found' };
    const cleanTitle = data.title.trim().toLowerCase();
    const cleanAuthor = data.author.trim().toLowerCase();
    const exists = books.some(
      (b) =>
        b.id !== id &&
        b.title.trim().toLowerCase() === cleanTitle &&
        b.author.trim().toLowerCase() === cleanAuthor
    );
    if (exists) {
      return { success: false, error: 'A book with this title and author already exists.' };
    }
    return updateBookApi(user.uid, currentBook, data);
  };

  const toggleFavorite = async (id: string) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    await toggleFavoriteApi(id, book.favorite);
  };

  const deleteBook = async (id: string) => {
    await deleteBookApi(id);
  };

  const seedSampleBooks = async () => {
    if (!user) return { success: false, count: 0 };
    return seedSampleBooksApi(user.uid);
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        filteredBooks,
        loading,
        filters,
        setGenreFilter,
        setStatusFilter,
        setFavoritesOnly,
        setSearchQuery,
        clearFilters,
        addBook,
        updateBook,
        toggleFavorite,
        deleteBook,
        seedSampleBooks,
        summary,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};
