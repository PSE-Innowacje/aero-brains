import type { UserRole } from '../api/types';

export interface MenuItem {
  label: string;
  path: string;
  menuKey: string;
  roles?: UserRole[]; // if set, only these roles see this item
}

export interface MenuGroup {
  label: string;
  menuKey: string;
  items: MenuItem[];
}

export const menuConfig: MenuGroup[] = [
  {
    label: 'Administracja',
    menuKey: 'administration',
    items: [
      { label: 'Helikoptery', path: '/helicopters', menuKey: 'administration' },
      { label: 'Członkowie załogi', path: '/crew', menuKey: 'administration' },
      { label: 'Lądowiska planowe', path: '/landing-sites', menuKey: 'administration' },
      { label: 'Użytkownicy', path: '/users', menuKey: 'administration', roles: ['ADMINISTRATOR'] },
    ],
  },
  {
    label: 'Planowanie operacji',
    menuKey: 'operations',
    items: [
      { label: 'Lista operacji', path: '/operations', menuKey: 'operations' },
    ],
  },
  {
    label: 'Zlecenia na lot',
    menuKey: 'flightOrders',
    items: [
      { label: 'Lista zleceń', path: '/flight-orders', menuKey: 'flightOrders' },
    ],
  },
];
