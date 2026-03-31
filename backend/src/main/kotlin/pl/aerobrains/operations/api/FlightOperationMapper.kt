package pl.aerobrains.operations.api

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import pl.aerobrains.operations.domain.FlightOperation
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
    fun toEntity(request: CreateFlightOperationRequest): FlightOperation

    fun toResponse(operation: FlightOperation): FlightOperationResponse
    fun toListItem(operation: FlightOperation): FlightOperationListItem
    fun toListItems(operations: List<FlightOperation>): List<FlightOperationListItem>

    fun toCommentResponse(comment: OperationComment): CommentResponse
    fun toChangeLogResponse(changeLog: OperationChangeLog): ChangeLogResponse
}
