package pl.aerobrains.shared.security.user

import org.mapstruct.Mapper
import org.mapstruct.Mapping

@Mapper(componentModel = "spring")
interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    fun toEntity(request: CreateUserRequest): User

    fun toResponse(user: User): UserResponse
    fun toResponseList(users: List<User>): List<UserResponse>
}