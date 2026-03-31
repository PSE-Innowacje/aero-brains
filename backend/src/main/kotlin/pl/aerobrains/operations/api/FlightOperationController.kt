package pl.aerobrains.operations.api

import jakarta.validation.Valid
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pl.aerobrains.operations.application.FlightOperationService
import pl.aerobrains.operations.domain.OperationStatus
import pl.aerobrains.shared.security.UserRole

@RestController
@RequestMapping("/api/flight-operations")
class FlightOperationController(
    private val service: FlightOperationService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('PLANNER', 'SUPERVISOR', 'ADMINISTRATOR', 'PILOT')")
    fun findAll(@RequestParam(required = false) statuses: List<OperationStatus>?): ResponseEntity<List<FlightOperationListItem>> {
        return ResponseEntity.ok(service.findAll(statuses))
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PLANNER', 'SUPERVISOR', 'ADMINISTRATOR', 'PILOT')")
    fun findById(@PathVariable id: Long): ResponseEntity<FlightOperationResponse> {
        return ResponseEntity.ok(service.findById(id))
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PLANNER', 'SUPERVISOR')")
    fun create(
        @Valid @RequestBody request: CreateFlightOperationRequest,
        authentication: Authentication
    ): ResponseEntity<FlightOperationResponse> {
        val email = authentication.name
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, email))
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PLANNER', 'SUPERVISOR')")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateFlightOperationRequest,
        authentication: Authentication
    ): ResponseEntity<FlightOperationResponse> {
        val email = authentication.name
        val role = extractRole(authentication)
        return ResponseEntity.ok(service.update(id, request, email, role))
    }

    @GetMapping("/{id}/kml")
    @PreAuthorize("hasAnyRole('PLANNER', 'SUPERVISOR', 'ADMINISTRATOR', 'PILOT')")
    fun getKml(@PathVariable id: Long): ResponseEntity<ByteArray> {
        val operation = service.getOperation(id)
        val kmlContent = operation.kmlContent
            ?: return ResponseEntity.noContent().build()

        val fileName = operation.kmlFileName ?: "operation-${operation.id}.kml"
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"$fileName\"")
            .contentType(MediaType.APPLICATION_XML)
            .body(kmlContent.toByteArray(Charsets.UTF_8))
    }

    @GetMapping("/{id}/geojson")
    @PreAuthorize("hasAnyRole('PLANNER', 'SUPERVISOR', 'ADMINISTRATOR', 'PILOT')")
    fun getGeoJson(@PathVariable id: Long): ResponseEntity<String> {
        val operation = service.getOperation(id)
        val geojson = operation.geojsonContent
            ?: return ResponseEntity.noContent().build()

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(geojson)
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('SUPERVISOR')")
    fun reject(@PathVariable id: Long, authentication: Authentication): ResponseEntity<Void> {
        service.reject(id, authentication.name)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('SUPERVISOR')")
    fun confirm(
        @PathVariable id: Long,
        @Valid @RequestBody request: ChangeStatusRequest,
        authentication: Authentication
    ): ResponseEntity<Void> {
        service.confirmToPlan(id, request, authentication.name)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('PLANNER', 'SUPERVISOR')")
    fun cancel(@PathVariable id: Long, authentication: Authentication): ResponseEntity<Void> {
        service.cancel(id, authentication.name)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('PLANNER', 'SUPERVISOR')")
    fun addComment(
        @PathVariable id: Long,
        @Valid @RequestBody request: AddCommentRequest,
        authentication: Authentication
    ): ResponseEntity<FlightOperationResponse> {
        return ResponseEntity.ok(service.addComment(id, request, authentication.name))
    }

    private fun extractRole(authentication: Authentication): UserRole {
        val authority = authentication.authorities.first().authority
        return UserRole.valueOf(authority.removePrefix("ROLE_"))
    }
}
