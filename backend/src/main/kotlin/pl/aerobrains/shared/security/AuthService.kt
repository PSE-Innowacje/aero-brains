package pl.aerobrains.shared.security

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import pl.aerobrains.shared.security.user.UserRepository

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider
) {

    fun login(request: LoginRequest): LoginResponse {
        val user = userRepository.findByEmail(request.email)
            .orElseThrow { BadCredentialsException() }

        if (!passwordEncoder.matches(request.password, user.password)) {
            throw BadCredentialsException()
        }

        val token = jwtTokenProvider.generateToken(user.email, user.role)
        return LoginResponse(
            token = token,
            email = user.email,
            role = user.role.name
        )
    }
}

class BadCredentialsException : RuntimeException("Invalid email or password")