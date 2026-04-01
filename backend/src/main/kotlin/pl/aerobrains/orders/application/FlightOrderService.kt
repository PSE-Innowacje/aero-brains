package pl.aerobrains.orders.application

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.aerobrains.fleet.infrastructure.CrewMemberRepository
import pl.aerobrains.operations.application.FlightOperationService
import pl.aerobrains.orders.api.CreateFlightOrderRequest
import pl.aerobrains.orders.api.FlightOrderListItem
import pl.aerobrains.orders.api.FlightOrderMapper
import pl.aerobrains.orders.api.FlightOrderResponse
import pl.aerobrains.orders.api.SettleFlightOrderRequest
import pl.aerobrains.orders.api.UpdateFlightOrderRequest
import pl.aerobrains.orders.domain.FlightOrder
import pl.aerobrains.orders.domain.OrderStatus
import pl.aerobrains.orders.infrastructure.FlightOrderRepository
import pl.aerobrains.shared.exception.EntityNotFoundException

@Service
@Transactional
class FlightOrderService(
    private val repository: FlightOrderRepository,
    private val mapper: FlightOrderMapper,
    private val validator: FlightOrderValidator,
    private val settlementService: FlightOrderSettlementService,
    private val flightOperationService: FlightOperationService,
    private val crewMemberRepository: CrewMemberRepository
) {

    @Transactional(readOnly = true)
    fun findAll(pageable: Pageable): Page<FlightOrderListItem> {
        return repository.findAll(pageable)
            .map { mapper.toListItem(it) }
    }

    @Transactional(readOnly = true)
    fun findById(id: Long): FlightOrderResponse {
        return mapper.toResponse(getOrder(id))
    }

    fun create(request: CreateFlightOrderRequest, pilotEmail: String): FlightOrderResponse {
        val pilot = crewMemberRepository.findAll().firstOrNull { it.email == pilotEmail }
            ?: throw EntityNotFoundException("CrewMember (pilot by email)", pilotEmail)

        val flightDate = request.plannedStartTime.toLocalDate()
        val crewWeight = validator.validate(
            helicopterId = request.helicopterId,
            pilotId = pilot.id,
            crewMemberIds = request.crewMemberIds,
            plannedFlightDate = flightDate,
            estimatedRouteLengthKm = request.estimatedRouteLengthKm
        )

        val order = mapper.toEntity(request)
        order.pilotId = pilot.id
        order.status = OrderStatus.INTRODUCED
        order.crewWeight = crewWeight

        val saved = repository.save(order)

        // Mark linked operations as SCHEDULED
        request.operationIds.forEach { opId ->
            flightOperationService.markScheduled(opId, pilotEmail)
        }

        return mapper.toResponse(saved)
    }

    fun update(id: Long, request: UpdateFlightOrderRequest, pilotEmail: String): FlightOrderResponse {
        val order = getOrder(id)
        val pilot = crewMemberRepository.findAll().firstOrNull { it.email == pilotEmail }
            ?: throw EntityNotFoundException("CrewMember (pilot by email)", pilotEmail)

        val flightDate = request.plannedStartTime.toLocalDate()
        val crewWeight = validator.validate(
            helicopterId = request.helicopterId,
            pilotId = pilot.id,
            crewMemberIds = request.crewMemberIds,
            plannedFlightDate = flightDate,
            estimatedRouteLengthKm = request.estimatedRouteLengthKm
        )

        order.plannedStartTime = request.plannedStartTime
        order.plannedEndTime = request.plannedEndTime
        order.helicopterId = request.helicopterId
        order.crewMemberIds = request.crewMemberIds.toMutableSet()
        order.departureSiteId = request.departureSiteId
        order.arrivalSiteId = request.arrivalSiteId
        order.operationIds = request.operationIds.toMutableSet()
        order.estimatedRouteLengthKm = request.estimatedRouteLengthKm
        order.crewWeight = crewWeight
        order.actualStartTime = request.actualStartTime
        order.actualEndTime = request.actualEndTime
        order.actualRouteLengthKm = request.actualRouteLengthKm

        return mapper.toResponse(repository.save(order))
    }

    fun submit(id: Long) {
        val order = getOrder(id)
        order.submit()
        repository.save(order)
    }

    fun reject(id: Long) {
        val order = getOrder(id)
        order.reject()
        repository.save(order)
    }

    fun accept(id: Long) {
        val order = getOrder(id)
        order.accept()
        repository.save(order)
    }

    fun settlePartial(id: Long, request: SettleFlightOrderRequest, pilotEmail: String) {
        val order = getOrder(id)
        settlementService.settlePartial(order, request, pilotEmail)
        repository.save(order)
    }

    fun settleComplete(id: Long, request: SettleFlightOrderRequest, pilotEmail: String) {
        val order = getOrder(id)
        settlementService.settleComplete(order, request, pilotEmail)
        repository.save(order)
    }

    fun settleNotCompleted(id: Long, pilotEmail: String) {
        val order = getOrder(id)
        settlementService.settleNotCompleted(order, pilotEmail)
        repository.save(order)
    }

    private fun getOrder(id: Long): FlightOrder {
        return repository.findById(id)
            .orElseThrow { EntityNotFoundException("FlightOrder", id) }
    }
}
