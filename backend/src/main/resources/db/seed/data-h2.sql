-- Seed data for H2 development profile
-- BCrypt hash for 'password'
-- Generated with Spring BCryptPasswordEncoder

INSERT INTO users (id, first_name, last_name, email, password, role, created_at, updated_at) VALUES
    (NEXT VALUE FOR users_seq, 'Admin', 'Systemowy', 'admin@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'ADMINISTRATOR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users (id, first_name, last_name, email, password, role, created_at, updated_at) VALUES
    (NEXT VALUE FOR users_seq, 'Anna', 'Kowalska', 'planner@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'PLANNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users (id, first_name, last_name, email, password, role, created_at, updated_at) VALUES
    (NEXT VALUE FOR users_seq, 'Jan', 'Nowak', 'supervisor@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'SUPERVISOR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users (id, first_name, last_name, email, password, role, created_at, updated_at) VALUES
    (NEXT VALUE FOR users_seq, 'Piotr', 'Wiśniewski', 'pilot@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'PILOT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO crew_members (id, first_name, last_name, email, weight, role, pilot_license_number, license_expiry_date, training_expiry_date, created_at, updated_at) VALUES
    (NEXT VALUE FOR crew_members_seq, 'Piotr', 'Wiśniewski', 'pilot@aero.pl', 82, 'PILOT', 'PL-PIL-2024-001', DATE '2027-06-30', DATE '2027-03-31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO crew_members (id, first_name, last_name, email, weight, role, pilot_license_number, license_expiry_date, training_expiry_date, created_at, updated_at) VALUES
    (NEXT VALUE FOR crew_members_seq, 'Marek', 'Zieliński', 'pilot2@aero.pl', 78, 'PILOT', 'PL-PIL-2024-002', DATE '2027-09-15', DATE '2027-05-31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO crew_members (id, first_name, last_name, email, weight, role, training_expiry_date, created_at, updated_at) VALUES
    (NEXT VALUE FOR crew_members_seq, 'Katarzyna', 'Dąbrowska', 'observer1@aero.pl', 65, 'OBSERVER', DATE '2027-04-30', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO crew_members (id, first_name, last_name, email, weight, role, training_expiry_date, created_at, updated_at) VALUES
    (NEXT VALUE FOR crew_members_seq, 'Tomasz', 'Lewandowski', 'observer2@aero.pl', 90, 'OBSERVER', DATE '2027-06-30', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO helicopters (id, registration_number, helicopter_type, description, max_crew_count, max_crew_weight, status, inspection_expiry_date, range_km, created_at, updated_at) VALUES
    (NEXT VALUE FOR helicopters_seq, 'SP-HEL1', 'Airbus H135', 'Lekki helikopter wielozadaniowy', 4, 400, 'ACTIVE', DATE '2027-01-15', 620, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO helicopters (id, registration_number, helicopter_type, description, max_crew_count, max_crew_weight, status, inspection_expiry_date, range_km, created_at, updated_at) VALUES
    (NEXT VALUE FOR helicopters_seq, 'SP-HEL2', 'Bell 407', 'Helikopter patrolowy', 5, 500, 'ACTIVE', DATE '2026-12-01', 580, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO helicopters (id, registration_number, helicopter_type, description, max_crew_count, max_crew_weight, status, range_km, created_at, updated_at) VALUES
    (NEXT VALUE FOR helicopters_seq, 'SP-HEL3', 'Robinson R44', 'Lekki helikopter - w przeglądzie', 2, 200, 'INACTIVE', 350, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO landing_sites (id, name, latitude, longitude, created_at, updated_at) VALUES
    (NEXT VALUE FOR landing_sites_seq, 'Lotnisko Warszawa-Babice', 52.2351, 20.9108, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO landing_sites (id, name, latitude, longitude, created_at, updated_at) VALUES
    (NEXT VALUE FOR landing_sites_seq, 'Lotnisko Kraków-Balice', 50.0777, 19.7848, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO landing_sites (id, name, latitude, longitude, created_at, updated_at) VALUES
    (NEXT VALUE FOR landing_sites_seq, 'Lądowisko Katowice-Muchowiec', 50.2383, 19.0347, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO landing_sites (id, name, latitude, longitude, created_at, updated_at) VALUES
    (NEXT VALUE FOR landing_sites_seq, 'Lądowisko Wrocław-Szymanów', 51.1027, 16.8858, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO landing_sites (id, name, latitude, longitude, created_at, updated_at) VALUES
    (NEXT VALUE FOR landing_sites_seq, 'Lądowisko Gdańsk-Rębiechowo', 54.3776, 18.4662, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ===================== FLIGHT OPERATIONS (30) =====================

-- INTRODUCED (8)
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, additional_info, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-10001', 'Inspekcja linii 110kV Warszawa-Łódź', DATE '2026-06-01', DATE '2026-09-30', 'Priorytet wysoki', 180, 'INTRODUCED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-10002', 'Patrol linii 220kV Radom-Kielce', DATE '2026-06-15', DATE '2026-08-31', 95, 'INTRODUCED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'CJI-5001', 'Kontrola słupów trakcji Poznań-Wrocław', DATE '2026-07-01', DATE '2026-10-31', 250, 'INTRODUCED', 'supervisor@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-10003', 'Inspekcja linii 400kV Kozienice-Ołtarzew', DATE '2026-07-10', DATE '2026-09-15', 120, 'INTRODUCED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-10004', 'Dokumentacja foto linii 110kV Lublin', DATE '2026-08-01', DATE '2026-10-30', 75, 'INTRODUCED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'CJI-5002', 'Patrol linii SN Kraków-Tarnów', DATE '2026-06-20', DATE '2026-08-20', 110, 'INTRODUCED', 'supervisor@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, additional_info, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-10005', 'Inspekcja termowizyjna Płock-Toruń', DATE '2026-09-01', DATE '2026-11-30', 'Wymagana kamera termowizyjna', 160, 'INTRODUCED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-10006', 'Kontrola linii 110kV Szczecin-Koszalin', DATE '2026-07-15', DATE '2026-09-30', 200, 'INTRODUCED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- REJECTED (4)
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-20001', 'Inspekcja odcinka testowego', DATE '2026-05-01', DATE '2026-05-31', 30, 'REJECTED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-20002', 'Patrol brak dostępnych helikopterów', DATE '2026-05-15', DATE '2026-06-15', 60, 'REJECTED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'CJI-6001', 'Kontrola nieopłacona przez klienta', DATE '2026-06-01', DATE '2026-07-31', 90, 'REJECTED', 'supervisor@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-20003', 'Foto odcinek zablokowany przez wojsko', DATE '2026-06-10', DATE '2026-07-10', 45, 'REJECTED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CONFIRMED (6)
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-30001', 'Inspekcja linii 220kV Warszawa-Radom', DATE '2026-06-01', DATE '2026-09-30', DATE '2026-07-01', DATE '2026-08-15', 130, 'CONFIRMED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-30002', 'Patrol linii 400kV Bełchatów-Rogowiec', DATE '2026-07-01', DATE '2026-10-31', DATE '2026-08-01', DATE '2026-09-30', 85, 'CONFIRMED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'CJI-7001', 'Kontrola linii SN Gdańsk-Elbląg', DATE '2026-06-15', DATE '2026-08-31', DATE '2026-07-15', DATE '2026-08-15', 140, 'CONFIRMED', 'supervisor@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-30003', 'Dokumentacja foto GPZ Piła', DATE '2026-08-01', DATE '2026-10-30', DATE '2026-08-15', DATE '2026-09-15', 50, 'CONFIRMED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-30004', 'Inspekcja linii 110kV Olsztyn-Ełk', DATE '2026-07-01', DATE '2026-09-30', DATE '2026-08-01', DATE '2026-08-31', 170, 'CONFIRMED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'CJI-7002', 'Patrol linii WN Opole-Nysa', DATE '2026-06-20', DATE '2026-08-20', DATE '2026-07-10', DATE '2026-08-10', 100, 'CONFIRMED', 'supervisor@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- SCHEDULED (5)
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-40001', 'Inspekcja linii 220kV Grudziądz-Bydgoszcz', DATE '2026-06-01', DATE '2026-08-31', DATE '2026-07-01', DATE '2026-07-31', 110, 'SCHEDULED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-40002', 'Patrol linii 110kV Białystok-Suwałki', DATE '2026-07-01', DATE '2026-09-30', DATE '2026-07-15', DATE '2026-08-15', 190, 'SCHEDULED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'CJI-8001', 'Kontrola linii 400kV Ostrów-Pątnów', DATE '2026-06-15', DATE '2026-08-31', DATE '2026-07-01', DATE '2026-07-20', 80, 'SCHEDULED', 'supervisor@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-40003', 'Inspekcja linii SN Rzeszów-Przemyśl', DATE '2026-08-01', DATE '2026-10-31', DATE '2026-08-15', DATE '2026-09-15', 70, 'SCHEDULED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-40004', 'Foto linii 220kV Siedlce-Terespol', DATE '2026-07-10', DATE '2026-09-10', DATE '2026-08-01', DATE '2026-08-20', 130, 'SCHEDULED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- PARTIALLY_COMPLETED (2)
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-50001', 'Inspekcja linii 110kV Łódź-Piotrków', DATE '2026-05-01', DATE '2026-07-31', DATE '2026-06-01', DATE '2026-06-30', 65, 'PARTIALLY_COMPLETED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'CJI-9001', 'Patrol linii WN Katowice-Gliwice', DATE '2026-05-15', DATE '2026-07-15', DATE '2026-06-01', DATE '2026-06-20', 55, 'PARTIALLY_COMPLETED', 'supervisor@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- COMPLETED (3)
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, post_completion_notes, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-60001', 'Inspekcja linii 220kV Jaworzno-Tarnów', DATE '2026-04-01', DATE '2026-06-30', DATE '2026-05-01', DATE '2026-05-31', 140, 'COMPLETED', 'planner@aero.pl', 'Wykryto 3 uszkodzone izolatory', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, post_completion_notes, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-60002', 'Patrol linii 110kV Zielona Góra-Gorzów', DATE '2026-04-15', DATE '2026-06-15', DATE '2026-05-01', DATE '2026-05-20', 165, 'COMPLETED', 'planner@aero.pl', 'Bez uwag', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, post_completion_notes, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'CJI-9002', 'Kontrola linii SN Wrocław-Legnica', DATE '2026-03-01', DATE '2026-05-31', DATE '2026-04-01', DATE '2026-04-30', 90, 'COMPLETED', 'supervisor@aero.pl', 'Raport przekazany do zleceniodawcy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CANCELLED (2)
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-70001', 'Inspekcja anulowana - zmiana projektu', DATE '2026-06-01', DATE '2026-08-31', 100, 'CANCELLED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_operations (id, order_project_number, short_description, proposed_date_from, proposed_date_to, planned_date_from, planned_date_to, route_length_km, status, created_by_email, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_operations_seq, 'DE-26-70002', 'Patrol odwołany z powodu warunków pogodowych', DATE '2026-05-01', DATE '2026-07-31', DATE '2026-06-01', DATE '2026-06-15', 80, 'CANCELLED', 'planner@aero.pl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ===================== GEOJSON ROUTES =====================
-- Add GeoJSON LineString routes to operations for map visualization

-- 1: Warszawa-Łódź (110kV)
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[20.9,52.23],[20.7,52.15],[20.5,52.05],[20.3,51.95],[20.1,51.85],[19.9,51.78]]}}' WHERE order_project_number = 'DE-26-10001';
-- 2: Radom-Kielce (220kV)
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[21.15,51.4],[21.0,51.3],[20.85,51.2],[20.7,51.1],[20.6,50.9],[20.63,50.87]]}}' WHERE order_project_number = 'DE-26-10002';
-- 3: Poznań-Wrocław
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[16.93,52.41],[16.95,52.2],[17.0,52.0],[17.05,51.8],[17.03,51.6],[17.02,51.4],[17.04,51.2],[17.03,51.11]]}}' WHERE order_project_number = 'CJI-5001';
-- 4: Kozienice-Ołtarzew (400kV)
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[21.56,51.58],[21.3,51.65],[21.1,51.72],[20.9,51.78],[20.7,51.82],[20.5,51.85],[20.3,51.88],[20.15,51.9]]}}' WHERE order_project_number = 'DE-26-10003';
-- 5: Lublin (110kV)
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[22.57,51.25],[22.4,51.2],[22.25,51.15],[22.1,51.1],[21.95,51.08],[21.8,51.05]]}}' WHERE order_project_number = 'DE-26-10004';
-- 6: Kraków-Tarnów
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[19.94,50.06],[20.1,50.05],[20.3,50.04],[20.5,50.03],[20.7,50.02],[20.98,50.01]]}}' WHERE order_project_number = 'CJI-5002';
-- 7: Płock-Toruń
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[19.7,52.55],[19.5,52.6],[19.3,52.7],[19.1,52.8],[18.9,52.9],[18.6,53.01]]}}' WHERE order_project_number = 'DE-26-10005';
-- 8: Szczecin-Koszalin
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[14.55,53.43],[14.8,53.5],[15.1,53.6],[15.4,53.7],[15.7,53.8],[16.0,53.9],[16.17,54.19]]}}' WHERE order_project_number = 'DE-26-10006';
-- 13: Warszawa-Radom (220kV) CONFIRMED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[20.9,52.23],[20.95,52.1],[21.0,51.95],[21.05,51.8],[21.1,51.65],[21.15,51.4]]}}' WHERE order_project_number = 'DE-26-30001';
-- 14: Bełchatów-Rogowiec (400kV) CONFIRMED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[19.35,51.37],[19.4,51.33],[19.45,51.3],[19.5,51.27],[19.55,51.25],[19.6,51.22]]}}' WHERE order_project_number = 'DE-26-30002';
-- 15: Gdańsk-Elbląg CONFIRMED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[18.65,54.35],[18.8,54.3],[19.0,54.25],[19.2,54.2],[19.4,54.18],[19.77,54.17]]}}' WHERE order_project_number = 'CJI-7001';
-- 16: GPZ Piła CONFIRMED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[16.73,53.15],[16.8,53.18],[16.9,53.2],[17.0,53.18],[17.1,53.15]]}}' WHERE order_project_number = 'DE-26-30003';
-- 17: Olsztyn-Ełk CONFIRMED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[20.48,53.78],[20.6,53.75],[20.8,53.7],[21.0,53.65],[21.2,53.6],[21.4,53.55],[21.5,53.5],[21.8,53.83]]}}' WHERE order_project_number = 'DE-26-30004';
-- 18: Opole-Nysa CONFIRMED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[17.92,50.67],[17.85,50.6],[17.75,50.55],[17.65,50.5],[17.55,50.45],[17.33,50.47]]}}' WHERE order_project_number = 'CJI-7002';
-- 19: Grudziądz-Bydgoszcz SCHEDULED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[18.77,53.48],[18.6,53.45],[18.4,53.4],[18.2,53.35],[18.0,53.15],[17.95,53.12]]}}' WHERE order_project_number = 'DE-26-40001';
-- 20: Białystok-Suwałki SCHEDULED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[23.15,53.13],[23.1,53.25],[23.05,53.4],[23.0,53.55],[22.95,53.7],[22.93,53.84]]}}' WHERE order_project_number = 'DE-26-40002';
-- 21: Ostrów-Pątnów (400kV) SCHEDULED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[17.8,51.65],[17.95,51.7],[18.1,51.75],[18.25,51.78],[18.4,51.8],[18.55,51.83]]}}' WHERE order_project_number = 'CJI-8001';
-- 22: Rzeszów-Przemyśl SCHEDULED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[21.99,50.04],[22.15,50.0],[22.3,49.95],[22.45,49.9],[22.6,49.85],[22.77,49.78]]}}' WHERE order_project_number = 'DE-26-40003';
-- 23: Siedlce-Terespol SCHEDULED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[22.29,52.17],[22.5,52.15],[22.7,52.1],[22.9,52.08],[23.1,52.05],[23.6,52.08]]}}' WHERE order_project_number = 'DE-26-40004';
-- 24: Łódź-Piotrków PARTIALLY_COMPLETED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[19.46,51.77],[19.5,51.7],[19.55,51.6],[19.6,51.5],[19.65,51.4]]}}' WHERE order_project_number = 'DE-26-50001';
-- 25: Katowice-Gliwice PARTIALLY_COMPLETED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[19.02,50.26],[18.95,50.27],[18.85,50.28],[18.75,50.29],[18.67,50.3]]}}' WHERE order_project_number = 'CJI-9001';
-- 26: Jaworzno-Tarnów (220kV) COMPLETED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[19.27,50.21],[19.4,50.18],[19.6,50.15],[19.8,50.12],[20.0,50.08],[20.2,50.05],[20.4,50.03],[20.98,50.01]]}}' WHERE order_project_number = 'DE-26-60001';
-- 27: Zielona Góra-Gorzów COMPLETED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[15.51,51.94],[15.5,52.05],[15.45,52.2],[15.4,52.35],[15.35,52.5],[15.25,52.73]]}}' WHERE order_project_number = 'DE-26-60002';
-- 28: Wrocław-Legnica COMPLETED
UPDATE flight_operations SET geojson_content = '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[17.04,51.11],[16.9,51.12],[16.7,51.13],[16.5,51.15],[16.3,51.17],[16.16,51.21]]}}' WHERE order_project_number = 'CJI-9002';

