package pl.aerobrains.shared.security

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @field:NotBlank
    @field:Email
    val email: String,

    @field:NotBlank
    val password: String
)

data class LoginResponse(
    val token: String,
    val email: String,
    val role: String
)