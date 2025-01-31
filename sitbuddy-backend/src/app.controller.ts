import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('status')
  getStatus(): { status: string } {
    return { status: 'Backend radi ispravno!' };
  }
}
