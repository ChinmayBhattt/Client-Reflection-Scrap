/**
 * Centralized Access Configuration for Blog & Gallery Owners / Authors
 *
 * Any email address in this list automatically gets:
 * 1. "+ Write New Blog" button on /blog
 * 2. "Edit Blog" button on all blog post cards on /blog
 * 3. "Edit Article" toolbar on each blog post detail page (/blog/[slug])
 * 4. Full permissions to create, publish, edit, and delete blogs
 * 5. Full access to /admin/blog and /admin/gallery
 */

export const AUTHORIZED_BLOG_EMAILS: string[] = [
  // Primary Authorized Owners & Authors
  "ayjazkhan68@gmail.com",

  // Reflection Scrap official email & aliases
  "info@reflectionscrap.com",
];

/**
 * Checks if a given email or role has blog author / editor permissions
 */
export function isAuthorizedBlogAuthor(
  email?: string | null,
  role?: string | null
): boolean {
  if (role === "admin") return true;
  if (!email) return false;

  const cleanEmail = email.trim().toLowerCase();

  // Also support dynamic comma-separated list from env variable
  const envEmails = (
    process.env.NEXT_PUBLIC_BLOG_AUTHOR_EMAILS ||
    process.env.BLOG_AUTHOR_EMAILS ||
    ""
  )
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const allAuthorized = [
    ...AUTHORIZED_BLOG_EMAILS.map((e) => e.trim().toLowerCase()),
    ...envEmails,
  ];

  return allAuthorized.includes(cleanEmail);
}
