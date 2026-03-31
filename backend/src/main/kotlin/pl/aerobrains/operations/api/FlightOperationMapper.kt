package pl.aerobrains.operations.api

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import pl.aerobrains.operations.domain.FlightOperation
import pl.aerobrains.operations.domain.OperationActivity
import pl.aerobrains.operations.domain.OperationChangeLog
import pl.aerobrains.operations.domain.OperationComment

@Mapper(componentModel = "spring")
interface FlightOperationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "routeLengthKm", ignore = true)
    @Mapping(target = "plannedDateFrom", ignore = true)
    @Mapping(target = "plannedDateTo", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdByEmail", ignore = true)
    @Mapping(target = "postCompletionNotes", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "changeLog", ignore = true)
    @Mapping(target = "activities", ignore = true)
    @Mapping(target = "geojsonContent", ignore = true)
    fun toEntity(request: CreateFlightOperationRequest): FlightOperation

    @Mapping(target = "activities", source = "activities")
    fun toResponse(operation: FlightOperation): FlightOperationResponse

    @Mapping(target = "activities", source = "activities")
    fun toListItem(operation: FlightOperation): FlightOperationListItem

    fun toListItems(operations: List<FlightOperation>): List<FlightOperationListItem>

    fun toActivityEntry(activity: OperationActivity): ActivityTypeEntry
    fun toCommentResponse(comment: OperationComment): CommentResponse
    fun toChangeLogResponse(changeLog: OperationChangeLog): ChangeLogResponse
}
