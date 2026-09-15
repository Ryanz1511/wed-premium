# Premium Digital Invitation — Rangga & Kirana

An Editorial Luxury template for the **PREMIUM (Rp100.000)** tier, built as a
real, working front-end plus the backend contracts a production deployment
needs.

## What's in this package

| File | What it is |
|---|---|
| `index.html` | The invitation itself — fully working, self-contained, no build step. Open it directly in a browser. |
| `backend/types.ts` | Shared data model (`Invitation`, `EventItem`, `RSVP`, `Wish`, etc.) |
| `backend/packageFeatures.ts` | Centralized entitlement table — the single source of truth for what Regular/Premium/Exclusive/VIP unlock |
| `backend/validation.ts` | Zod schemas that validate and sanitize every guest submission server-side |
| `backend/schema.prisma` | PostgreSQL schema via Prisma — Customer, Invitation, Guest, RSVP, Wish, Order, etc. |
| `backend/routes.ts` | Example Express routes showing validation, feature gating, and rate limiting wired together |

## Try it

Open `index.html` in a browser. Add `?to=Budi%20Santoso` to the URL to see
guest personalization in action (e.g. `index.html?to=Budi%20Santoso`).

## What actually works right now (client-side)

- Opening screen with guest name, elegant reveal transition
- Editorial hero, couple section, love-story timeline, multi-venue event
  schedule with map links, live countdown to the real event date
- Gallery with lazy-loaded images and a keyboard-navigable lightbox
- Background music control (a soft synthesized ambient pad, since no audio
  file was supplied — swap in a real track via the `MusicConfig.url` field
  and an `<audio>` tag once you have one)
- RSVP form with client-side validation and instant feedback
- Wishes: submit and see it appear in the list immediately
- Digital gift with copy-to-clipboard and a confirmation toast
- Share via the Web Share API with a copy-link fallback
- Fully responsive: side dot-nav on desktop, bottom nav on mobile; respects
  `prefers-reduced-motion`

## What's demo-only and needs the backend to go live

RSVP and Wish submissions currently live only in the browser tab's memory —
refreshing the page resets them. To make them real:

1. Point the two forms' `submit` handlers at `POST /api/invitations/:slug/rsvp`
   and `POST /api/invitations/:slug/wishes` (contracts in `routes.ts`).
2. Deploy the Prisma schema against Postgres and run the Express routes
   behind it.
3. Everything in `packageFeatures.ts` is already enforced twice — once in
   the UI (what's shown) and once in `routes.ts` (what's accepted) — so a
   Regular-tier invitation can't be upgraded to Premium behavior by editing
   client requests.

## Why this template, not a copy of Regular

Per the Premium brief: richer storytelling (multi-entry timeline), multiple
event venues, a real countdown, a lightbox gallery, digital gift, and a
genuinely different art direction (asymmetric editorial hero, vertical
timeline, minimal dot navigation) rather than Regular's simpler single-column
layout with a few more sections bolted on.

## Upgrade paths (not included, by design)

- Fully custom page structure / section reordering → **Exclusive**
- Bespoke visual identity, custom domain, guest-management dashboard →
  **VIP**

These are intentionally absent here — Premium stays a curated,
template-based product.
