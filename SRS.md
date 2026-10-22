# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## Project: BookShelf Mobile Application
**Subject:** MMA301 – Multiplatform Mobile App Development  
**Semester:** FALL 2026  
**Document Version:** 1.0.0 (Production & Grading Compliant)  
**Target Environment:** React Native (Expo SDK 58+), Firebase Authentication, Cloud Firestore

---

## 1. TỔNG QUAN HỆ THỐNG (SYSTEM OVERVIEW)

### 1.1 Mục tiêu dự án
Xây dựng ứng dụng di động **BookShelf**, cho phép mỗi người dùng sở hữu một tủ sách cá nhân hoàn toàn bảo mật. Ứng dụng quản lý các đầu sách đang sở hữu hoặc muốn đọc, phân loại theo trạng thái đọc (Reading Status), thể loại (Genre), đánh dấu yêu thích (Favorite flag), đánh giá sao (Rating), và ghi chú cá nhân (Notes).

### 1.2 Công nghệ & Kiến trúc
- **Frontend:** React Native với Expo (TypeScript khuyến nghị cao để đảm bảo type safety).
- **Quản lý trạng thái (State Management):** React Context API (`AuthContext`, `BooksContext`).
- **Xác thực người dùng (Authentication):** Firebase Authentication (Email/Password Provider) tích hợp lưu phiên đăng nhập bền vững qua `@react-native-async-storage/async-storage`.
- **Cơ sở dữ liệu (Database):** Cloud Firestore Database với quy tắc bảo mật cấp cơ sở dữ liệu (`firestore.rules`).
- **Cấu hình môi trường:** Biến môi trường thông qua `.env` (tiền tố `EXPO_PUBLIC_*`), tuyệt đối **không hardcode API key / secret key** trong mã nguồn. Cung cấp file mẫu `.env.example`.

---

## 2. QUY CHUẨN ĐẶT TÊN BẮT BUỘC (STRICT COMPLIANCE MATRIX)

> ⚠️ **LƯU Ý CỰC KỲ QUAN TRỌNG:**
> Hệ thống chấm bài (Grader) sử dụng kiểm thử tự động đọc trực tiếp dữ liệu Firestore và các component qua `testID`. Tất cả tên screen, nhãn hiển thị và `testID` phải **chính xác 100% từng chữ cái, không viết hoa/thường tùy tiện**.

### 2.1 Bảng tra cứu `testID` và chuỗi hiển thị bắt buộc

| Vị trí / Thành phần | `testID` | Chuỗi hiển thị (Exact Text) | Ghi chú |
| :--- | :--- | :--- | :--- |
| Tiêu đề tại Trang chủ | `home-title` | `BookShelf` | Bắt buộc hiển thị chữ `BookShelf` |
| Báo thành công Đăng ký | `form-success` | `Registration successful` | Hiển thị sau khi tạo tài khoản Firebase thành công |
| Lỗi Firebase Auth | `error-auth` | Thông báo từ Firebase | Hiển thị lỗi trùng email, sai mật khẩu, v.v. |
| Màn hình Sách đã đăng nhập | `list-screen` | — | Gắn vào container của List Screen |
| Form thêm sách | `book-form` | — | Gắn vào form nhập liệu thêm sách |
| Báo thêm sách thành công | `book-success` | `Book added` | Hiển thị ngay sau khi sách được lưu Firestore |
| Lỗi thêm sách từ Firestore | `error-book` | Thông báo lỗi từ Firestore | Ví dụ: trùng lặp sách cùng title + author |
| Từng cuốn sách trong danh sách | `book-item` | — | Gắn vào container thẻ từng cuốn sách |
| Trạng thái danh sách rỗng | `books-empty` | `No books found` | Hiển thị khi không có sách nào thỏa mãn |
| Tổng số sách đang hiển thị | `book-count` | Số nguyên thuần (VD: `3`, `0`) | Không kèm nhãn bên trong thẻ testID |
| Số sách yêu thích hiển thị | `favorite-count` | Số nguyên thuần (VD: `1`, `0`) | Không kèm nhãn bên trong thẻ testID |

---

