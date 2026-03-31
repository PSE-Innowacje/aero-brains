package pl.aerobrains.fleet.domain

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
data class Coordinates(
    @Column(nullable = false, precision = 10, scale = 7)
    val latitude: Double,

    @Column(nullable = false, precision = 10, scale = 7)
    val longitude: Double
)