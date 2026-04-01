package pl.aerobrains.orders.infrastructure

import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import pl.aerobrains.orders.domain.FlightOrder
import java.util.Optional

interface FlightOrderRepository : JpaRepository<FlightOrder, Long>, JpaSpecificationExecutor<FlightOrder> {

    @EntityGraph(attributePaths = ["operationIds", "crewMemberIds"])
    override fun findById(id: Long): Optional<FlightOrder>
}
