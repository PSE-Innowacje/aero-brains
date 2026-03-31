CREATE SEQUENCE flight_operations_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE flight_operations (
    id                          NUMBER(19)      DEFAULT flight_operations_seq.NEXTVAL PRIMARY KEY,
    operation_number            NUMBER(19)      GENERATED ALWAYS AS IDENTITY,
    order_project_number        VARCHAR2(30)    NOT NULL,
    short_description           VARCHAR2(100)   NOT NULL,
    kml_file_name               VARCHAR2(255),
    kml_content                 CLOB,
    proposed_date_from          DATE,
    proposed_date_to            DATE,
    additional_info             VARCHAR2(500),
    route_length_km             NUMBER(10)      NOT NULL,
    planned_date_from           DATE,
    planned_date_to             DATE,
    status                      VARCHAR2(30)    NOT NULL,
    created_by_email            VARCHAR2(100)   NOT NULL,
    contact_emails              VARCHAR2(1000),
    post_completion_notes       VARCHAR2(500),
    created_at                  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at                  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_fo_status CHECK (status IN (
        'INTRODUCED', 'REJECTED', 'CONFIRMED', 'SCHEDULED',
        'PARTIALLY_COMPLETED', 'COMPLETED', 'CANCELLED'
    ))
);

CREATE TABLE flight_operation_activity_types (
    flight_operation_id     NUMBER(19)      NOT NULL,
    activity_type           VARCHAR2(50)    NOT NULL,
    CONSTRAINT fk_foat_operation FOREIGN KEY (flight_operation_id)
        REFERENCES flight_operations(id),
    CONSTRAINT pk_foat PRIMARY KEY (flight_operation_id, activity_type)
);
