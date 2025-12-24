/**
 * Permissions and Role-Based Access Control
 * Defines what each role can do in the dashboard
 */

export type UserRole = "admin" | "business" | "independent";

// ============================================
// PERMISSION DEFINITIONS
// ============================================

export const permissions = {
  // Media permissions
  "media:view": ["admin", "business", "independent"],
  "media:upload": ["admin", "business", "independent"],
  "media:delete": ["admin", "business", "independent"],
  "media:delete_any": ["admin"],
  
  // Album permissions
  "albums:view": ["admin", "business", "independent"],
  "albums:create": ["admin", "business", "independent"],
  "albums:edit": ["admin", "business", "independent"],
  "albums:delete": ["admin", "business", "independent"],
  "albums:delete_any": ["admin"],
  
  // Bio links permissions
  "bio_links:view": ["admin", "business", "independent"],
  "bio_links:create": ["admin", "business", "independent"],
  "bio_links:edit": ["admin", "business", "independent"],
  "bio_links:delete": ["admin", "business", "independent"],
  
  // Social accounts permissions
  "accounts:view": ["admin", "business", "independent"],
  "accounts:add": ["admin", "business", "independent"],
  "accounts:edit": ["admin", "business", "independent"],
  "accounts:delete": ["admin", "business", "independent"],
  
  // Statistics permissions
  "stats:view_own": ["admin", "business", "independent"],
  "stats:view_any": ["admin"],
  "stats:view_studio_models": ["admin", "business"],
  
  // Model management permissions (business can manage their creators)
  "models:view": ["admin", "business"],
  "models:add": ["admin", "business"],
  "models:edit": ["admin", "business"],
  "models:remove": ["admin", "business"],
  
  // Contract permissions
  "contracts:view_own": ["admin", "business", "independent"],
  "contracts:view_any": ["admin"],
  "contracts:create": ["admin"],
  "contracts:sign": ["admin", "business", "independent"],
  
  // Onboarding permissions
  "onboarding:view": ["admin"],
  "onboarding:create": ["admin"],
  "onboarding:approve": ["admin"],
  "onboarding:reject": ["admin"],
  
  // Studio management permissions
  "studios:view": ["admin"],
  "studios:create": ["admin"],
  "studios:edit": ["admin"],
  "studios:delete": ["admin"],
  
  // Settings permissions
  "settings:view": ["admin", "business", "independent"],
  "settings:edit": ["admin", "business", "independent"],
  "settings:manage_users": ["admin"],
  
  // Admin permissions
  "admin:access": ["admin"],
  "admin:manage_all": ["admin"],
} as const;

export type Permission = keyof typeof permissions;

// ============================================
// PERMISSION CHECKING UTILITIES
// ============================================

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowedRoles = permissions[permission];
  return (allowedRoles as readonly string[]).includes(role);
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissionList: Permission[]): boolean {
  return permissionList.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissionList: Permission[]): boolean {
  return permissionList.some((p) => hasPermission(role, p));
}

/**
 * Get all permissions for a specific role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return (Object.keys(permissions) as Permission[]).filter((p) =>
    (permissions[p] as readonly string[]).includes(role)
  );
}

// ============================================
// ACCESS CONTROL HELPERS
// ============================================

/**
 * Check if user can access resource owned by another user
 */
export function canAccessResource(
  userRole: UserRole,
  userId: string,
  resourceOwnerId: string,
  permission: Permission
): boolean {
  // Admins can access any resource
  if (userRole === "admin") {
    return true;
  }

  // For other roles, check if they own the resource
  if (userId === resourceOwnerId) {
    return hasPermission(userRole, permission);
  }

  // Check for "view_any" equivalent permissions
  const anyPermission = permission.replace("_own", "_any") as Permission;
  if (permission.includes("_own") && anyPermission in permissions) {
    return hasPermission(userRole, anyPermission);
  }

  return false;
}

/**
 * Check if a business user can access a creator's resources
 */
export function canStudioAccessModel(
  userRole: UserRole,
  studioId: string | null,
  modelStudioId: string | null
): boolean {
  if (userRole === "admin") {
    return true;
  }

  if (userRole === "business" && studioId && modelStudioId && studioId === modelStudioId) {
    return true;
  }

  return false;
}

// ============================================
// ROLE HELPERS
// ============================================

export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}

export function isBusiness(role: UserRole): boolean {
  return role === "business";
}

export function isIndependent(role: UserRole): boolean {
  return role === "independent";
}

// Legacy aliases for backwards compatibility
export const isStudio = isBusiness;
export const isModel = isIndependent;

export function canManageModels(role: UserRole): boolean {
  return role === "admin" || role === "business";
}

// ============================================
// RESOURCE FILTERS
// ============================================

/**
 * Get the filter to apply for fetching resources based on role
 */
export function getResourceFilter(
  userRole: UserRole,
  userId: string,
  creatorId?: string | null,
  studioId?: string | null
): { type: "all" | "creator" | "studio"; id?: string } {
  if (userRole === "admin") {
    return { type: "all" };
  }

  if (userRole === "business" && studioId) {
    return { type: "studio", id: studioId };
  }

  if (creatorId) {
    return { type: "creator", id: creatorId };
  }

  return { type: "creator", id: userId };
}







