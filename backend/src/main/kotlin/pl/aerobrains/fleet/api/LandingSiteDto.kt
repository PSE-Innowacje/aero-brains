package pl.aerobrains.fleet.api

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class CreateLandingSiteRequest(
    @field:NotBlank
    @field:Size(max = 200)
    val name: String,

    @field:NotNull
    val latitude: Double,

    @field:NotNull
    val longitude: Double
)

data class UpdateLandingSiteRequest(
    @field:NotBlank
    @field:Size(max = 200)
    val name: String,

    @field:NotNull
    val latitude: Double,

    @field:NotNull
    val longitude: Double
)

data class LandingSiteResponse(
    val id: Long,
    val name: String,
    val latitude: Double,
    val longitude: Double
)