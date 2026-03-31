CREATE TABLE flight_order_operations (
    flight_order_id         NUMBER(19) NOT NULL,
    flight_operation_id     NUMBER(19) NOT NULL,
    CONSTRAINT pk_foo PRIMARY KEY (flight_order_id, flight_operation_id),
    CONSTRAINT fk_foo_order FOREIGN KEY (flight_order_id) REFERENCES flight_orders(id),
    CONSTRAINT fk_foo_operation FOREIGN KEY (flight_operation_id) REFERENCES flight_operations(id)
);
