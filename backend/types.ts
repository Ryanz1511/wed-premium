// ============================================================================
// Shared types — Digital Invitation Platform
// One platform, multiple templates, multiple package tiers.
// ============================================================================

export type PackageTier = "regular" | "premium" | "exclusive" | "vip";

export type AttendanceStatus = "Hadir" | "Tidak Hadir" | "Masih Ragu";

export interface ColorTheme {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  mutedText: string;
}

export interface StoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
}

export interface EventItem {
  id: string;
  name: string;          // "Akad Nikah", "Resepsi"
  date: string;           // ISO date
  startTime: string;      // "08:00"
  endTime: string;        // "10:00"
  venueName: string;
  address: string;
  mapsUrl?: string;
  description?: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface GiftAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  description?: string;
}

export interface MusicConfig {
  url: string;
  autoplayAfterInteraction: boolean;
  volumeDefault: number; // 0..1
}

export interface Invitation {
  id: string;
  customerId: string;
  packageTier: PackageTier;
  slug: string; // unique, used in the invitation URL

  theme: {
    templateId: string;
    colors: ColorTheme;
    headingFont: string;
    bodyFont: string;
  };

  couple: {
    groomName: string;
    brideName: string;
    groomParents?: string;
    brideParents?: string;
    groomPhotoUrl?: string;
    bridePhotoUrl?: string;
    heroPhotoUrl?: string;
  };

  story: StoryItem[];
  events: EventItem[];
  gallery: GalleryItem[];
  gifts: GiftAccount[];
  music?: MusicConfig;

  countdownDate: string; // ISO datetime, timezone-aware

  isPublished: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  invitationId: string;
  name: string;
  slug?: string; // for /invitation/:slug/:guestSlug style personalization
  createdAt: string;
}

export interface RSVP {
  id: string;
  invitationId: string;
  guestName: string;
  status: AttendanceStatus;
  attendeeCount: number;
  message?: string;
  submittedAt: string;
  ipHash?: string; // for rate limiting / abuse detection — never store raw IP long-term
}

export interface Wish {
  id: string;
  invitationId: string;
  guestName: string;
  message: string; // must always be stored/rendered as plain text, never raw HTML
  submittedAt: string;
  isHidden: boolean; // moderation flag
}
