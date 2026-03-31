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
    type: 'PZL W-3A Sokół',
    description: 'Wielozadaniowy śmigłowiec transportowy',
    maxCrewCount: 4,
    maxCrewWeight: 400,
    status: 'active',
    inspectionExpiryDate: '2026-09-15',
    rangeWithoutLanding: 745,
    imageUrl: '/images/pzl-w3a-sokol.svg',
  },
  {
    id: 2,
    registrationNumber: 'SP-HXB',
    type: 'Airbus H135',
    description: 'Lekki śmigłowiec patrolowy',
    maxCrewCount: 3,
    maxCrewWeight: 300,
    status: 'active',
    inspectionExpiryDate: '2026-11-30',
    rangeWithoutLanding: 620,
    imageUrl: '/images/airbus-h135.svg',
  },
  {
    id: 3,
    registrationNumber: 'SP-HXC',
    type: 'Bell 407GXi',
    description: 'Śmigłowiec wycofany z eksploatacji — oczekuje na przegląd generalny',
    maxCrewCount: 4,
    maxCrewWeight: 380,
    status: 'inactive',
    rangeWithoutLanding: 580,
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
    coordinates: { lat: 52.1657, lng: 20.9671 },
  },
  {
    id: 2,
    name: 'Kraków-Balice',
    coordinates: { lat: 50.0777, lng: 19.7848 },
  },
  {
    id: 3,
    name: 'Gdańsk-Rębiechowo',
    coordinates: { lat: 54.3776, lng: 18.4662 },
  },
  {
    id: 4,
    name: 'Wrocław-Strachowice',
    coordinates: { lat: 51.1027, lng: 16.8858 },
  },
];

// --- Users ---
export const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'Marek',
    lastName: 'Jankowski',
    email: 'marek.jankowski@aero.pl',
    role: 'admin',
  },
  {
    id: 2,
    firstName: 'Ewa',
    lastName: 'Dąbrowska',
    email: 'ewa.dabrowska@aero.pl',
    role: 'planner',
  },
  {
    id: 3,
    firstName: 'Anna',
    lastName: 'Nowak',
    email: 'anna.nowak@aero.pl',
    role: 'supervisor',
  },
  {
    id: 4,
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@aero.pl',
    role: 'pilot',
  },
];

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
    operationNumber: 'OP-2026-001',
    orderNumber: 'DE-25-12020',
    shortDescription: 'Oględziny linii 400kV Wrocław-Oleśnica',
    activityTypes: ['visual_inspection', 'photos'],
    proposedDateFrom: '2026-04-10',
    proposedDateTo: '2026-04-12',
    routeDistanceKm: 135,
    kmlPoints: wroclawKmlPoints,
    kmlFileName: 'linia_400kV_wroclaw_olesnica.kml',
    comments: [
      {
        text: 'Zgłoszenie przyjęte, oczekuje na przypisanie załogi.',
        date: '2026-03-25T10:30:00Z',
        author: 'ewa.dabrowska@aero.pl',
      },
    ],
    status: 1,
    createdBy: 'ewa.dabrowska@aero.pl',
    contactPersons: ['jan.kowalski@aero.pl'],
    linkedFlightOrderIds: [],
  },
  {
    id: 2,
    operationNumber: 'OP-2026-002',
    orderNumber: 'DE-25-12021',
    shortDescription: 'Skan 3D podstacji Wrocław-Południe',
    activityTypes: ['3d_scan'],
    proposedDateFrom: '2026-04-05',
    proposedDateTo: '2026-04-06',
    routeDistanceKm: 42,
    kmlPoints: wroclawSouthKmlPoints,
    kmlFileName: 'podstacja_wroclaw_poludnie.kml',
    comments: [
      {
        text: 'Odrzucono — termin koliduje z przeglądem SP-HXC.',
        date: '2026-03-26T08:15:00Z',
        author: 'anna.nowak@aero.pl',
      },
    ],
    status: 2,
    createdBy: 'ewa.dabrowska@aero.pl',
    linkedFlightOrderIds: [],
  },
  {
    id: 3,
    operationNumber: 'OP-2026-003',
    orderNumber: 'DE-25-12022',
    shortDescription: 'Lokalizacja awarii na linii 220kV Wrocław-Trzebnica',
    activityTypes: ['fault_location', 'photos'],
    proposedDateFrom: '2026-04-14',
    proposedDateTo: '2026-04-15',
    plannedDateFrom: '2026-04-14',
    plannedDateTo: '2026-04-15',
    routeDistanceKm: 68,
    kmlPoints: wroclawNorthKmlPoints,
    kmlFileName: 'linia_220kV_wroclaw_trzebnica.kml',
    comments: [
      {
        text: 'Potwierdzone do planu — wysoka priorytetowość.',
        date: '2026-03-27T14:00:00Z',
        author: 'anna.nowak@aero.pl',
      },
    ],
    status: 3,
    createdBy: 'ewa.dabrowska@aero.pl',
    contactPersons: ['piotr.lewandowski@aero.pl'],
    linkedFlightOrderIds: [1],
  },
  {
    id: 4,
    operationNumber: 'OP-2026-004',
    orderNumber: 'DE-25-12023',
    shortDescription: 'Patrolowanie trasy linii 110kV Wrocław-Sobótka',
    activityTypes: ['patrol', 'visual_inspection'],
    proposedDateFrom: '2026-04-20',
    proposedDateTo: '2026-04-22',
    plannedDateFrom: '2026-04-20',
    plannedDateTo: '2026-04-21',
    routeDistanceKm: 105,
    kmlPoints: wroclawSouthKmlPoints,
    kmlFileName: 'linia_110kV_wroclaw_sobotka.kml',
    comments: [
      {
        text: 'Zaplanowane do zlecenia, załoga przypisana.',
        date: '2026-03-28T09:45:00Z',
        author: 'ewa.dabrowska@aero.pl',
      },
    ],
    status: 4,
    createdBy: 'ewa.dabrowska@aero.pl',
    contactPersons: ['katarzyna.wisniewska@aero.pl'],
    linkedFlightOrderIds: [2],
  },
  {
    id: 5,
    operationNumber: 'OP-2026-005',
    orderNumber: 'DE-25-12024',
    shortDescription: 'Oględziny wizualne linii 400kV Wrocław-Oleśnica (północ)',
    activityTypes: ['visual_inspection', 'photos'],
    proposedDateFrom: '2026-03-15',
    proposedDateTo: '2026-03-16',
    plannedDateFrom: '2026-03-15',
    plannedDateTo: '2026-03-16',
    routeDistanceKm: 180,
    kmlPoints: wroclawKmlPoints,
    kmlFileName: 'linia_400kV_wroclaw_olesnica_polnoc.kml',
    comments: [
      {
        text: 'Operacja zrealizowana pomyślnie.',
        date: '2026-03-16T17:00:00Z',
        author: 'jan.kowalski@aero.pl',
      },
    ],
    status: 6,
    createdBy: 'ewa.dabrowska@aero.pl',
    postRealizationNotes: 'Wykonano pełne oględziny, brak usterek. Dokumentacja fotograficzna przekazana.',
    linkedFlightOrderIds: [3],
  },
];

