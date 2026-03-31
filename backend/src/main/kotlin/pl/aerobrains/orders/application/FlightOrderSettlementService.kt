package pl.aerobrains.orders.application

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.aerobrains.operations.application.FlightOperationService
import pl.aerobrains.orders.domain.FlightOrder

@Service
@Transactional
class FlightOrderSettlementService(
    private val flightOperationService: FlightOperationService
) {

    fun settlePartial(order: FlightOrder, changedByEmail: String) {
        order.settlePartial()
        order.operationIds.forEach { operationId ->
            flightOperationService.markPartiallyCompleted(operationId, changedByEmail)
        }
    }

    fun settleComplete(order: FlightOrder, changedByEmail: String) {
        order.settleComplete()
        order.operationIds.forEach { operationId ->
            flightOperationService.markCompleted(operationId, changedByEmail)
        }
    }

    fun settleNotCompleted(order: FlightOrder, changedByEmail: String) {
        order.settleNotCompleted()
        order.operationIds.forEach { operationId ->
            flightOperationService.unlinkFromOrder(operationId, changedByEmail)
        }
    }
}
