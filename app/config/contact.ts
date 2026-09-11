/** Public contact destination shared by author, book and newsletter surfaces. */
export const CONTACT_EMAIL = 'benjaminlabaschin@gmail.com';

export function contactHref(options: { subject?: string; body?: string } = {}) {
  const query = new URLSearchParams();
  if (options.subject) query.set('subject', options.subject);
  if (options.body) query.set('body', options.body);
  return `mailto:${CONTACT_EMAIL}${query.size ? `?${query.toString().replace(/\+/g, '%20')}` : ''}`;
}
