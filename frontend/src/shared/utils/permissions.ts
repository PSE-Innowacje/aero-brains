import type { UserRole } from '../../api/types';

type AccessLevel = 'full' | 'readonly' | 'none';

interface MenuPermission {
  roles: UserRole[];
  access: Record<UserRole, AccessLevel>;
}

export const menuPermissions: Record<string, MenuPermission> = {
  administration: {
    roles: ['admin', 'supervisor', 'pilot'],
    access: {
      admin: 'full',
      planner: 'none',
      supervisor: 'readonly',
      pilot: 'readonly',
    },
  },
  operations: {
    roles: ['admin', 'planner', 'supervisor', 'pilot'],
    access: {
      admin: 'readonly',
      planner: 'full',
      supervisor: 'full',
      pilot: 'readonly',
    },
  },
  flightOrders: {
    roles: ['admin', 'supervisor', 'pilot'],
    access: {
      admin: 'readonly',
      planner: 'none',
      supervisor: 'full',
      pilot: 'full',
    },
  },
};

/** Status codes in which a given role can edit an operation */
export const operationEditableStatuses: Record<string, number[]> = {
  planner: [1, 2, 3, 4, 5],
  supervisor: [1, 2, 3, 4, 5, 6, 7],
};

/** Fields that a planner cannot modify on an operation */
export const plannerBlockedFields: string[] = [
  'plannedDateFrom',
  'plannedDateTo',
  'status',
  'postRealizationNotes',
];

/**
 * Check if a role can access a given menu section (access is not 'none').
 */
export const canAccessMenu = (role: UserRole, menuKey: string): boolean => {
  const perm = menuPermissions[menuKey];
  if (!perm) return false;
  return perm.access[role] !== 'none';
};

/**
 * Check if a role has full (edit) access to a menu section.
 */
export const canEdit = (role: UserRole, menuKey: string): boolean => {
  const perm = menuPermissions[menuKey];
  if (!perm) return false;
  return perm.access[role] === 'full';
};

/**
 * Check if a role can edit an operation given the current status code.
 */
export const canEditOperation = (role: UserRole, statusCode: number): boolean => {
  const allowed = operationEditableStatuses[role];
  if (!allowed) return false;
  return allowed.includes(statusCode);
};
