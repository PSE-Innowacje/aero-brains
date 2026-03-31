package pl.aerobrains.fleet.application

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.aerobrains.fleet.api.CreateHelicopterRequest
import pl.aerobrains.fleet.api.HelicopterMapper
import pl.aerobrains.fleet.api.HelicopterResponse
import pl.aerobrains.fleet.api.UpdateHelicopterRequest
import pl.aerobrains.fleet.domain.Helicopter
import pl.aerobrains.fleet.domain.HelicopterStatus
import pl.aerobrains.fleet.infrastructure.HelicopterRepository
import pl.aerobrains.shared.exception.BusinessRuleViolationException
import pl.aerobrains.shared.exception.EntityNotFoundException

@Service
@Transactional
class HelicopterService(
    private val helicopterRepository: HelicopterRepository,
    private val helicopterMapper: HelicopterMapper
) {

    @Transactional(readOnly = true)
    fun findAll(): List<HelicopterResponse> {
        return helicopterMapper.toResponseList(
            helicopterRepository.findAllByOrderByStatusAscRegistrationNumberAsc()
        )
    }

    @Transactional(readOnly = true)
    fun findById(id: Long): HelicopterResponse {
        return helicopterMapper.toResponse(getHelicopter(id))
    }

    fun create(request: CreateHelicopterRequest): HelicopterResponse {
        validateRegistrationUnique(request.registrationNumber)
        validateInspectionDate(request.status, request.inspectionExpiryDate)

        val helicopter = helicopterMapper.toEntity(request)
        return helicopterMapper.toResponse(helicopterRepository.save(helicopter))
    }

    fun update(id: Long, request: UpdateHelicopterRequest): HelicopterResponse {
        val helicopter = getHelicopter(id)

        if (request.registrationNumber != helicopter.registrationNumber) {
            validateRegistrationUnique(request.registrationNumber)
        }
        validateInspectionDate(request.status, request.inspectionExpiryDate)

        helicopter.registrationNumber = request.registrationNumber
        helicopter.helicopterType = request.helicopterType
        helicopter.description = request.description
        helicopter.maxCrewCount = request.maxCrewCount
        helicopter.maxCrewWeight = request.maxCrewWeight
        helicopter.status = request.status
        helicopter.inspectionExpiryDate = request.inspectionExpiryDate
        helicopter.rangeKm = request.rangeKm

        return helicopterMapper.toResponse(helicopterRepository.save(helicopter))
    }

    private fun getHelicopter(id: Long): Helicopter {
        return helicopterRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Helicopter", id) }
    }

    private fun validateRegistrationUnique(registrationNumber: String) {
        if (helicopterRepository.existsByRegistrationNumber(registrationNumber)) {
            throw BusinessRuleViolationException("Helicopter with registration number $registrationNumber already exists")
        }
    }

    private fun validateInspectionDate(status: HelicopterStatus, inspectionExpiryDate: java.time.LocalDate?) {
        if (status == HelicopterStatus.ACTIVE && inspectionExpiryDate == null) {
            throw BusinessRuleViolationException("Inspection expiry date is required for active helicopters")
        }
    }
}