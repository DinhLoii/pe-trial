import { BookFormData, BookFormErrors } from '../models/book';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(val: string): string | undefined {
  if (!val || val.trim() === '') {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(val.trim())) {
    return 'Please enter a valid email address';
  }
  return undefined;
}

export function validatePassword(val: string, isRegister = false): string | undefined {
  if (!val || val === '') {
    return 'Password is required';
  }
  if (isRegister && val.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return undefined;
}

export function validateConfirmPassword(val: string, pwdVal: string): string | undefined {
  if (!val || val === '') {
    return 'Confirm password is required';
  }
  if (val !== pwdVal) {
    return 'Passwords do not match';
  }
  return undefined;
}

export function validateBookField(field: keyof BookFormData, value: any): string | undefined {
  switch (field) {
    case 'title':
      if (!value || String(value).trim() === '') {
        return 'Title is required';
      }
      if (String(value).length > 100) {
        return 'Title must be at most 100 characters';
      }
      return undefined;

    case 'author':
      if (!value || String(value).trim() === '') {
        return 'Author is required';
      }
      if (String(value).length > 60) {
        return 'Author must be at most 60 characters';
      }
      return undefined;

    case 'genre':
      if (!value || value === '') {
        return 'Please choose a genre';
      }
      return undefined;

    case 'status':
      if (!value || value === '') {
        return 'Please choose a status';
      }
      return undefined;

    case 'rating':
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        const str = String(value).trim();
        if (!/^[0-5]$/.test(str)) {
          return 'Rating must be a whole number from 0 to 5';
        }
      }
      return undefined;

    case 'notes':
      if (value && String(value).length > 300) {
        return 'Notes must be at most 300 characters';
      }
      return undefined;

    default:
      return undefined;
  }
}

export function validateBookForm(data: BookFormData): BookFormErrors {
  const errors: BookFormErrors = {};
  const tErr = validateBookField('title', data.title);
  if (tErr) errors.title = tErr;

  const aErr = validateBookField('author', data.author);
  if (aErr) errors.author = aErr;

  const gErr = validateBookField('genre', data.genre);
  if (gErr) errors.genre = gErr;

  const sErr = validateBookField('status', data.status);
  if (sErr) errors.status = sErr;

  const rErr = validateBookField('rating', data.rating);
  if (rErr) errors.rating = rErr;

  const nErr = validateBookField('notes', data.notes);
  if (nErr) errors.notes = nErr;

  return errors;
}
