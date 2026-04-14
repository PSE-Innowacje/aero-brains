package pl.aerobrains.operations.infrastructure

import org.springframework.data.jpa.domain.Specification
import pl.aerobrains.operations.domain.FlightOperation
import pl.aerobrains.operations.domain.OperationStatus

object FlightOperationSpecifications {

    fun hasStatus(status: OperationStatus): Specification<FlightOperation> {
        return Specification { root, _, cb -> cb.equal(root.get<OperationStatus>("status"), status) }
    }

    fun hasStatuses(statuses: Collection<OperationStatus>): Specification<FlightOperation> {
        return Specification { root, _, _ -> root.get<OperationStatus>("status").`in`(statuses) }
    }

    fun orderProjectNumberContains(value: String): Specification<FlightOperation> {
        return Specification { root, _, cb ->
            val sanitized = value.uppercase().replace("%", "\\%").replace("_", "\\_")
            cb.like(cb.upper(root.get("orderProjectNumber")), "%${sanitized}%", '\\')
        }
    }

    fun createdByEmail(email: String): Specification<FlightOperation> {
        return Specification { root, _, cb -> cb.equal(root.get<String>("createdByEmail"), email) }
    }
}
