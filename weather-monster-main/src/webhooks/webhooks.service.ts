import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '..//prisma/prisma.service';
import { CreateWebHookDto } from './dto';

@Injectable()
export class WebhooksService {
  constructor(private prismaService: PrismaService) {}
  async createWebhook(dto: CreateWebHookDto) {
    try {
      return this.prismaService.webhook.create({
        data: dto,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        errorMsg: 'Unable to create webhook, please try again later',
      });
    }
  }

  async deleteWebhook(webHookId: number) {
    try {
      return this.prismaService.webhook.delete({
        where: { id: webHookId },
      });
    } catch (error) {
      throw new InternalServerErrorException({
        errorMsg: 'Unable to delete webhook, please try again later',
      });
    }
  }
}
