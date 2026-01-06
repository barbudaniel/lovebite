"use client";

import { ReactNode } from "react";
import { usePermissions, type Permission } from "@/lib/hooks/use-permissions";
import { useDashboard } from "@/app/dashboard/layout";
import { Shield, AlertTriangle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProtectedRouteProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  showMessage?: boolean;
}

/**
 * Wraps content that requires specific permissions
 * - Single permission: permission="media:view"
 * - Multiple permissions: permissions={["media:view", "media:edit"]}
 * - Require all: requireAll={true} (default: false = any permission)
 */
export function ProtectedRoute({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback,
  showMessage = true,
}: ProtectedRouteProps) {
  const { user, creator } = useDashboard();
  const perms = usePermissions({
    role: user?.role,
    userId: user?.id,
    creatorId: creator?.id,
    studioId: user?.studio_id,
  });

  const permissionList = permission ? [permission] : permissions;

  if (permissionList.length === 0) {
    // No permissions required
    return <>{children}</>;
  }

  const hasAccess = requireAll
    ? perms.canAll(permissionList)
    : perms.canAny(permissionList);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showMessage) {
    return null;
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Access Restricted
      </h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        You don't have permission to access this content. Please contact your
        administrator if you believe this is an error.
      </p>
      <Link href="/dashboard">
        <Button variant="outline">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}

/**
 * Shows content only if user is admin
 */
export function AdminOnly({
  children,
  fallback,
  showMessage = false,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  showMessage?: boolean;
}) {
  return (
    <ProtectedRoute
      permission="admin:access"
      fallback={fallback}
      showMessage={showMessage}
    >
      {children}
    </ProtectedRoute>
  );
}

/**
 * Shows content only if user can manage models (admin or studio)
 */
export function StudioOrAdminOnly({
  children,
  fallback,
  showMessage = false,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  showMessage?: boolean;
}) {
  return (
    <ProtectedRoute
      permission="models:view"
      fallback={fallback}
      showMessage={showMessage}
    >
      {children}
    </ProtectedRoute>
  );
}

/**
 * Shows a warning banner for admin-only features
 */
export function AdminOnlyBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 mb-6">
      <Shield className="w-5 h-5 text-amber-600" />
      <div>
        <p className="font-medium text-amber-800">Admin Only</p>
        <p className="text-sm text-amber-600">
          This section is only visible to administrators.
        </p>
      </div>
    </div>
  );
}

/**
 * Shows a warning for actions that require additional permissions
 */
export function PermissionWarning({
  message,
  icon: Icon = AlertTriangle,
}: {
  message: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
      <Icon className="w-4 h-4 text-amber-600 shrink-0" />
      <p className="text-sm text-amber-700">{message}</p>
    </div>
  );
}










