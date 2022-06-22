import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ForecastsService } from './forecasts.service';

@Controller('forecasts')
export class ForecastsController {
  constructor(private forecastService: ForecastsService) {}
  @Get(':id')
  getForecastForCityById(@Param('id', ParseIntPipe) city_id: number) {
    return this.forecastService.getForecastForCityById(city_id);
  }
}
