CREATE SEQUENCE flight_orders_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE flight_orders (
    id                              NUMBER(19)      DEFAULT flight_orders_seq.NEXTVAL PRIMARY KEY,
    planned_start_time              TIMESTAMP       NOT NULL,
    planned_end_time                TIMESTAMP       NOT NULL,
    pilot_id                        NUMBER(19)      NOT NULL,
    status                          VARCHAR2(30)    NOT NULL,
    helicopter_id                   NUMBER(19)      NOT NULL,
    crew_weight                     NUMBER(5)       NOT NULL,
    departure_site_id               NUMBER(19)      NOT NULL,
    arrival_site_id                 NUMBER(19)      NOT NULL,
    estimated_route_length_km       NUMBER(10)      NOT NULL,
    actual_start_time               TIMESTAMP,
    actual_end_time                 TIMESTAMP,
    created_at                      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at                      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_fo_pilot FOREIGN KEY (pilot_id) REFERENCES crew_members(id),
    CONSTRAINT fk_fo_helicopter FOREIGN KEY (helicopter_id) REFERENCES helicopters(id),
    CONSTRAINT fk_fo_departure FOREIGN KEY (departure_site_id) REFERENCES landing_sites(id),
    CONSTRAINT fk_fo_arrival FOREIGN KEY (arrival_site_id) REFERENCES landing_sites(id),
    CONSTRAINT chk_fo_status CHECK (status IN (
        'INTRODUCED', 'SUBMITTED', 'REJECTED', 'ACCEPTED',
        'PARTIALLY_COMPLETED', 'COMPLETED', 'NOT_COMPLETED'
    ))
);
