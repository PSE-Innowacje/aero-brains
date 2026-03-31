package pl.aerobrains.fleet.api

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import pl.aerobrains.fleet.domain.CrewMember

@Mapper(componentModel = "spring")
interface CrewMemberMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    fun toEntity(request: CreateCrewMemberRequest): CrewMember

    fun toResponse(crewMember: CrewMember): CrewMemberResponse
    fun toResponseList(crewMembers: List<CrewMember>): List<CrewMemberResponse>
}