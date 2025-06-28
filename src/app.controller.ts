import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/chat')
  @Render('index')
  Home(): string {
    return;
  }

  @Get('api/chat')
  async getMessage(@Res() res) {
    const message = await this.appService.getMessage();
    res.json(message);
  }
}
