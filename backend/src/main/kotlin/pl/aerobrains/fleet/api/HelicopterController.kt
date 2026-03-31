package pl.aerobrains.fleet.api

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.aerobrains.fleet.application.HelicopterService

@RestController
@RequestMapping("/api/helicopters")
class HelicopterController(
    private val helicopterService: HelicopterService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SUPERVISOR', 'PILOT')")
    fun findAll(): ResponseEntity<List<HelicopterResponse>> {
        return ResponseEntity.ok(helicopterService.findAll())
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SUPERVISOR', 'PILOT')")
    fun findById(@PathVariable id: Long): ResponseEntity<HelicopterResponse> {
        return ResponseEntity.ok(helicopterService.findById(id))
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    fun create(@Valid @RequestBody request: CreateHelicopterRequest): ResponseEntity<HelicopterResponse> {
        return ResponseEntity.status(HttpStatus.CREATED).body(helicopterService.create(request))
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: UpdateHelicopterRequest): ResponseEntity<HelicopterResponse> {
        return ResponseEntity.ok(helicopterService.update(id, request))
    }
}