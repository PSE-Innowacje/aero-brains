package pl.aerobrains.shared.exception

class EntityNotFoundException(
    val entityName: String,
    val entityId: Any
) : RuntimeException("$entityName with id $entityId not found")

class BusinessRuleViolationException(
    override val message: String
) : RuntimeException(message)