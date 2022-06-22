import { Body, Controller, Post } from '@nestjs/common';
import { CreateTempDto } from './dto';
import { TemperaturesService } from './temperatures.service';

@Controller('temperatures')
export class TemperaturesController {
  constructor(private tempService: TemperaturesService) {}
  @Post()
  createTemperature(@Body() dto: CreateTempDto) {
    return this.tempService.createTemperature(dto);
  }
}
