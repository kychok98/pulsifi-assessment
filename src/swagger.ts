import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { API_KEY_HEADER } from './constants';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Flight Search API')
    .setDescription('Search roundtrip flights via Skyscanner (RapidAPI)')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: API_KEY_HEADER, in: 'header' },
      API_KEY_HEADER,
    )
    .build();

  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER || 'admin']:
          process.env.SWAGGER_PASSWORD || 'admin',
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
