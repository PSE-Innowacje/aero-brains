package pl.aerobrains.fleet.api

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import pl.aerobrains.fleet.domain.Coordinates
import pl.aerobrains.fleet.domain.LandingSite

@Mapper(componentModel = "spring")
interface LandingSiteMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "coordinates", source = ".")
    fun toEntity(request: CreateLandingSiteRequest): LandingSite

    @Mapping(target = "latitude", source = "coordinates.latitude")
    @Mapping(target = "longitude", source = "coordinates.longitude")
    fun toResponse(landingSite: LandingSite): LandingSiteResponse

    fun toResponseList(landingSites: List<LandingSite>): List<LandingSiteResponse>

    fun toCoordinates(request: CreateLandingSiteRequest): Coordinates {
        return Coordinates(
            latitude = request.latitude.toBigDecimal(),
            longitude = request.longitude.toBigDecimal()
        )
    }
}