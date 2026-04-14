package pl.aerobrains.orders.application

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.aerobrains.operations.application.FlightOperationService
import pl.aerobrains.orders.api.OperationSettlementStatus
import pl.aerobrains.orders.api.SettleFlightOrderRequest
import pl.aerobrains.orders.domain.FlightOrder
import pl.aerobrains.shared.exception.BusinessRuleViolationException

@Service
@Transactional
class FlightOrderSettlementService(
    private val flightOperationService: FlightOperationService
) {

    fun settlePartial(order: FlightOrder, request: SettleFlightOrderRequest, changedByEmail: String) {
        val opStatuses = request.operationStatuses
            ?: throw BusinessRuleViolationException("Operation statuses are required for partial settlement")

        if (opStatuses.keys != order.operationIds) {
            throw BusinessRuleViolationException("Operation statuses must cover all linked operations")
        }

        val allCompleted = opStatuses.values.all { it == OperationSettlementStatus.COMPLETED }
        if (allCompleted) {
            throw BusinessRuleViolationException("All operations are COMPLETED. Use full settlement instead.")
        }

        order.fillActualData(request.actualStartTime, request.actualEndTime, request.actualRouteLengthKm)
        order.settlePartial()

        opStatuses.forEach { (opId, status) ->
            when (status) {
                OperationSettlementStatus.COMPLETED -> flightOperationService.markCompleted(opId, changedByEmail)
                OperationSettlementStatus.PARTIALLY_COMPLETED -> flightOperationService.markPartiallyCompleted(opId, changedByEmail)
                OperationSettlementStatus.NOT_COMPLETED -> flightOperationService.unlinkFromOrder(opId, changedByEmail)
            }
        }
    }

    fun settleComplete(order: FlightOrder, request: SettleFlightOrderRequest, changedByEmail: String) {
        order.fillActualData(request.actualStartTime, request.actualEndTime, request.actualRouteLengthKm)
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
