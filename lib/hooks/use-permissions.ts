"use client";

import { useMemo } from "react";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getRolePermissions,
  canAccessResource,
  canStudioAccessModel,
  getResourceFilter,
  isAdmin,
  isStudio,
  isModel,
  canManageModels,
  type UserRole,
  type Permission,
} from "@/lib/permissions";

interface UsePermissionsProps {
  role: UserRole | null | undefined;
  userId?: string;
  creatorId?: string | null;
  studioId?: string | null;
}

export function usePermissions({
  role,
  userId = "",
  creatorId,
  studioId,
}: UsePermissionsProps) {
  const userRole = role || "model";

  const permissions = useMemo(() => {
    return {
      // Permission checks
      can: (permission: Permission) => hasPermission(userRole, permission),
      canAll: (permissionList: Permission[]) =>
        hasAllPermissions(userRole, permissionList),
      canAny: (permissionList: Permission[]) =>
        hasAnyPermission(userRole, permissionList),
      
      // Role checks
      isAdmin: isAdmin(userRole),
      isStudio: isStudio(userRole),
      isModel: isModel(userRole),
      canManageModels: canManageModels(userRole),
      
      // Resource access
      canAccessResource: (resourceOwnerId: string, permission: Permission) =>
        canAccessResource(userRole, userId, resourceOwnerId, permission),
      canAccessModel: (modelStudioId: string | null) =>
        canStudioAccessModel(userRole, studioId || null, modelStudioId),
      
      // Get all permissions for role
      getAllPermissions: () => getRolePermissions(userRole),
      
      // Get resource filter for queries
      getResourceFilter: () =>
        getResourceFilter(userRole, userId, creatorId, studioId),
      
      // Current role
      role: userRole,
    };
  }, [userRole, userId, creatorId, studioId]);

  return permissions;
}

// Re-export types for convenience
export type { UserRole, Permission };

