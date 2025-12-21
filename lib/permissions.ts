/**
 * Permissions and Role-Based Access Control
 * Defines what each role can do in the dashboard
 */

export type UserRole = "admin" | "studio" | "model";

// ============================================
// PERMISSION DEFINITIONS
// ============================================

export const permissions = {
  // Media permissions
  "media:view": ["admin", "studio", "model"],
  "media:upload": ["admin", "studio", "model"],
  "media:delete": ["admin", "studio", "model"],
  "media:delete_any": ["admin"],
  
  // Album permissions
  "albums:view": ["admin", "studio", "model"],
  "albums:create": ["admin", "studio", "model"],
  "albums:edit": ["admin", "studio", "model"],
  "albums:delete": ["admin", "studio", "model"],
  "albums:delete_any": ["admin"],
  
  // Bio links permissions
  "bio_links:view": ["admin", "studio", "model"],
  "bio_links:create": ["admin", "studio", "model"],
  "bio_links:edit": ["admin", "studio", "model"],
  "bio_links:delete": ["admin", "studio", "model"],
  
  // Social accounts permissions
  "accounts:view": ["admin", "studio", "model"],
  "accounts:add": ["admin", "studio", "model"],
  "accounts:edit": ["admin", "studio", "model"],
  "accounts:delete": ["admin", "studio", "model"],
  
  // Statistics permissions
  "stats:view_own": ["admin", "studio", "model"],
  "stats:view_any": ["admin"],
  "stats:view_studio_models": ["admin", "studio"],
  
  // Model management permissions
  "models:view": ["admin", "studio"],
  "models:add": ["admin", "studio"],
  "models:edit": ["admin", "studio"],
  "models:remove": ["admin", "studio"],
  
  // Contract permissions
  "contracts:view_own": ["admin", "studio", "model"],
  "contracts:view_any": ["admin"],
  "contracts:create": ["admin"],
  "contracts:sign": ["admin", "studio", "model"],
  
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
  "settings:view": ["admin", "studio", "model"],
  "settings:edit": ["admin", "studio", "model"],
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
 * Check if a studio user can access a model's resources
 */
export function canStudioAccessModel(
  userRole: UserRole,
  studioId: string | null,
  modelStudioId: string | null
): boolean {
  if (userRole === "admin") {
    return true;
  }

  if (userRole === "studio" && studioId && modelStudioId && studioId === modelStudioId) {
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

export function isStudio(role: UserRole): boolean {
  return role === "studio";
}

export function isModel(role: UserRole): boolean {
  return role === "model";
}

export function canManageModels(role: UserRole): boolean {
  return role === "admin" || role === "studio";
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

  if (userRole === "studio" && studioId) {
    return { type: "studio", id: studioId };
  }

  if (creatorId) {
    return { type: "creator", id: creatorId };
  }

  return { type: "creator", id: userId };
}

