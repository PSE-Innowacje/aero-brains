CREATE SEQUENCE operation_change_log_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE operation_change_log (
    id                      NUMBER(19)      DEFAULT operation_change_log_seq.NEXTVAL PRIMARY KEY,
    flight_operation_id     NUMBER(19)      NOT NULL,
    field_name              VARCHAR2(100)   NOT NULL,
    old_value               VARCHAR2(500),
    new_value               VARCHAR2(500),
    changed_by_email        VARCHAR2(100)   NOT NULL,
    changed_at              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_ocl_operation FOREIGN KEY (flight_operation_id)
        REFERENCES flight_operations(id)
);