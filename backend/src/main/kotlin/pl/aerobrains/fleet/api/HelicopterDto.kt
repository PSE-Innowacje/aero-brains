package pl.aerobrains.fleet.api

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import pl.aerobrains.fleet.domain.HelicopterStatus
import java.time.LocalDate

data class CreateHelicopterRequest(
    @field:NotBlank
    @field:Size(max = 30)
    val registrationNumber: String,

    @field:NotBlank
    @field:Size(max = 100)
    val helicopterType: String,

    @field:Size(max = 100)
    val description: String? = null,

    @field:NotNull
    @field:Min(1) @field:Max(10)
    val maxCrewCount: Int,

    @field:NotNull
    @field:Min(1) @field:Max(1000)
    val maxCrewWeight: Int,

    @field:NotNull
    val status: HelicopterStatus,

    val inspectionExpiryDate: LocalDate? = null,

    @field:NotNull
    @field:Min(1) @field:Max(1000)
    val rangeKm: Int
)

data class UpdateHelicopterRequest(
    @field:NotBlank
    @field:Size(max = 30)
    val registrationNumber: String,

    @field:NotBlank
    @field:Size(max = 100)
    val helicopterType: String,

    @field:Size(max = 100)
    val description: String? = null,

    @field:NotNull
    @field:Min(1) @field:Max(10)
    val maxCrewCount: Int,

    @field:NotNull
    @field:Min(1) @field:Max(1000)
    val maxCrewWeight: Int,

    @field:NotNull
    val status: HelicopterStatus,

    val inspectionExpiryDate: LocalDate? = null,

    @field:NotNull
    @field:Min(1) @field:Max(1000)
    val rangeKm: Int
)

data class HelicopterResponse(
    val id: Long,
    val registrationNumber: String,
    val helicopterType: String,
    val description: String?,
    val maxCrewCount: Int,
    val maxCrewWeight: Int,
    val status: HelicopterStatus,
    val inspectionExpiryDate: LocalDate?,
    val rangeKm: Int
)