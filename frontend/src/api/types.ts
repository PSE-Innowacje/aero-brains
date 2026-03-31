// Roles
export type UserRole = 'admin' | 'planner' | 'supervisor' | 'pilot';

// Helicopter
export interface Helicopter {
  id: number;
  registrationNumber: string;
  type: string;
  description?: string;
  maxCrewCount: number;
  maxCrewWeight: number; // kg
  status: 'active' | 'inactive';
  inspectionExpiryDate?: string; // ISO date, required when active
  rangeWithoutLanding: number; // km
  imageUrl?: string;
}

// Crew Member
export type CrewRole = 'pilot' | 'observer';

export interface CrewMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  weight: number; // kg 30-200
  role: CrewRole;
  pilotLicenseNumber?: string; // required for pilot
  licenseExpiryDate?: string; // required for pilot
  trainingExpiryDate: string;
}

// Landing Site
export interface LandingSite {
  id: number;
  name: string;
  coordinates: { lat: number; lng: number };
}

// User
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

// Operation status codes 1-7
export type OperationStatusCode = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const OPERATION_STATUS_LABELS: Record<OperationStatusCode, string> = {
  1: 'Wprowadzone',
  2: 'Odrzucone',
  3: 'Potwierdzone do planu',
  4: 'Zaplanowane do zlecenia',
  5: 'Częściowo zrealizowane',
  6: 'Zrealizowane',
  7: 'Rezygnacja',
};

// Activity types
export type ActivityType =
  | 'visual_inspection'
  | '3d_scan'
  | 'fault_location'
  | 'photos'
  | 'patrol';

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  visual_inspection: 'Oględziny wizualne',
  '3d_scan': 'Skan 3D',
  fault_location: 'Lokalizacja awarii',
  photos: 'Zdjęcia',
  patrol: 'Patrolowanie',
};

// Operation
export interface Operation {
  id: number;
  operationNumber: string; // auto
  orderNumber: string; // e.g. DE-25-12020
  shortDescription: string;
  kmlFileUrl?: string;
  kmlFileName?: string;
  kmlPoints?: Array<{ lat: number; lng: number }>;
  proposedDateFrom?: string;
  proposedDateTo?: string;
  activityTypes: ActivityType[];
  additionalInfo?: string;
  routeDistanceKm: number;
  plannedDateFrom?: string;
  plannedDateTo?: string;
  comments: Array<{ text: string; date: string; author: string }>;
  status: OperationStatusCode;
  createdBy: string; // email
  contactPersons?: string[];
  postRealizationNotes?: string;
  linkedFlightOrderIds: number[];
}

// Flight order status codes 1-7
export type FlightOrderStatusCode = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const FLIGHT_ORDER_STATUS_LABELS: Record<FlightOrderStatusCode, string> = {
  1: 'Wprowadzone',
  2: 'Przekazane do akceptacji',
  3: 'Odrzucone',
  4: 'Zaakceptowane',
  5: 'Zrealizowane w części',
  6: 'Zrealizowane w całości',
  7: 'Nie zrealizowane',
};

// Flight Order
export interface FlightOrder {
  id: number;
  orderNumber: string; // auto
  plannedStartDateTime: string;
  plannedLandingDateTime: string;
  pilotId: number;
  status: FlightOrderStatusCode;
  helicopterId: number;
  crewMemberIds: number[];
  crewWeight: number; // auto-calculated kg
  startLandingSiteId: number;
  endLandingSiteId: number;
  selectedOperationIds: number[];
  estimatedRouteDistance: number; // km
  actualStartDateTime?: string;
  actualLandingDateTime?: string;
}

// Auth
export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
