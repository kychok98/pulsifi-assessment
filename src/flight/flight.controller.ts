import { Controller, Get, Query } from '@nestjs/common';
import { SearchFlightDto } from './dto/search-flight.dto';
import { FlightService } from './flight.service';

@Controller({ version: '1', path: '/search-flight' })
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get()
  search(@Query() dto: SearchFlightDto) {
    return this.flightService.searchFlights(dto);
  }
}