## 3. THIẾT KẾ CƠ SỞ DỮ LIỆU & FIRESTORE SECURITY RULES

### 3.1 Cấu trúc Collection `books`
Một collection duy nhất có tên chính xác là `books`. Mỗi document lưu trữ 1 cuốn sách:

| Tên trường (Field) | Kiểu dữ liệu | Bắt buộc | Giá trị mặc định / Ràng buộc | Diễn giải |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `string` | Có | Firestore Document ID | ID duy nhất của sách |
| `userId` | `string` | Có | `request.auth.uid` | ID tài khoản người sở hữu |
| `title` | `string` | Có | 1 – 100 ký tự | Tiêu đề sách (không chỉ toàn khoảng trắng) |
| `author` | `string` | Có | 1 – 60 ký tự | Tác giả (không chỉ toàn khoảng trắng) |
| `genre` | `string` | Có | `Fiction` \| `Non-Fiction` \| `Academic` \| `Other` | Thuộc đúng 1 trong 4 thể loại |
| `status` | `string` | Có | `To Read` \| `Reading` \| `Finished` | Thuộc đúng 1 trong 3 trạng thái |
| `rating` | `number` \| `null` | Không | `null` (mặc định) | Số nguyên từ 0 đến 5 |
| `favorite` | `boolean` | Có | `false` (mặc định) | Cờ đánh dấu yêu thích |
| `notes` | `string` | Không | `""` (mặc định) | Tối đa 300 ký tự |
| `createdAt` | `number` / `timestamp`| Có | `Date.now()` | Thời gian tạo sách |

### 3.2 Ràng buộc cấp Cơ sở dữ liệu (Database-level Constraints)
Hệ thống chấm sẽ gửi trực tiếp các request sai phạm vào Firestore và **bắt buộc Firestore phải trả về lỗi**:
1. `title`: Không được rỗng, không được chỉ chứa khoảng trắng (`trim().size() > 0`), độ dài tối đa 100 ký tự.
2. `author`: Không được rỗng, không được chỉ chứa khoảng trắng (`trim().size() > 0`), độ dài tối đa 60 ký tự.
3. `genre`: Chỉ được là 1 trong 4 giá trị: `Fiction`, `Non-Fiction`, `Academic`, `Other`.
4. `status`: Chỉ được là 1 trong 3 giá trị: `To Read`, `Reading`, `Finished`.
5. `rating`: Nếu có, phải là số nguyên từ 0 đến 5 (`rating is int && rating >= 0 && rating <= 5`).
6. `notes`: Tối đa 300 ký tự (`notes.size() <= 300`).
7. **Quy tắc chống trùng lặp (Uniqueness):** Cùng một người dùng **không thể lưu 2 cuốn sách có cùng title + author** (so sánh không phân biệt hoa/thường - case-insensitive). Ví dụ: đã có *"Dune"* của *"Frank Herbert"* thì không được thêm *"dune"* của *"Frank Herbert"*. Hai người dùng khác nhau được phép lưu cùng một cuốn sách.
8. **Quy tắc bảo mật người dùng:**
   - Người chưa đăng nhập: Không được phép đọc hoặc ghi bất kỳ dữ liệu nào.
   - Người đã đăng nhập: Chỉ được đọc, thêm, sửa, xóa các tài liệu thuộc về chính mình (`userId == request.auth.uid`).
   - Cấm thay đổi quyền sở hữu sách sang người khác.

