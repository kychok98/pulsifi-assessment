import { NextFunction, Request, Response } from 'express';
import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  const mockLogger = {
    log: jest.fn(),
  };

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    (middleware as any).logger = mockLogger;
  });

  it('should log request details on response finish and call next()', () => {
    const req = {
      method: 'GET',
      originalUrl: '/api/test',
    } as Request;

    const res = {
      statusCode: 200,
      on: jest.fn((event, callback) => {
        if (event === 'finish') {
          callback();
        }
      }),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(1000) // start
      .mockReturnValueOnce(1200); // end

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(mockLogger.log).toHaveBeenCalledWith('GET /api/test 200 - 200ms');
  });
});
