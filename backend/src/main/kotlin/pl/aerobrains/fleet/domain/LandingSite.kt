package pl.aerobrains.fleet.domain

import jakarta.persistence.Column
import jakarta.persistence.Embedded
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import pl.aerobrains.shared.persistence.BaseEntity

@Entity
@Table(name = "landing_sites")
class LandingSite(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "landing_site_seq")
    @SequenceGenerator(name = "landing_site_seq", sequenceName = "LANDING_SITES_SEQ", allocationSize = 1)
    val id: Long = 0,

    @Column(nullable = false, unique = true, length = 200)
    var name: String,

    @Embedded
    var coordinates: Coordinates
) : BaseEntity()