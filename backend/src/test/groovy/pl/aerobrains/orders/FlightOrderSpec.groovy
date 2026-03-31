package pl.aerobrains.orders

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import pl.aerobrains.BaseIntegrationSpec
import pl.aerobrains.fleet.infrastructure.CrewMemberRepository
import pl.aerobrains.fleet.infrastructure.HelicopterRepository
import pl.aerobrains.fleet.infrastructure.LandingSiteRepository

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

/**
 * User Stories e-h:
 * e) Pilot creates a flight order linking operations
 * f) Pilot selects helicopter and crew with validations
 * g) Supervisor accepts/rejects flight orders
 * h) Pilot settles flight order (completed/partial/not completed)
 */
class FlightOrderSpec extends BaseIntegrationSpec {

    @Autowired
    HelicopterRepository helicopterRepository

    @Autowired
    CrewMemberRepository crewMemberRepository

    @Autowired
    LandingSiteRepository landingSiteRepository

    /**
     * Helper: create operation as planner, confirm as supervisor, return operation map.
     */
    def createConfirmedOperation() {
        def plannerTk = plannerToken()
        def supervisorTk = supervisorToken()

        def opReq = [
                orderProjectNumber: "DE-26-" + System.nanoTime(),
                shortDescription  : "Test op for order",
                activities        : [[activityType: "VISUAL_INSPECTION"]],
        ]
        def opResult = mockMvc.perform(
                post("/api/flight-operations").header("Authorization", "Bearer $plannerTk")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(opReq))
        ).andReturn()
        def op = parseResponse(opResult)

