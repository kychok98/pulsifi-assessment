import { Injectable, Logger } from '@nestjs/common';
import { safeDate } from '../utils/date';
import { applyDiscountRules } from '../utils/discount';
import { SearchFlightDto } from './dto/search-flight.dto';
import {
  ItineraryBucket,
  ItineraryItem,
} from './interfaces/flight-response.interface';
import { SkyscannerService } from './skyscanner/skyscanner.service';

@Injectable()
export class FlightService {
  private readonly logger = new Logger(FlightService.name);

  private static _calculateDiffInDays(start: string, end: string): number {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return (endTime - startTime) / (1000 * 60 * 60 * 24);
  }

  constructor(private readonly skyscannerService: SkyscannerService) {}

  async searchFlights(dto: SearchFlightDto) {
    const flights = await this.skyscannerService.searchFlights();
    const items = this._deduplicate(flights?.itineraries?.buckets || []);

    const matched = items.filter((item) => this._matchesCriteria(item, dto));
    this.logger.log(`Found ${matched.length} matched itineraries`);

    const transformed = this._transformResults(
      matched.sort((a, b) => a.price.raw - b.price.raw),
      FlightService._calculateDiffInDays(dto.inDate, dto.outDate),
    );
    this.logger.log(transformed);

    return {
      count: transformed.length,
      data: transformed,
    };
  }

  private _deduplicate(buckets: ItineraryBucket[]): ItineraryItem[] {
    const seen = new Set<string>();

    return buckets
      .flatMap((b) => b.items || [])
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
  }

  private _matchesCriteria(item: ItineraryItem, dto: SearchFlightDto): boolean {
    const errors: string[] = [];

    const [outbound, inbound] = item.legs;

    if (safeDate(outbound.departure) !== dto.inDate) {
      errors.push(
        `inDate mismatch: ${safeDate(outbound.departure)} ≠ ${dto.inDate}`,
      );
    }

    if (safeDate(inbound.departure) !== dto.outDate) {
      errors.push(
        `outDate mismatch: ${safeDate(inbound.departure)} ≠ ${dto.outDate}`,
      );
    }

    if (dto.from && outbound.origin.id !== dto.from) {
      errors.push(`origin mismatch: ${outbound.origin?.id} ≠ ${dto.from}`);
    }

    if (dto.to && outbound.destination.id !== dto.to) {
      errors.push(
        `destination mismatch: ${outbound.destination?.id} ≠ ${dto.to}`,
      );
    }

    if (errors.length > 0) {
      this.logger.debug(`Skipping item ${item.id}:\n${errors.join('\n')}`);
      return false;
    }

    return true;
  }

  private _transformResults(items: ItineraryItem[], diffInDays: number) {
    return items.map((item) => {
      const [outbound, inbound] = item.legs;
      const carrier = outbound.carriers.marketing[0];

      const finalPrice = applyDiscountRules(item.price.raw, diffInDays);

      return {
        id: item.id,
        price: `$` + finalPrice.toFixed(0),
        carrier: carrier?.name,
        from: outbound.origin.displayCode,
        to: outbound.destination.displayCode,
        departTime: outbound.departure,
        returnTime: inbound.departure,
        durationInMinutes:
          outbound.durationInMinutes + inbound.durationInMinutes,
        stops: outbound.stopCount + inbound.stopCount,
      };
    });
  }
}
