package pl.aerobrains.operations.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table

@Entity
@Table(name = "flight_operation_activity_types")
class OperationActivity(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "operation_activity_gen")
    @SequenceGenerator(name = "operation_activity_gen", sequenceName = "OPERATION_ACTIVITIES_SEQ", allocationSize = 1)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_operation_id", nullable = false)
    val flightOperation: FlightOperation? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false, length = 50)
    val activityType: ActivityType,

    @Column(name = "description", length = 200)
    val description: String? = null
)
