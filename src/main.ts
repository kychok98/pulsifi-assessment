import {
  BadRequestException,
  LogLevel,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const logLevels: LogLevel[] = ['log', 'error', 'warn'];
  if (process.env.DEBUG === 'true') {
    logLevels.push('debug', 'verbose');
  }

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  setupSwagger(app);

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
    defaultVersion: '1',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
