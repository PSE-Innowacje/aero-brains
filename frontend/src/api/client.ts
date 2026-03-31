import {
  mockHelicopters,
  mockCrewMembers,
  mockLandingSites,
  mockUsers,
  mockOperations,
  mockFlightOrders,
  mockCurrentUser,
} from './mockData';

import type {
  Helicopter,
  CrewMember,
  LandingSite,
  User,
  Operation,
  OperationStatusCode,
  FlightOrder,
  FlightOrderStatusCode,
  AuthUser,
} from './types';

// Simple delay helper
const delay = (ms = 200) => new Promise<void>((r) => setTimeout(r, ms));

// Next-id helper
const nextId = (arr: { id: number }[]) =>
  arr.length === 0 ? 1 : Math.max(...arr.map((item) => item.id)) + 1;

// Mutable local copies
let helicopters: Helicopter[] = [...mockHelicopters];
let crewMembers: CrewMember[] = [...mockCrewMembers];
let landingSites: LandingSite[] = [...mockLandingSites];
let users: User[] = [...mockUsers];
let operations: Operation[] = [...mockOperations];
let flightOrders: FlightOrder[] = [...mockFlightOrders];

export const api = {
  // ---- Helicopters ----
  helicopters: {
    getAll: async (): Promise<Helicopter[]> => {
      await delay();
      return [...helicopters];
    },
    getById: async (id: number): Promise<Helicopter | undefined> => {
      await delay();
      return helicopters.find((h) => h.id === id);
    },
    create: async (data: Omit<Helicopter, 'id'>): Promise<Helicopter> => {
      await delay();
      const item: Helicopter = { id: nextId(helicopters), ...data };
      helicopters.push(item);
      return { ...item };
    },
    update: async (id: number, data: Partial<Helicopter>): Promise<Helicopter> => {
      await delay();
      const idx = helicopters.findIndex((h) => h.id === id);
      if (idx === -1) throw new Error(`Helicopter ${id} not found`);
      helicopters[idx] = { ...helicopters[idx], ...data, id };
      return { ...helicopters[idx] };
    },
  },

  // ---- Crew Members ----
  crewMembers: {
    getAll: async (): Promise<CrewMember[]> => {
      await delay();
      return [...crewMembers];
    },
    getById: async (id: number): Promise<CrewMember | undefined> => {
      await delay();
      return crewMembers.find((c) => c.id === id);
    },
    create: async (data: Omit<CrewMember, 'id'>): Promise<CrewMember> => {
      await delay();
      const item: CrewMember = { id: nextId(crewMembers), ...data };
      crewMembers.push(item);
      return { ...item };
    },
    update: async (id: number, data: Partial<CrewMember>): Promise<CrewMember> => {
      await delay();
      const idx = crewMembers.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error(`CrewMember ${id} not found`);
      crewMembers[idx] = { ...crewMembers[idx], ...data, id };
      return { ...crewMembers[idx] };
    },
  },

  // ---- Landing Sites ----
  landingSites: {
    getAll: async (): Promise<LandingSite[]> => {
      await delay();
      return [...landingSites];
    },
    getById: async (id: number): Promise<LandingSite | undefined> => {
      await delay();
      return landingSites.find((ls) => ls.id === id);
    },
    create: async (data: Omit<LandingSite, 'id'>): Promise<LandingSite> => {
      await delay();
      const item: LandingSite = { id: nextId(landingSites), ...data };
      landingSites.push(item);
      return { ...item };
    },
    update: async (id: number, data: Partial<LandingSite>): Promise<LandingSite> => {
      await delay();
      const idx = landingSites.findIndex((ls) => ls.id === id);
      if (idx === -1) throw new Error(`LandingSite ${id} not found`);
      landingSites[idx] = { ...landingSites[idx], ...data, id };
      return { ...landingSites[idx] };
    },
  },

  // ---- Users ----
  users: {
    getAll: async (): Promise<User[]> => {
      await delay();
      return [...users];
    },
    getById: async (id: number): Promise<User | undefined> => {
      await delay();
      return users.find((u) => u.id === id);
    },
    create: async (data: Omit<User, 'id'>): Promise<User> => {
      await delay();
      const item: User = { id: nextId(users), ...data };
      users.push(item);
      return { ...item };
    },
    update: async (id: number, data: Partial<User>): Promise<User> => {
      await delay();
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error(`User ${id} not found`);
      users[idx] = { ...users[idx], ...data, id };
      return { ...users[idx] };
    },
  },

  // ---- Operations ----
  operations: {
    getAll: async (): Promise<Operation[]> => {
      await delay();
      return [...operations];
    },
    getById: async (id: number): Promise<Operation | undefined> => {
      await delay();
      return operations.find((o) => o.id === id);
    },
    create: async (data: Omit<Operation, 'id' | 'operationNumber'>): Promise<Operation> => {
      await delay();
      const id = nextId(operations);
      const operationNumber = `OP-2026-${String(id).padStart(3, '0')}`;
      const item: Operation = { id, operationNumber, ...data };
      operations.push(item);
      return { ...item };
    },
    update: async (id: number, data: Partial<Operation>): Promise<Operation> => {
      await delay();
      const idx = operations.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error(`Operation ${id} not found`);
      operations[idx] = { ...operations[idx], ...data, id };
      return { ...operations[idx] };
    },
    updateStatus: async (id: number, status: OperationStatusCode): Promise<Operation> => {
      await delay();
      const idx = operations.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error(`Operation ${id} not found`);
      operations[idx] = { ...operations[idx], status };
      return { ...operations[idx] };
    },
  },

  // ---- Flight Orders ----
  flightOrders: {
    getAll: async (): Promise<FlightOrder[]> => {
      await delay();
      return [...flightOrders];
    },
    getById: async (id: number): Promise<FlightOrder | undefined> => {
      await delay();
      return flightOrders.find((fo) => fo.id === id);
    },
    create: async (data: Omit<FlightOrder, 'id' | 'orderNumber'>): Promise<FlightOrder> => {
      await delay();
      const id = nextId(flightOrders);
      const orderNumber = `FO-2026-${String(id).padStart(3, '0')}`;
      const item: FlightOrder = { id, orderNumber, ...data };
      flightOrders.push(item);
      return { ...item };
    },
    update: async (id: number, data: Partial<FlightOrder>): Promise<FlightOrder> => {
      await delay();
      const idx = flightOrders.findIndex((fo) => fo.id === id);
      if (idx === -1) throw new Error(`FlightOrder ${id} not found`);
      flightOrders[idx] = { ...flightOrders[idx], ...data, id };
      return { ...flightOrders[idx] };
    },
    updateStatus: async (id: number, status: FlightOrderStatusCode): Promise<FlightOrder> => {
      await delay();
      const idx = flightOrders.findIndex((fo) => fo.id === id);
      if (idx === -1) throw new Error(`FlightOrder ${id} not found`);
      flightOrders[idx] = { ...flightOrders[idx], status };
      return { ...flightOrders[idx] };
    },
  },

  // ---- Auth ----
  auth: {
    login: async (email: string, _password: string): Promise<AuthUser | null> => {
      await delay();
      const user = users.find((u) => u.email === email);
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
    },
    getCurrentUser: async (): Promise<AuthUser> => {
      await delay();
      return { ...mockCurrentUser };
    },
  },
};
