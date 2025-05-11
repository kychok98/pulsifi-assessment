import { HttpErrorFilter } from './http-exception.filter';
import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

describe('HttpErrorFilter', () => {
  let filter: HttpErrorFilter;

  beforeEach(() => {
    filter = new HttpErrorFilter();

    // Silence logger output
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  it('should format and send a proper error response', () => {
    const mockRequest = {
      method: 'GET',
      url: '/api/test',
    } as Request;

    const mockStatus = jest.fn();
    const mockJson = jest.fn();
    const mockResponse = {
      status: mockStatus.mockReturnValue({ json: mockJson }),
    } as unknown as Response;

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as ArgumentsHost;

    const exception = new HttpException('Custom error', HttpStatus.BAD_REQUEST);
    filter.catch(exception, mockContext);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        path: '/api/test',
        method: 'GET',
        message: 'Custom error',
      }),
    );
  });
});
