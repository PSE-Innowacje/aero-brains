-- Seed data for initial setup
-- All passwords are BCrypt-hashed. Plain text passwords listed in comments for dev convenience.
-- These should be changed in production!

-- =====================
-- USERS (password = 'password')
-- BCrypt hash for 'password': $2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG
-- =====================

INSERT INTO users (first_name, last_name, email, password, role) VALUES
    ('Admin', 'Systemowy', 'admin@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'ADMINISTRATOR');

INSERT INTO users (first_name, last_name, email, password, role) VALUES
    ('Anna', 'Kowalska', 'planner@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'PLANNER');

INSERT INTO users (first_name, last_name, email, password, role) VALUES
    ('Jan', 'Nowak', 'supervisor@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'SUPERVISOR');

INSERT INTO users (first_name, last_name, email, password, role) VALUES
    ('Piotr', 'Wiśniewski', 'pilot@aero.pl', '$2a$10$UTa6YOqrQlgBmwTNwaioz.6K9Ihsyjo.BRwtxXwwbgCg6NJFjNxsG', 'PILOT');

-- =====================
-- CREW MEMBERS
-- =====================

INSERT INTO crew_members (first_name, last_name, email, weight, role, pilot_license_number, license_expiry_date, training_expiry_date) VALUES
    ('Piotr', 'Wiśniewski', 'pilot@aero.pl', 82, 'PILOT', 'PL-PIL-2024-001', DATE '2027-06-30', DATE '2027-03-31');

INSERT INTO crew_members (first_name, last_name, email, weight, role, pilot_license_number, license_expiry_date, training_expiry_date) VALUES
    ('Marek', 'Zieliński', 'pilot2@aero.pl', 78, 'PILOT', 'PL-PIL-2024-002', DATE '2027-09-15', DATE '2027-05-31');

INSERT INTO crew_members (first_name, last_name, email, weight, role, training_expiry_date) VALUES
    ('Katarzyna', 'Dąbrowska', 'observer1@aero.pl', 65, 'OBSERVER', DATE '2027-04-30');

INSERT INTO crew_members (first_name, last_name, email, weight, role, training_expiry_date) VALUES
    ('Tomasz', 'Lewandowski', 'observer2@aero.pl', 90, 'OBSERVER', DATE '2027-06-30');

-- =====================
-- HELICOPTERS
-- =====================

INSERT INTO helicopters (registration_number, helicopter_type, description, max_crew_count, max_crew_weight, status, inspection_expiry_date, range_km) VALUES
    ('SP-HEL1', 'Airbus H135', 'Lekki helikopter wielozadaniowy', 4, 400, 'ACTIVE', DATE '2027-01-15', 620);

INSERT INTO helicopters (registration_number, helicopter_type, description, max_crew_count, max_crew_weight, status, inspection_expiry_date, range_km) VALUES
    ('SP-HEL2', 'Bell 407', 'Helikopter patrolowy', 5, 500, 'ACTIVE', DATE '2026-12-01', 580);

INSERT INTO helicopters (registration_number, helicopter_type, description, max_crew_count, max_crew_weight, status, range_km) VALUES
    ('SP-HEL3', 'Robinson R44', 'Lekki helikopter - w przeglądzie', 2, 200, 'INACTIVE', 350);

-- =====================
-- LANDING SITES
-- =====================

INSERT INTO landing_sites (name, latitude, longitude) VALUES
    ('Lotnisko Warszawa-Babice', 52.2351, 20.9108);

INSERT INTO landing_sites (name, latitude, longitude) VALUES
    ('Lotnisko Kraków-Balice', 50.0777, 19.7848);

INSERT INTO landing_sites (name, latitude, longitude) VALUES
    ('Lądowisko Katowice-Muchowiec', 50.2383, 19.0347);

INSERT INTO landing_sites (name, latitude, longitude) VALUES
    ('Lądowisko Wrocław-Szymanów', 51.1027, 16.8858);

INSERT INTO landing_sites (name, latitude, longitude) VALUES
    ('Lądowisko Gdańsk-Rębiechowo', 54.3776, 18.4662);
