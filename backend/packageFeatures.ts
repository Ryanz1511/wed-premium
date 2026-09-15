// ============================================================================
// Centralized package entitlements.
// This is the single source of truth for what each tier unlocks.
// The frontend uses this to decide what UI to render; the backend uses the
// SAME table to reject writes/reads for features a tier doesn't own.
// Never scatter tier checks across individual routes or components.
// ============================================================================

import { PackageTier } from "./types";

export interface PackageFeatureSet {
  templatesAvailable: number;      // how many template art-directions the tier can choose from
  customTheme: boolean;            // curated color palette + font pairing selection
  customLayout: false | "semi-custom" | "fully-custom";
  storyTimeline: boolean;
  multipleEvents: boolean;
  galleryMaxImages: number;
  customCoverImage: boolean;
  customMusic: boolean;
  giftSection: boolean;
  guestPersonalization: boolean;
  wishesEnabled: boolean;
  rsvpGuestCount: boolean;
  analyticsDashboard: boolean;
  qrCode: boolean;
  customDomain: boolean;
}

export const packageFeatures: Record<PackageTier, PackageFeatureSet> = {
  regular: {
    templatesAvailable: 3,
    customTheme: false,
    customLayout: false,
    storyTimeline: false,
    multipleEvents: false,
    galleryMaxImages: 6,
    customCoverImage: false,
    customMusic: false,
    giftSection: false,
    guestPersonalization: true,
    wishesEnabled: true,
    rsvpGuestCount: false,
    analyticsDashboard: false,
    qrCode: false,
    customDomain: false,
  },
  premium: {
    templatesAvailable: 6,
    customTheme: true,
    customLayout: false,
    storyTimeline: true,
    multipleEvents: true,
    galleryMaxImages: 15,
    customCoverImage: true,
    customMusic: true,
    giftSection: true,
    guestPersonalization: true,
    wishesEnabled: true,
    rsvpGuestCount: true,
    analyticsDashboard: false,
    qrCode: false,
    customDomain: false,
  },
  exclusive: {
    templatesAvailable: 6,
    customTheme: true,
    customLayout: "semi-custom",
    storyTimeline: true,
    multipleEvents: true,
    galleryMaxImages: 30,
    customCoverImage: true,
    customMusic: true,
    giftSection: true,
    guestPersonalization: true,
    wishesEnabled: true,
    rsvpGuestCount: true,
    analyticsDashboard: true,
    qrCode: true,
    customDomain: false,
  },
  vip: {
    templatesAvailable: 6,
    customTheme: true,
    customLayout: "fully-custom",
    storyTimeline: true,
    multipleEvents: true,
    galleryMaxImages: 100,
    customCoverImage: true,
    customMusic: true,
    giftSection: true,
    guestPersonalization: true,
    wishesEnabled: true,
    rsvpGuestCount: true,
    analyticsDashboard: true,
    qrCode: true,
    customDomain: true,
  },
};

/** Throws if the invitation's tier does not include the requested feature. */
export function assertFeature(
  tier: PackageTier,
  feature: keyof PackageFeatureSet
): void {
  const value = packageFeatures[tier][feature];
  if (value === false || value === 0) {
    throw new FeatureNotAvailableError(tier, feature);
  }
}

export class FeatureNotAvailableError extends Error {
  constructor(public tier: PackageTier, public feature: keyof PackageFeatureSet) {
    super(
      `Feature "${feature}" is not available on the "${tier}" package. ` +
        `Upgrade to unlock it.`
    );
    this.name = "FeatureNotAvailableError";
  }
}
