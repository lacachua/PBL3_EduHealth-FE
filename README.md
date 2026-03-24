# EduHealth FE

Frontend cho hệ thống quản lý sức khỏe học đường, xây dựng bằng React + Vite, hỗ trợ phân quyền theo vai trò và luồng xác thực đăng nhập.

## Công nghệ sử dụng

- React 19
- Vite 8
- React Router DOM 7
- Axios
- Tailwind CSS v4
- ESLint 9

## Yêu cầu môi trường

- Node.js 18+
- npm 9+

## Cài đặt và chạy dự án

1. Cài dependencies:

```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:

```powershell
copy .env.example .env
```

3. Chạy môi trường development:

```bash
npm run dev
```

4. Build production:

```bash
npm run build
```

5. Preview bản build:

```bash
npm run preview
```

## Biến môi trường

Các biến được khai báo tại `src/app/config/env.js`:

- `VITE_API_BASE_URL`: URL backend API
- `VITE_APP_NAME`: tên ứng dụng
- `VITE_ENABLE_MOCK_AUTH`: bật/tắt đăng nhập giả lập
  - `true` hoặc bỏ trống: bật mock auth
  - `false`: gọi API thật qua endpoint `/auth/login`

## Tài khoản mock để test nhanh

Khai báo tại `src/features/auth/constants/mockAuthAccounts.js`, xử lý ở `src/features/auth/services/authApi.js`.

- Admin
  - Email: `ntctuyen@gmail.com`
  - Password: `Tuyen123@`
  - Route: `/admin/dashboard`
- Nurse
  - Email: `ntctuyen01@gmail.com`
  - Password: `Tuyen123@`
  - Route: `/nurse/dashboard`
- Parent
  - Email: `ntctuyen02@gmail.com`
  - Password: `Tuyen123@`
  - Route: `/parent/dashboard`

## Routing chính

Định nghĩa ở `src/app/router/index.jsx`:

- Public routes
  - `/`
  - `/login`
  - `/forgot-password`
  - `/verify-otp`
  - `/change-password`
- Protected routes
  - `/admin/dashboard` (role `admin`)
  - `/nurse/dashboard` (role `nurse`)
  - `/parent/dashboard` (role `parent`)
- Error routes
  - `/403`
  - `/500`
  - `*`

## Cấu trúc thư mục

- `src/app`: router, guards, providers, config
- `src/features`: module theo domain (`auth`, `dashboard`, `students`, `users`, ...)
- `src/layouts`: layout theo vai trò
- `src/pages`: trang public và trang lỗi
- `src/shared`: component dùng chung, services, hooks, utils, validators
- `src/assets`: styles, images, icons

## Scripts

- `npm run dev`: chạy local
- `npm run build`: build production
- `npm run preview`: preview build
- `npm run lint`: kiểm tra ESLint
