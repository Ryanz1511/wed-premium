// ============================================================================
// Example route handlers (Express-style, framework-agnostic logic).
// Mount under /api/invitations/:slug/...
//
// Contract:
//   GET  /api/invitations/:slug            -> public invitation payload
//   POST /api/invitations/:slug/rsvp       -> submit RSVP
//   POST /api/invitations/:slug/wishes     -> submit a wish
//   GET  /api/invitations/:slug/gallery    -> paginated gallery
// ============================================================================

import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { rsvpSchema, wishSchema } from "../validation";
import { assertFeature, FeatureNotAvailableError } from "./packageFeatures";
import { getInvitationBySlug, createRsvp, createWish } from "./services/invitationService";

const router = Router();

// Guests submit rarely; this is generous enough for real use and tight
// enough to blunt scripted spam.
const submissionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/:slug", async (req: Request, res: Response) => {
  const invitation = await getInvitationBySlug(req.params.slug);
  if (!invitation || !invitation.isPublished) {
    return res.status(404).json({ error: "Invitation not found." });
  }
  // Never leak customerId, internal flags, or guest PII in the public payload.
  const { customerId, guests, rsvps, ...publicPayload } = invitation as any;
  return res.json(publicPayload);
});

router.post("/:slug/rsvp", submissionLimiter, async (req: Request, res: Response) => {
  const invitation = await getInvitationBySlug(req.params.slug);
  if (!invitation || !invitation.isPublished) {
    return res.status(404).json({ error: "Invitation not found." });
  }

  const parsed = rsvpSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid RSVP payload.", details: parsed.error.flatten() });
  }

  try {
    // attendeeCount > 1 is a Premium+ RSVP feature; enforce server-side
    // even though the UI already hides the field on lower tiers.
    if (parsed.data.attendeeCount > 1) {
      assertFeature(invitation.packageTier, "rsvpGuestCount");
    }
  } catch (err) {
    if (err instanceof FeatureNotAvailableError) {
      return res.status(403).json({ error: err.message });
    }
    throw err;
  }

  const rsvp = await createRsvp(invitation.id, parsed.data, hashIp(req.ip));
  return res.status(201).json({ id: rsvp.id, submittedAt: rsvp.submittedAt });
});

router.post("/:slug/wishes", submissionLimiter, async (req: Request, res: Response) => {
  const invitation = await getInvitationBySlug(req.params.slug);
  if (!invitation || !invitation.isPublished) {
    return res.status(404).json({ error: "Invitation not found." });
  }

  try {
    assertFeature(invitation.packageTier, "wishesEnabled");
  } catch (err) {
    if (err instanceof FeatureNotAvailableError) {
      return res.status(403).json({ error: err.message });
    }
    throw err;
  }

  const parsed = wishSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid wish payload.", details: parsed.error.flatten() });
  }

  // Stored and later rendered as plain text only — the frontend must use
  // textContent / equivalent escaping, never innerHTML, for guest-submitted
  // strings.
  const wish = await createWish(invitation.id, parsed.data);
  return res.status(201).json({ id: wish.id, submittedAt: wish.submittedAt });
});

function hashIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined;
  // Use a one-way hash (e.g. HMAC-SHA256 with a server-side secret) so raw
  // IPs are never persisted — this is a placeholder for that call.
  return `hashed:${ip.length}`;
}

export default router;
