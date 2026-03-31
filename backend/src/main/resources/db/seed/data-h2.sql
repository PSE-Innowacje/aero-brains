-- Seed data for H2 development profile
-- BCrypt hash for 'password'
-- Generated with Spring BCryptPasswordEncoder

INSERT INTO users (id, first_name, last_name, email, password, role, created_at, updated_at) VALUES
    (1, 'Admin', 'Systemowy', 'admin@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'ADMINISTRATOR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users (id, first_name, last_name, email, password, role, created_at, updated_at) VALUES
    (2, 'Anna', 'Kowalska', 'planner@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'PLANNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users (id, first_name, last_name, email, password, role, created_at, updated_at) VALUES
    (3, 'Jan', 'Nowak', 'supervisor@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'SUPERVISOR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users (id, first_name, last_name, email, password, role, created_at, updated_at) VALUES
    (4, 'Piotr', 'Wiśniewski', 'pilot@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'PILOT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO crew_members (id, first_name, last_name, email, weight, role, pilot_license_number, license_expiry_date, training_expiry_date, created_at, updated_at) VALUES
    (1, 'Piotr', 'Wiśniewski', 'pilot@aero.pl', 82, 'PILOT', 'PL-PIL-2024-001', DATE '2027-06-30', DATE '2027-03-31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO crew_members (id, first_name, last_name, email, weight, role, pilot_license_number, license_expiry_date, training_expiry_date, created_at, updated_at) VALUES
    (2, 'Marek', 'Zieliński', 'pilot2@aero.pl', 78, 'PILOT', 'PL-PIL-2024-002', DATE '2027-09-15', DATE '2027-05-31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO crew_members (id, first_name, last_name, email, weight, role, training_expiry_date, created_at, updated_at) VALUES
    (3, 'Katarzyna', 'Dąbrowska', 'observer1@aero.pl', 65, 'OBSERVER', DATE '2027-04-30', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO crew_members (id, first_name, last_name, email, weight, role, training_expiry_date, created_at, updated_at) VALUES
    (4, 'Tomasz', 'Lewandowski', 'observer2@aero.pl', 90, 'OBSERVER', DATE '2027-06-30', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO helicopters (id, registration_number, helicopter_type, description, max_crew_count, max_crew_weight, status, inspection_expiry_date, range_km, created_at, updated_at) VALUES
    (1, 'SP-HEL1', 'Airbus H135', 'Lekki helikopter wielozadaniowy', 4, 400, 'ACTIVE', DATE '2027-01-15', 620, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO helicopters (id, registration_number, helicopter_type, description, max_crew_count, max_crew_weight, status, inspection_expiry_date, range_km, created_at, updated_at) VALUES
    (2, 'SP-HEL2', 'Bell 407', 'Helikopter patrolowy', 5, 500, 'ACTIVE', DATE '2026-12-01', 580, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO helicopters (id, registration_number, helicopter_type, description, max_crew_count, max_crew_weight, status, range_km, created_at, updated_at) VALUES
    (3, 'SP-HEL3', 'Robinson R44', 'Lekki helikopter - w przeglądzie', 2, 200, 'INACTIVE', 350, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO landing_sites (id, name, latitude, longitude, created_at, updated_at) VALUES
    (1, 'Lotnisko Warszawa-Babice', 52.2351, 20.9108, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO landing_sites (id, name, latitude, longitude, created_at, updated_at) VALUES
    (2, 'Lotnisko Kraków-Balice', 50.0777, 19.7848, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO landing_sites (id, name, latitude, longitude, created_at, updated_at) VALUES
    (3, 'Lądowisko Katowice-Muchowiec', 50.2383, 19.0347, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO landing_sites (id, name, latitude, longitude, created_at, updated_at) VALUES
    (4, 'Lądowisko Wrocław-Szymanów', 51.1027, 16.8858, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO landing_sites (id, name, latitude, longitude, created_at, updated_at) VALUES
    (5, 'Lądowisko Gdańsk-Rębiechowo', 54.3776, 18.4662, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
