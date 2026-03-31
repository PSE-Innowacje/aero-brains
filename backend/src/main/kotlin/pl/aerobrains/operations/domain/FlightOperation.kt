package pl.aerobrains.operations.domain

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToMany
import jakarta.persistence.OrderBy
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import pl.aerobrains.shared.exception.BusinessRuleViolationException
import pl.aerobrains.shared.persistence.BaseEntity
import java.time.LocalDate

@Entity
@Table(name = "flight_operations")
@SequenceGenerator(name = "default_seq", sequenceName = "FLIGHT_OPERATIONS_SEQ", allocationSize = 1)
class FlightOperation(
    @Column(name = "order_project_number", nullable = false, length = 30)
    var orderProjectNumber: String,

    @Column(name = "short_description", nullable = false, length = 100)
    var shortDescription: String,

    @Column(name = "kml_file_name", length = 255)
    var kmlFileName: String? = null,

    @Column(name = "kml_content", columnDefinition = "CLOB")
    var kmlContent: String? = null,

    @Column(name = "geojson_content", columnDefinition = "CLOB")
    var geojsonContent: String? = null,

    @Column(name = "proposed_date_from")
    var proposedDateFrom: LocalDate? = null,

    @Column(name = "proposed_date_to")
    var proposedDateTo: LocalDate? = null,

    @OneToMany(mappedBy = "flightOperation", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    val activities: MutableList<OperationActivity> = mutableListOf(),

    @Column(name = "additional_info", length = 500)
    var additionalInfo: String? = null,

    @Column(name = "route_length_km", nullable = false)
    var routeLengthKm: Int = 0,

    @Column(name = "planned_date_from")
    var plannedDateFrom: LocalDate? = null,

    @Column(name = "planned_date_to")
    var plannedDateTo: LocalDate? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    var status: OperationStatus = OperationStatus.INTRODUCED,

    @Column(name = "created_by_email", nullable = false, length = 100)
    var createdByEmail: String,

    @Column(name = "contact_emails", length = 1000)
    var contactEmails: String? = null,

    @Column(name = "post_completion_notes", length = 500)
    var postCompletionNotes: String? = null,

    @OneToMany(mappedBy = "flightOperation", cascade = [CascadeType.ALL], orphanRemoval = true)
    @OrderBy("createdAt DESC")
    val comments: MutableList<OperationComment> = mutableListOf(),

    @OneToMany(mappedBy = "flightOperation", cascade = [CascadeType.ALL], orphanRemoval = true)
    @OrderBy("changedAt DESC")
    val changeLog: MutableList<OperationChangeLog> = mutableListOf()
) : BaseEntity() {

    fun reject(changedByEmail: String) {
        requireTransition(OperationStatus.REJECTED)
        logChange("status", status.name, OperationStatus.REJECTED.name, changedByEmail)
        status = OperationStatus.REJECTED
    }

    fun confirmToPlan(plannedFrom: LocalDate, plannedTo: LocalDate, changedByEmail: String) {
        requireTransition(OperationStatus.CONFIRMED)
        logChange("status", status.name, OperationStatus.CONFIRMED.name, changedByEmail)
        logChange("plannedDateFrom", plannedDateFrom?.toString(), plannedFrom.toString(), changedByEmail)
        logChange("plannedDateTo", plannedDateTo?.toString(), plannedTo.toString(), changedByEmail)
        status = OperationStatus.CONFIRMED
        plannedDateFrom = plannedFrom
        plannedDateTo = plannedTo
    }

    fun cancel(changedByEmail: String) {
        if (status != OperationStatus.INTRODUCED &&
            status != OperationStatus.CONFIRMED &&
            status != OperationStatus.SCHEDULED
        ) {
            throw BusinessRuleViolationException(
                "Cannot cancel operation in status ${status.label}"
            )
        }
        logChange("status", status.name, OperationStatus.CANCELLED.name, changedByEmail)
        status = OperationStatus.CANCELLED
    }

    fun markScheduled(changedByEmail: String) {
        requireTransition(OperationStatus.SCHEDULED)
        logChange("status", status.name, OperationStatus.SCHEDULED.name, changedByEmail)
        status = OperationStatus.SCHEDULED
    }

    fun markPartiallyCompleted(changedByEmail: String) {
        requireTransition(OperationStatus.PARTIALLY_COMPLETED)
        logChange("status", status.name, OperationStatus.PARTIALLY_COMPLETED.name, changedByEmail)
        status = OperationStatus.PARTIALLY_COMPLETED
    }

    fun markCompleted(changedByEmail: String) {
        requireTransition(OperationStatus.COMPLETED)
        logChange("status", status.name, OperationStatus.COMPLETED.name, changedByEmail)
        status = OperationStatus.COMPLETED
    }

    fun unlinkFromOrder(changedByEmail: String) {
        requireTransition(OperationStatus.CONFIRMED)
        logChange("status", status.name, OperationStatus.CONFIRMED.name, changedByEmail)
        status = OperationStatus.CONFIRMED
    }

    fun addComment(content: String, authorEmail: String) {
        comments.add(OperationComment(content = content, authorEmail = authorEmail, flightOperation = this))
    }

    private fun requireTransition(target: OperationStatus) {
        if (!OperationStatus.canTransition(status, target)) {
            throw BusinessRuleViolationException(
                "Cannot transition from ${status.label} to ${target.label}"
            )
        }
    }

    private fun logChange(field: String, oldVal: String?, newVal: String?, changedBy: String) {
        changeLog.add(
            OperationChangeLog(
                flightOperation = this,
                fieldName = field,
                oldValue = oldVal,
                newValue = newVal,
                changedByEmail = changedBy
            )
        )
    }
}
