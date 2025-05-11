import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SearchFlightDto } from './dto/search-flight.dto';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';

describe('FlightController', () => {
  let controller: FlightController;

  const mockFlightService = {
    searchFlights: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightController],
      providers: [
        {
          provide: FlightService,
          useValue: mockFlightService,
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<FlightController>(FlightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call flightService.searchFlights with correct params', async () => {
    const dto: SearchFlightDto = {
      from: 'JFK',
      to: 'HNL',
      inDate: '2024-08-22',
      outDate: '2024-08-25',
    };

    const mockResult = [{ id: 'mock-1', price: '$123' }];
    mockFlightService.searchFlights.mockResolvedValue(mockResult);

    const result = await controller.search(dto);
    expect(result).toEqual(mockResult);
    expect(mockFlightService.searchFlights).toHaveBeenCalledWith(dto);
  });
});
