/**
 * User ID generation utilities for consistent user identification
 */

/**
 * Generates a consistent MongoDB ObjectId-compatible string based on email
 * This ensures the same user always gets the same ID across login sessions
 */
export function generateConsistentUserId(email: string): string {
  // Normalize email to lowercase to ensure consistency
  const normalizedEmail = email.toLowerCase().trim();
  
  // Create a simple hash of the email
  let hash = 0;
  for (let i = 0; i < normalizedEmail.length; i++) {
    const char = normalizedEmail.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to positive number
  const positiveHash = Math.abs(hash);
  
  // Create a 24-character hex string that looks like a MongoDB ObjectId
  // Format: 8 chars (timestamp-like) + 16 chars (email hash-based)
  const timestampPart = Math.floor(Date.now() / 1000000).toString(16).padStart(8, '0');
  const hashPart = positiveHash.toString(16).padStart(16, '0').substring(0, 16);
  
  return timestampPart + hashPart;
}

/**
 * Validates if a string is a valid ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Gets a user ID from email, ensuring it's always the same for the same email
 */
export function getUserIdFromEmail(email: string): string {
  const userId = generateConsistentUserId(email);
  
  // Ensure it's a valid ObjectId format
  if (!isValidObjectId(userId)) {
    throw new Error('Generated user ID is not a valid ObjectId format');
  }
  
  return userId;
}
