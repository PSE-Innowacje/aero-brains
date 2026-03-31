package pl.aerobrains.operations.application

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.aerobrains.operations.api.AddCommentRequest
import pl.aerobrains.operations.api.ChangeStatusRequest
import pl.aerobrains.operations.api.CreateFlightOperationRequest
import pl.aerobrains.operations.api.FlightOperationListItem
import pl.aerobrains.operations.api.FlightOperationMapper
import pl.aerobrains.operations.api.FlightOperationResponse
import pl.aerobrains.operations.api.UpdateFlightOperationRequest
import pl.aerobrains.operations.domain.FlightOperation
import pl.aerobrains.operations.domain.OperationStatus
import pl.aerobrains.operations.infrastructure.FlightOperationRepository
import pl.aerobrains.operations.infrastructure.FlightOperationSpecifications
import pl.aerobrains.operations.infrastructure.KmlParser
import pl.aerobrains.shared.exception.BusinessRuleViolationException
import pl.aerobrains.shared.exception.EntityNotFoundException
import pl.aerobrains.shared.security.UserRole

@Service
@Transactional
class FlightOperationService(
    private val repository: FlightOperationRepository,
    private val mapper: FlightOperationMapper,
    private val kmlParser: KmlParser,
    private val routeCalculationService: RouteCalculationService
) {

    @Transactional(readOnly = true)
    fun findAll(statuses: Collection<OperationStatus>?): List<FlightOperationListItem> {
        val spec = if (statuses != null) {
            FlightOperationSpecifications.hasStatuses(statuses)
        } else {
            null
        }
        val operations = if (spec != null) {
            repository.findAll(spec)
        } else {
            repository.findAll()
        }
        return mapper.toListItems(operations)
    }

    @Transactional(readOnly = true)
    fun findById(id: Long): FlightOperationResponse {
        return mapper.toResponse(getOperation(id))
    }

    @Transactional(readOnly = true)
    fun findConfirmedOperations(): List<FlightOperationListItem> {
        return mapper.toListItems(repository.findAllByStatus(OperationStatus.CONFIRMED))
    }

    fun create(request: CreateFlightOperationRequest, currentUserEmail: String): FlightOperationResponse {
        val operation = mapper.toEntity(request)
        operation.createdByEmail = currentUserEmail
        operation.status = OperationStatus.INTRODUCED

        if (request.kmlContent != null) {
            val points = kmlParser.parsePoints(request.kmlContent)
            operation.routeLengthKm = routeCalculationService.calculateRouteLength(points)
        }

        return mapper.toResponse(repository.save(operation))
    }

    fun update(id: Long, request: UpdateFlightOperationRequest, currentUserEmail: String, currentUserRole: UserRole): FlightOperationResponse {
        val operation = getOperation(id)
        validateEditPermission(operation, currentUserRole)

        operation.orderProjectNumber = request.orderProjectNumber
        operation.shortDescription = request.shortDescription
        operation.activityTypes = request.activityTypes.toMutableSet()
        operation.additionalInfo = request.additionalInfo
        operation.contactEmails = request.contactEmails
        operation.proposedDateFrom = request.proposedDateFrom
        operation.proposedDateTo = request.proposedDateTo

        if (request.kmlContent != null) {
            operation.kmlFileName = request.kmlFileName
            operation.kmlContent = request.kmlContent
            val points = kmlParser.parsePoints(request.kmlContent)
            operation.routeLengthKm = routeCalculationService.calculateRouteLength(points)
        }

        if (currentUserRole == UserRole.SUPERVISOR) {
            operation.plannedDateFrom = request.plannedDateFrom
            operation.plannedDateTo = request.plannedDateTo
            operation.postCompletionNotes = request.postCompletionNotes
        }

        return mapper.toResponse(repository.save(operation))
    }

    fun reject(id: Long, currentUserEmail: String) {
        val operation = getOperation(id)
        operation.reject(currentUserEmail)
        repository.save(operation)
    }

    fun confirmToPlan(id: Long, request: ChangeStatusRequest, currentUserEmail: String) {
        val operation = getOperation(id)
        val from = request.plannedDateFrom
            ?: throw BusinessRuleViolationException("Planned date from is required")
        val to = request.plannedDateTo
            ?: throw BusinessRuleViolationException("Planned date to is required")
        operation.confirmToPlan(from, to, currentUserEmail)
        repository.save(operation)
    }

    fun cancel(id: Long, currentUserEmail: String) {
        val operation = getOperation(id)
        operation.cancel(currentUserEmail)
        repository.save(operation)
    }

    fun markScheduled(id: Long, changedByEmail: String) {
        val operation = getOperation(id)
        operation.markScheduled(changedByEmail)
        repository.save(operation)
    }

    fun markPartiallyCompleted(id: Long, changedByEmail: String) {
        val operation = getOperation(id)
        operation.markPartiallyCompleted(changedByEmail)
        repository.save(operation)
    }

    fun markCompleted(id: Long, changedByEmail: String) {
        val operation = getOperation(id)
        operation.markCompleted(changedByEmail)
        repository.save(operation)
    }

    fun unlinkFromOrder(id: Long, changedByEmail: String) {
        val operation = getOperation(id)
        operation.unlinkFromOrder(changedByEmail)
        repository.save(operation)
    }

    fun addComment(id: Long, request: AddCommentRequest, authorEmail: String): FlightOperationResponse {
        val operation = getOperation(id)
        operation.addComment(request.content, authorEmail)
        return mapper.toResponse(repository.save(operation))
    }

    fun getOperation(id: Long): FlightOperation {
        return repository.findById(id)
            .orElseThrow { EntityNotFoundException("FlightOperation", id) }
    }

    private fun validateEditPermission(operation: FlightOperation, role: UserRole) {
        val editableStatuses = when (role) {
            UserRole.PLANNER -> setOf(
                OperationStatus.INTRODUCED,
                OperationStatus.REJECTED,
                OperationStatus.CONFIRMED,
                OperationStatus.SCHEDULED,
                OperationStatus.PARTIALLY_COMPLETED
            )
            UserRole.SUPERVISOR -> OperationStatus.entries.toSet()
            else -> throw BusinessRuleViolationException("Role ${role.name} cannot edit flight operations")
        }

        if (operation.status !in editableStatuses) {
            throw BusinessRuleViolationException(
                "Cannot edit operation in status ${operation.status.label} with role ${role.name}"
            )
        }
    }
}
