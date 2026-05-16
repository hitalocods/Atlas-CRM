# Atlas

Premium personal operating system SaaS foundation for freelancers, creators, and project management.

## Stack

- Next.js 15 App Router
- TypeScript
- TailwindCSS v4
- shadcn/ui-style component source
- Supabase Auth
- PostgreSQL
- Zustand
- dnd-kit
- Recharts

## Modules

- Advanced dashboard with widgets, activity, quick actions and productivity insight
- CRM with client CRUD, tags, status, notes, revenue tracking, filters and search
- Projects with kanban board, drag-and-drop, priorities, deadlines, progress, labels, comments and attachments
- Tasks with reminders, priorities, project links and calendar-oriented views
- Finance with income, expenses, pending payments, goals, categories and charts
- Vault for links, credentials, API keys, snippets, docs and private references
- Analytics with revenue, productivity, client and project completion reporting
- Activity logs across project, task, payment, client and system events
- Language toggle with English and Portuguese (Brazil) using local preference storage

## Internationalization

Atlas ships with a lightweight i18n layer:

- `lib/i18n/dictionaries.ts` stores translation keys
- `providers/language-provider.tsx` exposes `useI18n()`
- the language toggle lives in the top navigation
- preference is saved in `localStorage` as `atlas-locale`

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase

1. Copy `.env.example` to `.env.local`.
2. Add:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

3. Run `database/schema.sql` in the Supabase SQL editor.

Without Supabase credentials, dashboard routes run in local demo mode so the product UI can be reviewed. After credentials are configured, dashboard routes require an authenticated Supabase session.

## Project Structure

```txt
app/          App Router routes and layouts
components/   reusable UI and shell components
features/     feature-owned screens and actions
services/     Supabase clients and integration code
stores/       Zustand stores
hooks/        client hooks
providers/    app-level providers
lib/          shared utilities
types/        shared TypeScript types
database/     SQL schema and migrations
```

## Verification

```bash
npm run typecheck
npm run build
```
