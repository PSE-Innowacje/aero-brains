CREATE SEQUENCE crew_members_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE crew_members (
    id                      NUMBER(19)    DEFAULT crew_members_seq.NEXTVAL PRIMARY KEY,
    first_name              VARCHAR2(100) NOT NULL,
    last_name               VARCHAR2(100) NOT NULL,
    email                   VARCHAR2(100) NOT NULL,
    weight                  NUMBER(3)     NOT NULL,
    role                    VARCHAR2(20)  NOT NULL,
    pilot_license_number    VARCHAR2(30),
    license_expiry_date     DATE,
    training_expiry_date    DATE          NOT NULL,
    created_at              TIMESTAMP     DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at              TIMESTAMP     DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_crew_members_email UNIQUE (email),
    CONSTRAINT chk_crew_members_role CHECK (role IN ('PILOT', 'OBSERVER')),
    CONSTRAINT chk_crew_members_weight CHECK (weight BETWEEN 30 AND 200)
);