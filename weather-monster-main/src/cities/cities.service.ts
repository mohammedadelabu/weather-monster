import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCityDto, UpdateCityDto } from './dto';

const SERVER_ERROR_MSG = 'Unable to process request now';

@Injectable()
export class CityService {
  constructor(private prismaService: PrismaService) {}
  async createCity(dto: CreateCityDto) {
    try {
      return await this.prismaService.city.create({ data: dto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // for detecting violation in unique fields, i.e a duplicate is detected
          throw new ForbiddenException({
            error: (error.meta.target as Array<string>).map(
              (target) => `${target} already in use.`,
            ),
          });
        }
      }
      throw new InternalServerErrorException({
        error: SERVER_ERROR_MSG,
      });
    }
  }

  async updateCityById(cityId: number, dto: UpdateCityDto) {
    try {
      return await this.prismaService.city.update({
        where: { id: cityId },
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        error: SERVER_ERROR_MSG,
      });
    }
  }

  async deleteCityById(cityId: number) {
    try {
      return await this.prismaService.city.delete({
        where: { id: cityId },
      });
    } catch (error) {
      throw new InternalServerErrorException({
        error: SERVER_ERROR_MSG,
      });
    }
  }
}
