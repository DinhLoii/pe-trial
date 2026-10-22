import { BookGenre, BookStatus } from '../models/book';

export const GENRE_OPTIONS: BookGenre[] = ['Fiction', 'Non-Fiction', 'Academic', 'Other'];

export const STATUS_OPTIONS: BookStatus[] = ['To Read', 'Reading', 'Finished'];

export const STATUS_PRIORITY: Record<BookStatus, number> = {
  'To Read': 1,
  'Reading': 2,
  'Finished': 3,
};
