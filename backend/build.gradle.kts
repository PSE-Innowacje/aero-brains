import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "3.4.4"
    id("io.spring.dependency-management") version "1.1.7"
    groovy
    kotlin("jvm") version "2.1.10"
    kotlin("plugin.spring") version "2.1.10"
    kotlin("plugin.jpa") version "2.1.10"
    kotlin("kapt") version "2.1.10"
}

group = "pl.aerobrains"
version = "0.0.1-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    // Kotlin
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    // Database
    runtimeOnly("com.oracle.database.jdbc:ojdbc11")
    runtimeOnly("com.h2database:h2")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-oracle")

    // JWT
    implementation("io.jsonwebtoken:jjwt-api:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")

    // MapStruct
    implementation("org.mapstruct:mapstruct:1.6.3")
    kapt("org.mapstruct:mapstruct-processor:1.6.3")

    // OpenAPI / Swagger
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.4")

    // Test - JUnit 5
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")

    // Test - Spock + Groovy
    testImplementation("org.spockframework:spock-core:2.4-M4-groovy-4.0")
    testImplementation("org.spockframework:spock-spring:2.4-M4-groovy-4.0")
    testImplementation("org.apache.groovy:groovy-all:4.0.24")

    // Test - Testcontainers
    testImplementation("org.testcontainers:testcontainers:1.20.4")
    testImplementation("org.testcontainers:oracle-xe:1.20.4")
    testImplementation("org.testcontainers:spock:1.20.4")
    testImplementation("org.testcontainers:junit-jupiter:1.20.4")
}

kapt {
    arguments {
        arg("mapstruct.defaultComponentModel", "spring")
    }
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}

sourceSets {
    test {
        groovy {
            srcDirs("src/test/groovy")
        }
    }
}

tasks.withType<KotlinCompile> {
    compilerOptions {
        freeCompilerArgs.add("-Xjsr305=strict")
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.register("generateOpenApiDocs") {
    dependsOn("test")
    description = "Generate OpenAPI spec to shared/api/openapi.json (runs via test)"
    doLast {
        val specFile = file("../shared/api/openapi.json")
        if (specFile.exists()) {
            println("OpenAPI spec generated at: ${specFile.absolutePath}")
        } else {
            throw GradleException("OpenAPI spec not found. Make sure OpenApiSpecGeneratorTest ran successfully.")
        }
    }
}