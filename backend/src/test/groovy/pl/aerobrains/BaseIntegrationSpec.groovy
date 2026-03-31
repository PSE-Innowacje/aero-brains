package pl.aerobrains

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.testcontainers.containers.OracleContainer
import org.testcontainers.spock.Testcontainers
import spock.lang.Shared
import spock.lang.Specification

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
}
