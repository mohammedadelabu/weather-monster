import { Module } from '@nestjs/common';
import { TemperaturesService } from './temperatures.service';
import { TemperaturesController } from './temperatures.controller';
import { PrismaModule } from '..//prisma/prisma.module';

@Module({
  providers: [TemperaturesService],
  imports: [PrismaModule],
  controllers: [TemperaturesController],
})
export class TemperaturesModule {}
