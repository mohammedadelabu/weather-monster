import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ForecastsService {
  constructor(private prismaService: PrismaService) {}
  async getForecastForCityById(city_id: number) {
    try {
      const temp = await this.prismaService.temperature.aggregate({
        where: {
          city_id,
        },
        _avg: {
          max: true,
          min: true,
        },
        _count: {
          city_id: true,
        },
      });
      const result = { ...temp._avg, sample: temp._count.city_id, city_id };
      return result;
    } catch (error) {
      throw new InternalServerErrorException({
        errorMsg: 'Unable to get forecast currently.',
      });
    }
  }
}
