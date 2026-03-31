package pl.aerobrains.fleet.api

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import pl.aerobrains.fleet.domain.Helicopter

@Mapper(componentModel = "spring")
interface HelicopterMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    fun toEntity(request: CreateHelicopterRequest): Helicopter

    fun toResponse(helicopter: Helicopter): HelicopterResponse
    fun toResponseList(helicopters: List<Helicopter>): List<HelicopterResponse>
}