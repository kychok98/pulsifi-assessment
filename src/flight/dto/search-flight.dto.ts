import { IsString, Length, IsDateString, IsOptional } from 'class-validator';
import { IsBeforeOrEqualTo } from '../../common/validators/date-before.validator';

export class SearchFlightDto {
  @IsBeforeOrEqualTo('outDate')
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
