package pl.aerobrains.operations.infrastructure

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import pl.aerobrains.operations.domain.FlightOperation
import pl.aerobrains.operations.domain.OperationStatus

interface FlightOperationRepository : JpaRepository<FlightOperation, Long>, JpaSpecificationExecutor<FlightOperation> {
    fun findAllByStatusInOrderByPlannedDateFromAsc(statuses: Collection<OperationStatus>): List<FlightOperation>
    fun findAllByStatus(status: OperationStatus): List<FlightOperation>
}
