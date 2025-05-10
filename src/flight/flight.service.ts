import { Injectable } from '@nestjs/common';
import { SearchFlightDto } from './dto/search-flight.dto';
import { SkyscannerService } from './skyscanner/skyscanner.service';

@Injectable()
export class FlightService {
  constructor(private skyscannerService: SkyscannerService) {}

  async searchFlights(dto: SearchFlightDto) {
    console.log('dto: ', dto);
    const response = await this.skyscannerService.searchFlights();
    console.log('res: ', response?.itineraries);
    // const flights = response.data?.data || [];
    //
    // // Apply 10% discount if duration > 10 days
    // const days =
    //   (new Date(returnDate).getTime() - new Date(departureDate).getTime()) /
    //   (1000 * 60 * 60 * 24);
    // if (days > 10) {
    //   flights.forEach((f) => (f.price *= 0.9));
    // }
    //
    // return flights;
  }
}
