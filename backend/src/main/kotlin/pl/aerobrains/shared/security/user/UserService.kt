package pl.aerobrains.shared.security.user

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.aerobrains.shared.exception.BusinessRuleViolationException
import pl.aerobrains.shared.exception.EntityNotFoundException

@Service
@Transactional
class UserService(
    private val userRepository: UserRepository,
    private val userMapper: UserMapper,
    private val passwordEncoder: PasswordEncoder
) {

    @Transactional(readOnly = true)
    fun findAll(): List<UserResponse> {
        return userMapper.toResponseList(userRepository.findAll())
    }

    @Transactional(readOnly = true)
    fun findById(id: Long): UserResponse {
        val user = getUser(id)
        return userMapper.toResponse(user)
    }

    fun create(request: CreateUserRequest): UserResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw BusinessRuleViolationException("User with email ${request.email} already exists")
        }

        val user = userMapper.toEntity(request)
        user.password = passwordEncoder.encode(request.password)
        val saved = userRepository.save(user)
        return userMapper.toResponse(saved)
    }

    fun update(id: Long, request: UpdateUserRequest): UserResponse {
        val user = getUser(id)

        if (request.email != user.email && userRepository.existsByEmail(request.email)) {
            throw BusinessRuleViolationException("User with email ${request.email} already exists")
        }

        user.firstName = request.firstName
        user.lastName = request.lastName
        user.email = request.email
        user.role = request.role

        if (request.password != null) {
            user.password = passwordEncoder.encode(request.password)
        }

        val saved = userRepository.save(user)
        return userMapper.toResponse(saved)
    }

    private fun getUser(id: Long): User {
        return userRepository.findById(id)
            .orElseThrow { EntityNotFoundException("User", id) }
    }
}