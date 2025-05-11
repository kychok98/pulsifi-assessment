import { Test, TestingModule } from '@nestjs/testing';
import { FlightService } from './flight.service';
import { SkyscannerService } from './skyscanner/skyscanner.service';
import { SearchFlightDto } from './dto/search-flight.dto';

const mockFlightData = {
  itineraries: {
    buckets: [
      {
        id: 'Best',
        items: [
          {
            id: 'mock-1',
            price: { raw: 400, formatted: '$400' },
            legs: [
              {
                origin: { id: 'JFK', displayCode: 'JFK' },
                destination: { id: 'HNL', displayCode: 'HNL' },
                departure: '2024-08-12T10:00:00',
                durationInMinutes: 300,
                stopCount: 1,
                carriers: {
                  marketing: [{ name: 'Delta', logoUrl: 'logo.png' }],
                },
              },
              {
                origin: { id: 'HNL' },
                destination: { id: 'JFK' },
                departure: '2024-08-25T15:45:00',
                durationInMinutes: 320,
                stopCount: 1,
                carriers: {
                  marketing: [{ name: 'Delta', logoUrl: 'logo.png' }],
                },
              },
            ],
          },
          {
            id: 'mock-2',
            price: { raw: 500, formatted: '$500' },
            legs: [
              {
                origin: { id: 'JFK', displayCode: 'JFK' },
                destination: { id: 'HNL', displayCode: 'HNL' },
                departure: '2024-08-12T10:00:00',
                durationInMinutes: 300,
                stopCount: 1,
                carriers: {
                  marketing: [{ name: 'Delta', logoUrl: 'logo.png' }],
                },
              },
              {
                origin: { id: 'HNL' },
                destination: { id: 'JFK' },
                departure: '2024-08-25T15:45:00',
                durationInMinutes: 320,
                stopCount: 1,
                carriers: {
                  marketing: [{ name: 'Delta', logoUrl: 'logo.png' }],
                },
              },
            ],
          },
        ],
      },
      {
        id: 'Cheapest',
        items: [
          {
            id: 'mock-2',
            price: { raw: 400, formatted: '$400' },
            legs: [
              {
                origin: { id: 'JFK', displayCode: 'JFK' },
                destination: { id: 'HNL', displayCode: 'HNL' },
                departure: '2024-08-12T10:00:00',
                durationInMinutes: 300,
                stopCount: 1,
                carriers: {
                  marketing: [{ name: 'Delta', logoUrl: 'logo.png' }],
                },
              },
              {
                origin: { id: 'HNL' },
                destination: { id: 'JFK' },
                departure: '2024-08-25T15:45:00',
                durationInMinutes: 320,
                stopCount: 1,
                carriers: {
                  marketing: [{ name: 'Delta', logoUrl: 'logo.png' }],
                },
              },
            ],
          },
          {
            id: 'mock-1',
            price: { raw: 500, formatted: '$500' },
            legs: [
              {
                origin: { id: 'JFK', displayCode: 'JFK' },
                destination: { id: 'HNL', displayCode: 'HNL' },
                departure: '2024-08-12T10:00:00',
                durationInMinutes: 300,
                stopCount: 1,
                carriers: {
                  marketing: [{ name: 'Delta', logoUrl: 'logo.png' }],
                },
              },
              {
                origin: { id: 'HNL' },
                destination: { id: 'JFK' },
                departure: '2024-08-25T15:45:00',
                durationInMinutes: 320,
                stopCount: 1,
                carriers: {
                  marketing: [{ name: 'Delta', logoUrl: 'logo.png' }],
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

describe('FlightService', () => {
  let service: FlightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightService,
        {
          provide: SkyscannerService,
          useValue: {
            searchFlights: jest.fn().mockResolvedValue(mockFlightData),
          },
        },
      ],
    }).compile();

    service = module.get<FlightService>(FlightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return matched and transformed flights with count', async () => {
    const dto: SearchFlightDto = {
      inDate: '2024-08-12',
      outDate: '2024-08-25',
      from: 'JFK',
      to: 'HNL',
    };

    const result = await service.searchFlights(dto);

    expect(result.count).toBe(2);
    expect(result.data).toHaveLength(2);

    expect(result.data[0]).toEqual({
      id: 'mock-1',
      price: '$360',
      carrier: 'Delta',
      from: 'JFK',
      to: 'HNL',
      departTime: '2024-08-12T10:00:00',
      returnTime: '2024-08-25T15:45:00',
      durationInMinutes: 620,
      stops: 2,
    });
  });

  it('should return empty data if no match', async () => {
    const dto: SearchFlightDto = {
      inDate: '2024-08-22',
      outDate: '2024-08-25',
      from: 'LAX',
      to: 'HNL',
    };

    const result = await service.searchFlights(dto);
    expect(result).toEqual({ data: [], count: 0 });
  });

  it('should filter out if inDate does not match', async () => {
    const dto: SearchFlightDto = {
      inDate: '2024-08-21',
      outDate: '2024-08-25',
      from: 'JFK',
      to: 'HNL',
    };

    const result = await service.searchFlights(dto);
    expect(result).toEqual({ data: [], count: 0 });
  });

  it('should filter out if outDate does not match', async () => {
    const dto: SearchFlightDto = {
      inDate: '2024-08-22',
      outDate: '2024-08-24',
      from: 'JFK',
      to: 'HNL',
    };

    const result = await service.searchFlights(dto);
    expect(result).toEqual({ data: [], count: 0 });
  });

  it('should filter out if origin does not match', async () => {
    const dto: SearchFlightDto = {
      inDate: '2024-08-22',
      outDate: '2024-08-25',
      from: 'LAX',
      to: 'HNL',
    };

    const result = await service.searchFlights(dto);
    expect(result).toEqual({ data: [], count: 0 });
  });

  it('should filter out if destination does not match', async () => {
    const dto: SearchFlightDto = {
      inDate: '2024-08-22',
      outDate: '2024-08-25',
      from: 'JFK',
      to: 'SFO',
    };

    const result = await service.searchFlights(dto);
    expect(result).toEqual({ data: [], count: 0 });
  });

  it('should apply 10% discount if duration > 10 days', async () => {
    const dto: SearchFlightDto = {
      inDate: '2024-08-12',
      outDate: '2024-08-25', // 14 days trip
      from: 'JFK',
      to: 'HNL',
    };

    const result = await service.searchFlights(dto);

    expect(result.count).toBe(2);
    expect(result.data[0].price).toBe('$360'); // 10% off from $400
    expect(result.data[1].price).toBe('$450'); // 10% off from $500
  });
});
