import {
  BadRequestException,
  LogLevel,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-exception.filter';
import { API_VERSION } from './constants';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const logLevels: LogLevel[] = ['log', 'error', 'warn'];
  if (process.env.DEBUG === 'true') {
    logLevels.push('debug', 'verbose');
  }

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((e) => {
          const constraints = Object.values(e.constraints || {});
          return `${e.property}: ${constraints.join(', ')}`;
        });
        return new BadRequestException(
          `Validation failed: ${messages.join(' | ')}`,
        );
      },
    }),
  );
  app.useGlobalFilters(new HttpErrorFilter());

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION,
  });

  setupSwagger(app);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
