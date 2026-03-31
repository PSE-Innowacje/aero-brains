CREATE TABLE flight_order_crew (
    flight_order_id     NUMBER(19) NOT NULL,
    crew_member_id      NUMBER(19) NOT NULL,
    CONSTRAINT pk_foc PRIMARY KEY (flight_order_id, crew_member_id),
    CONSTRAINT fk_foc_order FOREIGN KEY (flight_order_id) REFERENCES flight_orders(id),
    CONSTRAINT fk_foc_crew FOREIGN KEY (crew_member_id) REFERENCES crew_members(id)
);
