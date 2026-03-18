# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication

Always communicate with the user in Mongolian (монгол хэлээр). Code, file names, and technical terms can remain in English, but all explanations, questions, and status updates must be in Mongolian.

## Project Overview

Maison Élise is a luxury handbag e-commerce storefront built with Next.js 16 (App Router) and deployed on Vercel. The project has two layers: a database-backed commerce core (Prisma + Supabase PostgreSQL) and a legacy static presentation layer that coexists during migration.

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm lint` — run ESLint
- `pnpm start` — serve production build
- `pnpm dlx prisma generate` — regenerate Prisma client (output: `lib/generated/prisma/`)
- `pnpm dlx prisma migrate dev` — run database migrations
- `pnpm dlx prisma db seed` — seed database (`prisma/seed.ts`)
- `pnpm dlx shadcn@latest add <component>` — add shadcn/ui component

## Tech Stack

- **Next.js 16** with App Router, React 19, TypeScript
- **Tailwind CSS v4** via `@tailwindcss/postcss` (no `tailwind.config` file — config is in `app/globals.css`)
- **shadcn/ui** (new-york style, RSC-enabled) — UI primitives in `components/ui/`
- **Prisma** with `@prisma/adapter-pg` (PostgreSQL driver adapter) — schema in `prisma/schema.prisma`, generated client in `lib/generated/prisma/`
- **Supabase** — PostgreSQL database + auth (profiles linked to `auth.users`)
- **Stripe** — payment processing with webhooks (`app/api/webhooks/stripe/`)
- **Upstash Redis** — cart session storage, rate limiting (checkout: 5/min, waitlist: 3/min)
- **Lucide React** for icons, **Framer Motion** for animations
- **Recharts** for charts, **Embla** for carousels, **Vaul** for drawers
- **Zod** — request validation (`lib/validators/`)
- Path alias: `@/*` maps to project root

## Architecture

### Routes
- `/` — homepage
- `/product/[slug]` — product detail (slug-based, not id-based)
- `/collection` — collection page (supports `?category=`, `?sort=`, `?page=` query params)
- `/bags` — bags category page (reuses CollectionContent with parentCategory filter)
- `/jewellery` — jewellery category page
- `/accessories` — accessories category page
- `/api/products`, `/api/products/[slug]`, `/api/products/[slug]/variants` — product API
- `/api/cart`, `/api/cart/items`, `/api/cart/items/[id]`, `/api/cart/merge` — cart API (guest sessions via `cart_session` cookie)
- `/checkout` — checkout page (shipping, payment, order review)
- `/checkout/confirmation` — order confirmation (query: orderId, payment_intent_client_secret)
- `/api/checkout/intent` — Stripe PaymentIntent creation
- `/api/webhooks/stripe` — Stripe webhook handler
- `/auth/login` — login page
- `/auth/signup` — signup page
- `/auth/callback` — auth callback (code exchange, profile creation, cart merge)
- `/account` — user account dashboard (protected, requires auth) — shows recent orders, wishlist, addresses
- `/account/orders/[id]` — order detail page (protected, owner-only)
- `/account/addresses` — address book CRUD page (protected)
- `/api/orders` — `GET` list user orders (auth required, pagination: `?page=`, `?limit=`)
- `/api/orders/[id]` — `GET` single order with items + variants (auth required, owner-only)
- `/api/addresses` — `GET` list addresses, `POST` create address (auth required)
- `/api/addresses/[id]` — `PATCH` update, `DELETE` remove address (auth required, owner-only)
- `/api/waitlist` — `POST` join waitlist (email + productId)
- `/api/waitlist/[productId]` — `GET` check registration status (`?email=` required)
- `/api/wishlist` — `GET` list wishlist, `POST` toggle (add/remove by variantId)
- `/api/wishlist/[id]` — `DELETE` remove by wishlist item ID (session-scoped)
- `/api/concierge` — `POST` concierge inquiry → sends email via Resend
- `/size-guide` — bag dimensions, strap lengths, material care (static)
- `/concierge` — luxury concierge contact page with form
- `/sitemap.xml` — dynamic sitemap (products + collections + static routes)
- `/robots.txt` — robots.txt (disallows /admin/, /api/, /account/)
- `/admin` — admin dashboard (protected: `ADMIN_EMAILS` env var, redirects unauthorized to `/`)
- `/admin/orders` — order list with status filter + inline status update
- `/admin/products` — product list with expandable variant inventory editor
- `/api/admin/orders/[id]` — `PATCH` update order status (admin only)
- `/api/admin/products/[id]/inventory` — `PATCH` update variant stock quantity (admin only)

### Data Flow (Dual-Layer)
The project is mid-migration between two data architectures:

1. **Legacy layer**: `data/products.ts` has hardcoded product data using `types/Product` interface (prices in dollars). Some UI components still consume this directly.
2. **Database layer**: Prisma models → API routes return DTOs (`types/ProductDTO`, `CartDTO`, etc.) with prices in **cents**. The adapter in `lib/adapters.ts` converts `ProductDTO` → `DisplayProduct` for UI consumption (cents → dollars).

### Key Modules
- `context/cart-context.tsx` — client-side cart state backed by API calls, with `cart_session` cookie for guest users
- `lib/prisma.ts` — singleton Prisma client with pg pool adapter
- `lib/stripe.ts` — server-side Stripe instance
- `lib/redis.ts` — Upstash Redis client + rate limiters
- `lib/adapters.ts` — `toDisplayProduct()` converts `ProductDTO` → `DisplayProduct` (extends `Product` with `defaultVariantId: string` and `variantMap: Record<colorName, variantId>`)
- `lib/validators/` — Zod schemas for cart, order, product, waitlist, wishlist requests
- `context/auth-context.tsx` — client-side auth state (AuthProvider, useAuth hook)
- `lib/supabase/server.ts` — cookie-based Supabase server client (`@supabase/ssr`)
- `lib/supabase/client.ts` — cookie-based Supabase browser client (`@supabase/ssr`)
- `lib/supabase/middleware.ts` — Supabase middleware client (request/response cookie bridge)
- `lib/supabase.ts` — admin Supabase client (service role, NOT for auth)
- `middleware.ts` — session refresh + route protection (`/account/*` protected)
- `components/providers.tsx` — client-side provider wrapper (AuthProvider → CartProvider)
- `hooks/use-mobile.ts`, `hooks/use-toast.ts` — custom React hooks
- `supabase/config.toml` — Supabase CLI local development config (project_id: maison-elise, API port: 54321)

## Design System

The site uses a dark luxury aesthetic with sharp corners (border-radius: 0 everywhere). Key design tokens are CSS custom properties in `app/globals.css`:

- **Gold accent**: `--primary: #C9A96E` (also `--text-gold`, `--accent`)
- **Surfaces**: Five layered dark backgrounds (`--surface-1` through `--surface-5`, from `#0F0F0F` to `#2A2A28`)
- **Typography**: Headings use Cormorant Garamond (serif, weight 300, tracked). Body uses Montserrat via `--font-sans` variable.

## Environment Variables

Required variables are listed in `.env.example`: Supabase (URL, anon key, service role key, DATABASE_URL), Stripe (secret key, publishable key, webhook secret), Upstash Redis (URL, token).

## Rules

- **Never** include Claude, AI, LLM, or any AI-related attribution in commit messages, code comments, PR descriptions, or any other project artifacts. No `Co-Authored-By` AI lines, no "generated by AI" comments.
- **Run `pnpm lint` before every commit.**
- **Update CLAUDE.md when adding/changing API routes**: document the endpoint and its dependencies in `## Architecture > Routes`.
- **Route ordering**: Specific routes (`/api/cart/items`, `/api/products/[slug]/variants`) must be registered before generic dynamic routes (`/api/cart/[id]`, `/api/products/[slug]`). Next.js App Router handles most of this via file-based routing, but take care with nested dynamic segments.
- **DI-ready integrations**: Always access external services (Stripe, Supabase, Redis) through `lib/` wrapper modules — never import SDKs directly in route files.

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update the **Lessons Learned** section below with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Run `pnpm lint` — fix all errors before continuing
- Ask yourself: "Would a staff engineer approve this?"
- Update CLAUDE.md `## Architecture > Routes` when adding/changing routes
- Run `pnpm dlx prisma generate` when schema changes

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes -- don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests -- then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

### Lessons Learned
After any correction or change in approach, add a entry here:
<!-- filled in over sessions -->

## Task Management

1. **Plan First**: Write plan to tasks/todo.md with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to tasks/todo.md
6. **Capture Lessons**: Update Lessons Learned after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Only touch what's necessary. No side effects with new bugs.

## Decision Framework

When making architectural decisions (API structure, DB schema, major changes), critique from 3 angles before proposing a solution:

1. **🔵 Staff Engineer**: "Is there technical debt or scalability risk?"
2. **🔴 Devil's Advocate**: "What will be painful about maintaining this in 6 months?"
3. **🟢 Consumer / Integration**: "How easy is it to consume this API from the frontend? Are the response shape and error handling correct?"

## Key Conventions

- Prices are stored in **cents** in the database; the UI displays **dollars** (`formatPrice()` and `centsToDollars()` are in `types/index.ts`)
- Product routing uses **slugs**, not numeric IDs
- Cart supports both guest (session-based) and authenticated (user-based) modes
- Images use Unsplash and Vercel Blob storage (configured in `next.config.mjs`)
- No testing framework is configured
- Uses `@vercel/analytics` for page tracking
- Prisma schema uses `@@map()` for snake_case table/column names with camelCase model fields
- `fullTextSearchPostgres` preview feature enabled in Prisma schema
