package pl.aerobrains.fleet.api

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import pl.aerobrains.fleet.domain.CrewMemberRole
import java.time.LocalDate

data class CreateCrewMemberRequest(
    @field:NotBlank
    @field:Size(max = 100)
    val firstName: String,

    @field:NotBlank
    @field:Size(max = 100)
    val lastName: String,

    @field:NotBlank
    @field:Email
    @field:Size(max = 100)
    val email: String,

    @field:NotNull
    @field:Min(30) @field:Max(200)
    val weight: Int,

    @field:NotNull
    val role: CrewMemberRole,

    @field:Size(max = 30)
    val pilotLicenseNumber: String? = null,

    val licenseExpiryDate: LocalDate? = null,

    @field:NotNull
    val trainingExpiryDate: LocalDate
)

data class UpdateCrewMemberRequest(
    @field:NotBlank
    @field:Size(max = 100)
    val firstName: String,

    @field:NotBlank
    @field:Size(max = 100)
    val lastName: String,

    @field:NotBlank
    @field:Email
    @field:Size(max = 100)
    val email: String,

    @field:NotNull
    @field:Min(30) @field:Max(200)
    val weight: Int,

    @field:NotNull
    val role: CrewMemberRole,

    @field:Size(max = 30)
    val pilotLicenseNumber: String? = null,

    val licenseExpiryDate: LocalDate? = null,

    @field:NotNull
    val trainingExpiryDate: LocalDate
)

data class CrewMemberResponse(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val weight: Int,
    val role: CrewMemberRole,
    val pilotLicenseNumber: String?,
    val licenseExpiryDate: LocalDate?,
    val trainingExpiryDate: LocalDate
)