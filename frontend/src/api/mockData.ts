import type {
  Helicopter,
  CrewMember,
  LandingSite,
  User,
  Operation,
  FlightOrder,
  AuthUser,
} from './types';

// --- Helicopters ---
export const mockHelicopters: Helicopter[] = [
  {
    id: 1,
    registrationNumber: 'SP-HXA',
    helicopterType: 'PZL W-3A Sokół',
    description: 'Wielozadaniowy śmigłowiec transportowy',
    maxCrewCount: 4,
    maxCrewWeight: 400,
    status: 'ACTIVE',
    inspectionExpiryDate: '2026-09-15',
    rangeKm: 745,
    imageUrl: '/images/pzl-w3a-sokol.svg',
  },
  {
    id: 2,
    registrationNumber: 'SP-HXB',
    helicopterType: 'Airbus H135',
    description: 'Lekki śmigłowiec patrolowy',
    maxCrewCount: 3,
    maxCrewWeight: 300,
    status: 'ACTIVE',
    inspectionExpiryDate: '2026-11-30',
    rangeKm: 620,
    imageUrl: '/images/airbus-h135.svg',
  },
  {
    id: 3,
    registrationNumber: 'SP-HXC',
    helicopterType: 'Bell 407GXi',
    description: 'Śmigłowiec wycofany z eksploatacji — oczekuje na przegląd generalny',
    maxCrewCount: 4,
    maxCrewWeight: 380,
    status: 'INACTIVE',
    rangeKm: 580,
    imageUrl: '/images/bell-407.svg',
  },
];

// --- Crew Members ---
export const mockCrewMembers: CrewMember[] = [
  {
    id: 1,
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@aero.pl',
    weight: 82,
    role: 'pilot',
    pilotLicenseNumber: 'PL-CPL-H-2019-0042',
    licenseExpiryDate: '2027-03-01',
    trainingExpiryDate: '2026-12-15',
  },
  {
    id: 2,
    firstName: 'Tomasz',
    lastName: 'Zieliński',
    email: 'tomasz.zielinski@aero.pl',
    weight: 78,
    role: 'pilot',
    pilotLicenseNumber: 'PL-CPL-H-2021-0118',
    licenseExpiryDate: '2025-11-30', // expired
    trainingExpiryDate: '2026-08-20',
  },
  {
    id: 3,
    firstName: 'Anna',
    lastName: 'Nowak',
    email: 'anna.nowak@aero.pl',
    weight: 65,
    role: 'observer',
    trainingExpiryDate: '2026-10-01',
  },
  {
    id: 4,
    firstName: 'Katarzyna',
    lastName: 'Wiśniewska',
    email: 'katarzyna.wisniewska@aero.pl',
    weight: 58,
    role: 'observer',
    trainingExpiryDate: '2027-01-10',
  },
  {
    id: 5,
    firstName: 'Piotr',
    lastName: 'Lewandowski',
    email: 'piotr.lewandowski@aero.pl',
    weight: 90,
    role: 'observer',
    trainingExpiryDate: '2026-06-30',
  },
];

// --- Landing Sites ---
export const mockLandingSites: LandingSite[] = [
  {
    id: 1,
    name: 'Warszawa-Okęcie',
    latitude: 52.1657,
    longitude: 20.9671,
  },
  {
    id: 2,
    name: 'Kraków-Balice',
    latitude: 50.0777,
    longitude: 19.7848,
  },
  {
    id: 3,
    name: 'Gdańsk-Rębiechowo',
    latitude: 54.3776,
    longitude: 18.4662,
  },
  {
    id: 4,
    name: 'Wrocław-Strachowice',
    latitude: 51.1027,
    longitude: 16.8858,
  },
];

// --- Users ---
export const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'Marek',
    lastName: 'Jankowski',
    email: 'marek.jankowski@aero.pl',
    role: 'ADMIN',
  },
  {
    id: 2,
    firstName: 'Ewa',
    lastName: 'Dąbrowska',
    email: 'ewa.dabrowska@aero.pl',
    role: 'PLANNER',
  },
  {
    id: 3,
    firstName: 'Anna',
    lastName: 'Nowak',
    email: 'anna.nowak@aero.pl',
    role: 'SUPERVISOR',
  },
  {
    id: 4,
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@aero.pl',
    role: 'PILOT',
  },
];

// Helper: convert point arrays to GeoJSON LineString string
function toGeoJsonLineString(points: { lat: number; lng: number }[]): string {
  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: points.map((p) => [p.lng, p.lat]),
    },
    properties: {},
  };
  return JSON.stringify(geojson);
}

// KML points near Wrocław — power line inspection route
const wroclawKmlPoints = [
  { lat: 51.1095, lng: 17.0326 }, // Wrocław centrum
  { lat: 51.1200, lng: 17.0600 }, // Wrocław-Psie Pole
  { lat: 51.1450, lng: 17.1000 }, // Kiełczów
  { lat: 51.1700, lng: 17.1400 }, // Długołęka
  { lat: 51.1950, lng: 17.1800 }, // Brzezia Łąka
  { lat: 51.2200, lng: 17.2200 }, // Oleśnica (okolice)
  { lat: 51.2100, lng: 17.2600 }, // Oleśnica wschód
  { lat: 51.1900, lng: 17.3000 }, // Bierutów (kierunek)
  { lat: 51.1600, lng: 17.2800 }, // powrót południowy
  { lat: 51.1300, lng: 17.2400 }, // Domaszczyn
  { lat: 51.1095, lng: 17.0326 }, // powrót do Wrocławia
];