-- ===================== OPERATION ACTIVITIES =====================
-- Operations get ids 1-30 from sequence, activities reference them

INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 1, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 1, 'PHOTOS', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 2, 'PATROL', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 3, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 4, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 4, 'PHOTOS', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 5, 'PHOTOS', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 6, 'PATROL', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 7, 'OTHER', 'Inspekcja termowizyjna');
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 8, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 9, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 10, 'PATROL', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 11, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 12, 'PHOTOS', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 13, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 13, 'PHOTOS', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 14, 'PATROL', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 15, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 16, 'PHOTOS', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 17, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 18, 'PATROL', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 19, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 19, 'PHOTOS', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 20, 'PATROL', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 21, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 22, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 23, 'PHOTOS', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 24, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 24, 'OTHER', 'Pomiary odległości przewodów');
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 25, 'PATROL', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 26, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 26, 'PHOTOS', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 27, 'PATROL', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 28, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 29, 'VISUAL_INSPECTION', NULL);
INSERT INTO flight_operation_activity_types (id, flight_operation_id, activity_type, description) VALUES (NEXT VALUE FOR operation_activities_seq, 30, 'PATROL', NULL);

-- ===================== FLIGHT ORDERS (10) =====================

-- INTRODUCED (2)
INSERT INTO flight_orders (id, planned_start_time, planned_end_time, pilot_id, status, helicopter_id, crew_weight, departure_site_id, arrival_site_id, estimated_route_length_km, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_orders_seq, TIMESTAMP '2026-07-10 07:00:00', TIMESTAMP '2026-07-10 12:00:00', 1, 'INTRODUCED', 1, 147, 1, 3, 110, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_orders (id, planned_start_time, planned_end_time, pilot_id, status, helicopter_id, crew_weight, departure_site_id, arrival_site_id, estimated_route_length_km, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_orders_seq, TIMESTAMP '2026-07-20 06:30:00', TIMESTAMP '2026-07-20 11:30:00', 2, 'INTRODUCED', 2, 143, 5, 1, 190, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- SUBMITTED (2)
INSERT INTO flight_orders (id, planned_start_time, planned_end_time, pilot_id, status, helicopter_id, crew_weight, departure_site_id, arrival_site_id, estimated_route_length_km, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_orders_seq, TIMESTAMP '2026-07-05 08:00:00', TIMESTAMP '2026-07-05 13:00:00', 1, 'SUBMITTED', 1, 172, 1, 2, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_orders (id, planned_start_time, planned_end_time, pilot_id, status, helicopter_id, crew_weight, departure_site_id, arrival_site_id, estimated_route_length_km, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_orders_seq, TIMESTAMP '2026-08-01 07:00:00', TIMESTAMP '2026-08-01 11:00:00', 2, 'SUBMITTED', 2, 168, 3, 4, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ACCEPTED (2)
INSERT INTO flight_orders (id, planned_start_time, planned_end_time, pilot_id, status, helicopter_id, crew_weight, departure_site_id, arrival_site_id, estimated_route_length_km, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_orders_seq, TIMESTAMP '2026-08-10 06:00:00', TIMESTAMP '2026-08-10 12:00:00', 1, 'ACCEPTED', 1, 147, 2, 3, 130, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_orders (id, planned_start_time, planned_end_time, pilot_id, status, helicopter_id, crew_weight, departure_site_id, arrival_site_id, estimated_route_length_km, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_orders_seq, TIMESTAMP '2026-08-15 07:30:00', TIMESTAMP '2026-08-15 11:30:00', 2, 'ACCEPTED', 2, 143, 4, 5, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- COMPLETED (2)
INSERT INTO flight_orders (id, planned_start_time, planned_end_time, pilot_id, status, helicopter_id, crew_weight, departure_site_id, arrival_site_id, estimated_route_length_km, actual_start_time, actual_end_time, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_orders_seq, TIMESTAMP '2026-05-10 07:00:00', TIMESTAMP '2026-05-10 12:00:00', 1, 'COMPLETED', 1, 172, 1, 3, 140, TIMESTAMP '2026-05-10 07:15:00', TIMESTAMP '2026-05-10 11:45:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO flight_orders (id, planned_start_time, planned_end_time, pilot_id, status, helicopter_id, crew_weight, departure_site_id, arrival_site_id, estimated_route_length_km, actual_start_time, actual_end_time, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_orders_seq, TIMESTAMP '2026-05-20 06:30:00', TIMESTAMP '2026-05-20 11:00:00', 2, 'COMPLETED', 2, 168, 5, 4, 165, TIMESTAMP '2026-05-20 06:45:00', TIMESTAMP '2026-05-20 10:50:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- PARTIALLY_COMPLETED (1)
INSERT INTO flight_orders (id, planned_start_time, planned_end_time, pilot_id, status, helicopter_id, crew_weight, departure_site_id, arrival_site_id, estimated_route_length_km, actual_start_time, actual_end_time, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_orders_seq, TIMESTAMP '2026-06-05 08:00:00', TIMESTAMP '2026-06-05 13:00:00', 1, 'PARTIALLY_COMPLETED', 1, 147, 3, 2, 65, TIMESTAMP '2026-06-05 08:10:00', TIMESTAMP '2026-06-05 10:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- REJECTED (1)
INSERT INTO flight_orders (id, planned_start_time, planned_end_time, pilot_id, status, helicopter_id, crew_weight, departure_site_id, arrival_site_id, estimated_route_length_km, created_at, updated_at) VALUES
    (NEXT VALUE FOR flight_orders_seq, TIMESTAMP '2026-06-15 07:00:00', TIMESTAMP '2026-06-15 12:00:00', 2, 'REJECTED', 2, 143, 2, 5, 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ===================== FLIGHT ORDER <-> OPERATION LINKS =====================

INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (1, 19);
INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (2, 20);
INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (3, 21);
INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (4, 22);
INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (5, 23);
INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (6, 17);
INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (6, 18);
INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (7, 26);
INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (8, 27);
INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (8, 28);
INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (9, 24);
INSERT INTO flight_order_operations (flight_order_id, flight_operation_id) VALUES (9, 25);

-- ===================== FLIGHT ORDER <-> CREW =====================

INSERT INTO flight_order_crew (flight_order_id, crew_member_id) VALUES (1, 3);
INSERT INTO flight_order_crew (flight_order_id, crew_member_id) VALUES (2, 4);
INSERT INTO flight_order_crew (flight_order_id, crew_member_id) VALUES (3, 3);
INSERT INTO flight_order_crew (flight_order_id, crew_member_id) VALUES (3, 4);
INSERT INTO flight_order_crew (flight_order_id, crew_member_id) VALUES (4, 3);
INSERT INTO flight_order_crew (flight_order_id, crew_member_id) VALUES (5, 4);
INSERT INTO flight_order_crew (flight_order_id, crew_member_id) VALUES (6, 3);
INSERT INTO flight_order_crew (flight_order_id, crew_member_id) VALUES (7, 3);
INSERT INTO flight_order_crew (flight_order_id, crew_member_id) VALUES (7, 4);
INSERT INTO flight_order_crew (flight_order_id, crew_member_id) VALUES (8, 3);
INSERT INTO flight_order_crew (flight_order_id, crew_member_id) VALUES (9, 4);