// --- Flight Orders ---
export const mockFlightOrders: FlightOrder[] = [
  {
    id: 1,
    orderNumber: 'FO-2026-001',
    plannedStartDateTime: '2026-04-14T07:00:00Z',
    plannedLandingDateTime: '2026-04-14T11:00:00Z',
    pilotId: 1,
    status: 1,
    helicopterId: 1,
    crewMemberIds: [1, 3, 5],
    crewWeight: 237, // 82+65+90
    startLandingSiteId: 3,
    endLandingSiteId: 3,
    selectedOperationIds: [3],
    estimatedRouteDistance: 68,
  },
  {
    id: 2,
    orderNumber: 'FO-2026-002',
    plannedStartDateTime: '2026-04-20T06:30:00Z',
    plannedLandingDateTime: '2026-04-20T12:00:00Z',
    pilotId: 1,
    status: 2,
    helicopterId: 2,
    crewMemberIds: [1, 4],
    crewWeight: 140, // 82+58
    startLandingSiteId: 1,
    endLandingSiteId: 1,
    selectedOperationIds: [4],
    estimatedRouteDistance: 105,
  },
  {
    id: 3,
    orderNumber: 'FO-2026-003',
    plannedStartDateTime: '2026-03-15T06:00:00Z',
    plannedLandingDateTime: '2026-03-15T13:00:00Z',
    pilotId: 1,
    status: 4,
    helicopterId: 1,
    crewMemberIds: [1, 3],
    crewWeight: 147, // 82+65
    startLandingSiteId: 3,
    endLandingSiteId: 3,
    selectedOperationIds: [5],
    estimatedRouteDistance: 180,
    actualStartDateTime: '2026-03-15T06:15:00Z',
    actualLandingDateTime: '2026-03-15T12:45:00Z',
  },
];

// --- Current User (default login) ---
export const mockCurrentUser: AuthUser = {
  id: 3,
  email: 'anna.nowak@aero.pl',
  firstName: 'Anna',
  lastName: 'Nowak',
  role: 'supervisor',
};
