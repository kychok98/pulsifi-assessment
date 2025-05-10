import { IsDateString } from 'class-validator';

export class SearchFlightDto {
  @IsDateString()
  departureDate: string;

  @IsDateString()
  returnDate: string;
}
