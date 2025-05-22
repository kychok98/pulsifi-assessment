import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom, Observable } from 'rxjs';
import { FlightResponse } from '../interfaces/flight-response.interface';

@Injectable()
export class SkyscannerService {
  private readonly logger = new Logger(SkyscannerService.name);

  private mockPath = path.resolve(
    __dirname,
    '../../../src/mocks/complete-response.json',
  );

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async searchFlights(): Promise<FlightResponse> {
    const useMock = this.configService.get('USE_FLIGHT_MOCK') === 'true';
    if (useMock) {
      const mockData = fs.readFileSync(this.mockPath, 'utf-8');
      return JSON.parse(mockData);
    }

    const apiKey = this.configService.get<string>('RAPIDAPI_KEY');
    const apiHost = this.configService.get<string>('RAPIDAPI_HOST');
    const baseUrl = this.configService.get<string>('RAPIDAPI_BASE_URL');

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/flights/roundtrip/list`, {
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': apiHost,
          },
        }),
      );
      if (response.data?.status === 'error') {
        throw new BadGatewayException(response.data);
      }

      return response.data;
    } catch (error) {
      this.logger.debug(error?.response?.data);
      throw new HttpException(
        'Failed to fetch flights from Skyscanner',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  streamFlightSearchSSE(): Observable<MessageEvent> {
    const mockPath = path.resolve(
      __dirname,
      '../../../src/mocks/mock-flight-results.json',
    );

    const useMock = this.configService.get('USE_FLIGHT_MOCK') === 'true';

    return new Observable((observer) => {
      const simulatePolling = async () => {
        observer.next({
          data: { status: 'searching', sessionId: 'mock-session' },
        } as MessageEvent);

        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
          await new Promise((res) => setTimeout(res, 2000));
          observer.next({
            data: { status: 'polling', attempt: attempts + 1 },
          } as MessageEvent);
          attempts++;
        }

        if (useMock) {
          const mockData = fs.readFileSync(mockPath, 'utf-8');
          const result = JSON.parse(mockData);
          observer.next({ data: result } as MessageEvent);
        }

        observer.complete();
      };

      simulatePolling();
    });
  }
}
