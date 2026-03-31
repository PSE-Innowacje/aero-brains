package pl.aerobrains.operations

import pl.aerobrains.BaseIntegrationSpec

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.http.MediaType

/**
 * User Stories a-d:
 * a) Planner creates a flight operation
 * b) Planner reads operations status
 * c) Planner cancels an operation
 * d) Supervisor confirms/rejects operations and sets dates
 */
class FlightOperationSpec extends BaseIntegrationSpec {

    def createOperation(String token, Map overrides = [:]) {
        def request = [
                orderProjectNumber: "DE-26-" + System.nanoTime(),
                shortDescription  : "Test operation",
                activities        : [[activityType: "VISUAL_INSPECTION"]],
                proposedDateFrom  : "2026-06-01",
                proposedDateTo    : "2026-09-30",
        ] + overrides

        def result = mockMvc.perform(
                post("/api/flight-operations").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        ).andReturn()
        return parseResponse(result)
    }

    // ==================== US-A: Planner creates operation ====================

    def "planner should create a flight operation"() {
        given:
        def token = plannerToken()
        def request = [
                orderProjectNumber: "DE-26-10001",
                shortDescription  : "Inspekcja linii 110kV Warszawa-Lodz",
                activities        : [[activityType: "VISUAL_INSPECTION"], [activityType: "PHOTOS"]],
                proposedDateFrom  : "2026-06-01",
                proposedDateTo    : "2026-09-30",
                additionalInfo    : "Priorytet wysoki"
        ]

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isCreated())
              .andExpect(jsonPath('$.orderProjectNumber').value("DE-26-10001"))
              .andExpect(jsonPath('$.status').value("INTRODUCED"))
              .andExpect(jsonPath('$.createdByEmail').value("planner@aero.pl"))
              .andExpect(jsonPath('$.activities').isArray())
    }

    def "supervisor should also create a flight operation"() {
        given:
        def token = supervisorToken()
        def request = [
                orderProjectNumber: "CJI-5001",
                shortDescription  : "Patrol linii 220kV",
                activities        : [[activityType: "PATROL"]],
        ]

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isCreated())
              .andExpect(jsonPath('$.createdByEmail').value("supervisor@aero.pl"))
    }

    def "pilot should not create operations"() {
        given:
        def token = pilotToken()
        def request = [
                orderProjectNumber: "XX-001", shortDescription: "Test",
                activities: [[activityType: "PATROL"]]
        ]

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isForbidden())
    }

    def "admin should not create operations"() {
        given:
        def token = adminToken()
        def request = [
                orderProjectNumber: "XX-002", shortDescription: "Test",
                activities: [[activityType: "PATROL"]]
        ]

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isForbidden())
    }

    def "should reject operation without activities"() {
        given:
        def token = plannerToken()
        def request = [
                orderProjectNumber: "DE-26-NOACT",
                shortDescription  : "Test",
                activities        : []
        ]

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "should reject operation without order project number"() {
        given:
        def token = plannerToken()

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson([shortDescription: "Test", activities: [[activityType: "PATROL"]]]))
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "should require description for activity type OTHER"() {
        given:
        def token = plannerToken()
        def request = [
                orderProjectNumber: "DE-26-OTHER",
                shortDescription  : "Test OTHER",
                activities        : [[activityType: "OTHER"]]
        ]

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "should accept activity type OTHER with description"() {
        given:
        def token = plannerToken()
        def request = [
                orderProjectNumber: "DE-26-OTHER2",
                shortDescription  : "Test OTHER ok",
                activities        : [[activityType: "OTHER", description: "Pomiary termowizyjne"]]
        ]

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isCreated())
    }

    // ==================== US-B: Planner reads operations ====================

    def "planner should list operations"() {
        given:
        def token = plannerToken()
        createOperation(token)

        when:
        def result = mockMvc.perform(
                get("/api/flight-operations").header("Authorization", "Bearer $token")
        )

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath('$').isArray())
    }

    def "planner should read single operation details"() {
        given:
        def token = plannerToken()
        def op = createOperation(token)

        when:
        def result = mockMvc.perform(
                get("/api/flight-operations/${op.id}").header("Authorization", "Bearer $token")
        )

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath('$.id').value(op.id))
              .andExpect(jsonPath('$.status').value("INTRODUCED"))
              .andExpect(jsonPath('$.comments').isArray())
              .andExpect(jsonPath('$.changeLog').isArray())
    }

    def "should return 404 for non-existent operation"() {
        when:
        def result = mockMvc.perform(
                get("/api/flight-operations/999999").header("Authorization", "Bearer ${plannerToken()}")
        )

        then:
        result.andExpect(status().isNotFound())
    }

    // ==================== US-C: Planner cancels operation ====================

    def "planner should cancel operation in status INTRODUCED"() {
        given:
        def token = plannerToken()
        def op = createOperation(token)

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations/${op.id}/cancel").header("Authorization", "Bearer $token")
        )

        then:
        result.andExpect(status().isNoContent())

        and: "status is CANCELLED"
        def updated = mockMvc.perform(
                get("/api/flight-operations/${op.id}").header("Authorization", "Bearer $token")
        ).andReturn()
        parseResponse(updated).status == "CANCELLED"
    }

    def "planner should cancel operation in status CONFIRMED"() {
        given:
        def plannerTk = plannerToken()
        def supervisorTk = supervisorToken()
        def op = createOperation(plannerTk)

        // supervisor confirms it first
        mockMvc.perform(post("/api/flight-operations/${op.id}/confirm")
                .header("Authorization", "Bearer $supervisorTk")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson([plannedDateFrom: "2026-07-01", plannedDateTo: "2026-08-31"])))

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations/${op.id}/cancel").header("Authorization", "Bearer $plannerTk")
        )

        then:
        result.andExpect(status().isNoContent())
    }

    def "planner should not cancel operation in status REJECTED"() {
        given:
        def plannerTk = plannerToken()
        def supervisorTk = supervisorToken()
        def op = createOperation(plannerTk)

        // supervisor rejects it
        mockMvc.perform(post("/api/flight-operations/${op.id}/reject")
                .header("Authorization", "Bearer $supervisorTk"))

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations/${op.id}/cancel").header("Authorization", "Bearer $plannerTk")
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    // ==================== US-D: Supervisor manages operations ====================

    def "supervisor should reject operation"() {
        given:
        def op = createOperation(plannerToken())
        def token = supervisorToken()

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations/${op.id}/reject").header("Authorization", "Bearer $token")
        )

        then:
        result.andExpect(status().isNoContent())

        and:
        def updated = mockMvc.perform(
                get("/api/flight-operations/${op.id}").header("Authorization", "Bearer $token")
        ).andReturn()
        parseResponse(updated).status == "REJECTED"
    }

    def "supervisor should confirm operation with planned dates"() {
        given:
        def op = createOperation(plannerToken())
        def token = supervisorToken()
        def request = [plannedDateFrom: "2026-07-01", plannedDateTo: "2026-08-31"]

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations/${op.id}/confirm").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isNoContent())

        and: "status changed to CONFIRMED and dates set"
        def updated = mockMvc.perform(
                get("/api/flight-operations/${op.id}").header("Authorization", "Bearer $token")
        ).andReturn()
        def body = parseResponse(updated)
        body.status == "CONFIRMED"
        body.plannedDateFrom == "2026-07-01"
        body.plannedDateTo == "2026-08-31"
    }

    def "supervisor should not confirm without planned dates"() {
        given:
        def op = createOperation(plannerToken())
        def token = supervisorToken()

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations/${op.id}/confirm").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson([:])))

        then:
        result.andExpect(status().isBadRequest())
    }

    def "supervisor should not confirm already rejected operation"() {
        given:
        def op = createOperation(plannerToken())
        def token = supervisorToken()
        mockMvc.perform(post("/api/flight-operations/${op.id}/reject").header("Authorization", "Bearer $token"))

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations/${op.id}/confirm").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson([plannedDateFrom: "2026-07-01", plannedDateTo: "2026-08-31"])))

        then:
        result.andExpect(status().isBadRequest())
    }

    def "planner should not reject operations"() {
        given:
        def op = createOperation(plannerToken())

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations/${op.id}/reject").header("Authorization", "Bearer ${plannerToken()}")
        )

        then:
        result.andExpect(status().isForbidden())
    }

    def "planner should not confirm operations"() {
        given:
        def op = createOperation(plannerToken())

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations/${op.id}/confirm").header("Authorization", "Bearer ${plannerToken()}")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson([plannedDateFrom: "2026-07-01", plannedDateTo: "2026-08-31"])))

        then:
        result.andExpect(status().isForbidden())
    }

    def "operation should track change log after status change"() {
        given:
        def op = createOperation(plannerToken())
        def token = supervisorToken()
        mockMvc.perform(post("/api/flight-operations/${op.id}/reject").header("Authorization", "Bearer $token"))

        when:
        def result = mockMvc.perform(
                get("/api/flight-operations/${op.id}").header("Authorization", "Bearer $token")
        ).andReturn()
        def body = parseResponse(result)

        then:
        body.changeLog.size() > 0
        body.changeLog.any { it.fieldName == "status" && it.newValue == "REJECTED" }
    }

    def "planner should add comment to operation"() {
        given:
        def token = plannerToken()
        def op = createOperation(token)

        when:
        def result = mockMvc.perform(
                post("/api/flight-operations/${op.id}/comments").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson([content: "Proszę o priorytetowe rozpatrzenie"]))
        )

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath('$.comments[0].content').value("Proszę o priorytetowe rozpatrzenie"))
              .andExpect(jsonPath('$.comments[0].authorEmail').value("planner@aero.pl"))
    }
}
