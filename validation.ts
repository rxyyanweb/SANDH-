/**
 * Strict Pakistani Phone Number Validation
 * Valid Pakistani mobile numbers:
 * - 03XXXXXXXXX (11 digits, e.g. 03481807287)
 * - +923XXXXXXXXX (13 chars, e.g. +923481807287)
 * - 923XXXXXXXXX (12 digits, e.g. 923481807287)
 */
export function isValidPakistaniPhone(input: string): boolean {
  if (!input) return false;
  // Clean spaces, dashes, brackets
  const cleaned = input.replace(/[\s\-\(\)]/g, '').trim();

  // Pattern: Optional +92 or 0092 or 92 or 0, followed by 3 and 9 digits
  const pakistaniPhoneRegex = /^(?:(?:\+92|0092|92)?0?)(3[0-9]{9})$/;
  return pakistaniPhoneRegex.test(cleaned);
}

export function formatPakistaniPhone(input: string): string {
  const cleaned = input.replace(/[\s\-\(\)]/g, '').trim();
  const match = cleaned.match(/^(?:(?:\+92|0092|92)?0?)(3[0-9]{9})$/);
  if (match) {
    const local = '0' + match[1]; // e.g. 03481807287
    return `${local.slice(0, 4)} ${local.slice(4)}`; // e.g. 0348 1807287
  }
  return input;
}
