// ============================================
// RESERVED USERNAMES
// ============================================
// These usernames are reserved and cannot be used as bio link slugs
// to prevent conflicts with system routes and common paths.

export const RESERVED_USERNAMES = [
  // System routes
  'dashboard',
  'api',
  'admin',
  'join',
  'register',
  'bio',
  'creator',
  'login',
  'logout',
  'signup',
  'signin',
  'signout',
  'settings',
  
  // Common paths
  'about',
  'help',
  'support',
  'contact',
  'terms',
  'privacy',
  'legal',
  'faq',
  'pricing',
  'blog',
  'news',
  
  // Brand names
  'Lovdash',
  'bites',
  'bitesbio',
  'Lovdash-fans',
  'Lovdash_fans',
  
  // Generic reserved
  'www',
  'mail',
  'email',
  'app',
  'apps',
  'static',
  'assets',
  'media',
  'cdn',
  'images',
  'img',
  'videos',
  'files',
  'uploads',
  'download',
  'downloads',
  
  // User-related
  'user',
  'users',
  'profile',
  'profiles',
  'account',
  'accounts',
  'me',
  'my',
  'you',
  
  // Actions
  'create',
  'edit',
  'delete',
  'update',
  'new',
  'add',
  'remove',
  
  // Special
  'null',
  'undefined',
  'true',
  'false',
  'test',
  'demo',
  'example',
  'sample',
];

/**
 * Check if a username is reserved
 */
export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.includes(username.toLowerCase());
}

/**
 * Validate a username and return an error message if invalid
 */
export function validateUsername(username: string): string | null {
  if (!username || username.length < 3) {
    return username && username.length > 0 
      ? "Username must be at least 3 characters" 
      : null;
  }
  
  if (username.length > 30) {
    return "Username must be 30 characters or less";
  }
  
  if (!/^[a-z0-9_]+$/.test(username)) {
    return "Only lowercase letters, numbers, and underscores allowed";
  }
  
  if (isReservedUsername(username)) {
    return "This username is reserved and cannot be used";
  }
  
  return null;
}

