import { useContext } from 'react';
import { BooksContext, BooksContextType } from '../store/BooksContext';

export function useBooks(): BooksContextType {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
}
