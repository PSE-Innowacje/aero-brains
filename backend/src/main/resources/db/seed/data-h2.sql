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
