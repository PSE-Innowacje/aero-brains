package pl.aerobrains.operations.application

import org.springframework.stereotype.Service
import pl.aerobrains.operations.infrastructure.KmlPoint
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

@Service
class RouteCalculationService {

    companion object {
        private const val EARTH_RADIUS_KM = 6371.0
    }

    fun calculateRouteLength(points: List<KmlPoint>): Int {
        if (points.size < 2) return 0

        var totalDistance = 0.0
        for (i in 0 until points.size - 1) {
            totalDistance += haversine(points[i], points[i + 1])
        }

        return totalDistance.toInt()
    }

    private fun haversine(p1: KmlPoint, p2: KmlPoint): Double {
        val dLat = Math.toRadians(p2.latitude - p1.latitude)
        val dLon = Math.toRadians(p2.longitude - p1.longitude)
        val lat1 = Math.toRadians(p1.latitude)
        val lat2 = Math.toRadians(p2.latitude)

        val a = sin(dLat / 2) * sin(dLat / 2) +
                cos(lat1) * cos(lat2) * sin(dLon / 2) * sin(dLon / 2)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return EARTH_RADIUS_KM * c
    }
}
