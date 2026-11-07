# Reflection Scrap Solutions LLP — Web Platform

Production-ready waste collection, scrap trading, and recycling platform for **Reflection Scrap Solutions LLP** (LLPIN ACY-4261), located in **MIDC, Andheri East, Mumbai, Maharashtra 400093**.

---

## 1. Business Profile & Facts

| Property | Value |
| :--- | :--- |
| **Legal Entity** | Reflection Scrap Solutions LLP |
| **LLPIN** | ACY-4261 |
| **Location & Yard** | MIDC, Andheri East, Mumbai, Maharashtra 400093 |
| **Operating Hours** | Monday to Sunday, 8:00 AM to 10:00 PM (7 Days a week) |
| **Core Services** | Waste collection, scrap trading, recycling, doorstep pickup, on-the-spot accurate digital weighing, and instant cash / UPI payment |
| **Service Scope** | Residential societies, commercial offices, factories, IT parks, and workshops |
| **Contact Phone** | `+91 98200 12345` (Configurable in `lib/site-config.ts`) |
| **WhatsApp Direct**| `+91 98200 12345` (Configurable in `lib/site-config.ts`) |
| **Email** | `contact@reflectionscrap.com` |

---

## 2. Technology Architecture

- **Web Framework**: Next.js 14+ (App Router, Server Actions, TypeScript)
- **Styling & System**: Tailwind CSS, Montserrat typography (`next/font/google`), Lucide React icons
- **Brand Identity**:
  - Primary Blue: `#3B8BC4`
  - Eco Green Accent: `#5BAE65`
  - Charcoal Dark Text: `#111111`
  - Warm Canvas Background: `#FAFAF7`
- **Backend & Database**: Supabase (PostgreSQL 15+, Supabase Auth, Storage bucket `pickup-photos`)
- **Security & Authorization**: Row Level Security (RLS) on 100% of tables with `is_admin()` Security Definer function and role-escalation prevention triggers
- **Auth Session Sync**: `@supabase/ssr` with Next.js edge route-guard middleware
- **Validation**: Server-side and client-side Zod validation with `react-hook-form`
- **Hosting & Deployability**: Vercel ready with strict environment segregation (`.env.example`)

---

## 3. Local Development Setup

### Prerequisites
- Node.js 18+ (tested up to Node 26)
- npm or pnpm

### Step 1: Clone and Install
```bash
git clone <your-repo-url>
cd "Reflection Scrap"
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_PHONE_OTP=false
```

> **Security Rule**: The Supabase Service Role Key is strictly backend-only and must **never** be exposed or prefixed with `NEXT_PUBLIC_`.

### Step 3: Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Supabase Setup Guide

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com) and click **"New Project"**.
2. Select your organization and choose region **South Asia (Mumbai) - `ap-south-1`** for the lowest latency.
3. Choose a strong database password and copy your project URL and anon public key into `.env.local`.

### 2. Apply Database Schema & Migrations
1. In your Supabase Dashboard, navigate to the **SQL Editor**.
2. Open `supabase/migrations/20240101000000_init_schema.sql` from this repository.
3. Paste its contents into the SQL Editor and click **Run**.
4. This creates:
   - Tables: `profiles`, `addresses`, `scrap_categories`, `scrap_items`, `rate_history`, `service_areas`, `pickups`, `pickup_items`, `pickup_photos`, `enquiries`.
   - Security helper function: `public.is_admin()`.
   - New user trigger: `handle_new_user()` on `auth.users` -> inserts `public.profiles` (`role = 'customer'`).
   - Anti-escalation trigger: `prevent_role_escalation()` prevents users from altering their role.
   - Rate history audit trigger: `log_rate_history()`.
   - Row Level Security (RLS) on all tables and storage policies.
   - Supabase Storage bucket: `pickup-photos` (private, 5 MB file size limit).