const wroclawSouthKmlPoints = [
  { lat: 51.1000, lng: 16.9500 }, // Wrocław-Muchobór
  { lat: 51.0700, lng: 16.9200 }, // Wrocław-Ołtaszyn
  { lat: 51.0400, lng: 16.8900 }, // Żerniki Wrocławskie
  { lat: 51.0100, lng: 16.8600 }, // Jordanów Śląski (kierunek)
  { lat: 50.9800, lng: 16.8300 }, // Sobótka (okolice)
  { lat: 50.9500, lng: 16.8000 }, // Ślęża
  { lat: 50.9300, lng: 16.8400 }, // Sulistrowice
  { lat: 50.9600, lng: 16.8800 }, // powrót
  { lat: 51.0000, lng: 16.9100 }, // Kąty Wrocławskie (okolice)
  { lat: 51.0500, lng: 16.9400 }, // powrót północ
  { lat: 51.1000, lng: 16.9500 }, // powrót do startu
];

const wroclawNorthKmlPoints = [
  { lat: 51.1095, lng: 17.0326 }, // Wrocław centrum
  { lat: 51.1500, lng: 17.0100 }, // Wrocław-Karłowice
  { lat: 51.1800, lng: 16.9800 }, // Wrocław-Sołtysowice
  { lat: 51.2100, lng: 16.9500 }, // Wrocław-Pracze
  { lat: 51.2400, lng: 16.9200 }, // Trzebnica (kierunek)
  { lat: 51.2700, lng: 16.8900 }, // Trzebnica
  { lat: 51.3000, lng: 16.8600 }, // Trzebnica północ
];

// --- Operations ---
export const mockOperations: Operation[] = [
  {
    id: 1,
    orderProjectNumber: 'DE-25-12020',
    shortDescription: 'Oględziny linii 400kV Wrocław-Oleśnica',
    activities: [
      { activityType: 'visual_inspection' },
      { activityType: 'photos' },
    ],
    proposedDateFrom: '2026-04-10',
    proposedDateTo: '2026-04-12',
    routeLengthKm: 135,
    geojsonContent: toGeoJsonLineString(wroclawKmlPoints),
    kmlFileName: 'linia_400kV_wroclaw_olesnica.kml',
    comments: [
      {
        id: 1,
        content: 'Zgłoszenie przyjęte, oczekuje na przypisanie załogi.',
        createdAt: '2026-03-25T10:30:00Z',
        authorEmail: 'ewa.dabrowska@aero.pl',
      },
    ],
    status: 'SUBMITTED',
    createdByEmail: 'ewa.dabrowska@aero.pl',
    contactEmails: 'jan.kowalski@aero.pl',
    changeLog: [],
    createdAt: '2026-03-24T08:00:00Z',
    updatedAt: '2026-03-25T10:30:00Z',
  },
  {
    id: 2,
    orderProjectNumber: 'DE-25-12021',
    shortDescription: 'Skan 3D podstacji Wrocław-Południe',
    activities: [
      { activityType: '3d_scan' },
    ],
    proposedDateFrom: '2026-04-05',
    proposedDateTo: '2026-04-06',
    routeLengthKm: 42,
    geojsonContent: toGeoJsonLineString(wroclawSouthKmlPoints),
    kmlFileName: 'podstacja_wroclaw_poludnie.kml',
    comments: [
      {
        id: 2,
        content: 'Odrzucono — termin koliduje z przeglądem SP-HXC.',
        createdAt: '2026-03-26T08:15:00Z',
        authorEmail: 'anna.nowak@aero.pl',
      },
    ],
    status: 'REJECTED',
    createdByEmail: 'ewa.dabrowska@aero.pl',
    changeLog: [],
    createdAt: '2026-03-24T09:00:00Z',
    updatedAt: '2026-03-26T08:15:00Z',
  },
  {
    id: 3,
    orderProjectNumber: 'DE-25-12022',
    shortDescription: 'Lokalizacja awarii na linii 220kV Wrocław-Trzebnica',
    activities: [
      { activityType: 'fault_location' },
      { activityType: 'photos' },
    ],
    proposedDateFrom: '2026-04-14',
    proposedDateTo: '2026-04-15',
    plannedDateFrom: '2026-04-14',
    plannedDateTo: '2026-04-15',
    routeLengthKm: 68,
    geojsonContent: toGeoJsonLineString(wroclawNorthKmlPoints),
    kmlFileName: 'linia_220kV_wroclaw_trzebnica.kml',
    comments: [
      {
        id: 3,
        content: 'Potwierdzone do planu — wysoka priorytetowość.',
        createdAt: '2026-03-27T14:00:00Z',
        authorEmail: 'anna.nowak@aero.pl',
      },
    ],
    status: 'CONFIRMED',
    createdByEmail: 'ewa.dabrowska@aero.pl',
    contactEmails: 'piotr.lewandowski@aero.pl',
    changeLog: [],
    createdAt: '2026-03-25T11:00:00Z',
    updatedAt: '2026-03-27T14:00:00Z',
  },
  {
    id: 4,
    orderProjectNumber: 'DE-25-12023',
    shortDescription: 'Patrolowanie trasy linii 110kV Wrocław-Sobótka',
    activities: [
      { activityType: 'patrol' },
      { activityType: 'visual_inspection' },
    ],
    proposedDateFrom: '2026-04-20',
    proposedDateTo: '2026-04-22',
    plannedDateFrom: '2026-04-20',
    plannedDateTo: '2026-04-21',
    routeLengthKm: 105,
    geojsonContent: toGeoJsonLineString(wroclawSouthKmlPoints),
    kmlFileName: 'linia_110kV_wroclaw_sobotka.kml',
    comments: [
      {
        id: 4,
        content: 'Zaplanowane do zlecenia, załoga przypisana.',
        createdAt: '2026-03-28T09:45:00Z',
        authorEmail: 'ewa.dabrowska@aero.pl',
      },
    ],
    status: 'SCHEDULED',
    createdByEmail: 'ewa.dabrowska@aero.pl',
    contactEmails: 'katarzyna.wisniewska@aero.pl',
    changeLog: [],
    createdAt: '2026-03-26T07:30:00Z',
    updatedAt: '2026-03-28T09:45:00Z',
  },
  {
    id: 5,
    orderProjectNumber: 'DE-25-12024',
    shortDescription: 'Oględziny wizualne linii 400kV Wrocław-Oleśnica (północ)',
    activities: [
      { activityType: 'visual_inspection' },
      { activityType: 'photos' },
    ],
    proposedDateFrom: '2026-03-15',
    proposedDateTo: '2026-03-16',
    plannedDateFrom: '2026-03-15',
    plannedDateTo: '2026-03-16',
    routeLengthKm: 180,
    geojsonContent: toGeoJsonLineString(wroclawKmlPoints),
    kmlFileName: 'linia_400kV_wroclaw_olesnica_polnoc.kml',
    comments: [
      {
        id: 5,
        content: 'Operacja zrealizowana pomyślnie.',
        createdAt: '2026-03-16T17:00:00Z',
        authorEmail: 'jan.kowalski@aero.pl',
      },
    ],
    status: 'COMPLETED',
    createdByEmail: 'ewa.dabrowska@aero.pl',
    postCompletionNotes: 'Wykonano pełne oględziny, brak usterek. Dokumentacja fotograficzna przekazana.',
    changeLog: [],
    createdAt: '2026-03-14T06:00:00Z',
    updatedAt: '2026-03-16T17:00:00Z',
  },
];

