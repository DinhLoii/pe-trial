export type BookGenre = 'Fiction' | 'Non-Fiction' | 'Academic' | 'Other';

export type BookStatus = 'To Read' | 'Reading' | 'Finished';

export const GENRE_OPTIONS: BookGenre[] = ['Fiction', 'Non-Fiction', 'Academic', 'Other'];

export const STATUS_OPTIONS: BookStatus[] = ['To Read', 'Reading', 'Finished'];

export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  genre: BookGenre;
  status: BookStatus;
  rating?: number | null;
  favorite: boolean;
  notes?: string;
  createdAt: any;
}

export interface BookFormData {
  title: string;
  author: string;
  genre: BookGenre | '';
  status: BookStatus | '';
  rating?: string; // string representation in input form, converted to number on submit
  notes?: string;
}

export interface BookFormErrors {
  title?: string;
  author?: string;
  genre?: string;
  status?: string;
  rating?: string;
  notes?: string;
}

export interface FilterOptions {
  genre: string; // 'All' or BookGenre
  status: string; // 'All' or BookStatus
  favoritesOnly: boolean;
  searchQuery: string;
}

export interface StatusCountBreakdown {
  status: BookStatus;
  count: number;
}
