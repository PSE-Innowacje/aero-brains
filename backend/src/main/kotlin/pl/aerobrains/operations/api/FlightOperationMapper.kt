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
    @Mapping(target = "status", expression = "java(pl.aerobrains.operations.domain.OperationStatus.INTRODUCED)")
    @Mapping(target = "createdByEmail", constant = "")
    @Mapping(target = "postCompletionNotes", ignore = true)
    @Mapping(target = "comments", expression = "java(new java.util.ArrayList<>())")
    @Mapping(target = "changeLog", expression = "java(new java.util.ArrayList<>())")
    @Mapping(target = "activities", expression = "java(new java.util.ArrayList<>())")
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
