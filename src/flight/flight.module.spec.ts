import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FlightController } from './flight.controller';
import { FlightModule } from './flight.module';
import { FlightService } from './flight.service';

describe('FlightModule', () => {
  let controller: FlightController;
  let service: FlightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, FlightModule],
      providers: [ConfigService],
    }).compile();

    controller = module.get<FlightController>(FlightController);
    service = module.get<FlightService>(FlightService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
