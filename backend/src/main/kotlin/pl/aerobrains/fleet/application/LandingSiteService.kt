package pl.aerobrains.fleet.application

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.aerobrains.fleet.api.CreateLandingSiteRequest
import pl.aerobrains.fleet.api.LandingSiteMapper
import pl.aerobrains.fleet.api.LandingSiteResponse
import pl.aerobrains.fleet.api.UpdateLandingSiteRequest
import pl.aerobrains.fleet.domain.Coordinates
import pl.aerobrains.fleet.domain.LandingSite
import pl.aerobrains.fleet.infrastructure.LandingSiteRepository
import pl.aerobrains.shared.exception.BusinessRuleViolationException
import pl.aerobrains.shared.exception.EntityNotFoundException

@Service
@Transactional
class LandingSiteService(
    private val landingSiteRepository: LandingSiteRepository,
    private val landingSiteMapper: LandingSiteMapper
) {

    @Transactional(readOnly = true)
    fun findAll(): List<LandingSiteResponse> {
        return landingSiteMapper.toResponseList(
            landingSiteRepository.findAllByOrderByNameAsc()
        )
    }

    @Transactional(readOnly = true)
    fun findById(id: Long): LandingSiteResponse {
        return landingSiteMapper.toResponse(getLandingSite(id))
    }

    fun create(request: CreateLandingSiteRequest): LandingSiteResponse {
        validateNameUnique(request.name)
        val landingSite = landingSiteMapper.toEntity(request)
        return landingSiteMapper.toResponse(landingSiteRepository.save(landingSite))
    }

    fun update(id: Long, request: UpdateLandingSiteRequest): LandingSiteResponse {
        val landingSite = getLandingSite(id)

        if (request.name != landingSite.name) {
            validateNameUnique(request.name)
        }

        landingSite.name = request.name
        landingSite.coordinates = Coordinates(
            request.latitude.toBigDecimal(),
            request.longitude.toBigDecimal()
        )

        return landingSiteMapper.toResponse(landingSiteRepository.save(landingSite))
    }

    private fun getLandingSite(id: Long): LandingSite {
        return landingSiteRepository.findById(id)
            .orElseThrow { EntityNotFoundException("LandingSite", id) }
    }

    private fun validateNameUnique(name: String) {
        if (landingSiteRepository.existsByName(name)) {
            throw BusinessRuleViolationException("Landing site with name $name already exists")
        }
    }
}
