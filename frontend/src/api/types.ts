// Roles
export type UserRole = 'ADMINISTRATOR' | 'PLANNER' | 'SUPERVISOR' | 'PILOT';

// Helicopter
export interface Helicopter {
  id: number;
  registrationNumber: string;
  helicopterType: string;
  description?: string;
  maxCrewCount: number;
  maxCrewWeight: number; // kg
  status: string; // e.g. "ACTIVE", "INACTIVE"
  inspectionExpiryDate?: string; // ISO date
  rangeKm: number; // km
  imageUrl?: string; // frontend-only field
}

// Crew Member
export interface CrewMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  weight: number; // kg
  role: string; // e.g. "PILOT", "OBSERVER"
  pilotLicenseNumber?: string;
  licenseExpiryDate?: string;
  trainingExpiryDate: string;
}

// Landing Site (flat structure)
export interface LandingSite {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

// User
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Operation status — backend string values
export type OperationStatus =
  | 'SUBMITTED'
  | 'REJECTED'
  | 'CONFIRMED'
  | 'SCHEDULED'
  | 'PARTIALLY_COMPLETED'
  | 'COMPLETED'
  | 'CANCELLED';

export const OPERATION_STATUS_LABELS: Record<OperationStatus, string> = {
  SUBMITTED: 'Wprowadzone',
  REJECTED: 'Odrzucone',
  CONFIRMED: 'Potwierdzone do planu',
  SCHEDULED: 'Zaplanowane do zlecenia',
  PARTIALLY_COMPLETED: 'Częściowo zrealizowane',
  COMPLETED: 'Zrealizowane',
  CANCELLED: 'Rezygnacja',
};

// Activity types — must match backend enum: ActivityType.kt
export type ActivityType =
  | 'VISUAL_INSPECTION'
  | 'SCAN_3D'
  | 'FAULT_LOCATION'
  | 'PHOTOS'
  | 'PATROL'
  | 'OTHER';

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  VISUAL_INSPECTION: 'Oględziny wizualne',
  SCAN_3D: 'Skan 3D',
  FAULT_LOCATION: 'Lokalizacja awarii',
  PHOTOS: 'Zdjęcia',
  PATROL: 'Patrolowanie',
  OTHER: 'Inne',
};

// Activity type entry (backend structure)
export interface ActivityTypeEntry {
  activityType: string;
  description?: string;
}

// Comment response from backend
export interface CommentResponse {
  id: number;
  content: string;
  authorEmail: string;
  createdAt: string; // ISO date-time
}

// Change log response from backend
export interface ChangeLogResponse {
  id: number;
  fieldName: string;
  oldValue?: string;
  newValue?: string;
  changedByEmail: string;
  changedAt: string; // ISO date-time
}

// Flight Operation (was Operation)
export interface FlightOperation {
  id: number;
  orderProjectNumber: string;
  shortDescription: string;
  kmlFileName?: string;
  geojsonContent?: string; // GeoJSON string from backend
  proposedDateFrom?: string;
  proposedDateTo?: string;
  activities: ActivityTypeEntry[];
  additionalInfo?: string;
  routeLengthKm: number;
  plannedDateFrom?: string;
  plannedDateTo?: string;
  status: OperationStatus;
  createdByEmail: string;
  contactEmails?: string;
  postCompletionNotes?: string;
  comments: CommentResponse[];
  changeLog: ChangeLogResponse[];
  createdAt: string; // ISO date-time
  updatedAt: string; // ISO date-time
}

// Keep old name as alias for migration convenience
export type Operation = FlightOperation;

// Flight order status — backend string values
export type FlightOrderStatus =
  | 'SUBMITTED'
  | 'PENDING_APPROVAL'
  | 'REJECTED'
  | 'ACCEPTED'
  | 'PARTIALLY_COMPLETED'
  | 'COMPLETED'
  | 'NOT_COMPLETED';

export const FLIGHT_ORDER_STATUS_LABELS: Record<FlightOrderStatus, string> = {
  SUBMITTED: 'Wprowadzone',
  PENDING_APPROVAL: 'Przekazane do akceptacji',
  REJECTED: 'Odrzucone',
  ACCEPTED: 'Zaakceptowane',
  PARTIALLY_COMPLETED: 'Zrealizowane w części',
  COMPLETED: 'Zrealizowane w całości',
  NOT_COMPLETED: 'Nie zrealizowane',
};

// Flight Order
export interface FlightOrder {
  id: number;
  plannedStartTime: string; // ISO date-time
  plannedEndTime: string; // ISO date-time
  pilotId: number;
  status: FlightOrderStatus;
  helicopterId: number;
  crewMemberIds: number[];
  crewWeight: number; // kg
  departureSiteId: number;
  arrivalSiteId: number;
  operationIds: number[];
  estimatedRouteLengthKm: number; // km
  actualStartTime?: string;
  actualEndTime?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: string;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  token: string;
}
