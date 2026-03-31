package pl.aerobrains.operations.domain

enum class OperationStatus(val code: Int, val label: String) {
    INTRODUCED(1, "Wprowadzone"),
    REJECTED(2, "Odrzucone"),
    CONFIRMED(3, "Potwierdzone do planu"),
    SCHEDULED(4, "Zaplanowane do zlecenia"),
    PARTIALLY_COMPLETED(5, "Częściowo zrealizowane"),
    COMPLETED(6, "Zrealizowane"),
    CANCELLED(7, "Rezygnacja");

    companion object {
        private val allowedTransitions: Map<OperationStatus, Set<OperationStatus>> = mapOf(
            INTRODUCED to setOf(REJECTED, CONFIRMED, CANCELLED),
            REJECTED to emptySet(),
            CONFIRMED to setOf(SCHEDULED, CANCELLED),
            SCHEDULED to setOf(PARTIALLY_COMPLETED, COMPLETED, CONFIRMED),
            PARTIALLY_COMPLETED to emptySet(),
            COMPLETED to emptySet(),
            CANCELLED to emptySet()
        )

        fun canTransition(from: OperationStatus, to: OperationStatus): Boolean {
            return allowedTransitions[from]?.contains(to) ?: false
        }
    }
}
