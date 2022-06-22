import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ForecastsController } from './forecasts.controller';
import { ForecastsService } from './forecasts.service';

@Module({
  controllers: [ForecastsController],
  providers: [ForecastsService],
  imports: [PrismaModule],
})
export class ForecastsModule {}
