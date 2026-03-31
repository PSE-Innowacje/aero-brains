package pl.aerobrains.fleet

import pl.aerobrains.BaseIntegrationSpec

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.http.MediaType

/**
 * User Story i) — Administrator edytuje flote helikopterow, czlonkow zalogi i ladowiska.
 */
class AdminFleetManagementSpec extends BaseIntegrationSpec {

    // ==================== HELICOPTERS ====================

    def "admin should create a helicopter"() {
        given:
        def token = adminToken()
        def regNum = unique("SP-T")
        def request = [
                registrationNumber: regNum,
                helicopterType    : "Airbus H145",
                description       : "Test helicopter",
                maxCrewCount      : 5,
                maxCrewWeight     : 450,
                status            : "ACTIVE",
                inspectionExpiryDate: "2027-12-31",
                rangeKm           : 700
        ]

        when:
        def result = mockMvc.perform(
                post("/api/helicopters")
                        .header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson(request))
        )

        then:
        result.andExpect(status().isCreated())
              .andExpect(jsonPath('$.registrationNumber').value(regNum))
              .andExpect(jsonPath('$.status').value("ACTIVE"))
    }

    def "admin should update a helicopter"() {
        given:
        def token = adminToken()
        def regNum = unique("SP-U")
        def createRequest = [
                registrationNumber: regNum,
                helicopterType    : "Bell 407",
                maxCrewCount      : 4,
                maxCrewWeight     : 400,
                status            : "ACTIVE",
                inspectionExpiryDate: "2027-06-30",
                rangeKm           : 500
        ]
        def createResult = mockMvc.perform(
                post("/api/helicopters").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(createRequest))
        ).andReturn()
        def id = parseResponse(createResult).id

        def updateRequest = createRequest + [helicopterType: "Bell 412", maxCrewWeight: 600]

        when:
        def result = mockMvc.perform(
                put("/api/helicopters/$id").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(updateRequest))
        )

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath('$.helicopterType').value("Bell 412"))
              .andExpect(jsonPath('$.maxCrewWeight').value(600))
    }

    def "should reject helicopter without registration number"() {
        given:
        def token = adminToken()
        def request = [
                helicopterType: "Test", maxCrewCount: 2, maxCrewWeight: 200,
                status: "ACTIVE", inspectionExpiryDate: "2027-12-31", rangeKm: 300
        ]

        when:
        def result = mockMvc.perform(
                post("/api/helicopters").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "should reject active helicopter without inspection date"() {
        given:
        def token = adminToken()
        def request = [
                registrationNumber: unique("SP-NI"),
                helicopterType    : "Test",
                maxCrewCount      : 2,
                maxCrewWeight     : 200,
                status            : "ACTIVE",
                rangeKm           : 300
        ]

        when:
        def result = mockMvc.perform(
                post("/api/helicopters").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "should allow inactive helicopter without inspection date"() {
        given:
        def token = adminToken()
        def request = [
                registrationNumber: unique("SP-IN"),
                helicopterType    : "Test",
                maxCrewCount      : 2,
                maxCrewWeight     : 200,
                status            : "INACTIVE",
                rangeKm           : 300
        ]

        when:
        def result = mockMvc.perform(
                post("/api/helicopters").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isCreated())
    }

    def "should reject duplicate registration number"() {
        given:
        def token = adminToken()
        def regNum = unique("SP-DP")
        def request = [
                registrationNumber: regNum,
                helicopterType    : "Test",
                maxCrewCount      : 2,
                maxCrewWeight     : 200,
                status            : "INACTIVE",
                rangeKm           : 300
        ]
        mockMvc.perform(post("/api/helicopters").header("Authorization", "Bearer $token")
                .contentType(MediaType.APPLICATION_JSON).content(toJson(request)))

        when:
        def result = mockMvc.perform(
                post("/api/helicopters").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "non-admin should not create helicopters"() {
        given:
        def request = [
                registrationNumber: unique("SP-NA"),
                helicopterType: "Test", maxCrewCount: 2, maxCrewWeight: 200,
                status: "INACTIVE", rangeKm: 300
        ]

        when:
        def result = mockMvc.perform(
                post("/api/helicopters").header("Authorization", "Bearer ${token}")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isForbidden())

        where:
        token << [plannerToken(), pilotToken()]
    }

    def "supervisor and pilot can read helicopters"() {
        when:
        def result = mockMvc.perform(
                get("/api/helicopters").header("Authorization", "Bearer ${token}")
        )

        then:
        result.andExpect(status().isOk())

        where:
        token << [supervisorToken(), pilotToken()]
    }

    // ==================== CREW MEMBERS ====================

    def "admin should create a crew member with role PILOT"() {
        given:
        def token = adminToken()
        def email = unique("pilot") + "@aero.pl"
        def request = [
                firstName          : "Testowy",
                lastName           : "Pilot",
                email              : email,
                weight             : 80,
                role               : "PILOT",
                pilotLicenseNumber : "PL-TEST-" + unique(),
                licenseExpiryDate  : "2027-12-31",
                trainingExpiryDate : "2027-06-30"
        ]

        when:
        def result = mockMvc.perform(
                post("/api/crew-members").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isCreated())
              .andExpect(jsonPath('$.role').value("PILOT"))
    }

    def "admin should create a crew member with role OBSERVER"() {
        given:
        def token = adminToken()
        def request = [
                firstName          : "Testowy",
                lastName           : "Observer",
                email              : unique("obs") + "@aero.pl",
                weight             : 70,
                role               : "OBSERVER",
                trainingExpiryDate : "2027-06-30"
        ]

        when:
        def result = mockMvc.perform(
                post("/api/crew-members").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isCreated())
              .andExpect(jsonPath('$.role').value("OBSERVER"))
    }

    def "should reject pilot without license number"() {
        given:
        def token = adminToken()
        def request = [
                firstName: "No", lastName: "License", email: unique("nl") + "@aero.pl",
                weight: 80, role: "PILOT", trainingExpiryDate: "2027-06-30"
        ]

        when:
        def result = mockMvc.perform(
                post("/api/crew-members").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "should reject pilot without license expiry date"() {
        given:
        def token = adminToken()
        def request = [
                firstName: "No", lastName: "Expiry", email: unique("ne") + "@aero.pl",
                weight: 80, role: "PILOT", pilotLicenseNumber: "PL-X-001",
                trainingExpiryDate: "2027-06-30"
        ]

        when:
        def result = mockMvc.perform(
                post("/api/crew-members").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "should reject crew member with weight out of range"() {
        given:
        def token = adminToken()
        def request = [
                firstName: "Heavy", lastName: "Person", email: unique("wt") + "@aero.pl",
                weight: weight, role: "OBSERVER", trainingExpiryDate: "2027-06-30"
        ]

        when:
        def result = mockMvc.perform(
                post("/api/crew-members").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isBadRequest())

        where:
        weight << [29, 201]
    }

    def "should reject duplicate crew member email"() {
        given:
        def token = adminToken()
        def email = unique("dup") + "@aero.pl"
        def request = [
                firstName: "Dup", lastName: "Crew", email: email,
                weight: 75, role: "OBSERVER", trainingExpiryDate: "2027-06-30"
        ]
        mockMvc.perform(post("/api/crew-members").header("Authorization", "Bearer $token")
                .contentType(MediaType.APPLICATION_JSON).content(toJson(request)))

        when:
        def result = mockMvc.perform(
                post("/api/crew-members").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    // ==================== LANDING SITES ====================

    def "admin should create a landing site"() {
        given:
        def token = adminToken()
        def name = "Ladowisko " + unique()
        def request = [name: name, latitude: 52.0, longitude: 21.0]

        when:
        def result = mockMvc.perform(
                post("/api/landing-sites").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isCreated())
              .andExpect(jsonPath('$.name').value(name))
    }

    def "should reject duplicate landing site name"() {
        given:
        def token = adminToken()
        def name = "Ladowisko " + unique()
        def request = [name: name, latitude: 52.0, longitude: 21.0]
        mockMvc.perform(post("/api/landing-sites").header("Authorization", "Bearer $token")
                .contentType(MediaType.APPLICATION_JSON).content(toJson(request)))

        when:
        def result = mockMvc.perform(
                post("/api/landing-sites").header("Authorization", "Bearer $token")
                        .contentType(MediaType.APPLICATION_JSON).content(toJson(request))
        )

        then:
        result.andExpect(status().isBadRequest())
    }

    def "planner should not manage fleet"() {
        given:
        def token = plannerToken()

        when:
        def result = mockMvc.perform(
                get("/api/helicopters").header("Authorization", "Bearer $token")
        )

        then: "planner has no access to fleet"
        result.andExpect(status().isForbidden())
    }
}