        mockMvc.perform(post("/api/flight-operations/${op.id}/confirm")
                .header("Authorization", "Bearer $supervisorTk")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson([plannedDateFrom: "2026-07-01", plannedDateTo: "2026-08-31"])))

        return op
    }

    def getActiveHelicopterId() {
        def helis = helicopterRepository.findAll()
        return helis.find { it.status.name() == "ACTIVE" }?.id
    }

    def getPilotCrewMemberId() {
        def members = crewMemberRepository.findAll()
        return members.find { it.role.name() == "PILOT" }?.id
    }

    def getObserverCrewMemberId() {
        def members = crewMemberRepository.findAll()
        return members.find { it.role.name() == "OBSERVER" }?.id
    }

    def getLandingSiteIds() {
        def sites = landingSiteRepository.findAll()
        return [sites[0]?.id, sites[1]?.id]
    }

    def createFlightOrderRequest(Map overrides = [:]) {
        def op = createConfirmedOperation()
        def heliId = getActiveHelicopterId()
        def siteIds = getLandingSiteIds()

        def base = [
                plannedStartTime       : "2026-07-15T08:00:00",
                plannedEndTime         : "2026-07-15T12:00:00",
                helicopterId           : heliId,
                crewMemberIds          : [],
                departureSiteId        : siteIds[0],
                arrivalSiteId          : siteIds[1],
                operationIds           : [op.id],
                estimatedRouteLengthKm : 100
        ]
        return base + overrides
    }

    // ==================== US-E: Pilot creates flight order ====================

    def "pilot should create a flight order"() {
        given:
        def token = pilotToken()
        def request = createFlightOrderRequest()

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isCreated())
              .andExpect(jsonPath('$.status').value("INTRODUCED"))
              .andExpect(jsonPath('$.pilotId').isNumber())
              .andExpect(jsonPath('$.crewWeight').isNumber())
    }

    def "pilot should see linked operations become SCHEDULED"() {
        given:
        def token = pilotToken()
        def op = createConfirmedOperation()
        def heliId = getActiveHelicopterId()
        def siteIds = getLandingSiteIds()

        def request = [
                plannedStartTime      : "2026-07-15T08:00:00",
                plannedEndTime        : "2026-07-15T12:00:00",
                helicopterId          : heliId,
                departureSiteId       : siteIds[0],
                arrivalSiteId         : siteIds[1],
                operationIds          : [op.id],
                estimatedRouteLengthKm: 100
        ]
        mockMvc.perform(post("/api/flight-orders").header("Authorization", "Bearer $token")
                .contentType(MediaType.APPLICATION_JSON).content(toJson(request)))

        when:
        def result = mockMvc.perform(
                get("/api/flight-operations/${op.id}").header("Authorization", "Bearer $token")
        ).andReturn()

        then:
        parseResponse(result).status == "SCHEDULED"
    }

    def "planner should not create flight orders"() {
        given:
        def request = createFlightOrderRequest()

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders").header("Authorization", "Bearer ${plannerToken()}")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isForbidden())
    }

    def "admin should not create flight orders"() {
        given:
        def request = createFlightOrderRequest()

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders").header("Authorization", "Bearer ${adminToken()}")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isForbidden())
    }

    // ==================== US-F: Validations ====================

    def "should reject order when route exceeds helicopter range"() {
        given:
        def token = pilotToken()
        def request = createFlightOrderRequest(estimatedRouteLengthKm: 9999)

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "should reject order with non-existent helicopter"() {
        given:
        def token = pilotToken()
        def request = createFlightOrderRequest(helicopterId: 999999)

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isNotFound())
    }

    // ==================== US-G: Supervisor accepts/rejects orders ====================

    def createSubmittedOrder() {
        def token = pilotToken()
        def request = createFlightOrderRequest()
        def createResult = mockMvc.perform(
                post("/api/flight-orders").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        ).andReturn()
        def order = parseResponse(createResult)

        // submit for approval
        mockMvc.perform(post("/api/flight-orders/${order.id}/submit")
                .header("Authorization", "Bearer $token"))

        return order
    }

    def "supervisor should accept a submitted order"() {
        given:
        def order = createSubmittedOrder()
        def token = supervisorToken()

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders/${order.id}/accept").header("Authorization", "Bearer $token")
        )

        then:
        result.andExpect(status().isNoContent())

        and:
        def updated = mockMvc.perform(
                get("/api/flight-orders/${order.id}").header("Authorization", "Bearer $token")
        ).andReturn()
        parseResponse(updated).status == "ACCEPTED"
    }

    def "supervisor should reject a submitted order"() {
        given:
        def order = createSubmittedOrder()
        def token = supervisorToken()

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders/${order.id}/reject").header("Authorization", "Bearer $token")
        )

        then:
        result.andExpect(status().isNoContent())

        and:
        def updated = mockMvc.perform(
                get("/api/flight-orders/${order.id}").header("Authorization", "Bearer $token")
        ).andReturn()
        parseResponse(updated).status == "REJECTED"
    }

    def "supervisor should not accept a non-submitted order"() {
        given: "order in INTRODUCED status (not submitted)"
        def token = pilotToken()
        def request = createFlightOrderRequest()
        def createResult = mockMvc.perform(
                post("/api/flight-orders").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        ).andReturn()
        def order = parseResponse(createResult)

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders/${order.id}/accept").header("Authorization", "Bearer ${supervisorToken()}")
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "pilot should not accept orders"() {
        given:
        def order = createSubmittedOrder()

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders/${order.id}/accept").header("Authorization", "Bearer ${pilotToken()}")
        )

        then:
        result.andExpect(status().isForbidden())
    }

    def "planner should not reject orders"() {
        given:
        def order = createSubmittedOrder()

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders/${order.id}/reject").header("Authorization", "Bearer ${plannerToken()}")
        )

        then:
        result.andExpect(status().isForbidden())
    }

    // ==================== US-H: Pilot settles order ====================

    def createAcceptedOrder() {
        def order = createSubmittedOrder()
        mockMvc.perform(post("/api/flight-orders/${order.id}/accept")
                .header("Authorization", "Bearer ${supervisorToken()}"))
        return order
    }

    def "pilot should settle order as fully completed"() {
        given:
        def order = createAcceptedOrder()
        def token = pilotToken()

        // set actual times first
        def updateReq = [
                plannedStartTime      : "2026-07-15T08:00:00",
                plannedEndTime        : "2026-07-15T12:00:00",
                helicopterId          : order.helicopterId,
                departureSiteId       : order.departureSiteId,
                arrivalSiteId         : order.arrivalSiteId,
                operationIds          : order.operationIds,
                estimatedRouteLengthKm: order.estimatedRouteLengthKm,
                actualStartTime       : "2026-07-15T08:15:00",
                actualEndTime         : "2026-07-15T11:45:00"
        ]
        mockMvc.perform(put("/api/flight-orders/${order.id}").header("Authorization", "Bearer $token")
                .contentType(MediaType.APPLICATION_JSON).content(toJson(updateReq)))

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders/${order.id}/settle-complete").header("Authorization", "Bearer $token")
        )

        then:
        result.andExpect(status().isNoContent())

        and: "order status is COMPLETED"
        def updated = mockMvc.perform(
                get("/api/flight-orders/${order.id}").header("Authorization", "Bearer $token")
        ).andReturn()
        parseResponse(updated).status == "COMPLETED"
    }

    def "pilot should settle order as partially completed"() {
        given:
        def order = createAcceptedOrder()
        def token = pilotToken()

        def updateReq = [
                plannedStartTime      : "2026-07-15T08:00:00",
                plannedEndTime        : "2026-07-15T12:00:00",
                helicopterId          : order.helicopterId,
                departureSiteId       : order.departureSiteId,
                arrivalSiteId         : order.arrivalSiteId,
                operationIds          : order.operationIds,
                estimatedRouteLengthKm: order.estimatedRouteLengthKm,
                actualStartTime       : "2026-07-15T08:15:00",
                actualEndTime         : "2026-07-15T10:00:00"
        ]
        mockMvc.perform(put("/api/flight-orders/${order.id}").header("Authorization", "Bearer $token")
                .contentType(MediaType.APPLICATION_JSON).content(toJson(updateReq)))

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders/${order.id}/settle-partial").header("Authorization", "Bearer $token")
        )

        then:
        result.andExpect(status().isNoContent())

        and: "linked operations become PARTIALLY_COMPLETED"
        order.operationIds.each { opId ->
            def opResult = mockMvc.perform(
                    get("/api/flight-operations/$opId").header("Authorization", "Bearer $token")
            ).andReturn()
            assert parseResponse(opResult).status == "PARTIALLY_COMPLETED"
        }
    }

    def "pilot should settle order as not completed — operations revert to CONFIRMED"() {
        given:
        def order = createAcceptedOrder()
        def token = pilotToken()

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders/${order.id}/settle-not-completed").header("Authorization", "Bearer $token")
        )

        then:
        result.andExpect(status().isNoContent())

        and: "order is NOT_COMPLETED"
        def updated = mockMvc.perform(
                get("/api/flight-orders/${order.id}").header("Authorization", "Bearer $token")
        ).andReturn()
        parseResponse(updated).status == "NOT_COMPLETED"

        and: "linked operations revert to CONFIRMED"
        order.operationIds.each { opId ->
            def opResult = mockMvc.perform(
                    get("/api/flight-operations/$opId").header("Authorization", "Bearer $token")
            ).andReturn()
            assert parseResponse(opResult).status == "CONFIRMED"
        }
    }

    def "should not settle order without actual times for complete"() {
        given:
        def order = createAcceptedOrder()
        def token = pilotToken()

        when: "try to settle without setting actual times"
        def result = mockMvc.perform(
                post("/api/flight-orders/${order.id}/settle-complete").header("Authorization", "Bearer $token")
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "should not settle an order that is not ACCEPTED"() {
        given: "order in INTRODUCED status"
        def token = pilotToken()
        def request = createFlightOrderRequest()
        def createResult = mockMvc.perform(
                post("/api/flight-orders").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        ).andReturn()
        def order = parseResponse(createResult)

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders/${order.id}/settle-complete").header("Authorization", "Bearer $token")
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "supervisor should not settle orders"() {
        given:
        def order = createAcceptedOrder()

        when:
        def result = mockMvc.perform(
                post("/api/flight-orders/${order.id}/settle-complete")
                        .header("Authorization", "Bearer ${supervisorToken()}")
        )

        then:
        result.andExpect(status().isForbidden())
    }

    // ==================== List / Read ====================

    def "pilot should list flight orders"() {
        when:
        def result = mockMvc.perform(
                get("/api/flight-orders").header("Authorization", "Bearer ${pilotToken()}")
        )

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath('$').isArray())
    }

    def "supervisor should list flight orders"() {
        when:
        def result = mockMvc.perform(
                get("/api/flight-orders").header("Authorization", "Bearer ${supervisorToken()}")
        )

        then:
        result.andExpect(status().isOk())
    }

    def "planner should not access flight orders"() {
        when:
        def result = mockMvc.perform(
                get("/api/flight-orders").header("Authorization", "Bearer ${plannerToken()}")
        )

        then:
        result.andExpect(status().isForbidden())
    }
}
