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
@Table(name = "helicopters")
class Helicopter(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "helicopter_seq")
    @SequenceGenerator(name = "helicopter_seq", sequenceName = "HELICOPTERS_SEQ", allocationSize = 1)
    val id: Long = 0,

    @Column(name = "registration_number", nullable = false, unique = true, length = 30)
    var registrationNumber: String,

    @Column(name = "helicopter_type", nullable = false, length = 100)
    var helicopterType: String,

    @Column(length = 100)
    var description: String? = null,

    @Column(name = "max_crew_count", nullable = false)
    var maxCrewCount: Int,

    @Column(name = "max_crew_weight", nullable = false)
    var maxCrewWeight: Int,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var status: HelicopterStatus,

    @Column(name = "inspection_expiry_date")
    var inspectionExpiryDate: LocalDate? = null,

    @Column(name = "range_km", nullable = false)
    var rangeKm: Int
) : BaseEntity()