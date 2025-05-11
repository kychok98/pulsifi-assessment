import { ApiProperty } from '@nestjs/swagger';

class RoundtripFlightDto {
  @ApiProperty() id: string;
  @ApiProperty() price: string;
  @ApiProperty() carrier: string;
  @ApiProperty() from: string;
  @ApiProperty() to: string;
  @ApiProperty() departTime: string;
  @ApiProperty() returnTime: string;
  @ApiProperty() durationInMinutes: number;
  @ApiProperty() stops: number;
}

export class SearchFlightResponseDto {
  @ApiProperty({ example: 1 })
  count: number;

  @ApiProperty({ type: [RoundtripFlightDto] })
  data: RoundtripFlightDto[];
}
