import applicationPermissions from "~shared/models/Permissions";
import useAuthStore from "~shared/store/AuthStore";

class PermissionService {
  // TODO: singleton instance
  constructor() {
    this.getCurrentUserRoles = this.getCurrentUserRoles.bind(this);
    this.verifyRole = this.verifyRole.bind(this);
    this.canAccess = this.canAccess.bind(this);
  }

  // Retrieves the current user's roles from the Zustand store.
  getCurrentUserRoles() {
    const role = useAuthStore.getState().role;
    return role ? role.roles : [];
  }

  // Checks if the user's roles include the specified required role.
  verifyRole(currentUserRoles: string[], requiredRole: string) {
    return currentUserRoles.includes(requiredRole);
  }

  // Determines if the current user has any of the roles required to access a specific resource.
  canAccess(resourceRequested: string): boolean {
    const currentUserRoles = this.getCurrentUserRoles();

    // Get the roles required to access the specified resource.
    const requiredAccess = applicationPermissions[resourceRequested];

    return requiredAccess.some((role) =>
      this.verifyRole(currentUserRoles, role),
    );
  }
}

export default PermissionService;

// Usage:

/*
 * const permissionService = new PermissionService();
 * const canAccessDashboard = permissionService.can('dashboard');
 */