### 3. Run the Seed Script (Categories & Pincodes)
1. In the Supabase **SQL Editor**, open `supabase/seed.sql`.
2. Paste the contents and click **Run**.
3. This seeds:
   - 10 scrap categories (Iron & Steel, Copper, Brass, Aluminium, Stainless Steel, Plastic, Paper & Cardboard, E-Waste, Batteries, Appliances).
   - 5 sample Mumbai service pincodes:
     - `400093`: MIDC, Andheri East (Primary Yard Area)
     - `400059`: Marol, Andheri East
     - `400069`: Andheri East Station & Gundavali
     - `400072`: Saki Naka, Andheri East
     - `400076`: Powai & Hiranandani
   - Sample scrap items with placeholder rates (`0.00`).

> ⚠️ **IMPORTANT ACTION REQUIRED**:
> All sample rates in `supabase/seed.sql` are initial **placeholders (0.00)**.
> Please update them with your actual market prices either in the Supabase Table Editor or directly in the `/admin/rates` panel!

---

## 5. Creating Your First Admin Account

By default, every new user account is created with `role = 'customer'`. To grant administrator privileges:

1. Create a user account on your site via `/signup` or `/login` with your email.
2. Go to your **Supabase Dashboard** -> **SQL Editor**.
3. Run the following query with your email:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-admin-email@reflectionscrap.com'
);
```
4. Log out and log back in on the website.
5. You can now access the full operations control room at `/admin` (Overview, Pickups, Rates CRUD, Enquiries, Service Areas, Customers).

---

## 6. Configuring Google OAuth (Optional)

1. Create a Google Cloud Project in [Google Cloud Console](https://console.cloud.google.com).
2. Configure OAuth Consent Screen (External, app name: "Reflection Scrap Solutions").
3. Create an **OAuth 2.0 Client ID** (Web application).
4. Add Authorized Redirect URI:
   `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`
5. In your Supabase Dashboard, go to **Authentication** -> **Providers** -> **Google**.
6. Enable Google and paste your Client ID and Client Secret.

---

## 7. Deploying to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set the **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://<your-supabase-project-id>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<your-anon-key>`
   - `NEXT_PUBLIC_APP_URL` = `https://your-custom-domain.com`
   - `NEXT_PUBLIC_ENABLE_PHONE_OTP` = `false`
5. Click **Deploy**.
6. In Supabase Dashboard -> **Authentication** -> **URL Configuration**:
   - Set **Site URL** to `https://your-custom-domain.com`.
   - Add `https://your-custom-domain.com/**` to **Redirect URLs**.

---

## 8. Application Routes Map

### Public Routes
- `/`: Home page (Hero, Trust Strip, Services preview, Live Rates preview, How It Works, CTA, FAQ preview)
- `/services`: Full breakdown of 6 core scrap and recycling services
- `/rates`: Scrap rates table with category filter, search, and "Estimate My Value" calculator
- `/what-we-accept`: 10 material categories with acceptance guidelines & hazardous notice
- `/about`: Company history, LLP credentials (ACY-4261), MIDC Andheri East facility
- `/contact`: Contact form with server-side Zod validation, embedded Google Map, phone, WhatsApp
- `/faq`: Categorized questions and answers
- `/privacy`: Privacy Policy (marked "review with legal counsel")
- `/terms`: Commercial Terms of Service (marked "review with legal counsel")
- `/sitemap.xml` & `/robots.txt`: Automated search engine indexing

### Booking & Customer Routes (Auth Protected)
- `/book`: 5-step booking wizard (Items -> Address / Yard -> Schedule -> Photos -> Review & Confirm)
- `/dashboard`: Customer pickups overview, status badges, settlement amounts
- `/dashboard/pickups/[code]`: Detail view, status timeline, item weights, cancellation
- `/dashboard/addresses`: Saved pickup addresses CRUD & default toggling
- `/dashboard/profile`: Contact name & phone updates

### Admin Control Room (`role = admin`)
- `/admin`: Operations overview metrics, pending today, monthly weight, payout metrics
- `/admin/pickups`: Full filterable pickups table, status transitions, staff assignment, scale weights, CSV export
- `/admin/rates`: Full categories & scrap items CRUD with automatic audit logging into `rate_history`
- `/admin/enquiries`: Contact messages inbox with read/replied toggles
- `/admin/service-areas`: Add and manage eligible Mumbai postal pincodes
- `/admin/customers`: Read-only customer accounts directory
