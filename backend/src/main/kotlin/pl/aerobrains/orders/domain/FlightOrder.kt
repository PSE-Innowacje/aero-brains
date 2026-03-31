package pl.aerobrains.orders.domain

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import pl.aerobrains.shared.exception.BusinessRuleViolationException
import pl.aerobrains.shared.persistence.BaseEntity
import java.time.LocalDateTime

@Entity
@Table(name = "flight_orders")
@SequenceGenerator(name = "default_seq", sequenceName = "FLIGHT_ORDERS_SEQ", allocationSize = 1)
class FlightOrder(
    @Column(name = "planned_start_time", nullable = false)
    var plannedStartTime: LocalDateTime,

    @Column(name = "planned_end_time", nullable = false)
    var plannedEndTime: LocalDateTime,

    @Column(name = "pilot_id", nullable = false)
    var pilotId: Long,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    var status: OrderStatus = OrderStatus.INTRODUCED,

    @Column(name = "helicopter_id", nullable = false)
    var helicopterId: Long,

    @Column(name = "crew_weight", nullable = false)
    var crewWeight: Int = 0,

    @Column(name = "departure_site_id", nullable = false)
    var departureSiteId: Long,

    @Column(name = "arrival_site_id", nullable = false)
    var arrivalSiteId: Long,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "flight_order_operations", joinColumns = [JoinColumn(name = "flight_order_id")])
    @Column(name = "flight_operation_id")
    var operationIds: MutableSet<Long> = mutableSetOf(),

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "flight_order_crew", joinColumns = [JoinColumn(name = "flight_order_id")])
    @Column(name = "crew_member_id")
    var crewMemberIds: MutableSet<Long> = mutableSetOf(),

    @Column(name = "estimated_route_length_km", nullable = false)
    var estimatedRouteLengthKm: Int = 0,

    @Column(name = "actual_start_time")
    var actualStartTime: LocalDateTime? = null,

    @Column(name = "actual_end_time")
    var actualEndTime: LocalDateTime? = null
) : BaseEntity() {

    fun submit() {
        requireTransition(OrderStatus.SUBMITTED)
        status = OrderStatus.SUBMITTED
    }

    fun reject() {
        requireTransition(OrderStatus.REJECTED)
        status = OrderStatus.REJECTED
    }

    fun accept() {
        requireTransition(OrderStatus.ACCEPTED)
        status = OrderStatus.ACCEPTED
    }

    fun settlePartial() {
        requireTransition(OrderStatus.PARTIALLY_COMPLETED)
        validateActualTimes()
        status = OrderStatus.PARTIALLY_COMPLETED
    }

    fun settleComplete() {
        requireTransition(OrderStatus.COMPLETED)
        validateActualTimes()
        status = OrderStatus.COMPLETED
    }

    fun settleNotCompleted() {
        requireTransition(OrderStatus.NOT_COMPLETED)
        status = OrderStatus.NOT_COMPLETED
    }

    private fun requireTransition(target: OrderStatus) {
        if (!OrderStatus.canTransition(status, target)) {
            throw BusinessRuleViolationException(
                "Cannot transition from ${status.label} to ${target.label}"
            )
        }
    }

    private fun validateActualTimes() {
        if (actualStartTime == null || actualEndTime == null) {
            throw BusinessRuleViolationException(
                "Actual start and end times are required before completing an order"
            )
        }
    }
}
