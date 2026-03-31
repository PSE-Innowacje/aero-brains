package pl.aerobrains.operations.domain

enum class ActivityType(val label: String) {
    VISUAL_INSPECTION("Oględziny wizualne"),
    SCAN_3D("Skan 3D"),
    FAULT_LOCATION("Lokalizacja awarii"),
    PHOTOS("Zdjęcia"),
    PATROL("Patrolowanie"),
    OTHER("Inne")
}
