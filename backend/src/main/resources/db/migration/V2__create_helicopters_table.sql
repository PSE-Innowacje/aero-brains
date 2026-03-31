CREATE SEQUENCE helicopters_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE helicopters (
    id                      NUMBER(19)    DEFAULT helicopters_seq.NEXTVAL PRIMARY KEY,
    registration_number     VARCHAR2(30)  NOT NULL,
    helicopter_type         VARCHAR2(100) NOT NULL,
    description             VARCHAR2(100),
    max_crew_count          NUMBER(2)     NOT NULL,
    max_crew_weight         NUMBER(4)     NOT NULL,
    status                  VARCHAR2(20)  NOT NULL,
    inspection_expiry_date  DATE,
    range_km                NUMBER(4)     NOT NULL,
    created_at              TIMESTAMP     DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at              TIMESTAMP     DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_helicopters_reg UNIQUE (registration_number),
    CONSTRAINT chk_helicopters_status CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT chk_helicopters_crew_count CHECK (max_crew_count BETWEEN 1 AND 10),
    CONSTRAINT chk_helicopters_crew_weight CHECK (max_crew_weight BETWEEN 1 AND 1000),
    CONSTRAINT chk_helicopters_range CHECK (range_km BETWEEN 1 AND 1000)
);
