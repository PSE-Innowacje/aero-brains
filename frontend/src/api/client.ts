import axios from 'axios';

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
  FlightOperation,
  FlightOrder,
  OperationStatus,
  FlightOrderStatus,
  AuthUser,
  LoginResponse,
  CommentResponse,
  Page,
} from './types';

// ── Toggle: set to true to use in-memory mock data instead of real API ──
const USE_MOCK = false;

// ── Axios instance ──
const http = axios.create({
  baseURL: '/api',
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('aero_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Mock helpers (kept for USE_MOCK mode) ──
const delay = (ms = 200) => new Promise<void>((r) => setTimeout(r, ms));
const nextId = (arr: { id: number }[]) =>
  arr.length === 0 ? 1 : Math.max(...arr.map((item) => item.id)) + 1;

// Mutable local copies for mock mode
let _helicopters: Helicopter[] = [...mockHelicopters];
let _crewMembers: CrewMember[] = [...mockCrewMembers];
let _landingSites: LandingSite[] = [...mockLandingSites];
let _users: User[] = [...mockUsers];
let _operations: FlightOperation[] = [...mockOperations];
let _flightOrders: FlightOrder[] = [...mockFlightOrders];

// ── API client ──
export const api = {
  // ──── Auth ────
  auth: {
    login: async (
      email: string,
      password: string,
    ): Promise<AuthUser | null> => {
      if (USE_MOCK) {
        await delay();
        const user = _users.find((u) => u.email === email);
        if (!user) return null;
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role as AuthUser['role'],
          token: 'mock-jwt-token',
        };
      }

      const { data } = await http.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      // Persist the JWT so the interceptor picks it up
      localStorage.setItem('aero_token', data.token);
      // Fetch full user details (firstName, lastName)
      // Try /users first (admin only), then /crew-members as fallback
      let firstName = '';
      let lastName = '';
      let userId = 0;
      try {
        const { data: usersPage } = await http.get<Page<User>>('/users', {
          params: { size: 2147483647 },
        });
        const found = usersPage.content.find((u) => u.email === data.email);
        if (found) {
          firstName = found.firstName;
          lastName = found.lastName;
          userId = found.id;
        }
      } catch {
        // /users is admin-only — try crew-members (accessible to supervisor, pilot)
        try {
          const { data: crew } = await http.get<CrewMember[]>('/crew-members');
          const found = crew.find((c) => c.email === data.email);
          if (found) {
            firstName = found.firstName;
            lastName = found.lastName;
            userId = found.id;
          }
        } catch {
          // Derive name from email as last resort
        }
      }
      if (!firstName && !lastName) {
        const parts = data.email.split('@')[0].split('.');
        firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : '';
        lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
      }
      return {
        id: userId,
        email: data.email,
        firstName,
        lastName,
        role: data.role as AuthUser['role'],
        token: data.token,
      };
    },

    getCurrentUser: async (): Promise<AuthUser> => {
      if (USE_MOCK) {
        await delay();
        return { ...mockCurrentUser };
      }
      // There is no dedicated /auth/me endpoint in the spec, so we derive
      // the current user from the stored token + users list if needed.
      // For now return the stored info; pages that need full user data
      // should call users.getAll().
      return { ...mockCurrentUser };
    },
  },

  // ──── Helicopters ────
  helicopters: {
    getAll: async (): Promise<Helicopter[]> => {
      if (USE_MOCK) {
        await delay();
        return [..._helicopters];
      }
      const { data } = await http.get<Page<Helicopter>>('/helicopters', {
        params: { size: 2147483647 },
      });
      return data.content;
    },

    getById: async (id: number): Promise<Helicopter | undefined> => {
      if (USE_MOCK) {
        await delay();
        return _helicopters.find((h) => h.id === id);
      }
      try {
        const { data } = await http.get<Helicopter>(`/helicopters/${id}`);
        return data;
      } catch (err: any) {
        if (err?.response?.status === 404) return undefined;
        throw err;
      }
    },

    create: async (data: Omit<Helicopter, 'id'>): Promise<Helicopter> => {
      if (USE_MOCK) {
        await delay();
        const item: Helicopter = { id: nextId(_helicopters), ...data };
        _helicopters.push(item);
        return { ...item };
      }
      const { data: created } = await http.post<Helicopter>(
        '/helicopters',
        data,
      );
      return created;
    },

    update: async (
      id: number,
      data: Partial<Helicopter>,
    ): Promise<Helicopter> => {
      if (USE_MOCK) {
        await delay();
        const idx = _helicopters.findIndex((h) => h.id === id);
        if (idx === -1) throw new Error(`Helicopter ${id} not found`);
        _helicopters[idx] = { ..._helicopters[idx], ...data, id };
        return { ..._helicopters[idx] };
      }
      const { data: updated } = await http.put<Helicopter>(
        `/helicopters/${id}`,
        data,
      );
      return updated;
    },
  },

  // ──── Crew Members ────
  crewMembers: {
    getAll: async (): Promise<CrewMember[]> => {
      if (USE_MOCK) {
        await delay();
        return [..._crewMembers];
      }
      const { data } = await http.get<Page<CrewMember>>('/crew-members', {
        params: { size: 2147483647 },
      });
      return data.content;
    },

    getById: async (id: number): Promise<CrewMember | undefined> => {
      if (USE_MOCK) {
        await delay();
        return _crewMembers.find((c) => c.id === id);
      }
      try {
        const { data } = await http.get<CrewMember>(`/crew-members/${id}`);
        return data;
      } catch (err: any) {
        if (err?.response?.status === 404) return undefined;
        throw err;
      }
    },

    create: async (data: Omit<CrewMember, 'id'>): Promise<CrewMember> => {
      if (USE_MOCK) {
        await delay();
        const item: CrewMember = { id: nextId(_crewMembers), ...data };
        _crewMembers.push(item);
        return { ...item };
      }
      const { data: created } = await http.post<CrewMember>(
        '/crew-members',
        data,
      );
      return created;
    },

    update: async (
      id: number,
      data: Partial<CrewMember>,
    ): Promise<CrewMember> => {
      if (USE_MOCK) {
        await delay();
        const idx = _crewMembers.findIndex((c) => c.id === id);
        if (idx === -1) throw new Error(`CrewMember ${id} not found`);
        _crewMembers[idx] = { ..._crewMembers[idx], ...data, id };
        return { ..._crewMembers[idx] };
      }
      const { data: updated } = await http.put<CrewMember>(
        `/crew-members/${id}`,
        data,
      );
      return updated;
    },
  },

  // ──── Landing Sites ────
  landingSites: {
    getAll: async (): Promise<LandingSite[]> => {
      if (USE_MOCK) {
        await delay();
        return [..._landingSites];
      }
      const { data } = await http.get<Page<LandingSite>>('/landing-sites', {
        params: { size: 2147483647 },
      });
      return data.content;
    },

    getById: async (id: number): Promise<LandingSite | undefined> => {
      if (USE_MOCK) {
        await delay();
        return _landingSites.find((ls) => ls.id === id);
      }
      try {
        const { data } = await http.get<LandingSite>(`/landing-sites/${id}`);
        return data;
      } catch (err: any) {
        if (err?.response?.status === 404) return undefined;
        throw err;
      }
    },

    create: async (data: Omit<LandingSite, 'id'>): Promise<LandingSite> => {
      if (USE_MOCK) {
        await delay();
        const item: LandingSite = { id: nextId(_landingSites), ...data };
        _landingSites.push(item);
        return { ...item };
      }
      const { data: created } = await http.post<LandingSite>(
        '/landing-sites',
        data,
      );
      return created;
    },

    update: async (
      id: number,
      data: Partial<LandingSite>,
    ): Promise<LandingSite> => {
      if (USE_MOCK) {
        await delay();
        const idx = _landingSites.findIndex((ls) => ls.id === id);
        if (idx === -1) throw new Error(`LandingSite ${id} not found`);
        _landingSites[idx] = { ..._landingSites[idx], ...data, id };
        return { ..._landingSites[idx] };
      }
      const { data: updated } = await http.put<LandingSite>(
        `/landing-sites/${id}`,
        data,
      );
      return updated;
    },
  },

  // ──── Users ────
  users: {
    getAll: async (): Promise<User[]> => {
      if (USE_MOCK) {
        await delay();
        return [..._users];
      }
      const { data } = await http.get<Page<User>>('/users', {
        params: { size: 2147483647 },
      });
      return data.content;
    },

    getById: async (id: number): Promise<User | undefined> => {
      if (USE_MOCK) {
        await delay();
        return _users.find((u) => u.id === id);
      }
      try {
        const { data } = await http.get<User>(`/users/${id}`);
        return data;
      } catch (err: any) {
        if (err?.response?.status === 404) return undefined;
        throw err;
      }
    },

    create: async (data: Omit<User, 'id'> & { password: string }): Promise<User> => {
      if (USE_MOCK) {
        await delay();
        const { password: _, ...rest } = data;
        const item: User = { id: nextId(_users), ...rest };
        _users.push(item);
        return { ...item };
      }
      const { data: created } = await http.post<User>('/users', data);
      return created;
    },

    update: async (id: number, data: Partial<User>): Promise<User> => {
      if (USE_MOCK) {
        await delay();
        const idx = _users.findIndex((u) => u.id === id);
        if (idx === -1) throw new Error(`User ${id} not found`);
        _users[idx] = { ..._users[idx], ...data, id };
        return { ..._users[idx] };
      }
      const { data: updated } = await http.put<User>(`/users/${id}`, data);
      return updated;
    },
  },

  // ──── Flight Operations (was "operations") ────
  operations: {
    getAll: async (): Promise<FlightOperation[]> => {
      if (USE_MOCK) {
        await delay();
        return [..._operations];
      }
      const { data } = await http.get<Page<FlightOperation>>('/flight-operations', {
        params: { size: 2147483647 },
      });
      return data.content;
    },

    getById: async (id: number): Promise<FlightOperation | undefined> => {
      if (USE_MOCK) {
        await delay();
        return _operations.find((o) => o.id === id);
      }
      try {
        const { data } = await http.get<FlightOperation>(
          `/flight-operations/${id}`,
        );
        return data;
      } catch (err: any) {
        if (err?.response?.status === 404) return undefined;
        throw err;
      }
    },

    create: async (
      data: Record<string, unknown>,
    ): Promise<FlightOperation> => {
      if (USE_MOCK) {
        await delay();
        const id = nextId(_operations);
        const item = {
          id,
          comments: [],
          changeLog: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        } as unknown as FlightOperation;
        _operations.push(item);
        return { ...item };
      }
      const { data: created } = await http.post<FlightOperation>(
        '/flight-operations',
        data,
      );
      return created;
    },

    update: async (
      id: number,
      data: Partial<FlightOperation>,
    ): Promise<FlightOperation> => {
      if (USE_MOCK) {
        await delay();
        const idx = _operations.findIndex((o) => o.id === id);
        if (idx === -1) throw new Error(`Operation ${id} not found`);
        _operations[idx] = { ..._operations[idx], ...data, id };
        return { ..._operations[idx] };
      }
      const { data: updated } = await http.put<FlightOperation>(
        `/flight-operations/${id}`,
        data,
      );
      return updated;
    },

    // Status transitions
    reject: async (id: number): Promise<void> => {
      if (USE_MOCK) {
        await delay();
        const idx = _operations.findIndex((o) => o.id === id);
        if (idx !== -1) _operations[idx] = { ..._operations[idx], status: 'REJECTED' };
        return;
      }
      await http.post(`/flight-operations/${id}/reject`);
    },

    confirm: async (
      id: number,
      dates?: { plannedDateFrom?: string; plannedDateTo?: string },
    ): Promise<void> => {
      if (USE_MOCK) {
        await delay();
        const idx = _operations.findIndex((o) => o.id === id);
        if (idx !== -1)
          _operations[idx] = {
            ..._operations[idx],
            status: 'CONFIRMED',
            ...dates,
          };
        return;
      }
      await http.post(`/flight-operations/${id}/confirm`, dates ?? {});
    },

    cancel: async (id: number): Promise<void> => {
      if (USE_MOCK) {
        await delay();
        const idx = _operations.findIndex((o) => o.id === id);
        if (idx !== -1) _operations[idx] = { ..._operations[idx], status: 'CANCELLED' };
        return;
      }
      await http.post(`/flight-operations/${id}/cancel`);
    },

    // Keep legacy helper — maps to the appropriate status-transition endpoint
    updateStatus: async (
      id: number,
      status: OperationStatus,
    ): Promise<FlightOperation> => {
      if (USE_MOCK) {
        await delay();
        const idx = _operations.findIndex((o) => o.id === id);
        if (idx === -1) throw new Error(`Operation ${id} not found`);
        _operations[idx] = { ..._operations[idx], status };
        return { ..._operations[idx] };
      }
      const statusEndpointMap: Partial<Record<OperationStatus, string>> = {
        REJECTED: 'reject',
        CONFIRMED: 'confirm',
        CANCELLED: 'cancel',
      };
      const endpoint = statusEndpointMap[status];
      if (endpoint) {
        await http.post(`/flight-operations/${id}/${endpoint}`);
      }
      // Re-fetch to return updated entity
      const { data } = await http.get<FlightOperation>(
        `/flight-operations/${id}`,
      );
      return data;
    },

    // Comments
    addComment: async (
      id: number,
      content: string,
    ): Promise<CommentResponse> => {
      if (USE_MOCK) {
        await delay();
        return {
          id: Date.now(),
          content,
          authorEmail: 'mock@user.pl',
          createdAt: new Date().toISOString(),
        };
      }
      const { data } = await http.post<CommentResponse>(
        `/flight-operations/${id}/comments`,
        { content },
      );
      return data;
    },

    // KML / GeoJSON downloads
    getKml: async (id: number): Promise<string> => {
      if (USE_MOCK) {
        await delay();
        return '<kml>mock</kml>';
      }
      const { data } = await http.get<string>(
        `/flight-operations/${id}/kml`,
        { responseType: 'text' as any },
      );
      return data;
    },

    getGeojson: async (id: number): Promise<any> => {
      if (USE_MOCK) {
        await delay();
        return { type: 'FeatureCollection', features: [] };
      }
      const { data } = await http.get(`/flight-operations/${id}/geojson`);
      return data;
    },
  },

  // ──── Flight Orders ────
  flightOrders: {
    getAll: async (): Promise<FlightOrder[]> => {
      if (USE_MOCK) {
        await delay();
        return [..._flightOrders];
      }
      const { data } = await http.get<Page<FlightOrder>>('/flight-orders', {
        params: { size: 2147483647 },
      });
      return data.content;
    },

    getById: async (id: number): Promise<FlightOrder | undefined> => {
      if (USE_MOCK) {
        await delay();
        return _flightOrders.find((fo) => fo.id === id);
      }
      try {
        const { data } = await http.get<FlightOrder>(`/flight-orders/${id}`);
        return data;
      } catch (err: any) {
        if (err?.response?.status === 404) return undefined;
        throw err;
      }
    },

    create: async (
      data: Omit<FlightOrder, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<FlightOrder> => {
      if (USE_MOCK) {
        await delay();
        const id = nextId(_flightOrders);
        const item: FlightOrder = {
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        };
        _flightOrders.push(item);
        return { ...item };
      }
      const { data: created } = await http.post<FlightOrder>(
        '/flight-orders',
        data,
      );
      return created;
    },

    update: async (
      id: number,
      data: Partial<FlightOrder>,
    ): Promise<FlightOrder> => {
      if (USE_MOCK) {
        await delay();
        const idx = _flightOrders.findIndex((fo) => fo.id === id);
        if (idx === -1) throw new Error(`FlightOrder ${id} not found`);
        _flightOrders[idx] = { ..._flightOrders[idx], ...data, id };
        return { ..._flightOrders[idx] };
      }
      const { data: updated } = await http.put<FlightOrder>(
        `/flight-orders/${id}`,
        data,
      );
      return updated;
    },

    // Status transitions
    submit: async (id: number): Promise<void> => {
      if (USE_MOCK) {
        await delay();
        const idx = _flightOrders.findIndex((fo) => fo.id === id);
        if (idx !== -1) _flightOrders[idx] = { ..._flightOrders[idx], status: 'SUBMITTED' };
        return;
      }
      await http.post(`/flight-orders/${id}/submit`);
    },

    accept: async (id: number): Promise<void> => {
      if (USE_MOCK) {
        await delay();
        const idx = _flightOrders.findIndex((fo) => fo.id === id);
        if (idx !== -1) _flightOrders[idx] = { ..._flightOrders[idx], status: 'ACCEPTED' };
        return;
      }
      await http.post(`/flight-orders/${id}/accept`);
    },

    reject: async (id: number): Promise<void> => {
      if (USE_MOCK) {
        await delay();
        const idx = _flightOrders.findIndex((fo) => fo.id === id);
        if (idx !== -1) _flightOrders[idx] = { ..._flightOrders[idx], status: 'REJECTED' };
        return;
      }
      await http.post(`/flight-orders/${id}/reject`);
    },

    settleComplete: async (id: number): Promise<void> => {
      if (USE_MOCK) {
        await delay();
        const idx = _flightOrders.findIndex((fo) => fo.id === id);
        if (idx !== -1) _flightOrders[idx] = { ..._flightOrders[idx], status: 'COMPLETED' };
        return;
      }
      await http.post(`/flight-orders/${id}/settle-complete`);
    },

    settlePartial: async (id: number): Promise<void> => {
      if (USE_MOCK) {
        await delay();
        const idx = _flightOrders.findIndex((fo) => fo.id === id);
        if (idx !== -1) _flightOrders[idx] = { ..._flightOrders[idx], status: 'PARTIALLY_COMPLETED' };
        return;
      }
      await http.post(`/flight-orders/${id}/settle-partial`);
    },

    settleNotCompleted: async (id: number): Promise<void> => {
      if (USE_MOCK) {
        await delay();
        const idx = _flightOrders.findIndex((fo) => fo.id === id);
        if (idx !== -1) _flightOrders[idx] = { ..._flightOrders[idx], status: 'NOT_COMPLETED' };
        return;
      }
      await http.post(`/flight-orders/${id}/settle-not-completed`);
    },

    // Legacy helper
    updateStatus: async (
      id: number,
      status: FlightOrderStatus,
    ): Promise<FlightOrder> => {
      if (USE_MOCK) {
        await delay();
        const idx = _flightOrders.findIndex((fo) => fo.id === id);
        if (idx === -1) throw new Error(`FlightOrder ${id} not found`);
        _flightOrders[idx] = { ..._flightOrders[idx], status };
        return { ..._flightOrders[idx] };
      }
      const statusEndpointMap: Partial<Record<FlightOrderStatus, string>> = {
        SUBMITTED: 'submit',
        ACCEPTED: 'accept',
        REJECTED: 'reject',
        COMPLETED: 'settle-complete',
        PARTIALLY_COMPLETED: 'settle-partial',
        NOT_COMPLETED: 'settle-not-completed',
      };
      const endpoint = statusEndpointMap[status];
      if (endpoint) {
        await http.post(`/flight-orders/${id}/${endpoint}`);
      }
      const { data } = await http.get<FlightOrder>(`/flight-orders/${id}`);
      return data;
    },
  },
};

// Re-export the axios instance for advanced usage (e.g. file uploads)
export { http };
