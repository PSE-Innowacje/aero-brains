-- Drop composite PK to allow multiple activities + add surrogate key
ALTER TABLE flight_operation_activity_types DROP CONSTRAINT pk_foat;

CREATE SEQUENCE operation_activities_seq START WITH 1 INCREMENT BY 1;

ALTER TABLE flight_operation_activity_types ADD (
    id          NUMBER(19) DEFAULT operation_activities_seq.NEXTVAL NOT NULL,
    description VARCHAR2(200)
);

ALTER TABLE flight_operation_activity_types ADD CONSTRAINT pk_foat PRIMARY KEY (id);
