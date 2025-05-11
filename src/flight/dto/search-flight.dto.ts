import { IsString, Length, IsDateString, IsOptional } from 'class-validator';

export class SearchFlightDto {
  @IsDateString()
  inDate: string; // Date (yyyy-mm-dd)

  @IsDateString()
  outDate: string;

  @IsOptional()
  @IsString()
  @Length(3, 5) // e.g., "LGA", "NYCA", "HNL"
  from?: string;

  @IsOptional()
  @IsString()
  @Length(3, 5)
  to?: string;
}
