package pl.aerobrains

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import java.io.File

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("openapi")
class OpenApiSpecGeneratorTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Test
    fun `generate OpenAPI spec to shared directory`() {
        val result = mockMvc.get("/v3/api-docs")
            .andExpect { status { isOk() } }
            .andReturn()

        val spec = result.response.contentAsString
        val outputDir = File("../shared/api")
        outputDir.mkdirs()
        File(outputDir, "openapi.json").writeText(spec)

        println("OpenAPI spec written to ../shared/api/openapi.json (${spec.length} bytes)")
    }
}
