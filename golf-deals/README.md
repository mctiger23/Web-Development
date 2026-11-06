# Fairway Steals – Golf Deals Site

A mobile-friendly site that lists golf deals, with an admin dashboard for adding and managing them.
Shoppers click **Get Deal** and go to the retailer (or your affiliate link). There's no checkout to run.

Built with **Next.js** and **Tailwind CSS**, with **Supabase** for the database, admin login and image storage.
The site builds to plain static files, so hosting can be free.

## Features

**For shoppers**
- Deal grid with % off badges, original and sale price, and live countdown timers
- "Hot deals" row for featured deals
- Search, category filters and sorting (newest, biggest discount, price, ending soon). Filters are kept in the URL so links can be shared
- Deal page with a coupon code copy button, a share button and savings shown
- Expired, hidden and scheduled deals are left off automatically

**For admins** (`/admin`)
- Email and password login. Only accounts in the `admins` table can make changes
- Dashboard showing live, scheduled and expired counts plus total clicks, with search and status filters
- One-tap toggles to show or hide a deal and to feature it, plus duplicate and delete
- Deal editor with a live preview, photo upload, quick end times (24h, 48h, 7 days) and start times for scheduling
- Works on a phone: big tap targets, a floating "New deal" button and a save bar that stays on screen

## Run it locally

```bash
cd golf-deals
npm install
npm run dev
```

Open http://localhost:3000. Without Supabase keys it runs in **demo mode**: sample deals are stored in your browser,
and any email and password logs you in to `/admin`. Use this to try everything out.

## Go live with Supabase (free tier)

1. Create a project at https://supabase.com.
2. **SQL Editor → New query**: paste all of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
   This creates the `deals` table, the security rules and the `deal-images` storage bucket.
3. **Authentication → Users → Add user**: create your admin email and password.
4. Make that user an admin by running this in the SQL Editor:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
5. **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up" so nobody else can create accounts.
6. Copy `.env.example` to `.env.local` and fill in the values from **Project Settings → API**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   NEXT_PUBLIC_SITE_NAME=Fairway Steals
   ```
   The anon key is safe to put in the browser. The database security rules stop visitors from changing anything.

## Deploy

`npm run build` creates a static site in `out/`.

- **Vercel / Netlify**: import the repo, set the root directory to `golf-deals`, and add the env variables above.
  On Netlify, set the publish directory to `out`.
- **GitHub Pages**: build with `NEXT_PUBLIC_BASE_PATH=/your-repo-name` set, then publish the `out/` folder.

New deals appear straight away. You don't need to rebuild when deals change.

## Project layout

```
app/
  page.js               Home: hero, Hot deals, search, filters, grid
  deal/                 Deal page (/deal/?id=...)
  admin/                Dashboard (/admin)
  admin/edit/           Add or edit a deal (/admin/edit/?id=... or ?copy=...)
components/             Deal card, countdown, header, admin pieces
lib/
  config.js             Site name, categories, sort options
  dealsApi.js           All reads and writes (Supabase, or demo storage)
  format.js             Prices, discounts, deal status, dates
  sampleDeals.js        Demo data
supabase/schema.sql     Database tables, security rules and storage
```

To change the categories, edit `CATEGORIES` in `lib/config.js`. To change the colours, edit the `--color-turf-*`
and `--color-flag` values in `app/globals.css`.

## Ideas for later

- Email or SMS alerts for new deals (for example with Supabase and Resend)
- Price history, or a "deal ended" archive page
- Generating a static page per deal for better SEO (needs a rebuild hook, or a server host such as Vercel without `output: "export"`)
