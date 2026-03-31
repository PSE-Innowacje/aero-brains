package pl.aerobrains.operations.infrastructure

import org.springframework.stereotype.Component
import org.w3c.dom.Element
import org.w3c.dom.NodeList
import java.io.StringReader
import javax.xml.parsers.DocumentBuilderFactory

data class KmlPoint(val latitude: Double, val longitude: Double)

@Component
class KmlParser {

    fun parsePoints(kmlContent: String): List<KmlPoint> {
        val factory = DocumentBuilderFactory.newInstance()
        factory.isNamespaceAware = true
        val builder = factory.newDocumentBuilder()
        val document = builder.parse(org.xml.sax.InputSource(StringReader(kmlContent)))

        val points = mutableListOf<KmlPoint>()
        extractCoordinates(document.getElementsByTagNameNS("*", "coordinates"), points)

        if (points.size > 5000) {
            throw IllegalArgumentException("KML file contains more than 5000 points (found ${points.size})")
        }

        return points
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
