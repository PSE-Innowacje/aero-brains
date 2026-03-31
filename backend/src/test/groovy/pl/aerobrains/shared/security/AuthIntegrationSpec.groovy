package pl.aerobrains.shared.security

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.security.crypto.password.PasswordEncoder
import pl.aerobrains.BaseIntegrationSpec
import pl.aerobrains.shared.security.user.User
import pl.aerobrains.shared.security.user.UserRepository

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

class AuthIntegrationSpec extends BaseIntegrationSpec {

    @Autowired
    UserRepository userRepository

    @Autowired
    PasswordEncoder passwordEncoder

    @Autowired
    ObjectMapper objectMapper

    def setup() {
        // re-hash passwords with proper BCrypt encoder since seed data hash may not match
        def users = userRepository.findAll()
        users.each { user ->
            if (!passwordEncoder.matches("password", user.password)) {
                user.password = passwordEncoder.encode("password")
                userRepository.save(user)
            }
        }
    }

    def "should login successfully with valid credentials"() {
        given:
        def request = [email: "admin@aero.pl", password: "password"]

        when:
        def result = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
        )

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath('$.token').isNotEmpty())
              .andExpect(jsonPath('$.email').value("admin@aero.pl"))
              .andExpect(jsonPath('$.role').value("ADMINISTRATOR"))
    }

    def "should login with each role"() {
        given:
        def request = [email: email, password: "password"]

        when:
        def result = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
        )

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath('$.role').value(expectedRole))

        where:
        email                | expectedRole
        "admin@aero.pl"      | "ADMINISTRATOR"
        "planner@aero.pl"    | "PLANNER"
        "supervisor@aero.pl" | "SUPERVISOR"
        "pilot@aero.pl"      | "PILOT"
    }

    def "should return 401 for wrong password"() {
        given:
        def request = [email: "admin@aero.pl", password: "wrongpassword"]

        when:
        def result = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
        )

        then:
        result.andExpect(status().isUnauthorized())
    }

    def "should return 401 for non-existent user"() {
        given:
        def request = [email: "nonexistent@aero.pl", password: "password"]

        when:
        def result = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
        )

        then:
        result.andExpect(status().isUnauthorized())
    }

    def "should reject login with missing email"() {
        when:
        def result = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content('{"password": "password"}')
        )

        then: "should return 4xx client error"
        result.andExpect(status().is4xxClientError())
    }

    def "should reject login with missing password"() {
        when:
        def result = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content('{"email": "admin@aero.pl"}')
        )

        then: "should return 4xx client error"
        result.andExpect(status().is4xxClientError())
    }

    def "should reject login with empty body"() {
        when:
        def result = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content('{}')
        )

        then:
        result.andExpect(status().is4xxClientError())
    }

    def "should access protected endpoint with valid JWT"() {
        given: "login to get token"
        def loginRequest = [email: "admin@aero.pl", password: "password"]
        def loginResult = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
        ).andReturn()

        def token = objectMapper.readValue(loginResult.response.contentAsString, Map).token

        when: "access protected endpoint"
        def result = mockMvc.perform(
                get("/api/users")
                        .header("Authorization", "Bearer ${token}")
        )

        then:
        result.andExpect(status().isOk())
    }

    def "should deny access to protected endpoint without JWT"() {
        when:
        def result = mockMvc.perform(get("/api/users"))

        then:
        result.andExpect(status().isForbidden())
    }

    def "should deny access with invalid JWT"() {
        when:
        def result = mockMvc.perform(
                get("/api/users")
                        .header("Authorization", "Bearer invalid.token.here")
        )

        then:
        result.andExpect(status().isForbidden())
    }

    def "should deny access to admin endpoint with non-admin role"() {
        given: "login as planner"
        def loginRequest = [email: "planner@aero.pl", password: "password"]
        def loginResult = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
        ).andReturn()

        def token = objectMapper.readValue(loginResult.response.contentAsString, Map).token

        when: "try to access admin-only endpoint"
        def result = mockMvc.perform(
                get("/api/users")
                        .header("Authorization", "Bearer ${token}")
        )

        then:
        result.andExpect(status().isForbidden())
    }
}
