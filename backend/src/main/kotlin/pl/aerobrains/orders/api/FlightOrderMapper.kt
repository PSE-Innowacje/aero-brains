package pl.aerobrains.orders.api

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import pl.aerobrains.orders.domain.FlightOrder

@Mapper(componentModel = "spring")
interface FlightOrderMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "pilotId", constant = "0L")
    @Mapping(target = "status", expression = "java(pl.aerobrains.orders.domain.OrderStatus.INTRODUCED)")
    @Mapping(target = "crewWeight", constant = "0")
    @Mapping(target = "actualStartTime", ignore = true)
    @Mapping(target = "actualEndTime", ignore = true)
    @Mapping(target = "actualRouteLengthKm", ignore = true)
    fun toEntity(request: CreateFlightOrderRequest): FlightOrder

    fun toResponse(order: FlightOrder): FlightOrderResponse
    fun toListItem(order: FlightOrder): FlightOrderListItem
    fun toListItems(orders: List<FlightOrder>): List<FlightOrderListItem>
}
