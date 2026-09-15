// ============================================================================
// Server-side validation. Never trust client-side validation alone —
// these schemas are what actually run before anything touches the database.
// ============================================================================

import { z } from "zod";

// Strip any HTML tags and collapse whitespace. Guest input is stored and
// rendered as plain text only — never as raw HTML — so this is a belt-and-
// braces layer on top of the templating layer's own escaping.
function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export const rsvpSchema = z.object({
  guestName: z
    .string()
    .min(2, "Nama minimal 2 karakter.")
    .max(80, "Nama maksimal 80 karakter.")
    .transform(stripTags),
  status: z.enum(["Hadir", "Tidak Hadir", "Masih Ragu"]),
  attendeeCount: z
    .number()
    .int()
    .min(1, "Jumlah tamu minimal 1.")
    .max(10, "Jumlah tamu maksimal 10."),
  message: z
    .string()
    .max(300, "Pesan maksimal 300 karakter.")
    .transform(stripTags)
    .optional(),
});

export const wishSchema = z.object({
  guestName: z
    .string()
    .min(2, "Nama minimal 2 karakter.")
    .max(60, "Nama maksimal 60 karakter.")
    .transform(stripTags),
  message: z
    .string()
    .min(2, "Ucapan minimal 2 karakter.")
    .max(240, "Ucapan maksimal 240 karakter.")
    .transform(stripTags),
});

export const guestPersonalizationParamSchema = z
  .string()
  .max(80)
  .transform(stripTags)
  .optional();

export type RsvpInput = z.infer<typeof rsvpSchema>;
export type WishInput = z.infer<typeof wishSchema>;
