package pl.aerobrains.fleet.domain

import jakarta.persistence.Column
import jakarta.persistence.Embedded
import jakarta.persistence.Entity
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import pl.aerobrains.shared.persistence.BaseEntity

@Entity
@Table(name = "landing_sites")
@SequenceGenerator(name = "default_seq", sequenceName = "LANDING_SITES_SEQ", allocationSize = 1)
class LandingSite(
    @Column(nullable = false, unique = true, length = 200)
    var name: String,

    @Embedded
    var coordinates: Coordinates
) : BaseEntity()