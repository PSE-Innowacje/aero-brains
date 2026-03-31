package pl.aerobrains.orders.api

import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import pl.aerobrains.orders.domain.OrderStatus
import java.time.LocalDateTime

data class CreateFlightOrderRequest(
    @field:NotNull
    val plannedStartTime: LocalDateTime,

    @field:NotNull
    val plannedEndTime: LocalDateTime,

    @field:NotNull
    val helicopterId: Long,

    val crewMemberIds: Set<Long> = emptySet(),

    @field:NotNull
    val departureSiteId: Long,

    @field:NotNull
    val arrivalSiteId: Long,

    @field:NotEmpty
    val operationIds: Set<Long>,

    @field:NotNull
    val estimatedRouteLengthKm: Int
)

data class UpdateFlightOrderRequest(
    @field:NotNull
    val plannedStartTime: LocalDateTime,

    @field:NotNull
    val plannedEndTime: LocalDateTime,

    @field:NotNull
    val helicopterId: Long,

    val crewMemberIds: Set<Long> = emptySet(),

    @field:NotNull
    val departureSiteId: Long,

    @field:NotNull
    val arrivalSiteId: Long,

    @field:NotEmpty
    val operationIds: Set<Long>,

    @field:NotNull
    val estimatedRouteLengthKm: Int,

    val actualStartTime: LocalDateTime? = null,
    val actualEndTime: LocalDateTime? = null
)

data class FlightOrderResponse(
    val id: Long,
    val plannedStartTime: LocalDateTime,
    val plannedEndTime: LocalDateTime,
    val pilotId: Long,
    val status: OrderStatus,
    val helicopterId: Long,
    val crewMemberIds: Set<Long>,
    val crewWeight: Int,
    val departureSiteId: Long,
    val arrivalSiteId: Long,
    val operationIds: Set<Long>,
    val estimatedRouteLengthKm: Int,
    val actualStartTime: LocalDateTime?,
    val actualEndTime: LocalDateTime?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class FlightOrderListItem(
    val id: Long,
    val plannedStartTime: LocalDateTime,
    val helicopterId: Long,
    val pilotId: Long,
    val status: OrderStatus
)
