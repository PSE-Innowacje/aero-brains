import type { UserRole } from '../../api/types';

type AccessLevel = 'full' | 'readonly' | 'none';

interface MenuPermission {
  roles: UserRole[];
  access: Record<UserRole, AccessLevel>;
}

export const menuPermissions: Record<string, MenuPermission> = {
  administration: {
    roles: ['ADMINISTRATOR', 'SUPERVISOR', 'PILOT'],
    access: {
      ADMINISTRATOR: 'full',
      PLANNER: 'none',
      SUPERVISOR: 'readonly',
      PILOT: 'readonly',
    },
  },
  operations: {
    roles: ['ADMINISTRATOR', 'PLANNER', 'SUPERVISOR', 'PILOT'],
    access: {
      ADMINISTRATOR: 'readonly',
      PLANNER: 'full',
      SUPERVISOR: 'full',
      PILOT: 'readonly',
    },
  },
  flightOrders: {
    roles: ['ADMINISTRATOR', 'SUPERVISOR', 'PILOT'],
    access: {
      ADMINISTRATOR: 'readonly',
      PLANNER: 'none',
      SUPERVISOR: 'full',
      PILOT: 'full',
    },
  },
};

/** Status codes in which a given role can edit an operation */
export const operationEditableStatuses: Record<string, string[]> = {
  PLANNER: ['SUBMITTED', 'REJECTED', 'CONFIRMED', 'SCHEDULED', 'PARTIALLY_COMPLETED'],
  SUPERVISOR: ['SUBMITTED', 'REJECTED', 'CONFIRMED', 'SCHEDULED', 'PARTIALLY_COMPLETED', 'COMPLETED', 'CANCELLED'],
};

/** Fields that a planner cannot modify on an operation */
export const plannerBlockedFields: string[] = [
  'plannedDateFrom',
  'plannedDateTo',
  'status',
  'postCompletionNotes',
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
export const canEditOperation = (role: UserRole, statusCode: string): boolean => {
  const allowed = operationEditableStatuses[role];
  if (!allowed) return false;
  return allowed.includes(statusCode);
};
