# EduHealth FE

EduHealth FE là ứng dụng frontend cho hệ thống quản lý sức khỏe học đường EduHealth. Ứng dụng hỗ trợ các luồng nghiệp vụ theo vai trò Admin, Nurse và Student, kết nối với backend ASP.NET Core Web API thông qua API prefix `/api/v1`.

## Công Nghệ Sử Dụng

- React 19
- Vite 8
- React Router DOM 7
- Axios
- Tailwind CSS v4
- ESLint
- Recharts
- SignalR
- Vitest
- Playwright

## Yêu Cầu Môi Trường

- Node.js 18+
- npm 9+

## Cài Đặt Và Chạy Dự Án

```bash
npm install
```

Tạo file môi trường từ file mẫu:

```powershell
copy .env.example .env
```

Chạy môi trường development:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview bản build:

```bash
npm run preview
```

## Biến Môi Trường Quan Trọng

- `VITE_API_BASE_URL`: Base URL dùng khi gọi API. Khi để trống trong môi trường Vite dev, frontend sẽ gọi qua proxy `/api`.
- `VITE_DEV_API_PROXY_TARGET`: Backend target cho Vite proxy `/api` và `/hubs`, ví dụ `https://localhost:7012`.
- `VITE_SIGNALR_BASE_URL`: Base URL cho kết nối SignalR. Có thể để trống để dùng cùng origin/proxy trong môi trường dev.
- `VITE_DATA_MODE`: Chế độ dữ liệu, gồm `mock`, `live` hoặc `hybrid`.
- `VITE_ENABLE_AUTH_MOCK`: Bật/tắt mock cho xác thực.
- Các biến mock theo module:
  - `VITE_ENABLE_ADMIN_USERS_MOCK`
  - `VITE_ENABLE_ADMIN_STUDENTS_MOCK`
  - `VITE_ENABLE_ADMIN_CATALOGS_MOCK`
  - `VITE_ENABLE_ADMIN_MEDICINES_MOCK`
  - `VITE_ENABLE_ADMIN_REPORTS_MOCK`
  - `VITE_ENABLE_ADMIN_SYSTEM_LOGS_MOCK`
  - `VITE_ENABLE_ADMIN_SETTINGS_MOCK`
  - `VITE_ENABLE_ADMIN_DASHBOARD_MOCK`
  - `VITE_ENABLE_NURSE_STUDENTS_MOCK`
  - `VITE_ENABLE_NURSE_HEALTH_PROFILE_MOCK`
  - `VITE_ENABLE_NURSE_MEDICINES_MOCK`
  - `VITE_ENABLE_NURSE_EXAMINATIONS_MOCK`
  - `VITE_ENABLE_NURSE_VACCINATIONS_MOCK`
  - `VITE_ENABLE_NOTIFICATIONS_INBOX_MOCK`
  - `VITE_ENABLE_NURSE_NOTIFICATIONS_MOCK`
  - `VITE_ENABLE_NURSE_REPORTS_MOCK`
  - `VITE_ENABLE_NURSE_DASHBOARD_MOCK`
  - `VITE_ENABLE_CURRENT_USER_ACCOUNT_MOCK`
  - `VITE_ENABLE_STUDENT_PORTAL_MOCK`

## Cấu Hình `.env` Mẫu Khi Chạy Với Backend Thật

Backend local có thể chạy ở `https://localhost:7012`.

```env
VITE_API_BASE_URL=
VITE_DEV_API_PROXY_TARGET=https://localhost:7012
VITE_SIGNALR_BASE_URL=
VITE_DATA_MODE=live
VITE_ENABLE_AUTH_MOCK=false
```

## Tài Khoản Test Local

| Vai trò | Username | Password | Route sau đăng nhập |
| --- | --- | --- | --- |
| Admin | `admin` | `123456Aa@` | `/admin/dashboard` |
| Nurse | `nurse01` | `123456` | `/nurse/dashboard` |
| Student | `HS001` | `123456` | `/student/overview` |

## Routing Chính

### Public

- `/`
- `/login`
- `/forgot-password`
- `/verify-otp`
- `/change-password`

### Protected

- `/admin/dashboard`
- `/nurse/dashboard`
- `/student/overview`

### Error

- `/403`
- `/500`
- `*`

## Cấu Trúc Thư Mục

- `src/app`: Cấu hình ứng dụng, router, guards và các thiết lập cấp app.
- `src/features`: Các module nghiệp vụ theo domain.
- `src/layouts`: Layout theo nhóm trang và vai trò.
- `src/pages`: Trang public, trang lỗi và các page cấp cao.
- `src/shared`: Component, hook, service, utility, validator và cấu hình dùng chung.
- `src/assets`: Hình ảnh, style và tài nguyên tĩnh.
- `tests`: Thư mục test nếu được bổ sung trong quá trình phát triển.

## Module Chính

- **Auth**: Đăng nhập, quên mật khẩu, xác thực OTP, đổi mật khẩu và quản lý phiên người dùng.
- **Admin Dashboard**: Tổng quan số liệu hệ thống cho quản trị viên.
- **User Management**: Quản lý tài khoản và phân quyền người dùng.
- **Student Management**: Quản lý hồ sơ học sinh và thông tin liên quan.
- **Nurse Dashboard**: Tổng quan công việc cho nhân viên y tế.
- **Medicines**: Quản lý thuốc, tồn kho, nhập kho, hủy thuốc và cảnh báo.
- **Examinations**: Quản lý khám sức khỏe, lịch sử khám và chi tiết đợt khám.
- **Vaccinations**: Quản lý chiến dịch tiêm chủng, danh sách học sinh và trạng thái tiêm.
- **Notifications**: Gửi, nhận và quản lý thông báo trong hệ thống.
- **Messaging/SignalR**: Nhắn tin và cập nhật realtime thông qua SignalR.
- **Reports**: Báo cáo, thống kê và theo dõi dữ liệu sức khỏe học đường.

## Lưu Ý Khi Nối Backend

- Không thêm `/api/v1` vào `VITE_DEV_API_PROXY_TARGET`.
- Frontend đã gọi endpoint dạng `/api/v1/...`.
- Khi test với backend local, Vite proxy đang xử lý `/api` và `/hubs` trong `vite.config.js`.
- Nếu gặp lỗi CORS hoặc `Network Error`, kiểm tra cấu hình proxy trong `vite.config.js` và biến `VITE_DEV_API_PROXY_TARGET`.
- Nếu lỗi tạo đợt tiêm `CLASS_NOT_FOUND`, kiểm tra response của `GET /api/v1/classes` và payload `targetClassIds` gửi lên `POST /api/v1/vaccination-campaigns`.

## Scripts

- `npm run dev`: Chạy ứng dụng ở môi trường development.
- `npm run build`: Build production.
- `npm run preview`: Preview bản build.
- `npm run lint`: Kiểm tra ESLint.
- `npm run test`: Chạy Vitest ở chế độ watch.
- `npm run test:run`: Chạy Vitest một lần.
