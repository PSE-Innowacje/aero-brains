package pl.aerobrains.orders.domain

enum class OrderStatus(val code: Int, val label: String) {
    INTRODUCED(1, "Wprowadzone"),
    SUBMITTED(2, "Przekazane do akceptacji"),
    REJECTED(3, "Odrzucone"),
    ACCEPTED(4, "Zaakceptowane"),
    PARTIALLY_COMPLETED(5, "Zrealizowane w części"),
    COMPLETED(6, "Zrealizowane w całości"),
    NOT_COMPLETED(7, "Nie zrealizowane");

    companion object {
        private val allowedTransitions: Map<OrderStatus, Set<OrderStatus>> = mapOf(
            INTRODUCED to setOf(SUBMITTED),
            SUBMITTED to setOf(REJECTED, ACCEPTED),
            REJECTED to emptySet(),
            ACCEPTED to setOf(PARTIALLY_COMPLETED, COMPLETED, NOT_COMPLETED),
            PARTIALLY_COMPLETED to emptySet(),
            COMPLETED to emptySet(),
            NOT_COMPLETED to emptySet()
        )

        fun canTransition(from: OrderStatus, to: OrderStatus): Boolean {
            return allowedTransitions[from]?.contains(to) ?: false
        }
    }
}
