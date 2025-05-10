import { Controller, Get } from '@nestjs/common';

@Controller({ version: '1' })
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
