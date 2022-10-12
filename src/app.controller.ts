import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  getStatus() {
    return { status: HttpStatus.OK };
  }

  @Get('/version')
  getVersion() {
    return { version: 1 };
  }
}
