CREATE SEQUENCE landing_sites_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE landing_sites (
    id          NUMBER(19)      DEFAULT landing_sites_seq.NEXTVAL PRIMARY KEY,
    name        VARCHAR2(200)   NOT NULL,
    latitude    NUMBER(10, 7)   NOT NULL,
    longitude   NUMBER(10, 7)   NOT NULL,
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_landing_sites_name UNIQUE (name)
);