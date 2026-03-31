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
import pl.aerobrains.fleet.application.CrewMemberService

@RestController
@RequestMapping("/api/crew-members")
class CrewMemberController(
    private val crewMemberService: CrewMemberService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SUPERVISOR', 'PILOT')")
    fun findAll(): ResponseEntity<List<CrewMemberResponse>> {
        return ResponseEntity.ok(crewMemberService.findAll())
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SUPERVISOR', 'PILOT')")
    fun findById(@PathVariable id: Long): ResponseEntity<CrewMemberResponse> {
        return ResponseEntity.ok(crewMemberService.findById(id))
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    fun create(@Valid @RequestBody request: CreateCrewMemberRequest): ResponseEntity<CrewMemberResponse> {
        return ResponseEntity.status(HttpStatus.CREATED).body(crewMemberService.create(request))
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: UpdateCrewMemberRequest): ResponseEntity<CrewMemberResponse> {
        return ResponseEntity.ok(crewMemberService.update(id, request))
    }
}