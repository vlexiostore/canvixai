/**
 * Admin access control — only the specified admin email(s) can access admin routes.
 */

const ADMIN_EMAILS = [
  "codeinc.ai@gmail.com",
];

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}
