package pl.aerobrains.fleet.api

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import pl.aerobrains.fleet.domain.LandingSite

@Mapper(componentModel = "spring")
interface LandingSiteMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "coordinates.latitude", source = "latitude")
    @Mapping(target = "coordinates.longitude", source = "longitude")
    fun toEntity(request: CreateLandingSiteRequest): LandingSite

    @Mapping(target = "latitude", source = "coordinates.latitude")
    @Mapping(target = "longitude", source = "coordinates.longitude")
    fun toResponse(landingSite: LandingSite): LandingSiteResponse

    fun toResponseList(landingSites: List<LandingSite>): List<LandingSiteResponse>
}