export const ADMIN_EMAILS: string[] = [
  'candrakurniawan.com@gmail.com',
  'candrakurniawan@smpn2sutojayan.sch.id',
  'kanggurungopi@smpn2sutojayan.sch.id',
  'mgmptik@smpn2sutojayan.sch.id',
];

/**
 * Checks whether an email belongs to a Super Admin / Panitia Utama.
 * Matches explicitly registered admin emails or emails associated with Candra Kurniawan.
 */
export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const lower = email.trim().toLowerCase();
  if (ADMIN_EMAILS.includes(lower)) return true;
  if (lower.startsWith('candrakurniawan') || lower.includes('candrakurniawan')) return true;
  return false;
}
