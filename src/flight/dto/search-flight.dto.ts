import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, IsDateString, IsOptional } from 'class-validator';
import { IsBeforeOrEqualTo } from '../../common/validators/date-before.validator';

export class SearchFlightDto {
  @ApiProperty({
    example: '2024-08-22',
    description: 'Departure date (YYYY-MM-DD)',
  })
  @IsBeforeOrEqualTo('outDate')
  @IsDateString()
  inDate: string;

  @ApiProperty({
    example: '2024-08-25',
    description: 'Return date (YYYY-MM-DD)',
  })
  @IsDateString()
  outDate: string;

  @ApiPropertyOptional({
    example: 'JFK',
    description: 'Origin airport code (3-5 characters)',
  })
  @IsOptional()
  @IsString()
  @Length(3, 5)
  from?: string;

  @ApiPropertyOptional({
    example: 'HNL',
    description: 'Destination airport code (3-5 characters)',
  })
  @IsOptional()
  @IsString()
  @Length(3, 5)
  to?: string;
}
