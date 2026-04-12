# Braided Beauty Frontend

## Overview

This repository contains the React frontend for the Braided Beauty application. It serves the public marketing site, customer booking flow, authenticated customer dashboard, and the admin dashboard used to manage operational data.

The app is built with Vite and TypeScript and is configured as a client-rendered single-page application.

## Main Features

- Public marketing pages for landing, about, policies, and contact
- Service discovery by category and service detail pages
- Appointment booking flow, including pricing preview and booking success/cancel pages
- Guest appointment cancellation via tokenized link
- Email/password login and signup
- Google OAuth callback handling
- Forgot-password and reset-password flows
- Customer dashboard with profile and appointment management
- Admin dashboard for users, appointments, services, categories, add-ons, business hours, loyalty settings, business settings, promo codes, fees, analytics, and calendar management
- Temporary admin bootstrap page for first-time admin access setup

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- React Admin
- Tailwind CSS
- Radix UI
- Material UI
- Recharts

## Project Structure

High-level structure:

- `src/main.tsx`: app entry point, route registration, provider setup
- `src/features/marketing`: public-facing pages and booking flow
- `src/features/auth`: login, signup, password reset, OAuth callback, bootstrap admin
- `src/features/account`: authenticated customer dashboard pages, layout, and booking-related components
- `src/features/admin`: React Admin-based back-office dashboard, resources, calendar API helpers, layouts
- `src/components/shared`: site-wide layout, navbar, footer, shared display components
- `src/components/ui`: reusable UI primitives
- `src/context`: app-level providers such as current user and business settings
- `src/lib`: API clients, auth helpers, formatting helpers, logging, and shared utilities
- `src/hooks`: shared frontend hooks, including business settings query hook
- `src/styles`: global styles and admin overrides

## Routing Overview

Defined in `src/main.tsx`.

Public routes:

- `/`
- `/about`
- `/policies`
- `/contact`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/bootstrap-admin`
- `/categories`
- `/services/:categoryId`
- `/book/service/:serviceId`
- `/book/success`
- `/book/final/success`
- `/book/cancel`
- `/guest/cancel/:token`
- `/auth/callback`

Authenticated customer area:

- `/dashboard/me`
- `/dashboard/me/appointments`
- `/dashboard/me/profile`

Admin area:

- `/dashboard/admin/*`

The deploy config rewrites all routes to `index.html` in `vercel.json`, so the frontend expects SPA-style hosting.

## State Management And Data Access

The app uses a lightweight mix of React state, context, React Router loaders, TanStack Query, and custom API helpers.

- `UserProvider` loads the current authenticated user and exposes auth state through context.
- `BusinessSettingsProvider` uses TanStack Query to cache business settings fetched from the backend.
- Most public and account pages call backend endpoints through `src/lib/apiClient.ts`.
- React Admin uses `src/lib/httpClient.ts` plus `src/features/admin/ra/dataProvider.ts`.
- Access tokens are stored in `localStorage` and included as bearer tokens on authenticated requests.
- Requests are sent with `credentials: "include"` so the frontend can participate in cookie-based auth flows such as refresh/logout.

This repo does include `@tanstack/react-query`, but it is not used as the single global state solution. Usage is targeted rather than app-wide.

## Environment Variables

Environment variables referenced by the frontend code:

- `VITE_SERVER_API_URL`
- `VITE_SERVER_ADMIN_API_URL`
- `VITE_CLIENT_API_URL`

Notes:

- `import.meta.env.MODE` is read in the login page for debug logging, but it is a standard Vite runtime value rather than a project-specific env var.
- No values are documented here intentionally. Use environment-specific values outside the repo.

## Local Development

Prerequisites:

- Node.js compatible with the current Vite and TypeScript toolchain
- npm
- A reachable backend API configured through the required `VITE_...` variables

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Useful scripts:

```bash
npm run build
npm run lint
npm run preview
```

If authentication or booking flows do not work locally, verify the frontend env vars and backend CORS/cookie settings first.

## Build And Deployment

Production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

High-level deployment expectations:

- The app builds to static frontend assets through Vite.
- Hosting must serve the built SPA and rewrite unknown routes to `index.html`.
- This repo includes a `vercel.json` rewrite that supports client-side routing on Vercel-style hosting.
- Runtime environment variables must point to the correct backend services for the target environment.

## Backend Integration

The frontend talks to backend HTTP APIs rather than bundling any server logic in this repo.

Verified connection points in the code:

- Public and authenticated application calls use `src/lib/apiClient.ts`
- Auth refresh and logout use `src/lib/authClient.ts`
- React Admin calls use `src/lib/httpClient.ts` and `src/features/admin/ra/dataProvider.ts`
- Admin calendar pages use `src/features/admin/api/calendarApi.ts`

Examples of backend-backed flows in this frontend:

- auth login, register, logout, refresh, forgot password, reset password, OAuth callback
- current user and dashboard data
- business settings
- service/category availability
- booking, pricing preview, booking success/cancel follow-up
- guest cancellation
- admin CRUD and analytics endpoints

## Auth, Cookies, And CORS Expectations

Based on the frontend code:

- authenticated requests include a bearer token from `localStorage`
- requests also send cookies with `credentials: "include"`
- token refresh is performed against `/auth/refresh`
- logout is performed against `/auth/logout`
- login and OAuth flows expect the backend to issue or honor cookies in a way that makes refresh possible

For local and deployed environments, the backend must be configured so that:

- CORS allows the frontend origin
- credentialed requests are allowed
- cookie settings are valid for the target domain and protocol
- OAuth redirect handling returns the user to the frontend callback route

The exact backend cookie attributes are not documented here because they are not defined in this frontend repo.

## Notable Limitations

- This README documents the frontend only. Backend behavior, required API contracts, and deployment infrastructure details live outside this repo.
- There are some duplicate or legacy-looking files in the tree, such as `AdminCalendarPage 2.tsx` and `calendarApi 2.ts`. They do not appear to be part of the main route setup and are not treated as the primary implementation here.

## Onboarding Notes

- Start with `src/main.tsx` to understand the route map and provider setup.
- For public booking work, begin in `src/features/marketing/pages`.
- For customer dashboard work, begin in `src/features/account`.
- For admin work, begin in `src/features/admin/pages/AdminDashboardPage.tsx` and the corresponding `resources` directory.
- For API behavior, check `src/lib/apiClient.ts`, `src/lib/httpClient.ts`, and `src/lib/authClient.ts` first.
