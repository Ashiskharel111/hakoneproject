/**
 * Japan Standard Time (JST / UTC+9) Date Utilities
 * Ensures that all date pickers, lead time validations, and bookings
 * align with Tokyo local time regardless of user's browser timezone.
 */

/**
 * Returns today's date in Japan Standard Time as 'YYYY-MM-DD'
 */
export function getTodayJST(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch {
    // Fallback if Intl timeZone is unavailable
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const jstDate = new Date(utc + 3600000 * 9);
    return jstDate.toISOString().split('T')[0];
  }
}

/**
 * Returns a future date in Japan Standard Time offset by `days` as 'YYYY-MM-DD'
 */
export function getFutureDateJST(days = 1): string {
  try {
    const now = new Date();
    const future = new Date(now.getTime() + days * 86400000);
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(future);
  } catch {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const jstDate = new Date(utc + 3600000 * 9 + days * 86400000);
    return jstDate.toISOString().split('T')[0];
  }
}

/**
 * Validates standard email address format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates international phone number format (must have digits, at least 7 chars)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return cleaned.length >= 7 && /^\+?[0-9]{7,15}$/.test(cleaned);
}
