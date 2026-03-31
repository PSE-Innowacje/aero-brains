package pl.aerobrains.fleet.domain

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import java.math.BigDecimal

@Embeddable
data class Coordinates(
    @Column(nullable = false, precision = 10, scale = 7)
    val latitude: BigDecimal,

    @Column(nullable = false, precision = 10, scale = 7)
    val longitude: BigDecimal
)