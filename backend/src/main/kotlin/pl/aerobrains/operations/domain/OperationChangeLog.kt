package pl.aerobrains.operations.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "operation_change_log")
class OperationChangeLog(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "operation_change_log_gen")
    @SequenceGenerator(name = "operation_change_log_gen", sequenceName = "OPERATION_CHANGE_LOG_SEQ", allocationSize = 1)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_operation_id", nullable = false)
    val flightOperation: FlightOperation? = null,

    @Column(name = "field_name", nullable = false, length = 100)
    val fieldName: String,

    @Column(name = "old_value", length = 500)
    val oldValue: String? = null,

    @Column(name = "new_value", length = 500)
    val newValue: String? = null,

    @Column(name = "changed_by_email", nullable = false, length = 100)
    val changedByEmail: String,

    @Column(name = "changed_at", nullable = false)
    val changedAt: LocalDateTime = LocalDateTime.now()
)
