package pl.aerobrains.orders.application

import org.springframework.stereotype.Component
import pl.aerobrains.fleet.domain.HelicopterStatus
import pl.aerobrains.fleet.infrastructure.CrewMemberRepository
import pl.aerobrains.fleet.infrastructure.HelicopterRepository
import pl.aerobrains.shared.exception.BusinessRuleViolationException
import pl.aerobrains.shared.exception.EntityNotFoundException
import java.time.LocalDate

@Component
class FlightOrderValidator(
    private val helicopterRepository: HelicopterRepository,
    private val crewMemberRepository: CrewMemberRepository
) {

    fun validate(
        helicopterId: Long,
        pilotId: Long,
        crewMemberIds: Set<Long>,
        plannedFlightDate: LocalDate,
        estimatedRouteLengthKm: Int
    ): Int {
        val helicopter = helicopterRepository.findById(helicopterId)
            .orElseThrow { EntityNotFoundException("Helicopter", helicopterId) }

        // 1. Helicopter must be active and have valid inspection
        if (helicopter.status != HelicopterStatus.ACTIVE) {
            throw BusinessRuleViolationException("Helicopter ${helicopter.registrationNumber} is not active")
        }
        if (helicopter.inspectionExpiryDate != null && helicopter.inspectionExpiryDate!!.isBefore(plannedFlightDate)) {
            throw BusinessRuleViolationException(
                "Helicopter ${helicopter.registrationNumber} inspection expires on ${helicopter.inspectionExpiryDate}, before flight date $plannedFlightDate"
            )
        }

        // 2. Pilot must have valid license and training
        val pilot = crewMemberRepository.findById(pilotId)
            .orElseThrow { EntityNotFoundException("CrewMember (pilot)", pilotId) }
        if (pilot.licenseExpiryDate != null && pilot.licenseExpiryDate!!.isBefore(plannedFlightDate)) {
            throw BusinessRuleViolationException(
                "Pilot ${pilot.firstName} ${pilot.lastName} license expires on ${pilot.licenseExpiryDate}, before flight date $plannedFlightDate"
            )
        }
        if (pilot.trainingExpiryDate.isBefore(plannedFlightDate)) {
            throw BusinessRuleViolationException(
                "Pilot ${pilot.firstName} ${pilot.lastName} training expires on ${pilot.trainingExpiryDate}, before flight date $plannedFlightDate"
            )
        }

        // 3. All crew must have valid training (batch fetch)
        val crewMembers = crewMemberRepository.findAllById(crewMemberIds)
        if (crewMembers.size != crewMemberIds.size) {
            val foundIds = crewMembers.map { it.id }.toSet()
            val missingIds = crewMemberIds - foundIds
            throw EntityNotFoundException("CrewMember", missingIds.first())
        }

        var totalWeight = pilot.weight
        for (member in crewMembers) {
            if (member.trainingExpiryDate.isBefore(plannedFlightDate)) {
                throw BusinessRuleViolationException(
                    "Crew member ${member.firstName} ${member.lastName} training expires on ${member.trainingExpiryDate}, before flight date $plannedFlightDate"
                )
            }
            totalWeight += member.weight
        }

        // 4. Crew count must not exceed helicopter max (pilot + crew)
        val totalCrewCount = 1 + crewMemberIds.size
        if (totalCrewCount > helicopter.maxCrewCount) {
            throw BusinessRuleViolationException(
                "Total crew count ($totalCrewCount) exceeds helicopter max capacity (${helicopter.maxCrewCount})"
            )
        }

        // 5. Crew weight must not exceed helicopter max
        if (totalWeight > helicopter.maxCrewWeight) {
            throw BusinessRuleViolationException(
                "Crew weight ($totalWeight kg) exceeds helicopter max capacity (${helicopter.maxCrewWeight} kg)"
            )
        }

        // 6. Route must not exceed helicopter range
        if (estimatedRouteLengthKm > helicopter.rangeKm) {
            throw BusinessRuleViolationException(
                "Estimated route length ($estimatedRouteLengthKm km) exceeds helicopter range (${helicopter.rangeKm} km)"
            )
        }

        return totalWeight
    }
}
