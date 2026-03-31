package pl.aerobrains.fleet.infrastructure

import org.springframework.data.jpa.repository.JpaRepository
import pl.aerobrains.fleet.domain.Helicopter
import pl.aerobrains.fleet.domain.HelicopterStatus

interface HelicopterRepository : JpaRepository<Helicopter, Long> {
    fun existsByRegistrationNumber(registrationNumber: String): Boolean
    fun findAllByOrderByStatusAscRegistrationNumberAsc(): List<Helicopter>
    fun findAllByStatus(status: HelicopterStatus): List<Helicopter>
}