import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { API_KEY_HEADER, API_VERSION } from '../constants';
import { SearchFlightResponseDto } from './dto/flight.dto';
import { SearchFlightDto } from './dto/search-flight.dto';
import { FlightService } from './flight.service';

@ApiTags('Flights')
@ApiSecurity(API_KEY_HEADER)
@Controller({ version: API_VERSION, path: '/search-flight' })
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Search roundtrip flights' })
  @ApiResponse({
    status: 200,
    description: 'List of sorted flights with count',
    type: SearchFlightResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid API key',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  search(@Query() dto: SearchFlightDto) {
    return this.flightService.searchFlights(dto);
  }
}
