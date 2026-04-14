package pl.aerobrains.operations.infrastructure

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Component
import org.w3c.dom.Element
import org.w3c.dom.NodeList
import java.io.StringReader
import javax.xml.parsers.DocumentBuilderFactory

data class KmlPoint(val latitude: Double, val longitude: Double)

@Component
class KmlParser(
    private val objectMapper: ObjectMapper
) {

    fun parsePoints(kmlContent: String): List<KmlPoint> {
        val factory = DocumentBuilderFactory.newInstance().apply {
            isNamespaceAware = true
            setFeature("http://apache.org/xml/features/disallow-doctype-decl", true)
            setFeature("http://xml.org/sax/features/external-general-entities", false)
            setFeature("http://xml.org/sax/features/external-parameter-entities", false)
        }
        val builder = factory.newDocumentBuilder()
        val document = builder.parse(org.xml.sax.InputSource(StringReader(kmlContent)))

        val points = mutableListOf<KmlPoint>()
        extractCoordinates(document.getElementsByTagNameNS("*", "coordinates"), points)

        if (points.size > 5000) {
            throw IllegalArgumentException("KML file contains more than 5000 points (found ${points.size})")
        }

        return points
    }

    fun generateKml(points: List<KmlPoint>): String {
        val coordString = points.joinToString("\n            ") { "${it.longitude},${it.latitude},0" }
        val geometryTag = if (points.size == 1) {
            "<Point><coordinates>${points[0].longitude},${points[0].latitude},0</coordinates></Point>"
        } else {
            "<LineString><coordinates>\n            $coordString\n          </coordinates></LineString>"
        }

        return """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Operation Route</name>
    <Placemark>
      <name>Route</name>
      $geometryTag
    </Placemark>
  </Document>
</kml>"""
    }

    fun toGeoJson(points: List<KmlPoint>): String {
        val geojson = if (points.size == 1) {
            mapOf(
                "type" to "FeatureCollection",
                "features" to listOf(
                    mapOf(
                        "type" to "Feature",
                        "geometry" to mapOf(
                            "type" to "Point",
                            "coordinates" to listOf(points[0].longitude, points[0].latitude)
                        ),
                        "properties" to emptyMap<String, Any>()
                    )
                )
            )
        } else {
            mapOf(
                "type" to "FeatureCollection",
                "features" to listOf(
                    mapOf(
                        "type" to "Feature",
                        "geometry" to mapOf(
                            "type" to "LineString",
                            "coordinates" to points.map { listOf(it.longitude, it.latitude) }
                        ),
                        "properties" to emptyMap<String, Any>()
                    )
                )
            )
        }

        return objectMapper.writeValueAsString(geojson)
    }

    private fun extractCoordinates(nodeList: NodeList, points: MutableList<KmlPoint>) {
        for (i in 0 until nodeList.length) {
            val element = nodeList.item(i) as? Element ?: continue
            val text = element.textContent.trim()
            text.split("\\s+".toRegex())
                .filter { it.isNotBlank() }
                .forEach { coordStr ->
                    val parts = coordStr.split(",")
                    if (parts.size >= 2) {
                        val lon = parts[0].trim().toDoubleOrNull()
                        val lat = parts[1].trim().toDoubleOrNull()
                        if (lon != null && lat != null) {
                            points.add(KmlPoint(latitude = lat, longitude = lon))
                        }
                    }
                }
        }
    }
}
