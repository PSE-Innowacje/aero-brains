CREATE SEQUENCE operation_comments_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE operation_comments (
    id                      NUMBER(19)      DEFAULT operation_comments_seq.NEXTVAL PRIMARY KEY,
    flight_operation_id     NUMBER(19)      NOT NULL,
    content                 VARCHAR2(500)   NOT NULL,
    author_email            VARCHAR2(100)   NOT NULL,
    created_at              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_oc_operation FOREIGN KEY (flight_operation_id)
        REFERENCES flight_operations(id)
);