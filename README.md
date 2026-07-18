# Hair Salon Booking System — Frontend (Professional V2)

A modern, responsive React frontend for a premium London hair salon booking platform. Built with React 18, TypeScript, Vite, Tailwind CSS, and TanStack Query.

## Tech Stack

- **Framework**: React 18.3 + TypeScript (strict)
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query) + React Context
- **Styling**: Tailwind CSS v3
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **HTTP**: Axios with JWT interceptors

## Features

### Customer Experience
- 🏠 **Landing Page** — Hero section, featured services & stylists
- 💇 **Services Catalog** — Browse services with category filters
- 👩‍🎨 **Stylist Directory** — Profile cards with specializations
- 📅 **4-Step Booking Flow** — Service → Stylist → Date/Time → Confirm
- 👤 **Customer Dashboard** — Upcoming bookings, history, profile
- 🔐 **Auth** — Registration, login, password reset

### Admin Dashboard
- 📊 **Statistics** — Total bookings, users, services, stylists
- 📋 **Booking Management** — View, reschedule, cancel all appointments
- 👥 **User Management** — Role assignment (USER → MODERATOR → ADMIN)
- 💼 **Service Management** — CRUD for salon services
- 👩‍🎨 **Stylist Management** — CRUD for staff profiles

### Design System
- 🎨 Premium London palette — ink black, warm ivory, bronze, deep burgundy, muted sage (Tailwind tokens) with an editorial serif (Fraunces) for headings
- 🔌 API client aligned to the backend contract (raw DTOs, correct endpoints, flat login mapping)
- 📱 Fully responsive (mobile-first)
- ♿ Accessible (ARIA labels, keyboard navigation, focus states)
- ⏳ Skeleton loaders & empty states
- 🔔 Toast notifications

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/discover` | Discover salons (search) | Public |
| `/salons/:id` | Salon profile (services, reviews, policies) | Public |
| `/services` | Services | Public |
| `/stylists` | Stylists | Public |
| `/booking` | Booking Flow | Authenticated |
| `/business` | My businesses | Authenticated |
| `/business/new` | Onboard a business | Authenticated |
| `/business/:businessId/*` | **Business dashboard** — overview, calendar, services, staff, schedules, locations, customers, waitlist, reviews, portfolio, payments, reports, settings | Business members |
| `/platform` | Platform administration | ADMIN, MODERATOR |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | Forgot Password | Public |
| `/reset-password` | Reset Password | Public |
| `/dashboard` | Customer Dashboard | USER |
| `/admin` | Admin Dashboard | ADMIN, MODERATOR |
| `*` | 404 Not Found | Public |

## Testing

- **Unit / component**: Vitest + React Testing Library — `npm run test` (validators, UI components, API contract).
- **End-to-end**: Playwright — `npx playwright install chromium` then `npm run e2e` against a running stack (frontend on :3000 + backend + DB).
- **Lint / build**: `npm run lint` (0 warnings) and `npm run build` (tsc + vite).

The business dashboard connects every screen to a real backend endpoint (see `src/api/businessAdmin.ts`).

## Local Development

### Prerequisites
- Node.js 20+
- Backend API running (see backend README)

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:8080

# Start dev server
npm run dev
```

The dev server will start at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080` | Backend API base URL (no trailing slash) |

## Project Structure

```
src/
├── api/           — Axios client & API functions
├── components/    — Reusable UI components
│   ├── admin/     — Dashboard management panels
│   ├── auth/      — Login, register, password forms
│   ├── booking/   — Booking flow step components
│   ├── customer/  — Dashboard booking lists
│   ├── layout/    — Navbar, footer, page layout
│   └── ui/        — Primitive components (Button, Input, Card, etc.)
├── context/       — AuthContext provider
├── hooks/         — Custom React hooks
├── pages/         — Route-level page components
├── types/         — TypeScript interfaces
└── utils/         — Formatters & validators
```

## API Integration

All API calls use `/api/v1` prefix:
- `GET /api/v1/services` — List services
- `POST /api/v1/auth/login` — Login
- `GET /api/v1/bookings/available-slots` — Fetch time slots
- etc.

The Axios client automatically:
- Attaches `Authorization: Bearer <token>` header
- Redirects to `/login` on 401 responses
- Prefixes all requests with `VITE_API_URL`

## Authentication Flow

1. User logs in → backend returns JWT token + user info
2. Token stored in `localStorage`
3. `AuthContext` restores session on app load
4. Axios interceptor adds token to every request
5. On 401 → clear storage, redirect to login

## Role-Based Access

| Role | Redirect After Login | Accessible Routes |
|------|---------------------|-------------------|
| USER | `/dashboard` | `/`, `/services`, `/stylists`, `/booking`, `/dashboard` |
| MODERATOR | `/admin` | All + `/admin` |
| ADMIN | `/admin` | All + `/admin` |

## Responsive Breakpoints

- **Mobile**: < 640px (single column, hamburger nav)
- **Tablet**: 640px – 1024px (2-column grids)
- **Desktop**: > 1024px (full layout)

## Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-*.js    (~429 KB, 125 KB gzipped)
│   └── index-*.css   (~24 KB, 5 KB gzipped)
```

## License

MIT
