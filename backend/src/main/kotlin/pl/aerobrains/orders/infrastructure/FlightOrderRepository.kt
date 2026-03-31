package pl.aerobrains.orders.infrastructure

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import pl.aerobrains.orders.domain.FlightOrder

interface FlightOrderRepository : JpaRepository<FlightOrder, Long>, JpaSpecificationExecutor<FlightOrder>
