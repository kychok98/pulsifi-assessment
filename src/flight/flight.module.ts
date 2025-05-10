import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { SkyscannerService } from './skyscanner/skyscanner.service';

@Module({
  imports: [HttpModule],
  controllers: [FlightController],
  providers: [FlightService, SkyscannerService, ConfigService],
})
export class FlightModule {}
