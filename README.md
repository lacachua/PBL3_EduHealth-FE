# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Tôi khuyên dùng cấu trúc này:
frontend/
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ router/
│  │  │  ├─ index.jsx
│  │  │  ├─ protectedRoutes.jsx
│  │  │  └─ roleRoutes.jsx
│  │  ├─ providers/
│  │  │  ├─ AuthProvider.jsx
│  │  │  └─ AppProvider.jsx
│  │  ├─ store/
│  │  ├─ guards/
│  │  │  ├─ RequireAuth.jsx
│  │  │  └─ RequireRole.jsx
│  │  └─ config/
│  │     ├─ env.js
│  │     └─ permissions.js
│  │
│  ├─ assets/
│  │  ├─ images/
│  │  ├─ icons/
│  │  └─ styles/
│  │
│  ├─ layouts/
│  │  ├─ AuthLayout.jsx
│  │  ├─ AdminLayout.jsx
│  │  ├─ NurseLayout.jsx
│  │  └─ ParentLayout.jsx
│  │
│  ├─ shared/
│  │  ├─ components/
│  │  │  ├─ common/
│  │  │  ├─ form/
│  │  │  ├─ table/
│  │  │  ├─ modal/
│  │  │  └─ status/
│  │  ├─ hooks/
│  │  ├─ utils/
│  │  ├─ constants/
│  │  ├─ services/
│  │  │  ├─ httpClient.js
│  │  │  ├─ tokenService.js
│  │  │  └─ storageService.js
│  │  └─ validators/
│  │
│  ├─ features/
│  │  ├─ auth/
│  │  │  ├─ pages/
│  │  │  │  ├─ LoginPage.jsx
│  │  │  │  ├─ ForgotPasswordPage.jsx
│  │  │  │  ├─ VerifyOtpPage.jsx
│  │  │  │  └─ ChangePasswordPage.jsx
│  │  │  ├─ components/
│  │  │  ├─ services/
│  │  │  ├─ hooks/
│  │  │  └─ schemas/
│  │  │
│  │  ├─ dashboard/
│  │  │  ├─ admin/
│  │  │  ├─ nurse/
│  │  │  └─ parent/
│  │  │
│  │  ├─ users/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  ├─ services/
│  │  │  ├─ hooks/
│  │  │  └─ schemas/
│  │  │
│  │  ├─ catalogs/
│  │  │  ├─ medicines/
│  │  │  ├─ vaccines/
│  │  │  ├─ diseases/
│  │  │  └─ allergies/
│  │  │
│  │  ├─ students/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  ├─ services/
│  │  │  ├─ hooks/
│  │  │  └─ schemas/
│  │  │
│  │  ├─ health-records/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  └─ services/
│  │  │
│  │  ├─ inventory/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  └─ services/
│  │  │
│  │  ├─ examinations/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  └─ services/
│  │  │
│  │  ├─ vaccinations/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  └─ services/
│  │  │
│  │  ├─ reports/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  └─ services/
│  │  │
│  │  ├─ news/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  └─ services/
│  │  │
│  │  └─ parent-portal/
│  │     ├─ pages/
│  │     ├─ components/
│  │     └─ services/
│  │
│  ├─ pages/
│  │  ├─ NotFoundPage.jsx
│  │  ├─ ForbiddenPage.jsx
│  │  └─ ServerErrorPage.jsx
│  │
│  ├─ App.jsx
│  └─ main.jsx
│
├─ .env
├─ package.json
└─ vite.config.js
