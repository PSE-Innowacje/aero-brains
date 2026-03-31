CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE users (
    id            NUMBER(19)    DEFAULT users_seq.NEXTVAL PRIMARY KEY,
    first_name    VARCHAR2(100) NOT NULL,
    last_name     VARCHAR2(100) NOT NULL,
    email         VARCHAR2(100) NOT NULL,
    password      VARCHAR2(255) NOT NULL,
    role          VARCHAR2(30)  NOT NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('ADMINISTRATOR', 'PLANNER', 'SUPERVISOR', 'PILOT'))
);
