package pl.aerobrains.fleet.application

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.aerobrains.fleet.api.CreateCrewMemberRequest
import pl.aerobrains.fleet.api.CrewMemberMapper
import pl.aerobrains.fleet.api.CrewMemberResponse
import pl.aerobrains.fleet.api.UpdateCrewMemberRequest
import pl.aerobrains.fleet.domain.CrewMember
import pl.aerobrains.fleet.domain.CrewMemberRole
import pl.aerobrains.fleet.infrastructure.CrewMemberRepository
import pl.aerobrains.shared.exception.BusinessRuleViolationException
import pl.aerobrains.shared.exception.EntityNotFoundException

@Service
@Transactional
class CrewMemberService(
    private val crewMemberRepository: CrewMemberRepository,
    private val crewMemberMapper: CrewMemberMapper
) {

    @Transactional(readOnly = true)
    fun findAll(): List<CrewMemberResponse> {
        return crewMemberMapper.toResponseList(
            crewMemberRepository.findAllByOrderByEmailAsc()
        )
    }

    @Transactional(readOnly = true)
    fun findById(id: Long): CrewMemberResponse {
        return crewMemberMapper.toResponse(getCrewMember(id))
    }

    fun create(request: CreateCrewMemberRequest): CrewMemberResponse {
        validateEmailUnique(request.email)
        validatePilotFields(request.role, request.pilotLicenseNumber, request.licenseExpiryDate)

        val crewMember = crewMemberMapper.toEntity(request)
        return crewMemberMapper.toResponse(crewMemberRepository.save(crewMember))
    }

    fun update(id: Long, request: UpdateCrewMemberRequest): CrewMemberResponse {
        val crewMember = getCrewMember(id)

        if (request.email != crewMember.email) {
            validateEmailUnique(request.email)
        }
        validatePilotFields(request.role, request.pilotLicenseNumber, request.licenseExpiryDate)

        crewMember.firstName = request.firstName
        crewMember.lastName = request.lastName
        crewMember.email = request.email
        crewMember.weight = request.weight
        crewMember.role = request.role
        crewMember.pilotLicenseNumber = request.pilotLicenseNumber
        crewMember.licenseExpiryDate = request.licenseExpiryDate
        crewMember.trainingExpiryDate = request.trainingExpiryDate

        return crewMemberMapper.toResponse(crewMemberRepository.save(crewMember))
    }

    private fun getCrewMember(id: Long): CrewMember {
        return crewMemberRepository.findById(id)
            .orElseThrow { EntityNotFoundException("CrewMember", id) }
    }

    private fun validateEmailUnique(email: String) {
        if (crewMemberRepository.existsByEmail(email)) {
            throw BusinessRuleViolationException("Crew member with email $email already exists")
        }
    }

    private fun validatePilotFields(role: CrewMemberRole, licenseNumber: String?, licenseExpiry: java.time.LocalDate?) {
        if (role == CrewMemberRole.PILOT) {
            if (licenseNumber.isNullOrBlank()) {
                throw BusinessRuleViolationException("Pilot license number is required for pilots")
            }
            if (licenseExpiry == null) {
                throw BusinessRuleViolationException("License expiry date is required for pilots")
            }
        }
    }
}