import { ApiKeyGuard } from './api-key.guard';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('valid-api-key'),
    } as any;

    guard = new ApiKeyGuard(configService);
  });

  const mockContext = (headers: Record<string, string>): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
    }) as unknown as ExecutionContext;

  it('should allow access when x-api-key is valid', () => {
    const context = mockContext({ 'x-api-key': 'valid-api-key' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access when x-api-key is missing', () => {
    const context = mockContext({});
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should deny access when x-api-key is invalid', () => {
    const context = mockContext({ 'x-api-key': 'wrong-key' });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
