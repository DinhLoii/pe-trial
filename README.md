# BookShelf - MMA301 Practical Exam (FALL 2026)

A modern, production-ready React Native (Expo) mobile application for managing a personal library of books, built with React Context for shared state, Firebase Authentication, and Cloud Firestore.

---

## 📱 Features

1. **Authentication (Firebase Auth)**:
   - Email/password registration and login with real Firebase Authentication.
   - Comprehensive client-side form validation with exact required error messages.
   - Real-time field validation cleanup (errors disappear as soon as fields become valid).
   - Display `testID="form-success"` on registration success (`Registration successful`).
   - Firebase error message display in `testID="error-auth"`.
   - Zero-flash route protection: Splash screen shown while verifying user session.

2. **Personal Books Management (Cloud Firestore)**:
   - Add new books (`testID="book-form"`): Title, Author, Genre, Status, Rating (optional 0-5), Notes (optional max 300 chars).
   - Instant optimistic / real-time sync with Firestore via `onSnapshot`.
   - Case-insensitive duplicate rejection per user (`error-book`).
   - Success banner `testID="book-success"` showing `Book added`.
   - Toggle favorite with one tap (instant update and persistent in Firestore).
   - Alphabetical sorting by title (case-insensitive; ties broken by author).
   - Empty state `testID="books-empty"` showing `No books found`.

3. **Combined Filters, Real-time Search & Live Summary**:
   - Genre filter: All, Fiction, Non-Fiction, Academic, Other.
   - Status filter: All, To Read, Reading, Finished.
   - "Favorites only" toggle switch.
   - Real-time search by title or author (case-insensitive, trims whitespace).
   - Clear button that resets all 4 filters.
   - Summary statistics:
     - Total books currently shown: `testID="book-count"` (plain integer).
     - Favorite books currently shown: `testID="favorite-count"` (plain integer).
     - Status breakdown: sorted by most books first, with tie-breaking order (To Read → Reading → Finished).

4. **Book Details Screen (Protected)**:
   - Full details view (Title, Author, Genre badge, Status badge, Rating stars, Notes).
   - Interactive favorite toggle.
   - Edit mode with Save & Cancel buttons and the same validation rules.
   - Delete action with confirmation prompt; immediately removed from database and list.

5. **Database-level Validation & Security Rules (`firestore.rules`)**:
   - Strictly enforces user-level data isolation (`resource.data.userId == request.auth.uid`).
   - Non-authenticated visitors are denied read and write access.
   - Reject empty / whitespace-only or oversized titles (> 100 chars).
   - Reject empty / whitespace-only or oversized authors (> 60 chars).
   - Reject invalid genres and statuses.
   - Reject invalid ratings (< 0, > 5, non-integer).
   - Reject notes exceeding 300 chars.
   - Strictly prevents the same user from saving duplicate books with matching title and author (case-insensitive), while allowing different users to save identical titles.

---

## 🛠️ Project Structure

```
├── .env.example              # Environment variables template
├── firestore.rules           # Cloud Firestore Security Rules
├── package.json              # Project dependencies and scripts
├── eas.json                  # Expo Application Services build configuration
├── .prettierrc               # Prettier code formatting rules
├── .prettierignore           # Prettier ignore patterns
├── eslint.config.js          # ESLint configuration
├── SRS.md                    # Software Requirements Specification
├── REPORT_TEMPLATE.md        # Submission Word report template & screenshot checklist
└── src/
    ├── api/
    │   └── books.ts          # Firestore API operations
    ├── app/                  # Expo Router file-based routes
    │   ├── (auth)/
    │   │   ├── _layout.tsx   # Auth stack layout
    │   │   ├── login.tsx     # Login screen
    │   │   └── register.tsx  # Register screen
    │   ├── (main)/
    │   │   ├── _layout.tsx   # Protected layout
    │   │   ├── list.tsx      # Main books list screen (list-screen)
    │   │   └── book/
    │   │       └── [id].tsx  # Book detail, edit & delete screen
    │   ├── _layout.tsx       # Root layout wrapping providers & splash screen
    │   └── index.tsx         # Home screen (home-title, feature cards, auth redirect)
    ├── components/
    │   ├── common/
    │   │   ├── AppHeader.tsx # Header with email and Logout button
    │   │   ├── Button.tsx    # Styled buttons (primary, outline, danger)
    │   │   ├── Input.tsx     # Form inputs with inline error labels
    │   │   ├── SelectPicker.tsx # Dropdown modal pickers
    │   │   └── Card.tsx      # Elevated card surface
    │   ├── books/
    │   │   ├── BookForm.tsx  # book-form with exact validation & testIDs
    │   │   ├── BookCard.tsx  # book-item with star toggle & badges
    │   │   ├── BookFilters.tsx# Real-time search, filters & Clear button
    │   │   └── BooksSummary.tsx # book-count, favorite-count, breakdown
    │   └── ui/
    │       ├── Badge.tsx     # Visual category badges
    │       ├── ThemedText.tsx# Typography component
    │       └── ThemedView.tsx# Themed view wrapper
    ├── config/
    │   ├── env.ts            # Typed environment variables
    │   └── firebase.ts       # Firebase SDK & AsyncStorage persistence setup
    ├── constants/
    │   └── options.ts        # Genres, Statuses, and priority constants
    ├── hooks/
    │   ├── useAuth.ts        # Auth state hook
    │   └── useBooks.ts       # Books state hook
    ├── models/
    │   └── book.ts           # Book data models & form interfaces
    ├── store/
    │   ├── AuthContext.tsx   # Firebase Authentication provider
    │   └── BooksContext.tsx  # Firestore real-time library state
    ├── theme/
    │   └── index.ts          # Color tokens, typography & spacing
    ├── types/
    │   └── index.ts          # Re-exported types
    └── utils/
        └── validation.ts     # Validation rules and exact error messages
```

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase project credentials:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run the Application

```bash
npx expo start
```

Press `a` for Android Emulator, `i` for iOS Simulator, or scan the QR code with Expo Go.

---

## 🔒 Security Rules (`firestore.rules`)

To deploy the security rules to your Firebase project:

1. Open Firebase Console → **Firestore Database** → **Rules** tab.
2. Copy the entire contents of `firestore.rules` from this project.
3. Click **Publish**.

---

## 📋 Self-Check & Testing Checklist

- [x] Unauthenticated users cannot access `List` or `Detail` screens (zero-flash protection).
- [x] Register empty submit displays required error messages.
- [x] Register valid submit creates Firebase account & shows `form-success` ("Registration successful").
- [x] Duplicate email registration displays message in `error-auth`.
- [x] Login with valid credentials navigates directly to `list-screen`.
- [x] Header on `list-screen` displays user email and functioning `Logout` button.
- [x] Add Book form shows errors on submit; errors clear on valid input.
- [x] Duplicate title + author submission displays error in `error-book` and refuses creation.
- [x] Books list displays in case-insensitive alphabetical order by title.
- [x] Favorite star toggles immediately and persists after app reload.
- [x] Filters (genre, status, favorites only, search) combine and update immediately.
- [x] Clear button resets all 4 filters.
- [x] Summary counts (`book-count`, `favorite-count`) match visible books.
- [x] Status breakdown sorted by highest count with tie-breaker order (To Read → Reading → Finished).
- [x] Detail screen view mode displays all book fields.
- [x] Edit mode updates book in Firestore and returns to view mode.
- [x] Delete button with confirmation removes book from Firestore and returns to list.
- [x] Empty state displays `testID="books-empty"` with text `No books found`.
- [x] Code passes `npx tsc --noEmit` and `npx expo-doctor` with 0 errors.
