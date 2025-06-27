/**
 * Client-safe ObjectId utilities
 * These functions generate MongoDB ObjectId-compatible strings without requiring Node.js dependencies
 */

/**
 * Generates a MongoDB ObjectId-compatible string
 * Format: 24-character hexadecimal string (8 chars timestamp + 16 chars random)
 */
export function generateObjectId(): string {
  // 4-byte timestamp (seconds since Unix epoch)
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  
  // 16 random bytes (represented as 16 hex characters)
  const randomBytes = Array.from({ length: 16 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('').substring(0, 16);
  
  return timestamp + randomBytes;
}

/**
 * Validates if a string is a valid ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Converts a string to ObjectId format if it's not already
 * If the string is not a valid ObjectId, generates a new one
 */
export function toObjectId(id?: string): string {
  if (id && isValidObjectId(id)) {
    return id;
  }
  return generateObjectId();
}
