package pl.aerobrains.fleet.infrastructure

import org.springframework.data.jpa.repository.JpaRepository
import pl.aerobrains.fleet.domain.LandingSite

interface LandingSiteRepository : JpaRepository<LandingSite, Long> {
    fun existsByName(name: String): Boolean
    fun findAllByOrderByNameAsc(): List<LandingSite>
}