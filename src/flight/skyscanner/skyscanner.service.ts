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
import { firstValueFrom } from 'rxjs';
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
}
