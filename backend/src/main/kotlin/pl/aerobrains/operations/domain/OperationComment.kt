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
import java.time.Instant

@Entity
@Table(name = "operation_comments")
class OperationComment(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "operation_comments_gen")
    @SequenceGenerator(name = "operation_comments_gen", sequenceName = "OPERATION_COMMENTS_SEQ", allocationSize = 1)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_operation_id", nullable = false)
    val flightOperation: FlightOperation? = null,

    @Column(nullable = false, length = 500)
    val content: String,

    @Column(name = "author_email", nullable = false, length = 100)
    val authorEmail: String,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now()
)
