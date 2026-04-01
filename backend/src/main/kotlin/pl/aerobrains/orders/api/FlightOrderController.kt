package pl.aerobrains.orders.api

import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.aerobrains.orders.application.FlightOrderService

@RestController
@RequestMapping("/api/flight-orders")
class FlightOrderController(
    private val service: FlightOrderService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('PILOT', 'SUPERVISOR', 'ADMINISTRATOR')")
    fun findAll(
        @PageableDefault(size = 20) pageable: Pageable
    ): ResponseEntity<Page<FlightOrderListItem>> {
        return ResponseEntity.ok(service.findAll(pageable))
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PILOT', 'SUPERVISOR', 'ADMINISTRATOR')")
    fun findById(@PathVariable id: Long): ResponseEntity<FlightOrderResponse> {
        return ResponseEntity.ok(service.findById(id))
    }

    @PostMapping
    @PreAuthorize("hasRole('PILOT')")
    fun create(
        @Valid @RequestBody request: CreateFlightOrderRequest,
        authentication: Authentication
    ): ResponseEntity<FlightOrderResponse> {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, authentication.name))
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PILOT')")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateFlightOrderRequest,
        authentication: Authentication
    ): ResponseEntity<FlightOrderResponse> {
        return ResponseEntity.ok(service.update(id, request, authentication.name))
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('PILOT')")
    fun submit(@PathVariable id: Long): ResponseEntity<Void> {
        service.submit(id)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('SUPERVISOR')")
    fun reject(@PathVariable id: Long): ResponseEntity<Void> {
        service.reject(id)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('SUPERVISOR')")
    fun accept(@PathVariable id: Long): ResponseEntity<Void> {
        service.accept(id)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/settle-partial")
    @PreAuthorize("hasRole('PILOT')")
    fun settlePartial(@PathVariable id: Long, authentication: Authentication): ResponseEntity<Void> {
        service.settlePartial(id, authentication.name)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/settle-complete")
    @PreAuthorize("hasRole('PILOT')")
    fun settleComplete(@PathVariable id: Long, authentication: Authentication): ResponseEntity<Void> {
        service.settleComplete(id, authentication.name)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/settle-not-completed")
    @PreAuthorize("hasRole('PILOT')")
    fun settleNotCompleted(@PathVariable id: Long, authentication: Authentication): ResponseEntity<Void> {
        service.settleNotCompleted(id, authentication.name)
        return ResponseEntity.noContent().build()
    }
}
