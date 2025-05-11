import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['x-api-key'];

    const expectedKey = this.configService.get<string>('API_KEY');
    if (!apiKeyHeader || apiKeyHeader !== expectedKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
