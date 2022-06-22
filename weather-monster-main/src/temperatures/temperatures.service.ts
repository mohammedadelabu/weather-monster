import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTempDto } from './dto';

@Injectable()
export class TemperaturesService {
  constructor(private prismaService: PrismaService) {}
  async createTemperature(dto: CreateTempDto) {
    try {
      const createdTemp = await this.prismaService.temperature.create({
        data: dto,
      });

      const webhooks = await this.prismaService.webhook.findMany({
        where: {
          city_id: dto.city_id,
        },
      });

      if (webhooks.length > 0) {
        for (const webhook of webhooks) {
          const { callback_url } = webhook;
          const dataToPost = dto;
          await axios.post(callback_url, dataToPost);
        }
      }

      return {
        ...createdTemp,
        timestamp: new Date(createdTemp.timestamp).getTime(),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        errorMsg: 'Unable to create temperature',
      });
    }
  }
}
