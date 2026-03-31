package pl.aerobrains.shared.security.user

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import pl.aerobrains.shared.security.UserRole

data class CreateUserRequest(
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

    @field:NotBlank
    @field:Size(min = 8, max = 100)
    val password: String,

    @field:NotNull
    val role: UserRole
)

data class UpdateUserRequest(
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

    @field:Size(min = 8, max = 100)
    val password: String? = null,

    @field:NotNull
    val role: UserRole
)

data class UserResponse(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val role: UserRole
)