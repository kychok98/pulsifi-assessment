import { HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import * as fs from 'fs';
import { of, throwError } from 'rxjs';
import { SkyscannerService } from './skyscanner.service';

jest.mock('fs');

describe('SkyscannerService', () => {
  let service: SkyscannerService;
  let configService: ConfigService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkyscannerService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'USE_FLIGHT_MOCK') return 'true';
              if (key === 'RAPIDAPI_KEY') return 'mock-key';
              if (key === 'RAPIDAPI_HOST') return 'mock-host';
              if (key === 'RAPIDAPI_BASE_URL') return 'http://mock-url';
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SkyscannerService>(SkyscannerService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return mock data when USE_FLIGHT_MOCK is true', async () => {
    const mockJson = { itineraries: { buckets: [] } };
    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(JSON.stringify(mockJson));

    const result = await service.searchFlights();
    expect(result).toEqual(mockJson);
  });

  it('should call RapidAPI when USE_FLIGHT_MOCK is false', async () => {
    jest.spyOn(configService, 'get').mockImplementation((key) => {
      const config = {
        USE_FLIGHT_MOCK: 'false',
        RAPIDAPI_KEY: 'real-key',
        RAPIDAPI_HOST: 'real-host',
        RAPIDAPI_BASE_URL: 'http://real-url',
      };
      return config[key];
    });

    const mockApiResponse: AxiosResponse = {
      data: { itineraries: { buckets: [] } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockApiResponse));

    const result = await service.searchFlights();
    expect(result).toEqual(mockApiResponse.data);
  });

  it('should throw BadGatewayException if response.data.status is "error"', async () => {
    jest.spyOn(configService, 'get').mockImplementation((key) => {
      const config = {
        USE_FLIGHT_MOCK: 'false',
        RAPIDAPI_KEY: 'real-key',
        RAPIDAPI_HOST: 'real-host',
        RAPIDAPI_BASE_URL: 'http://real-url',
      };
      return config[key];
    });

    const mockApiResponse = {
      data: { status: 'error', message: 'Invalid request' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockApiResponse));
    await expect(service.searchFlights()).rejects.toThrow(HttpException);
  });

  it('should throw HttpException on API failure', async () => {
    jest.spyOn(configService, 'get').mockImplementation((key) => {
      const config = {
        USE_FLIGHT_MOCK: 'false',
        RAPIDAPI_KEY: 'real-key',
        RAPIDAPI_HOST: 'real-host',
        RAPIDAPI_BASE_URL: 'http://real-url',
      };
      return config[key];
    });

    jest
      .spyOn(httpService, 'get')
      .mockReturnValueOnce(throwError(() => new Error('Network error')));

    await expect(service.searchFlights()).rejects.toThrow(
      'Failed to fetch flights from Skyscanner',
    );
  });
});
