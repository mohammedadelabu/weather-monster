import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  clearDatabase() {
    return this.$transaction([
      this.city.deleteMany(),
      this.temperature.deleteMany(),
      this.webhook.deleteMany(),
    ]);
  }
}
