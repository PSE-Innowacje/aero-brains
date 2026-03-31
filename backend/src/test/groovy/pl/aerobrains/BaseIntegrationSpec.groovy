package pl.aerobrains

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult
import org.testcontainers.containers.OracleContainer
import org.testcontainers.spock.Testcontainers
import pl.aerobrains.shared.security.user.UserRepository
import spock.lang.Shared
import spock.lang.Specification

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
abstract class BaseIntegrationSpec extends Specification {

    @Shared
    static OracleContainer oracle = new OracleContainer("gvenzl/oracle-xe:21-slim-faststart")
            .withDatabaseName("testdb")
            .withUsername("aero")
            .withPassword("aero")

    @Autowired
    MockMvc mockMvc

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    UserRepository userRepository

    @Autowired
    PasswordEncoder passwordEncoder

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        oracle.start()
        registry.add("spring.datasource.url", () -> oracle.getJdbcUrl())
        registry.add("spring.datasource.username", () -> oracle.getUsername())
        registry.add("spring.datasource.password", () -> oracle.getPassword())
        registry.add("spring.datasource.driver-class-name", () -> "oracle.jdbc.OracleDriver")
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate")
        registry.add("spring.flyway.enabled", () -> "true")
    }

    @Shared
    static boolean passwordsFixed = false

    def setup() {
        if (!passwordsFixed) {
            def users = userRepository.findAll()
            users.each { user ->
                if (!passwordEncoder.matches("password", user.password)) {
                    user.password = passwordEncoder.encode("password")
                    userRepository.save(user)
                }
            }
            passwordsFixed = true
        }
    }

    String loginAs(String email) {
        def result = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString([email: email, password: "password"]))
        ).andReturn()

        return objectMapper.readValue(result.response.contentAsString, Map).token
    }

    String adminToken() { loginAs("admin@aero.pl") }
    String plannerToken() { loginAs("planner@aero.pl") }
    String supervisorToken() { loginAs("supervisor@aero.pl") }
    String pilotToken() { loginAs("pilot@aero.pl") }

    static String unique(String prefix = "") {
        def nano = System.nanoTime().toString()
        return prefix + nano.substring(Math.max(0, nano.length() - 8))
    }

    String toJson(Object obj) {
        objectMapper.writeValueAsString(obj)
    }

    Map parseResponse(MvcResult result) {
        objectMapper.readValue(result.response.contentAsString, Map)
    }

    List parseResponseList(MvcResult result) {
        objectMapper.readValue(result.response.contentAsString, List)
    }
}
