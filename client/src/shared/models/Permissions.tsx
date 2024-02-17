type PermissionsModel = {
  [key: string]: string[];
};

const applicationPermissions: PermissionsModel = {
  dashboard: ["org.admin", "org.user"],
  gayneil: ["org.admin", "org.permissions.SERVICENAME.read"],

  /*
   * Use org.admin or org.user when specific permissions are not required
   * If this feels unnecessary, just use org.permissions for everything else
   * However, org.admin should have some permissions by default which dont need to be specified
   */

  /*
   * Below are examples of permissions that can be used in the application
   * settings: ['org.admin', 'org.permissions.settings.manage'],
   * userManagement: ['org.admin', 'org.permissions.user.manage'],
   * reports: ['org.permissions.reports.read', 'org.permissions.reports.write'],
   */
};

export default applicationPermissions;