// --- Flight Orders ---
export const mockFlightOrders: FlightOrder[] = [
  {
    id: 1,
    plannedStartTime: '2026-04-14T07:00:00Z',
    plannedEndTime: '2026-04-14T11:00:00Z',
    pilotId: 1,
    status: 'SUBMITTED',
    helicopterId: 1,
    crewMemberIds: [1, 3, 5],
    crewWeight: 237, // 82+65+90
    departureSiteId: 3,
    arrivalSiteId: 3,
    operationIds: [3],
    estimatedRouteLengthKm: 68,
    createdAt: '2026-03-27T15:00:00Z',
    updatedAt: '2026-03-27T15:00:00Z',
  },
  {
    id: 2,
    plannedStartTime: '2026-04-20T06:30:00Z',
    plannedEndTime: '2026-04-20T12:00:00Z',
    pilotId: 1,
    status: 'PENDING_APPROVAL',
    helicopterId: 2,
    crewMemberIds: [1, 4],
    crewWeight: 140, // 82+58
    departureSiteId: 1,
    arrivalSiteId: 1,
    operationIds: [4],
    estimatedRouteLengthKm: 105,
    createdAt: '2026-03-28T10:00:00Z',
    updatedAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 3,
    plannedStartTime: '2026-03-15T06:00:00Z',
    plannedEndTime: '2026-03-15T13:00:00Z',
    pilotId: 1,
    status: 'ACCEPTED',
    helicopterId: 1,
    crewMemberIds: [1, 3],
    crewWeight: 147, // 82+65
    departureSiteId: 3,
    arrivalSiteId: 3,
    operationIds: [5],
    estimatedRouteLengthKm: 180,
    actualStartTime: '2026-03-15T06:15:00Z',
    actualEndTime: '2026-03-15T12:45:00Z',
    createdAt: '2026-03-14T07:00:00Z',
    updatedAt: '2026-03-15T12:45:00Z',
  },
];

// --- Current User (default login) ---
export const mockCurrentUser: AuthUser = {
  id: 3,
  email: 'anna.nowak@aero.pl',
  firstName: 'Anna',
  lastName: 'Nowak',
  role: 'SUPERVISOR',
  token: 'mock-jwt-token',
};
