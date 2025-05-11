import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('App');
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const message = `${method} ${originalUrl} ${res.statusCode} - ${duration}ms`;
      this.logger.log(message);
    });

    next();
  }
}