### 3.3 Mã nguồn chuẩn `firestore.rules`
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isValidBook(data) {
      return data.userId == request.auth.uid
        && data.title is string
        && data.title.trim().size() > 0
        && data.title.size() <= 100
        && data.author is string
        && data.author.trim().size() > 0
        && data.author.size() <= 60
        && data.genre in ['Fiction', 'Non-Fiction', 'Academic', 'Other']
        && data.status in ['To Read', 'Reading', 'Finished']
        && (!('rating' in data) || data.rating == null || (data.rating is int && data.rating >= 0 && data.rating <= 5))
        && (!('notes' in data) || data.notes == null || (data.notes is string && data.notes.size() <= 300))
        && (!('favorite' in data) || data.favorite is bool);
    }

    function bookUniqueKey(data) {
      return request.auth.uid + '_' + data.title.trim().lower() + '_' + data.author.trim().lower();
    }

    match /books/{bookId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;

      allow create: if request.auth != null
        && isValidBook(request.resource.data)
        && !exists(/databases/$(database)/documents/books/$(bookUniqueKey(request.resource.data)));

      allow update: if request.auth != null
        && resource.data.userId == request.auth.uid
        && isValidBook(request.resource.data)
        && (
          (resource.data.title.trim().lower() == request.resource.data.title.trim().lower()
           && resource.data.author.trim().lower() == request.resource.data.author.trim().lower())
          ||
          !exists(/databases/$(database)/documents/books/$(bookUniqueKey(request.resource.data)))
        );

      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 4. ĐẶC TẢ CHI TIẾT CÁC MÀN HÌNH (SCREENS & BEHAVIORS)

### 4.1 Màn hình Home (`HomeScreen` - Public, Màn hình đầu tiên)
- **Trạng thái Chưa đăng nhập:**
  - Header hiển thị tên ứng dụng `BookShelf`, nút **Login** và nút **Register**.
  - Phần thân: Tiêu đề có `testID="home-title"` hiển thị đúng chữ `BookShelf`.
  - Đoạn mô tả ngắn về ứng dụng.
  - Tối thiểu 3 feature cards (VD: *"Track your books"*, *"Sort by status"*, *"Rate your favorites"*).
- **Trạng thái Đã đăng nhập:**
  - Ứng dụng tự động chuyển thẳng vào màn hình **List Screen**.
  - Không được hiển thị màn hình Home khi đã có phiên đăng nhập hợp lệ.

---

### 4.2 Màn hình Đăng ký (`RegisterScreen`) & Đăng nhập (`LoginScreen`)

#### Quy tắc hiển thị thông báo lỗi Validation:
1. **Trước lần nhấn Submit đầu tiên:** Hoàn toàn **không hiển thị bất kỳ lỗi nào**.
2. **Sau khi nhấn Submit:** Hiển thị thông báo lỗi tương ứng với trường không hợp lệ.
3. **Khi người dùng sửa trường hợp lệ:** Lỗi của trường đó **phải biến mất ngay lập tức** (Real-time error dismissal).
4. Sử dụng thông báo riêng của ứng dụng, không dùng tooltip mặc định của bàn phím thiết bị.

#### Bảng thông báo lỗi chính xác:
| Trường (Field) | Điều kiện vi phạm | Thông báo lỗi chính xác (Exact Error Message) |
| :--- | :--- | :--- |
| **Email** (Cả 2 form) | Rỗng hoặc chỉ có khoảng trắng | `Email is required` |
| **Email** (Cả 2 form) | Sai định dạng email regex | `Please enter a valid email address` |
| **Password** (Cả 2 form) | Rỗng | `Password is required` |
| **Password** (Chỉ Register) | Ngắn hơn 6 ký tự | `Password must be at least 6 characters` |
| **Confirm password** (Chỉ Register) | Rỗng | `Confirm password is required` |
| **Confirm password** (Chỉ Register) | Không khớp với Password | `Passwords do not match` |

#### Xử lý phản hồi từ Firebase:
- **Register thành công:** Tạo tài khoản thật trên Firebase Auth, hiển thị banner có `testID="form-success"` với text `Registration successful`.
- **Login thành công:** Đăng nhập phiên thật và điều hướng ngay vào `ListScreen`.
- **Firebase từ chối** (email đã tồn tại, sai mật khẩu, tài khoản không tồn tại...): Hiển thị thông báo lỗi của Firebase trong phần tử có `testID="error-auth"`.

---

### 4.3 Màn hình Danh sách sách (`ListScreen` - Protected)
> **Bảo vệ màn hình:** Chỉ truy cập được sau khi Login/Register thành công. Trong quá trình kiểm tra phiên đăng nhập (lúc mở app), **không được để chớp giật nội dung** (No flash of content, no wrong navigation). Sử dụng Splash loading khi `authLoading = true`.

Container chính của màn hình phải có `testID="list-screen"`.  
Header hiển thị email của tài khoản đang đăng nhập và nút **Logout** (nhấn Logout sẽ trở về `HomeScreen`).

#### A. Form thêm sách (`book-form`)
- Nằm trên màn hình List, bao gồm các trường:
  - `title` (TextInput)
  - `author` (TextInput)
  - `genre` (Dropdown/Picker có lựa chọn đầu tiên rỗng là `Choose genre`, tiếp theo là `Fiction`, `Non-Fiction`, `Academic`, `Other`)
  - `status` (Dropdown/Picker có lựa chọn đầu tiên rỗng là `Choose status`, tiếp theo là `To Read`, `Reading`, `Finished`)
  - `rating` (TextInput tùy chọn, số nguyên 0 đến 5)
  - `notes` (TextInput tùy chọn, tối đa 300 ký tự)
- **Quy tắc Validation của form Thêm sách:**

| Trường (Field) | Điều kiện vi phạm | Thông báo lỗi chính xác (Exact Error Message) |
| :--- | :--- | :--- |
| **Title** | Rỗng hoặc chỉ toàn khoảng trắng | `Title is required` |
| **Title** | Dài hơn 100 ký tự | `Title must be at most 100 characters` |
| **Author** | Rỗng hoặc chỉ toàn khoảng trắng | `Author is required` |
| **Author** | Dài hơn 60 ký tự | `Author must be at most 60 characters` |
| **Genre** | Chưa chọn gì (hoặc chọn `Choose genre`) | `Please choose a genre` |
| **Status** | Chưa chọn gì (hoặc chọn `Choose status`) | `Please choose a status` |
| **Rating** | Nếu có nhập: không phải số nguyên từ 0 đến 5 | `Rating must be a whole number from 0 to 5` |
| **Notes** | Dài hơn 300 ký tự | `Notes must be at most 300 characters` |

- Khi submit hợp lệ:
  - Lưu sách vào Firestore cho user hiện tại.
  - Sách xuất hiện ngay lập tức trong danh sách bên dưới mà **không cần reload màn hình**.
  - Xóa trắng form nhập liệu.
  - Hiển thị thông báo thành công có `testID="book-success"` với text `Book added`.
- Khi Firestore trả về lỗi (ví dụ trùng `title + author`):
  - Hiển thị thông báo lỗi trong phần tử có `testID="error-book"`.
  - Không thêm bất kỳ dòng nào vào danh sách.

#### B. Danh sách sách (`The list`)
- Hiển thị toàn bộ sách của người dùng theo **thứ tự bảng chữ cái theo Title** (không phân biệt hoa/thường; nếu trùng Title thì xếp theo `author`).
- Mỗi cuốn sách là một thẻ có `testID="book-item"` chứa:
  - `title`, `author`, `genre`, `status`.
  - Nút chuyển đổi yêu thích: Nút hình ngôi sao (Star button), sáng (on/gold) khi là favorite, tắt khi không phải.
  - Khi bấm vào ngôi sao: Cập nhật ngay lập tức lên Firestore và giao diện đổi trạng thái ngay.
  - Khi đóng app và mở lại: Trạng thái danh sách và yêu thích giữ nguyên hoàn hảo.
  - Chạm vào thẻ sách để mở màn hình **Detail Screen**.
- Khi danh sách không có cuốn sách nào thỏa mãn: Hiển thị phần tử có `testID="books-empty"` với text chính xác `No books found` (thay thế cho danh sách).

#### C. Bộ lọc, Tìm kiếm và Bảng tổng kết (`Filter, search and summary`)
- **Bộ lọc kết hợp (Realtime, không cần bấm nút Apply):**
  - Genre filter: `All` hoặc 1 trong 4 thể loại.
  - Status filter: `All` hoặc 1 trong 3 trạng thái.
  - Favorites only switch: Công tắc chỉ hiển thị sách yêu thích.
  - Search box: Tìm kiếm sách có `title` hoặc `author` chứa cụm từ tìm kiếm (không phân biệt hoa/thường, tự động loại bỏ khoảng trắng thừa 2 đầu).
  - Tất cả các bộ lọc kết hợp đồng thời (AND). Khi một cuốn sách không còn thỏa mãn (VD bị bỏ star khi Favorites only đang bật), nó biến mất khỏi màn hình ngay lập tức.
  - Nút **Clear**: Khôi phục cả 4 bộ lọc về mặc định ban đầu (`All`, `All`, `false`, `""`).
- **Bảng tổng kết (Summary) - Mô tả các sách đang hiển thị trên màn hình:**
  - Số lượng sách đang hiển thị: thẻ có `testID="book-count"` chứa số nguyên thuần (VD: `<Text testID="book-count">3</Text>`).
  - Số lượng sách yêu thích đang hiển thị: thẻ có `testID="favorite-count"` chứa số nguyên thuần (VD: `<Text testID="favorite-count">1</Text>`).
  - Phân tích theo trạng thái (Status breakdown): Mỗi trạng thái có ít nhất 1 cuốn sách sẽ hiển thị 1 dòng gồm tên trạng thái và số lượng sách.
  - **Thứ tự sắp xếp dòng trạng thái:** Trạng thái có nhiều sách nhất đứng đầu; nếu số lượng bằng nhau thì xếp theo thứ tự ưu tiên: `To Read` → `Reading` → `Finished`.

---

### 4.4 Màn hình Chi tiết sách (`DetailScreen` - Protected)
- Mở ra khi chạm vào một cuốn sách trong danh sách.
- **Chế độ xem (View Mode):**
  - Hiển thị đầy đủ thông tin: `title`, `author`, `genre`, `status`, `rating`, `notes`.
  - Nút toggle yêu thích hình ngôi sao hoạt động độc lập.
  - Nút **Edit Book** và nút **Delete Book**.
- **Chế độ chỉnh sửa (Edit Mode):**
  - Nhấn nút Edit sẽ chuyển các trường thành ô nhập liệu tương ứng.
  - Có 2 nút: **Save** và **Cancel**.
  - Áp dụng cùng tập quy tắc kiểm tra và thông báo lỗi giống hệt form Thêm sách.
  - Nhấn Save: Cập nhật dữ liệu vào Firestore, đồng bộ danh sách và quay lại View Mode.
  - Nhấn Cancel: Hủy bỏ chỉnh sửa và quay lại View Mode.
- **Thao tác Xóa (Delete Action):**
  - Nhấn nút Delete hiển thị hộp thoại xác nhận (Alert / Confirmation dialog).
  - Sau khi xác nhận xóa: Xóa document trong Firestore và điều hướng quay lại `ListScreen`. Sách biến mất khỏi danh sách ngay lập tức và không xuất hiện lại sau khi khởi động lại app.

---

## 5. CÁC TÍNH NĂNG VÀ ĐIỂM CỘNG ĐỂ ĐẠT ĐIỂM TỐI ĐA (BONUS / HIGH SCORE)

1. **Authentication Session Persistence:** Sử dụng `@react-native-async-storage/async-storage` kết hợp `initializeAuth` của Firebase để người dùng không bị văng đăng nhập khi tắt và mở lại app.
2. **Zero Content Flashing:** Splash loading screen hiển thị trong lúc `onAuthStateChanged` kiểm tra token, ngăn ngừa tình trạng chớp nháy màn hình đăng nhập rồi mới nhảy vào màn hình danh sách.
3. **Badges màu sắc trực quan:** Gắn badge màu pastel sang trọng cho Genre và Status giúp chấm bài trực quan, chuyên nghiệp.
4. **Rating Stars Interactive:** Hiển thị 5 ngôi sao trực quan bên cạnh số điểm rating để tăng trải nghiệm người dùng.
5. **Real-time Firestore Listeners (`onSnapshot`):** Mọi thay đổi từ thiết bị khác hoặc Firestore Console đều cập nhật tức thì lên màn hình.
6. **Optimized Keyboard UX:** Dùng `KeyboardAvoidingView` và `ScrollView` giúp không bị che khuất nút bấm hoặc ô nhập liệu trên mọi kích thước màn hình Android và iOS.
7. **Production Code Cleanliness:**
   - 100% TypeScript không có lỗi kiểu dữ liệu (`npx tsc --noEmit` pass 0 errors).
   - 100% tương thích Expo SDK (`npx expo-doctor` pass 20/20 checks).
   - Kiến trúc tách lớp: `config/`, `context/`, `navigation/`, `screens/`, `components/`, `types/`, `styles/`.

---

## 6. DANH SÁCH 16 ẢNH CHỤP MÀN HÌNH BẮT BUỘC TRONG BÁO CÁO DOCX

Báo cáo nộp bài phải là file `<StudentCode>.docx` (Word thực, không đổi đuôi từ PDF).  
Chụp trực tiếp từ thiết bị thật hoặc máy ảo đã đăng nhập bằng test account của bạn:

1. **Firebase console — Authentication:** Danh sách Users hiển thị tài khoản test của bạn.
2. **Firebase console — Firestore data:** Collection `books` có ít nhất 3 documents thuộc test account.
3. **Firebase console — Security Rules:** Tab Rules hiển thị các quy tắc đã được Publish thành công.
4. **Register screen — validation:** Form đăng ký submit khi để trống, hiển thị các thông báo lỗi.
5. **Register screen — success:** Ngay sau khi đăng ký thành công, hiển thị `Registration successful`.
6. **Login screen:** Form đăng nhập để trống.
7. **List screen — after login:** Header hiển thị email người dùng, nút Logout, và có ít nhất 3 cuốn sách trong danh sách.
8. **Add Book form — validation:** Form thêm sách submit khi để trống/nhập sai, hiển thị các thông báo lỗi.
9. **Add Book form — success:** Ngay sau khi thêm sách thành công, hiển thị `Book added` và cuốn sách mới nằm ngay trong danh sách.
10. **Filters and search:** Ảnh chụp Genre filter, Status filter, Favorites-only switch, và Search box làm thay đổi danh sách hiển thị.
11. **Summary:** Hiển thị rõ `book-count`, `favorite-count` và bảng phân tích trạng thái (Status breakdown) với nhiều hơn 1 trạng thái.
12. **Detail screen — view mode:** Chi tiết 1 cuốn sách đầy đủ (title, author, genre, status, rating, notes).
13. **Detail screen — edit mode, validation:** Chế độ edit submit dữ liệu sai, hiển thị thông báo lỗi.
14. **Detail screen — after Save:** Chi tiết sách sau khi đã lưu các giá trị mới chỉnh sửa.
15. **Favorite toggle and Delete:** Cặp ảnh trước/sau khi toggle ngôi sao yêu thích, và một cuốn sách bị xóa biến mất khỏi danh sách.
16. **Empty state:** Màn hình `books-empty` với chữ `No books found` (chụp bằng tài khoản mới chưa có sách hoặc áp bộ lọc không khớp).

---

## 7. MẪU BÁO CÁO VÀ HỒ SƠ NỘP BÀI (SUBMISSION GUIDELINES)

Tạo một thư mục đặt tên theo mã sinh viên (Ví dụ: `QE200012`), bên trong chứa đúng 2 file:

### File 1: `<StudentCode>.docx`
Mẫu nội dung bắt buộc:
```text
Student Code: QE200012
Full Name: Nguyen Van A
GitHub Repository URL: https://github.com/username/repo-name
Expo Project Link: https://expo.dev/accounts/username/projects/project-name/builds/xxxxxxxx
Firebase Project ID: your-project-id
Test account email: grader.qe200012@example.com
Test account password: Test1234!

[Chèn 16 ảnh chụp màn hình kèm caption chú thích chi tiết bên dưới]
```

### File 2: `<StudentCode>.zip`
Nén toàn bộ source code với các quy tắc:
- `package.json` nằm ngay ở tầng ngoài cùng của file zip (không lồng trong thư mục phụ).
- Bao gồm: `package.json`, `package-lock.json`, `App.tsx`, thư mục `src/`, file `firestore.rules`, và file `.env.example`.
- **TUYỆT ĐỐI KHÔNG ĐƯA VÀO ZIP:** `node_modules/`, `.expo/`, `.git/`, hoặc file `.env` chứa API key thật.
- Chỉ dùng client-side Firebase config; tuyệt đối **không dùng Service Account / Admin SDK key**.
