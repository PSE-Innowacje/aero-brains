package pl.aerobrains.operations.api

import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import pl.aerobrains.operations.domain.ActivityType
import pl.aerobrains.operations.domain.OperationStatus
import java.time.LocalDateTime
import java.time.LocalDate

data class CoordinateDto(
    val latitude: Double,
    val longitude: Double
)

data class ActivityTypeEntry(
    @field:NotNull
    val activityType: ActivityType,

    @field:Size(max = 200)
    val description: String? = null
)

data class CreateFlightOperationRequest(
    @field:NotBlank
    @field:Size(max = 30)
    val orderProjectNumber: String,

    @field:NotBlank
    @field:Size(max = 100)
    val shortDescription: String,

    val coordinates: List<CoordinateDto>? = null,

    val proposedDateFrom: LocalDate? = null,
    val proposedDateTo: LocalDate? = null,

    @field:NotEmpty
    @field:Valid
    val activities: List<ActivityTypeEntry>,

    @field:Size(max = 500)
    val additionalInfo: String? = null,

    @field:Size(max = 1000)
    val contactEmails: String? = null
)

data class UpdateFlightOperationRequest(
    @field:NotBlank
    @field:Size(max = 30)
    val orderProjectNumber: String,

    @field:NotBlank
    @field:Size(max = 100)
    val shortDescription: String,

    val coordinates: List<CoordinateDto>? = null,

    val proposedDateFrom: LocalDate? = null,
    val proposedDateTo: LocalDate? = null,

    @field:NotEmpty
    @field:Valid
    val activities: List<ActivityTypeEntry>,

    @field:Size(max = 500)
    val additionalInfo: String? = null,

    @field:Size(max = 1000)
    val contactEmails: String? = null,

    val plannedDateFrom: LocalDate? = null,
    val plannedDateTo: LocalDate? = null,

    @field:Size(max = 500)
    val postCompletionNotes: String? = null
)

data class ChangeStatusRequest(
    val plannedDateFrom: LocalDate? = null,
    val plannedDateTo: LocalDate? = null
)

data class AddCommentRequest(
    @field:NotBlank
    @field:Size(max = 500)
    val content: String
)

data class FlightOperationResponse(
    val id: Long,
    val orderProjectNumber: String,
    val shortDescription: String,
    val kmlFileName: String?,
    val geojsonContent: String?,
    val proposedDateFrom: LocalDate?,
    val proposedDateTo: LocalDate?,
    val activities: List<ActivityTypeEntry>,
    val additionalInfo: String?,
    val routeLengthKm: Int,
    val plannedDateFrom: LocalDate?,
    val plannedDateTo: LocalDate?,
    val status: OperationStatus,
    val createdByEmail: String,
    val contactEmails: String?,
    val postCompletionNotes: String?,
    val comments: List<CommentResponse>,
    val changeLog: List<ChangeLogResponse>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class FlightOperationListItem(
    val id: Long,
    val orderProjectNumber: String,
    val activities: List<ActivityTypeEntry>,
    val proposedDateFrom: LocalDate?,
    val proposedDateTo: LocalDate?,
    val plannedDateFrom: LocalDate?,
    val plannedDateTo: LocalDate?,
    val status: OperationStatus
)

data class CommentResponse(
    val id: Long,
    val content: String,
    val authorEmail: String,
    val createdAt: LocalDateTime
)

data class ChangeLogResponse(
    val id: Long,
    val fieldName: String,
    val oldValue: String?,
    val newValue: String?,
    val changedByEmail: String,
    val changedAt: LocalDateTime
)
