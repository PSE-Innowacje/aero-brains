package pl.aerobrains.fleet.infrastructure

import org.springframework.data.jpa.repository.JpaRepository
import pl.aerobrains.fleet.domain.CrewMember
import pl.aerobrains.fleet.domain.CrewMemberRole

interface CrewMemberRepository : JpaRepository<CrewMember, Long> {
    fun existsByEmail(email: String): Boolean
    fun findAllByOrderByEmailAsc(): List<CrewMember>
    fun findAllByRole(role: CrewMemberRole): List<CrewMember>
}