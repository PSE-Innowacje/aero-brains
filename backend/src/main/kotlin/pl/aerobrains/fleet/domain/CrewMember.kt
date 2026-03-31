package pl.aerobrains.fleet.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import pl.aerobrains.shared.persistence.BaseEntity
import java.time.LocalDate

@Entity
@Table(name = "crew_members")
class CrewMember(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "crew_member_seq")
    @SequenceGenerator(name = "crew_member_seq", sequenceName = "CREW_MEMBERS_SEQ", allocationSize = 1)
    val id: Long = 0,

    @Column(name = "first_name", nullable = false, length = 100)
    var firstName: String,

    @Column(name = "last_name", nullable = false, length = 100)
    var lastName: String,

    @Column(nullable = false, unique = true, length = 100)
    var email: String,

    @Column(nullable = false)
    var weight: Int,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var role: CrewMemberRole,

    @Column(name = "pilot_license_number", length = 30)
    var pilotLicenseNumber: String? = null,

    @Column(name = "license_expiry_date")
    var licenseExpiryDate: LocalDate? = null,

    @Column(name = "training_expiry_date", nullable = false)
    var trainingExpiryDate: LocalDate
) : BaseEntity()