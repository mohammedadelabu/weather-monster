import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CityService } from './cities.service';
import { CreateCityDto, UpdateCityDto } from './dto';

@Controller('cities')
export class CityController {
  constructor(private cityService: CityService) {}
  @Post()
  createCity(@Body() dto: CreateCityDto) {
    return this.cityService.createCity(dto);
  }

  @Patch(':id')
  async updateCity(
    @Param('id', ParseIntPipe) cityId: number,
    @Body() dto: UpdateCityDto,
  ) {
    return await this.cityService.updateCityById(cityId, dto);
  }

  @Delete(':id')
  async deleteCity(@Param('id', ParseIntPipe) cityId: number) {
    return this.cityService.deleteCityById(cityId);
  }
}
